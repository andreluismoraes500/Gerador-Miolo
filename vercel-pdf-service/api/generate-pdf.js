// vercel-pdf-service/api/generate-pdf.js
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";

// Chave secreta - use a mesma no .env do Render
const API_SECRET =
  process.env.API_SECRET || "sua-chave-secreta-aqui-mude-em-producao";

export default async function handler(req, res) {
  // ✅ CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, x-api-key");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  // 🔐 Validação da chave de API
  const apiKey = req.headers["x-api-key"];
  if (!apiKey || apiKey !== API_SECRET) {
    return res.status(401).json({ error: "Chave API inválida" });
  }

  const { url, html, options = {} } = req.body;

  if (!url && !html) {
    return res
      .status(400)
      .json({ error: "É necessário enviar 'url' ou 'html'" });
  }

  console.log(`[PDF Service] Processando: ${url ? "URL" : "HTML"}`);

  let browser = null;
  let page = null;

  try {
    // 🚀 Configuração otimizada para serverless
    const executablePath = await chromium.executablePath();

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
      ],
      defaultViewport: chromium.defaultViewport,
      executablePath,
      headless: "new",
    });

    page = await browser.newPage();

    // ⏱️ Timeouts
    page.setDefaultTimeout(30000);
    page.setDefaultNavigationTimeout(30000);

    // 🖨️ Emular impressão
    await page.emulateMediaType("print");

    // 🎯 Carregar conteúdo
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

    // 🔥 Aguardar sinal de pronto
    try {
      await page.waitForFunction(() => window.__PDF_READY__ === true, {
        timeout: 15000,
        polling: 100,
      });
    } catch (signalError) {
      console.warn(
        "[PDF Service] Sinal __PDF_READY__ não recebido, prosseguindo mesmo assim.",
      );
    }

    // 📄 Gerar PDF
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

    // 🔄 Retornar como buffer
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=document.pdf");
    res.status(200).send(Buffer.from(pdfBuffer));
  } catch (error) {
    console.error("[PDF Service] Erro:", error);
    return res.status(500).json({
      error: "Falha ao gerar PDF",
      details: error.message,
    });
  } finally {
    // 🧹 Limpeza essencial
    if (page) await page.close().catch(() => {});
    if (browser) await browser.close().catch(() => {});
  }
}
