import puppeteer from "puppeteer";

export async function generatePDFFromUrl(previewUrl) {
  const browser = await puppeteer.launch({
    headless: true,
    channel: "chrome", // ou executablePath
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();

    // Ativa o modo de impressão
    await page.emulateMediaType("print");

    await page.setViewport({
      width: 794,
      height: 1123,
      deviceScaleFactor: 1,
    });

    await page.goto(previewUrl, {
      waitUntil: "networkidle0",
      timeout: 60000,
    });

    // Aguarda o primeiro elemento de quebra de página (sinal de que o miolo foi renderizado)
    await page.waitForSelector(".page-break, .printable-page", {
      timeout: 15000,
    });

    // Pequeno delay extra para garantir renderização
    await new Promise((resolve) => setTimeout(resolve, 500));

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
