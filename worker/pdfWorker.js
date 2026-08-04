// worker/pdfWorker.js
//
// Processo Node.js PERSISTENTE e SEPARADO da API HTTP. Fica rodando
// continuamente, consumindo a fila BullMQ/Redis e processando jobs de
// geração de PDF: abre o Chromium (Puppeteer), renderiza, salva o
// resultado no storage (Object Storage ou disco — ver _lib/storage.js) e
// devolve só metadados pequenos ({ fileKey, filename, size }) como
// resultado do job — nunca o PDF em Base64.
//
// Em produção no Render, este arquivo roda como um Web Service separado
// da API (ver render.yaml) — cadastrado como "Web Service" e não
// "Background Worker" para poder usar o free tier do Render (Background
// Worker não tem plano gratuito). Ambos apontam para o mesmo REDIS_URL.
//
// Comandos:
//   - Local: npm run worker
//   - Produção (Render Web Service "worker"): node worker/pdfWorker.js
import "dotenv/config";
import http from "node:http";
import { Worker } from "bullmq";
import { getConnection, QUEUE_NAME } from "../api/_lib/queue.js";
import { generatePDFFromUrl, closeBrowser } from "../api/_lib/renderer.js";
import { savePdf } from "../api/_lib/storage.js";
import { deleteState, getState } from "../api/_lib/stateStore.js";

// ── Health-check HTTP ────────────────────────────────────────────────────
// O worker continua sendo um processo separado da API — nunca executa
// nenhuma rota da aplicação. Este servidor HTTP existe SÓ para satisfazer
// a checagem de porta aberta do Render quando este processo é cadastrado
// como "Web Service" (necessário para usar o free tier, já que Background
// Worker no Render é sempre pago). Responde só um 200 OK simples.
const HEALTH_PORT = process.env.PORT || 10000;
http
  .createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("pdf-worker ok\n");
  })
  .listen(HEALTH_PORT, () => {
    console.log(
      `[worker] Health-check HTTP em http://localhost:${HEALTH_PORT}`,
    );
  });

// ALTERADO: usa INTERNAL_FRONTEND_URL se disponível (para comunicação interna no Render)
const FRONTEND_URL =
  process.env.INTERNAL_FRONTEND_URL ||
  process.env.FRONTEND_URL ||
  "http://localhost:5173";

// Concorrência configurável por variável de ambiente. Cada job ativo é um
// Chromium inteiro na memória — comece com 1 (fila FIFO real, sem disputa
// de CPU/memória entre PDFs) e só suba com cuidado, monitorando o
// consumo de memória do plano do Render.
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

  // Garante que o "retrato" de estado (logo, cores, módulos etc. — ver
  // stateStore.js) ainda existe antes de abrir o Chromium. Se não
  // existir mais (expirou, ou algo apagou antes da hora), falha cedo com
  // uma mensagem clara em vez de deixar o Puppeteer renderizar uma aba
  // "vazia" sem as personalizações do usuário.
  const stored = await getState(job.id);
  if (!stored) {
    throw new Error(
      "Estado do job expirou ou não foi encontrado antes do processamento " +
        "(ver STATE_TTL em api/_lib/stateStore.js).",
    );
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

  // A aba que o Puppeteer abre usa essa chave para buscar em
  // GET /api/state/:jobId o retrato de configuração do usuário (logo,
  // cores, módulos escolhidos etc.) — ver src/bootstrap/hydrateFromServer.js
  previewUrl.searchParams.set("stateKey", String(job.id));
  previewUrl.searchParams.set("printing", "true");
  previewUrl.searchParams.set("_t", Date.now().toString());

  console.log(
    `[worker] Job ${job.id} (${kind}) — gerando "${filename}" a partir de ${previewUrl.toString()}`,
  );

  try {
    const pdfBuffer = await generatePDFFromUrl(previewUrl.toString());

    console.log(
      `[worker] Job ${job.id} renderizado — ${(pdfBuffer.length / 1024).toFixed(0)}KB, salvando no storage...`,
    );

    // Aqui é o ponto central da refatoração: o PDF vai direto para o
    // storage, e SÓ os metadados pequenos voltam como resultado do job —
    // nunca o Buffer/Base64 do PDF em si atravessa o Redis.
    const { fileKey, size } = await savePdf(pdfBuffer, filename);

    console.log(`[worker] Job ${job.id} concluído — fileKey=${fileKey}`);

    return { fileKey, filename, size };
  } finally {
    // O retrato de estado só é necessário durante o processamento deste
    // job específico — libera o espaço no Redis assim que possível, sem
    // esperar o TTL de 30min.
    await deleteState(job.id).catch(() => {});
  }
}

const worker = new Worker(QUEUE_NAME, processJob, {
  connection: getConnection(),
  concurrency: CONCURRENCY,
  // Templates grandes (Montagem Completa, centenas de páginas) podem
  // demorar — lockDuration generoso evita que o BullMQ considere o job
  // "travado" e o reenfileire para outro worker enquanto este ainda está
  // trabalhando nele.
  lockDuration: 5 * 60 * 1000, // 5min
  stalledInterval: 30 * 1000,
  maxStalledCount: 1,
});

worker.on("completed", (job) => {
  console.log(`[worker] ✅ Job ${job.id} finalizado com sucesso.`);
});

worker.on("failed", (job, err) => {
  console.error(
    `[worker] ❌ Job ${job?.id} falhou (tentativa ${job?.attemptsMade}/${job?.opts?.attempts}):`,
    err.message,
  );
});

worker.on("error", (err) => {
  // Erros de conexão com o Redis, entre outros — não derruba o processo,
  // o BullMQ tenta reconectar sozinho.
  console.error("[worker] Erro na conexão/worker:", err.message);
});

worker.on("stalled", (jobId) => {
  console.warn(`[worker] ⚠️ Job ${jobId} ficou travado e será reprocessado.`);
});

console.log(
  `🚀 Worker de geração de PDF rodando (fila "${QUEUE_NAME}", concurrency=${CONCURRENCY}).\n` +
    `   FRONTEND_URL: ${FRONTEND_URL}`,
);

// ── Encerramento gracioso ────────────────────────────────────────────────
// Ao receber SIGTERM/SIGINT (é assim que o Render pede para o processo
// parar antes de um deploy/restart), para de aceitar jobs novos, espera o
// job atual terminar e fecha o Chromium — evita PDFs pela metade e
// processos Chromium órfãos consumindo memória.
let shuttingDown = false;
async function gracefulShutdown(signal) {
  if (shuttingDown) return;
  shuttingDown = true;
  console.log(`[worker] Recebido ${signal}, encerrando graciosamente...`);
  try {
    await worker.close();
  } catch (err) {
    console.error("[worker] Erro ao fechar o worker:", err.message);
  }
  try {
    await closeBrowser();
  } catch (err) {
    console.error("[worker] Erro ao fechar o Chromium:", err.message);
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
