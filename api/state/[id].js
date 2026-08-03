// api/state/[id].js
//
// GET /api/state/:id
// Endpoint interno: é chamado pela própria aba que o Puppeteer abre
// (src/bootstrap/hydrateFromServer.js), não pelo usuário final. Devolve o
// "retrato" de configuração enviado junto com o job em /api/generate,
// junto com o "kind" (agenda | talonario), que diz como aplicar esse
// retrato (localStorage vs window.__TALONARIO_HYDRATE__).
import { stateByJobId, pdfQueue } from "../_lib/pdfQueue.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const id = req.query?.id || req.params?.id;
  if (!id) {
    return res.status(400).json({ error: "id é obrigatório" });
  }

  if (stateByJobId.has(id)) {
    const { kind, state } = stateByJobId.get(id);
    return res.status(200).json({ kind, state });
  }

  // Fallback: job já pode ter terminado e o estado já ter sido limpo,
  // mas o próprio job ainda existe (dentro da janela de retenção) — não
  // deveria acontecer no fluxo normal, mas não custa ser defensivo.
  const job = pdfQueue.getJob(id);
  if (!job) {
    return res
      .status(404)
      .json({ error: "Job não encontrado (pode ter expirado)" });
  }

  return res.status(200).json({
    kind: job.data?.kind || "agenda",
    state: job.data?.state || {},
  });
}