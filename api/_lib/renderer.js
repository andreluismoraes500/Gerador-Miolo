// api/_lib/renderer.js
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";

// Detecta se está rodando localmente (vercel dev) ou produção
const isLocal = process.env.VERCEL_ENV === "development" || !process.env.VERCEL;

export async function generatePDFFromUrl(previewUrl) {
  let browser;

  try {
    if (isLocal) {
      // Usa Puppeteer instalado localmente (puppeteer-core + Chromium baixado)
      // Você precisa instalar o puppeteer (não core) para local
      // Ou usar o chromium que vem com o puppeteer-core local
      const puppeteerLocal = await import("puppeteer");
      browser = await puppeteerLocal.launch({
        headless: true,
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

    const page = await browser.newPage();

    await page.setViewport({
      width: 794,
      height: 1123,
      deviceScaleFactor: 1,
    });

    await page.goto(previewUrl, {
      waitUntil: "networkidle0",
      timeout: 30000,
    });

    // Aguarda o conteúdo ser renderizado
    await page.waitForSelector(".agenda-preview-container", { timeout: 10000 });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: 0, bottom: 0, left: 0, right: 0 },
      displayHeaderFooter: false,
    });

    return Buffer.from(pdfBuffer);
  } finally {
    if (browser) await browser.close();
  }
}
