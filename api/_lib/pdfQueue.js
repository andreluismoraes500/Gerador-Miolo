// api/_lib/pdfQueue.js
//
// Liga a fila em memória (memoryQueue.js) ao renderer (Puppeteer). Antes
// isso era um processo separado (worker/pdfWorker.js) conversando com o
// backend via Redis; agora, sem Redis, o processamento roda dentro do
// MESMO processo que atende as requisições HTTP (server/index.js) — por
// isso não existe mais um "worker" separado para rodar.
import { getPdfQueue } from "./memoryQueue.js";
import { generatePDFFromUrl } from "./renderer.js";

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

// Guarda temporariamente o "retrato" do localStorage de cada job, para a
// rota GET /api/state/:id devolvê-lo à aba que o Puppeteer abrir (ver
// src/bootstrap/hydrateFromServer.js). Fica disponível assim que o job é
// criado — não precisa esperar ele começar a ser processado.
export const stateByJobId = new Map();

async function processJob(data, job) {
  const {
    kind = "agenda",
    template,
    selectedDate,
    customName,
    footerType,
    businessProfileId,
    builderMode,
    filename,
  } = data;

  // Agenda usa /preview; Talonário usa /talonario — cada um com sua
  // própria página e sua própria lógica de "pronto para imprimir" (ver
  // usePdfReadySignal em PreviewPage.jsx / TalonarioPage.jsx).
  const basePath = kind === "talonario" ? "/talonario" : "/preview";
  const previewUrl = new URL(basePath, FRONTEND_URL);

  if (kind === "talonario") {
    // O Talonário não precisa desses parâmetros de agenda — só do
    // stateKey, que já traz activeTab/pedido/receituario/etc. via
    // window.__TALONARIO_HYDRATE__ (ver hydrateFromServer.js).
  } else {
    previewUrl.searchParams.set("template", template);
    previewUrl.searchParams.set("selectedDate", selectedDate);
    previewUrl.searchParams.set("customName", customName || "");
    previewUrl.searchParams.set("footerType", footerType || "default");
    previewUrl.searchParams.set(
      "businessProfileId",
      businessProfileId || "default",
    );
    previewUrl.searchParams.set(
      "builderMode",
      builderMode ? "true" : "false",
    );
  }

  previewUrl.searchParams.set("stateKey", job.id);
  previewUrl.searchParams.set("printing", "true");
  previewUrl.searchParams.set("_t", Date.now().toString());

  console.log(
    `[pdfQueue] Job ${job.id} (${kind}) — gerando "${filename}" a partir de ${previewUrl.toString()}`,
  );

  try {
    const pdfBuffer = await generatePDFFromUrl(previewUrl.toString());
    console.log(
      `[pdfQueue] Job ${job.id} concluído — ${(pdfBuffer.length / 1024).toFixed(0)}KB`,
    );
    return {
      pdfBase64: pdfBuffer.toString("base64"),
      filename,
      size: pdfBuffer.length,
    };
  } finally {
    stateByJobId.delete(job.id);
  }
}

export const pdfQueue = getPdfQueue(processJob);

// Wrapper que registra o "retrato" do estado ANTES de enfileirar, para
// que ele já esteja disponível em /api/state/:id mesmo enquanto o job
// ainda está "waiting" na fila. Guarda também o "kind", para
// hydrateFromServer.js saber como aplicar o estado (localStorage para
// agenda, window.__TALONARIO_HYDRATE__ para talonário).
export function enqueuePdfJob(data) {
  const job = pdfQueue.add(data);
  stateByJobId.set(job.id, {
    kind: data.kind || "agenda",
    state: data.state || {},
  });
  return job;
}
