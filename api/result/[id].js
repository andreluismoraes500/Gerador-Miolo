// api/result/[id].js
//
// GET /api/result/:id
// Quando o job estiver "completed", devolve o PDF pronto.
import { pdfQueue } from "../_lib/pdfQueue.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const id = req.query?.id || req.params?.id;
  if (!id) {
    return res.status(400).json({ error: "id é obrigatório" });
  }

  const job = pdfQueue.getJob(id);
  if (!job) {
    return res
      .status(404)
      .json({ error: "Job não encontrado (pode ter expirado)" });
  }

  if (job.status === "failed") {
    return res.status(500).json({
      error: "A geração do PDF falhou",
      details: job.error,
    });
  }

  if (job.status !== "completed") {
    return res.status(409).json({
      error: `PDF ainda não está pronto (status atual: ${job.status})`,
    });
  }

  const { pdfBase64, filename } = job.result || {};
  if (!pdfBase64) {
    return res.status(500).json({ error: "Resultado do job veio vazio" });
  }

  const buffer = Buffer.from(pdfBase64, "base64");

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="${filename || `agenda-${id}.pdf`}"`,
  );
  res.setHeader("Content-Length", buffer.length);
  res.setHeader("Cache-Control", "no-cache");

  return res.status(200).send(buffer);
}