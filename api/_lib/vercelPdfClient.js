// api/_lib/vercelPdfClient.js

const VERCEL_PDF_URL =
  process.env.VERCEL_PDF_URL ||
  "https://seu-projeto.vercel.app/api/generate-pdf";
const API_SECRET = process.env.API_SECRET || "sua-chave-secreta-aqui";

/**
 * Gera PDF via microserviço na Vercel
 * @param {string} url - URL da página a ser renderizada
 * @param {object} options - Opções adicionais
 * @returns {Promise<Buffer>}
 */
export async function generatePDFViaVercel(url, options = {}) {
  const payload = {
    url,
    options: {
      format: options.format || "A4",
      margin: options.margin || { top: 0, bottom: 0, left: 0, right: 0 },
    },
  };

  console.log(`[VercelClient] Solicitando PDF para: ${url}`);

  const response = await fetch(VERCEL_PDF_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": API_SECRET,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let errorText = "";
    try {
      const errorData = await response.json();
      errorText = errorData.error || errorData.details || response.statusText;
    } catch {
      errorText = response.statusText || "Erro desconhecido";
    }
    throw new Error(`Vercel PDF Service: ${response.status} - ${errorText}`);
  }

  // A resposta é o próprio PDF em buffer
  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}
