import "dotenv/config";
import http from "node:http";
import { Worker } from "bullmq";
import { getConnection, QUEUE_NAME } from "../api/_lib/queue.js";
import { generatePDFFromUrl, closeBrowser } from "../api/_lib/renderer.js";
import { savePdf } from "../api/_lib/storage.js";
import { deleteState, getState } from "../api/_lib/stateStore.js";

// Health-check para o Render (porta aberta)
const HEALTH_PORT = process.env.PORT || 10000;
http
  .createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("pdf-worker ok\n");
  })
  .listen(HEALTH_PORT, () => {
    console.log(`[worker] Health-check em http://localhost:${HEALTH_PORT}`);
  });

// Usa URL interna se disponível, senão a pública
const FRONTEND_URL =
  process.env.INTERNAL_FRONTEND_URL ||
  process.env.FRONTEND_URL ||
  "http://localhost:5173";

const CONCURRENCY = Number(process.env.PDF_WORKER_CONCURRENCY || 1);

async function processJob(job) {
  const {
    kind = "agenda",
    template,
    selectedDate,
    customName,
    footerType,
    businessProfileId,
    builderMode,
    filename,
  } = job.data;

  // Verifica se o estado ainda existe
  const stored = await getState(job.id);
  if (!stored) {
    throw new Error("Estado do job expirou ou não foi encontrado.");
  }

  const basePath = kind === "talonario" ? "/talonario" : "/preview";
  const previewUrl = new URL(basePath, FRONTEND_URL);

  if (kind !== "talonario") {
    previewUrl.searchParams.set("template", template);
    previewUrl.searchParams.set("selectedDate", selectedDate);
    previewUrl.searchParams.set("customName", customName || "");
    previewUrl.searchParams.set("footerType", footerType || "default");
    previewUrl.searchParams.set(
      "businessProfileId",
      businessProfileId || "default",
    );
    previewUrl.searchParams.set("builderMode", builderMode ? "true" : "false");
  }

  previewUrl.searchParams.set("stateKey", String(job.id));
  previewUrl.searchParams.set("printing", "true");
  previewUrl.searchParams.set("_t", Date.now().toString());

  console.log(
    `[worker] Job ${job.id} (${kind}) — gerando "${filename}" a partir de ${previewUrl.toString()}`,
  );

  // Timeout de segurança para o job (10 min)
  const TIMEOUT = 10 * 60 * 1000;
  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Job timeout após 10 minutos")), TIMEOUT),
  );

  try {
    const pdfBuffer = await Promise.race([
      generatePDFFromUrl(previewUrl.toString()),
      timeoutPromise,
    ]);

    console.log(
      `[worker] Job ${job.id} renderizado — ${(pdfBuffer.length / 1024).toFixed(
        0,
      )}KB, salvando...`,
    );

    const { fileKey, size } = await savePdf(pdfBuffer, filename);

    console.log(`[worker] Job ${job.id} concluído — fileKey=${fileKey}`);

    return { fileKey, filename, size };
  } finally {
    await deleteState(job.id).catch(() => {});
  }
}

const worker = new Worker(QUEUE_NAME, processJob, {
  connection: getConnection(),
  concurrency: CONCURRENCY,
  lockDuration: 10 * 60 * 1000, // 10 min
  stalledInterval: 30 * 1000,
  maxStalledCount: 1,
});

worker.on("completed", (job) => {
  console.log(`[worker] ✅ Job ${job.id} finalizado.`);
});

worker.on("failed", (job, err) => {
  console.error(`[worker] ❌ Job ${job?.id} falhou:`, err.message);
});

worker.on("error", (err) => {
  console.error("[worker] Erro no worker:", err.message);
});

worker.on("stalled", (jobId) => {
  console.warn(`[worker] ⚠️ Job ${jobId} ficou travado.`);
});

console.log(
  `🚀 Worker rodando (fila "${QUEUE_NAME}", concurrency=${CONCURRENCY}).\n   FRONTEND_URL: ${FRONTEND_URL}`,
);

// Graceful shutdown
let shuttingDown = false;
async function gracefulShutdown(signal) {
  if (shuttingDown) return;
  shuttingDown = true;
  console.log(`[worker] ${signal} recebido, encerrando...`);
  try {
    await worker.close();
  } catch (err) {
    console.error("[worker] Erro ao fechar worker:", err.message);
  }
  try {
    await closeBrowser();
  } catch (err) {
    console.error("[worker] Erro ao fechar Chromium:", err.message);
  }
  process.exit(0);
}
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

process.on("unhandledRejection", (reason) => {
  console.error("[worker] unhandledRejection:", reason);
});
process.on("uncaughtException", (err) => {
  console.error("[worker] uncaughtException:", err);
});
