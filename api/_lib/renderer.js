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
// de cada vez (concurrency: 1).
let browserInstance = null;
let browserPromise = null;

async function launchBrowser() {
  return puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
}

async function getBrowser() {
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

    await page.goto(previewUrl, {
      waitUntil: "networkidle0",
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
      polling: 200,
    });

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

    await new Promise((resolve) => setTimeout(resolve, 300));

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
    // Mantém o browser aberto para reuso no próximo job da fila.
  }
}