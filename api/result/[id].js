// api/result/[id].js
//
// GET /api/result/:id
// Quando o job estiver "completed", devolve não o PDF em si, mas uma URL
// de download: { downloadUrl, filename, size }. O navegador baixa
// diretamente dessa URL (Object Storage com URL assinada, ou streaming
// local via GET /files/:fileKey — ver server/index.js), sem que o PDF
// inteiro atravesse novamente o processo da API Node.
import { getQueue } from "../_lib/queue.js";
import { getDownloadUrl } from "../_lib/storage.js";

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

    const state = await job.getState();

    if (state === "failed") {
      return res.status(500).json({
        error: "A geração do PDF falhou",
        details: job.failedReason,
      });
    }

    if (state !== "completed") {
      return res.status(409).json({
        error: `PDF ainda não está pronto (status atual: ${state})`,
      });
    }

    // O Worker retorna só metadados pequenos — nunca o PDF em Base64.
    const { fileKey, filename, size } = job.returnvalue || {};
    if (!fileKey) {
      return res.status(500).json({ error: "Resultado do job veio vazio" });
    }

    const downloadUrl = await getDownloadUrl(fileKey, filename);

    return res.status(200).json({ downloadUrl, filename, size });
  } catch (error) {
    console.error("[result] Erro ao buscar resultado do job:", error);
    return res.status(500).json({
      error: "Falha ao buscar o resultado do PDF",
      details: error.message,
    });
  }
}
