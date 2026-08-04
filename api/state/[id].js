// api/state/[id].js
//
// GET /api/state/:id
// Endpoint interno: é chamado pela própria aba que o Puppeteer abre
// (src/bootstrap/hydrateFromServer.js), não pelo usuário final. Devolve o
// "retrato" de configuração enviado junto com o job em /api/generate,
// junto com o "kind" (agenda | talonario). Vem do Redis (stateStore.js),
// não do job do BullMQ — mantém o job pequeno mesmo quando o retrato
// inclui logo/marca d'água em Base64.
import { getState } from "../_lib/stateStore.js";

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
    const stored = await getState(id);
    if (!stored) {
      return res
        .status(404)
        .json({ error: "Estado não encontrado (pode ter expirado)" });
    }

    return res.status(200).json(stored);
  } catch (error) {
    console.error("[state] Erro ao buscar estado:", error);
    return res.status(500).json({
      error: "Falha ao buscar o estado do job",
      details: error.message,
    });
  }
}
