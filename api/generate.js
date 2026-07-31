// api/generate.js
import { generatePDFFromUrl } from "./_lib/renderer.js";

export default async function handler(req, res) {
  console.log("[API] Recebida requisição", req.method);

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const {
    template,
    selectedDate,
    colorTheme = "classico",
    customName = "",
    footerType = "default",
    businessProfileId = "default",
  } = req.body;

  console.log("[API] Dados:", {
    template,
    selectedDate,
    colorTheme,
    customName,
    footerType,
    businessProfileId,
  });

  if (!template || !selectedDate) {
    return res
      .status(400)
      .json({ error: "template e selectedDate são obrigatórios" });
  }

  // Constrói a URL de preview
  const frontendUrl =
    process.env.FRONTEND_URL ||
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:5173");
  console.log("[API] Frontend URL:", frontendUrl);

  const previewUrl = new URL("/preview", frontendUrl);
  const params = new URLSearchParams({
    template,
    selectedDate,
    colorTheme,
    customName,
    footerType,
    businessProfileId,
  });
  previewUrl.search = params.toString();

  console.log("[API] URL de preview:", previewUrl.toString());

  try {
    const pdfBuffer = await generatePDFFromUrl(previewUrl.toString());
    console.log("[API] PDF gerado com sucesso, tamanho:", pdfBuffer.length);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="agenda-${template}-${selectedDate}.pdf"`,
    );
    res.setHeader("Content-Length", pdfBuffer.length);
    return res.status(200).send(pdfBuffer);
  } catch (error) {
    console.error("[API] Erro ao gerar PDF:", error);
    return res
      .status(500)
      .json({ error: "Falha ao gerar o PDF: " + error.message });
  }
}
