// api/generate.js
//
// Este endpoint NÃO gera o PDF diretamente. Ele só valida o pedido, salva
// o "retrato" de configuração no Redis (ver stateStore.js) e cria um job
// no BullMQ. Quem realmente abre o Chromium e gera o PDF é o worker
// (worker/pdfWorker.js) — um processo Node.js separado, que pode inclusive
// rodar em outra instância/serviço do Render (Background Worker),
// consumindo a mesma fila Redis. Isso é o que permite escalar
// horizontalmente: suba quantos workers quiser, todos competem pelos
// mesmos jobs, e a API HTTP nunca fica bloqueada esperando um PDF.
//
// Fluxo:
//   1. POST /api/generate           → valida e enfileira, devolve { jobId }
//   2. GET  /api/status/:jobId      → status do job na fila
//   3. GET  /api/result/:jobId      → { downloadUrl } quando completed
//
// O front-end (src/pages/PreviewPage.jsx / TalonarioPage.jsx) já
// implementa esse fluxo de polling automaticamente.
import { getQueue, QUEUE_NAME, DEFAULT_JOB_OPTIONS } from "./_lib/queue.js";
import { setState } from "./_lib/stateStore.js";

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

// Abas válidas do Talonário (usadas quando kind === "talonario")
const TALONARIO_TABS = [
  "pedido",
  "receituario",
  "receita",
  "bingo",
  "ordemServico",
  "recibo",
  "comanda",
  "reserva",
  "valePresente",
];

// Tamanho máximo aceito para o "retrato" de estado enviado (logo, marca
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
    kind = "agenda",
    template,
    selectedDate,
    customName = "",
    footerType = "default",
    businessProfileId = "default",
    builderMode = false,
    state = {},
  } = req.body || {};

  if (!["agenda", "talonario"].includes(kind)) {
    return res.status(400).json({ error: "kind inválido" });
  }

  if (!template || !selectedDate) {
    return res
      .status(400)
      .json({ error: "template e selectedDate são obrigatórios" });
  }

  if (kind === "agenda" && !ALLOWED_TEMPLATES.includes(template)) {
    return res.status(400).json({ error: "Template inválido" });
  }

  if (kind === "talonario" && !TALONARIO_TABS.includes(template)) {
    return res.status(400).json({ error: "Aba de talonário inválida" });
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
  const filename =
    kind === "talonario"
      ? `talao-${safeTemplate}-${safeDate}.pdf`
      : `agenda-${safeTemplate}-${safeDate}.pdf`;

  try {
    const queue = getQueue();

    // Cria o job primeiro (job.id vem do BullMQ) e só então grava o
    // "retrato" de estado no Redis com essa mesma chave — assim
    // GET /api/state/:id já encontra o retrato assim que o job existe,
    // mesmo que ele ainda esteja "waiting" na fila.
    const job = await queue.add(
      "generate-pdf",
      {
        kind,
        template,
        selectedDate,
        customName,
        footerType,
        businessProfileId,
        builderMode: Boolean(builderMode),
        filename,
      },
      DEFAULT_JOB_OPTIONS,
    );

    // "Foto" do estado do usuário — no caso de agenda, é o localStorage
    // (template, Montagem Completa, logo, cores etc. — ver
    // src/utils/agendaStateSnapshot.js); no caso de talonário, é o
    // retrato do próprio hook useTalonarioBuilder (ver
    // src/utils/talonarioStateSnapshot.js). É isso que faz o PDF do
    // backend sair IDÊNTICO ao que a pessoa vê/imprime no navegador.
    // Fica em uma chave Redis própria (não dentro do job do BullMQ) para
    // não inflar o job com imagens grandes — ver stateStore.js.
    await setState(job.id, { kind, state: state || {} });

    return res.status(202).json({
      jobId: job.id,
      status: "waiting",
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