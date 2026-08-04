import puppeteerFull from "puppeteer";
import puppeteerCore from "puppeteer-core";
import chromium from "@sparticuz/chromium";

const IS_PRODUCTION =
  process.env.RENDER === "true" || process.env.NODE_ENV === "production";

let browserInstance = null;
let browserPromise = null;
let idleCloseTimer = null;
const IDLE_CLOSE_MS = 5 * 60 * 1000; // 5 minutos (evita recriação frequente)

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
      console.log("[renderer] Fechando Chromium ocioso.");
      const toClose = browserInstance;
      browserInstance = null;
      try {
        await toClose.close();
      } catch (err) {
        console.error("[renderer] Erro ao fechar Chromium:", err.message);
      }
    }
  }, IDLE_CLOSE_MS);
  idleCloseTimer.unref?.();
}

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
  "--js-flags=--max-old-space-size=256", // Aumenta o heap do JS
];

async function launchBrowser() {
  console.log(
    `[renderer] Iniciando Chromium (${IS_PRODUCTION ? "leve/sparticuz" : "completo"})...`,
  );

  if (IS_PRODUCTION) {
    // Usa o Chromium otimizado para lambda (compatível com Render)
    const executablePath = await chromium.executablePath();
    return puppeteerCore.launch({
      args: [...chromium.args, ...EXTRA_MEMORY_FLAGS],
      defaultViewport: chromium.defaultViewport,
      executablePath,
      headless: "new", // ESSENCIAL: mais rápido e econômico
    });
  }

  return puppeteerFull.launch({
    headless: "new",
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
    page.setDefaultTimeout(300000); // 5 min
    page.setDefaultNavigationTimeout(300000);

    // Bloqueia recursos desnecessários (imagens, mídia, etc.)
    await page.setRequestInterception(true);
    page.on("request", (req) => {
      const url = req.url();
      const type = req.resourceType();
      // Permite apenas Google Fonts e recursos críticos
      if (["image", "media", "font", "stylesheet"].includes(type)) {
        if (
          url.includes("fonts.googleapis.com") ||
          url.includes("fonts.gstatic.com")
        ) {
          req.continue();
        } else {
          req.abort();
        }
      } else {
        req.continue();
      }
    });

    page.on("pageerror", (err) => {
      console.error("[renderer] Erro de runtime:", err.message);
    });
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        console.error("[renderer] console.error:", msg.text());
      }
    });

    await page.emulateMediaType("print");
    await page.setViewport({
      width: 794,
      height: 1123,
      deviceScaleFactor: 1,
    });

    await page.goto(previewUrl, {
      waitUntil: "domcontentloaded",
      timeout: 300000,
    });

    // Aguarda o sinal de pronto (__PDF_READY__)
    await page.waitForFunction(() => window.__PDF_READY__ === true, {
      timeout: 240000,
      polling: 100,
    });

    // Aguarda fontes carregarem
    await page.evaluate(() => document.fonts?.ready).catch(() => {});

    const pageCount = await page.evaluate(() => window.__PDF_PAGE_COUNT__ || 0);
    console.log(`[renderer] Páginas renderizadas: ${pageCount}`);

    if (pageCount < 1) {
      throw new Error(`PDF incompleto: apenas ${pageCount} página(s).`);
    }

    // Pequena pausa para garantir renderização
    await new Promise((resolve) => setTimeout(resolve, 80));

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: 0, bottom: 0, left: 0, right: 0 },
      displayHeaderFooter: false,
      timeout: 300000,
    });

    return Buffer.from(pdfBuffer);
  } finally {
    await page.close();
    scheduleIdleClose();
  }
}
