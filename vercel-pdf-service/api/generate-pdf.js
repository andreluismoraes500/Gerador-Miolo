// vercel-pdf-service/api/generate-pdf.js
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";

const API_SECRET = process.env.API_SECRET || "sua-chave-secreta-aqui";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, x-api-key");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = req.headers["x-api-key"];
  if (!apiKey || apiKey !== API_SECRET) {
    return res.status(401).json({ error: "Invalid API key" });
  }

  const { url, html, options = {} } = req.body;

  if (!url && !html) {
    return res.status(400).json({ error: "url or html required" });
  }

  let browser = null;
  let page = null;

  try {
    // 🔥 OBTÉM O CAMINHO DO CHROMIUM OTIMIZADO PARA SERVERLESS
    const executablePath = await chromium.executablePath();

    console.log(`[PDF Service] Executable path: ${executablePath}`);

    browser = await puppeteer.launch({
      args: [
        ...chromium.args,
        "--disable-extensions",
        "--disable-background-networking",
        "--disable-default-apps",
        "--disable-sync",
        "--disable-translate",
        "--disable-software-rasterizer",
        "--mute-audio",
        "--no-first-run",
        "--metrics-recording-only",
        "--js-flags=--max-old-space-size=256",
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
      ],
      defaultViewport: {
        width: 1280,
        height: 800,
      },
      executablePath,
      headless: "new",
      ignoreHTTPSErrors: true,
    });

    page = await browser.newPage();
    page.setDefaultTimeout(30000);
    page.setDefaultNavigationTimeout(30000);
    await page.emulateMediaType("print");

    if (url) {
      await page.goto(url, {
        waitUntil: "networkidle0",
        timeout: 25000,
      });
    } else if (html) {
      await page.setContent(html, {
        waitUntil: "networkidle0",
        timeout: 25000,
      });
    }

    // Aguarda o sinal de pronto (opcional - seu app usa window.__PDF_READY__)
    try {
      await page.waitForFunction(() => window.__PDF_READY__ === true, {
        timeout: 15000,
        polling: 100,
      });
    } catch (signalError) {
      console.warn("Signal __PDF_READY__ not received, proceeding anyway.");
    }

    const pdfBuffer = await page.pdf({
      format: options.format || "A4",
      printBackground: true,
      margin: options.margin || { top: 0, bottom: 0, left: 0, right: 0 },
      displayHeaderFooter: false,
      timeout: 25000,
    });

    console.log(
      `[PDF Service] PDF gerado: ${(pdfBuffer.length / 1024).toFixed(0)} KB`,
    );

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=document.pdf");
    res.status(200).send(Buffer.from(pdfBuffer));
  } catch (error) {
    console.error("[PDF Service] Erro:", error);
    return res.status(500).json({
      error: "Falha ao gerar PDF",
      details: error.message,
      stack: error.stack,
    });
  } finally {
    if (page) await page.close().catch(() => {});
    if (browser) await browser.close().catch(() => {});
  }
}
