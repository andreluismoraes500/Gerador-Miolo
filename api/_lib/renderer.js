// api/_lib/renderer.js
//
// Usado exclusivamente pelo worker (worker/pdfWorker.js), que roda como
// processo Node.js persistente FORA da Vercel. Por isso usamos o pacote
// `puppeteer` completo (baixa e gerencia seu próprio Chromium) em vez de
// `puppeteer-core` + `@sparticuz/chromium` (que só fazem sentido dentro
// de uma função serverless/Lambda, ambiente que este arquivo não roda
// mais desde que a geração de PDF virou um job de fila).
import puppeteer from "puppeteer";

// Reutiliza o browser entre jobs (evita o custo de abrir/fechar um
// Chromium inteiro a cada PDF) — seguro porque o worker processa um job
// de cada vez (concurrency: 1). MAS em planos com pouca RAM (ex: Render
// free, 512MB), manter o Chromium sempre aberto (mesmo parado, sem gerar
// nada) já consome uns 100-150MB só de base — o suficiente pra faltar
// memória na hora que uma geração de PDF precisa de um pico. Por isso
// fechamos o browser sozinho depois de um tempo sem uso: perde-se ~1-2s
// de "cold start" no PDF seguinte, mas devolve memória pro sistema
// operacional entre uma geração e outra.
let browserInstance = null;
let browserPromise = null;
let idleCloseTimer = null;
const IDLE_CLOSE_MS = 30 * 1000; // fecha depois de 30s sem nenhum job

function cancelIdleClose() {
  if (idleCloseTimer) {
    clearTimeout(idleCloseTimer);
    idleCloseTimer = null;
  }
}

function scheduleIdleClose() {
  cancelIdleClose();
  idleCloseTimer = setTimeout(async () => {
    if (browserInstance) {
      console.log("[renderer] Fechando Chromium ocioso para liberar memória.");
      const toClose = browserInstance;
      browserInstance = null;
      try {
        await toClose.close();
      } catch (err) {
        console.error("[renderer] Erro ao fechar Chromium ocioso:", err.message);
      }
    }
  }, IDLE_CLOSE_MS);
  idleCloseTimer.unref?.();
}

async function launchBrowser() {
  return puppeteer.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      // ESSENCIAL em containers (Render, Railway, Docker em geral): por
      // padrão o /dev/shm vem limitado a ~64MB nesses ambientes, e o
      // Chromium usa memória compartilhada pesadamente pra renderizar —
      // sem essa flag ele estoura e derruba o processo inteiro (sintoma:
      // funciona liso local, mas em produção as requisições começam a
      // voltar 502 porque o servidor caiu e está reiniciando). Com a
      // flag, o Chromium usa /tmp em vez de /dev/shm.
      "--disable-dev-shm-usage",
      // Não há GPU disponível nesses containers; desabilitar evita o
      // Chromium gastar tempo/memória tentando inicializar aceleração
      // gráfica que não existe.
      "--disable-gpu",
      // Reduz uso de memória evitando processos "zygote" extras — ajuda
      // em planos com pouca RAM (ex: Render free tier, 512MB).
      "--no-zygote",
      // Corta processos/recursos que este app nunca usa e que só
      // consomem RAM à toa em segundo plano.
      "--disable-extensions",
      "--disable-background-networking",
      "--disable-default-apps",
      "--disable-sync",
      "--disable-translate",
      "--disable-software-rasterizer",
      "--mute-audio",
      "--no-first-run",
      "--metrics-recording-only",
      // Limita o heap de JS do Chromium — as páginas geradas aqui são
      // HTML/CSS de agenda, não precisam de um heap grande.
      "--js-flags=--max-old-space-size=128",
    ],
  });
}

async function getBrowser() {
  cancelIdleClose();
  if (browserInstance && !browserInstance.connected) {
    browserInstance = null;
  }
  if (browserInstance) return browserInstance;
  if (browserPromise) return browserPromise;

  browserPromise = launchBrowser()
    .then((browser) => {
      browserInstance = browser;
      browserPromise = null;
      browser.on("disconnected", () => {
        browserInstance = null;
        cancelIdleClose();
      });
      return browser;
    })
    .catch((err) => {
      browserPromise = null;
      throw err;
    });

  return browserPromise;
}

export async function generatePDFFromUrl(previewUrl) {
  const browser = await getBrowser();
  const page = await browser.newPage();

  try {
    page.setDefaultTimeout(180000);
    page.setDefaultNavigationTimeout(180000);

    page.on("pageerror", (err) => {
      console.error("[renderer] Erro de runtime na página:", err.message);
    });
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        console.error("[renderer] console.error na página:", msg.text());
      }
    });

    await page.emulateMediaType("print");

    await page.setViewport({
      width: 794, // 210mm em pixels (96dpi)
      height: 1123, // 297mm
      deviceScaleFactor: 1,
    });

    // "domcontentloaded" é suficiente aqui: quem realmente garante que a
    // página terminou de montar é o waitForFunction(__PDF_READY__) logo
    // abaixo. Esperar também por "networkidle0" era redundante e podia
    // adicionar 1-3s de espera extra (precisa de 500ms sem NENHUMA
    // requisição de rede, o que atrasa à toa quando há qualquer polling
    // em segundo plano).
    await page.goto(previewUrl, {
      waitUntil: "domcontentloaded",
      timeout: 180000,
    });

    // Espera pela renderização real do React: aguarda até que o
    // front-end defina window.__PDF_READY__ = true (ver
    // src/hooks/usePdfReadySignal.js), o que só acontece depois que o
    // DOM parou de mudar por um período — ou seja, todas as páginas do
    // template (ou de todos os módulos, no modo Montagem Completa) já
    // foram montadas.
    await page.waitForFunction(() => window.__PDF_READY__ === true, {
      timeout: 150000,
      polling: 100,
    });

    // Fontes (Google Fonts) carregam em paralelo ao React e não disparam
    // mutação no DOM, então o MutationObserver de usePdfReadySignal não as
    // "vê". Esperar document.fonts.ready explicitamente garante que o PDF
    // sempre saia com a fonte certa, sem precisar de uma folga arbitrária
    // grande "no escuro" depois.
    await page
      .evaluate(() => document.fonts && document.fonts.ready)
      .catch(() => {});

    const pageCount = await page.evaluate(
      () => window.__PDF_PAGE_COUNT__ || 0,
    );
    console.log(`[renderer] Páginas renderizadas: ${pageCount}`);

    if (pageCount < 1) {
      throw new Error(
        `PDF incompleto: apenas ${pageCount} página(s) renderizada(s). ` +
          "Verifique se o template/módulos selecionados realmente geram " +
          "conteúdo para os parâmetros enviados.",
      );
    }

    await new Promise((resolve) => setTimeout(resolve, 80));

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: 0, bottom: 0, left: 0, right: 0 },
      displayHeaderFooter: false,
      timeout: 150000,
    });

    return Buffer.from(pdfBuffer);
  } finally {
    await page.close();
    // Não fecha o browser imediatamente (evita reabrir a cada PDF em
    // sequência), mas agenda o fechamento se ninguém pedir outro PDF nos
    // próximos 30s — devolve a memória do Chromium pro sistema entre uma
    // geração e outra, essencial em planos com pouca RAM.
    scheduleIdleClose();
  }
}