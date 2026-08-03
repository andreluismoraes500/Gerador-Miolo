// api/status/[id].js
//
// GET /api/status/:id
// Devolve o status atual do job na fila: waiting (com a posição na fila),
// active (sendo processado agora), completed ou failed.
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

  const payload = {
    jobId: job.id,
    status: job.status,
    position: job.status === "waiting" ? pdfQueue.getPosition(job.id) : null,
  };

  if (job.status === "failed") {
    payload.error = job.error;
  }

  return res.status(200).json(payload);
}