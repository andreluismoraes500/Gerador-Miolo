// api/_lib/renderer.js
//
// Roda dentro do mesmo processo Node persistente que serve a API
// (server/index.js) — local, ou em produção (Render, Railway, Fly.io).
//
// Dois "motores" diferentes dependendo do ambiente:
//
//   - LOCAL (seu computador): usa `puppeteer` completo, que já vem com
//     um Chromium de verdade pronto pra rodar em qualquer SO (Windows,
//     Mac, Linux). É pesado, mas no seu computador isso não é problema.
//
//   - PRODUÇÃO (Render/Railway/qualquer host Linux, detectado
//     automaticamente pela env var RENDER, ou por NODE_ENV=production):
//     usa `puppeteer-core` + `@sparticuz/chromium` — um Chromium
//     ENXUTO, feito originalmente pra rodar em AWS Lambda, otimizado
//     especificamente pra ambientes com pouquíssima memória (bem menor
//     e mais econômico que o Chromium completo). É a mesma técnica usada
//     por praticamente todo serviço de "gerar PDF" que roda em host com
//     512MB-1GB de RAM — o Chromium completo (`puppeteer`) simplesmente
//     não cabe confortavelmente nesses planos junto com Node+Express.
//
// Não precisa configurar nada: a troca é automática pela env var RENDER
// (o próprio Render já define isso sozinho em todo serviço).
import puppeteerFull from "puppeteer";
import puppeteerCore from "puppeteer-core";
import chromium from "@sparticuz/chromium";

const IS_PRODUCTION =
  process.env.RENDER === "true" || process.env.NODE_ENV === "production";

// Reutiliza o browser entre jobs (evita o custo de abrir/fechar um
// Chromium inteiro a cada PDF) — seguro porque o worker processa um job
// de cada vez (concurrency: 1). MAS em planos com pouca RAM (ex: Render
// free, 512MB), manter o Chromium sempre aberto (mesmo parado, sem gerar
// nada) já consome memória de base — o suficiente pra faltar espaço na
// hora que uma geração de PDF precisa de um pico. Por isso fechamos o
// browser sozinho depois de um tempo sem uso: perde-se ~1-2s de "cold
// start" no PDF seguinte, mas devolve memória pro sistema operacional
// entre uma geração e outra.
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

// Flags extras de economia de memória, além das que cada motor já traz
// por padrão. Cortam processos/recursos que este app nunca usa (sync,
// extensões, tradução automática, etc.) e limitam o heap de JS interno
// do Chromium — as páginas geradas aqui são HTML/CSS de agenda, não
// precisam de um heap grande.
const EXTRA_MEMORY_FLAGS = [
  "--disable-extensions",
  "--disable-background-networking",
  "--disable-default-apps",
  "--disable-sync",
  "--disable-translate",
  "--disable-software-rasterizer",
  "--mute-audio",
  "--no-first-run",
  "--metrics-recording-only",
  "--js-flags=--max-old-space-size=128",
];

async function launchBrowser() {
  console.log(
    `[renderer] Iniciando Chromium (${IS_PRODUCTION ? "leve/sparticuz — produção" : "completo/puppeteer — local"})...`,
  );

  if (IS_PRODUCTION) {
    // @sparticuz/chromium já vem com o conjunto de flags recomendado
    // para ambientes com pouca memória (inclui --disable-dev-shm-usage,
    // --single-process, --no-zygote — combinação testada especificamente
    // para não faltar RAM em containers pequenos).
    return puppeteerCore.launch({
      args: [...chromium.args, ...EXTRA_MEMORY_FLAGS],
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });
  }

  return puppeteerFull.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
      ...EXTRA_MEMORY_FLAGS,
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

// Usado no encerramento gracioso do worker (SIGTERM/SIGINT) para não
// deixar um processo Chromium órfão consumindo memória depois que o
// processo Node principal já terminou.
export async function closeBrowser() {
  cancelIdleClose();
  if (browserInstance) {
    const toClose = browserInstance;
    browserInstance = null;
    await toClose.close().catch(() => {});
  }
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