import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";

export async function generatePDFFromUrl(previewUrl) {
  const executablePath = await chromium.executablePath();
  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath,
    headless: true,
    ignoreHTTPSErrors: true,
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 794, height: 1123, deviceScaleFactor: 1 });
    await page.goto(previewUrl, { waitUntil: "networkidle0", timeout: 30000 });
    await page.waitForSelector(".agenda-preview-container", { timeout: 10000 });
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: 0, bottom: 0, left: 0, right: 0 },
      displayHeaderFooter: false,
    });
    return Buffer.from(pdfBuffer);
  } finally {
    await browser.close();
  }
}
