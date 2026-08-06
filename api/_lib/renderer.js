// api/_lib/renderer.js
// 🚨 REMOVA a dependência direta do Puppeteer

import { generatePDFViaVercel } from "./vercelPdfClient.js";

/**
 * Gera PDF através do microserviço na Vercel
 * Não usa mais Puppeteer localmente
 */
export async function generatePDFFromUrl(previewUrl, options = {}) {
  console.log(`[renderer] Gerando PDF via Vercel Service: ${previewUrl}`);

  try {
    const pdfBuffer = await generatePDFViaVercel(previewUrl, options);
    console.log(
      `[renderer] PDF recebido: ${(pdfBuffer.length / 1024).toFixed(0)} KB`,
    );
    return pdfBuffer;
  } catch (error) {
    console.error("[renderer] Falha ao gerar PDF via Vercel:", error.message);
    throw new Error(`Falha ao gerar PDF: ${error.message}`);
  }
}

// Função vazia para compatibilidade (não usamos mais browser local)
export async function closeBrowser() {
  console.log("[renderer] Browser local não está em uso");
  return Promise.resolve();
}
