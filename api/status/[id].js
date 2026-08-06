// api/status/[id].js
//
// GET /api/status/:id
// Devolve o status atual do job na fila BullMQ: waiting (com a posição
// aproximada na fila), active (sendo processado agora por algum worker),
// completed ou failed.
import { getQueue } from "../_lib/queue.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const id = req.query?.id || req.params?.id;
  if (!id) {
    return res.status(400).json({ error: "id é obrigatório" });
  }

  try {
    const queue = getQueue();
    const job = await queue.getJob(id);
    if (!job) {
      return res
        .status(404)
        .json({ error: "Job não encontrado (pode ter expirado)" });
    }

    const state = await job.getState(); // waiting | active | completed | failed | delayed
    const payload = { jobId: job.id, status: state };

    if (state === "waiting" || state === "delayed") {
      // Posição aproximada — soma de quem está esperando ou atrasado à
      // frente deste job. BullMQ não expõe posição exata por job de
      // forma barata, então isto é uma estimativa (tamanho atual da
      // fila), suficiente para o "Na fila — posição X..." do front-end.
      const waiting = await queue.getWaitingCount();
      const delayed = await queue.getDelayedCount();
      payload.position = waiting + delayed;
    }

    if (state === "failed") {
      payload.error = job.failedReason;
    }

    return res.status(200).json(payload);
  } catch (error) {
    console.error("[status] Erro ao consultar job:", error);
    return res.status(500).json({
      error: "Falha ao consultar status do job",
      details: error.message,
    });
  }
}
