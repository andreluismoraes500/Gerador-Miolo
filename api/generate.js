// api/generate.js
//
// Este endpoint NÃO gera mais o PDF diretamente. Ele só valida o pedido e
// coloca um job na fila (BullMQ + Redis). Quem realmente abre o Chromium e
// gera o PDF é o worker (worker/pdfWorker.js), que processa a fila em
// regime FIFO (um por vez), para que vários usuários pedindo PDF ao mesmo
// tempo não disputem CPU/memória do mesmo Chromium e derrubem uns aos
// outros.
//
// Fluxo:
//   1. POST /api/generate           → valida e enfileira, devolve { jobId }
//   2. GET  /api/status/:jobId      → posição na fila / progresso
//   3. GET  /api/result/:jobId      → PDF pronto (quando status = completed)
//
// O front-end (src/pages/PreviewPage.jsx) já implementa esse fluxo de
// polling automaticamente.
import { enqueuePdfJob, pdfQueue } from "./_lib/pdfQueue.js";

function sanitizeFilename(filename) {
  return String(filename || "")
    .replace(/[^a-zA-Z0-9\-_. ]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 100);
}

// Lista de templates permitidos (segurança)
const ALLOWED_TEMPLATES = [
  "anualLivre",
  "anualCompleto",
  "anualComercialDuplo",
  "diario",
  "diarioLivre",
  "diarioFloral",
  "mensalCompleto",
  "mensalLivre",
  "mensalComercialDuplo",
  "semanal",
  "tarefas",
  "capa",
  "dadosPessoais",
  "calendarios",
  "gratidao",
  "habitos",
  "financas",
  "conteudo",
  "refeicoes",
  "metas",
  "saude",
  "pet",
  "sono",
  "estudos",
  "leitura",
  "viagem",
  "compras",
  "sonhos",
  "wishlist",
  "cadernoUniversitario",
  "cadernoReceitas",
  "bulletJournal",
  "babyBook",
  "listaChamada",
  "boletim",
  "planoAula",
  "caligrafia",
  "noivas",
  "partituras",
  "floralMensal",
  "floralAnual",
  "diarioComercial",
  "diarioComercialDuplo",
  "plannerMensal",
  "semData",
];

// Tamanho máximo aceito para o "retrato" do localStorage (logo, marca
// d'água e fundo em base64 podem ser grandes). 15MB é generoso o
// suficiente para imagens normais sem deixar o endpoint aberto a abuso.
const MAX_STATE_BYTES = 15 * 1024 * 1024;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST");

  const {
    template,
    selectedDate,
    customName = "",
    footerType = "default",
    businessProfileId = "default",
    builderMode = false,
    state = {},
  } = req.body || {};

  if (!template || !selectedDate) {
    return res
      .status(400)
      .json({ error: "template e selectedDate são obrigatórios" });
  }

  if (!ALLOWED_TEMPLATES.includes(template)) {
    return res.status(400).json({ error: "Template inválido" });
  }

  const stateSize = Buffer.byteLength(JSON.stringify(state || {}), "utf8");
  if (stateSize > MAX_STATE_BYTES) {
    return res.status(413).json({
      error:
        "Personalização enviada é grande demais (logo/marca d'água muito pesados).",
    });
  }

  const safeTemplate = sanitizeFilename(template);
  const safeDate = sanitizeFilename(selectedDate);
  const filename = `agenda-${safeTemplate}-${safeDate}.pdf`;

  try {
    const job = enqueuePdfJob({
      template,
      selectedDate,
      customName,
      footerType,
      businessProfileId,
      builderMode: Boolean(builderMode),
      filename,
      // "Foto" completa do localStorage do usuário (ver
      // src/utils/agendaStateSnapshot.js) — é isso que faz o PDF do
      // backend sair IDÊNTICO ao que a pessoa vê/imprime no navegador,
      // incluindo Montagem Completa, logo, cores, combo escolhido etc.
      state,
    });

    const position = pdfQueue.getPosition(job.id);

    return res.status(202).json({
      jobId: job.id,
      status: job.status,
      position,
      filename,
    });
  } catch (error) {
    console.error("[generate] Erro ao enfileirar job:", error);
    return res.status(500).json({
      error: "Falha ao enfileirar a geração do PDF",
      details: error.message,
    });
  }
}
