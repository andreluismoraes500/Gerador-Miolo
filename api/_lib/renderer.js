// api/_lib/renderer.js
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";

// Detecta se está rodando localmente (vercel dev) ou produção
const isLocal = process.env.VERCEL_ENV === "development" || !process.env.VERCEL;

// Pool para reutilizar o browser entre chamadas (instância quente)
let browserInstance = null;
let browserPromise = null;

async function getBrowser() {
  if (browserInstance) return browserInstance;
  if (browserPromise) return browserPromise;

  browserPromise = (async () => {
    let browser;
    if (isLocal) {
      // Local: usa puppeteer (completo) com Chrome instalado
      const puppeteerLocal = await import("puppeteer");
      browser = await puppeteerLocal.launch({
        headless: true,
        channel: "chrome", // usa o Chrome instalado no sistema
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });
    } else {
      // Produção na Vercel: usa @sparticuz/chromium
      const executablePath = await chromium.executablePath();
      browser = await puppeteer.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath,
        headless: true,
        ignoreHTTPSErrors: true,
      });
    }
    browserInstance = browser;
    browserPromise = null;
    return browser;
  })();
  return browserPromise;
}

export async function generatePDFFromUrl(previewUrl) {
  const browser = await getBrowser();
  const page = await browser.newPage();

  try {
    // Ativa o modo de impressão (aplica @media print)
    await page.emulateMediaType("print");

    await page.setViewport({
      width: 794, // 210mm em pixels (96dpi)
      height: 1123, // 297mm
      deviceScaleFactor: 1,
    });

    // Headers para bypass de proteção de deployment (se configurado)
    const headers = {};
    if (process.env.VERCEL_BYPASS_TOKEN) {
      headers["x-vercel-protection-bypass"] = process.env.VERCEL_BYPASS_TOKEN;
    }

    // Navega até a URL com timeout maior
    await page.goto(previewUrl, {
      waitUntil: "networkidle0",
      timeout: 120000, // 2 minutos para renderizar 374 páginas
      headers,
    });

    // ============================================================
    // 🔥 ESPERA POR RENDERIZAÇÃO REAL DO REACT
    // Aguarda até que o front-end defina window.__PDF_READY__ = true
    // Isso garante que todas as páginas foram montadas no DOM.
    // ============================================================
    await page.waitForFunction(() => window.__PDF_READY__ === true, {
      timeout: 60000,
      polling: 200,
    });

    // ============================================================
    // 🔥 VALIDAÇÃO: Obtém a contagem de páginas do sinal
    // ============================================================
    const pageCount = await page.evaluate(() => window.__PDF_PAGE_COUNT__ || 0);
    console.log(`[renderer] Páginas renderizadas: ${pageCount}`);

    // Se não houver páginas suficientes, lança erro
    if (pageCount < 2) {
      throw new Error(
        `PDF incompleto: apenas ${pageCount} página(s) renderizada(s)`,
      );
    }

    // Pequeno delay extra para garantir pintura completa
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Gera o PDF
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: 0, bottom: 0, left: 0, right: 0 },
      displayHeaderFooter: false,
      timeout: 60000,
    });

    return Buffer.from(pdfBuffer);
  } finally {
    await page.close();
    // Mantém o browser aberto para reuso em próximas chamadas
  }
}
