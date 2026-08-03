// worker/pdfWorker.js
//
// Este é um PROCESSO NODE.JS PERSISTENTE — diferente de api/generate.js
// (que é uma função serverless da Vercel, que só roda enquanto atende uma
// requisição), este arquivo fica rodando continuamente, consumindo a fila
// Redis e processando um job de PDF de cada vez (concurrency: 1 = FIFO
// real: quem pediu primeiro, sai primeiro; ninguém disputa o mesmo
// Chromium ao mesmo tempo).
//
// IMPORTANTE: a Vercel NÃO executa processos persistentes — funções
// serverless têm tempo de vida limitado à requisição. Por isso este
// worker precisa rodar em outro lugar:
//   - Localmente, para testar: `npm run worker`
//   - Em produção: um serviço "always-on" — Railway, Render, Fly.io, um
//     VPS com pm2/systemd, etc. Ver SETUP.md para o passo a passo.
import "dotenv/config";
import { Worker } from "bullmq";
import { getConnection, QUEUE_NAME } from "../api/_lib/queue.js";
import { generatePDFFromUrl } from "../api/_lib/renderer.js";

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

async function processJob(job) {
  const {
    template,
    selectedDate,
    customName,
    footerType,
    businessProfileId,
    builderMode,
    filename,
  } = job.data;

  const previewUrl = new URL("/preview", FRONTEND_URL);
  previewUrl.searchParams.set("template", template);
  previewUrl.searchParams.set("selectedDate", selectedDate);
  previewUrl.searchParams.set("customName", customName || "");
  previewUrl.searchParams.set("footerType", footerType || "default");
  previewUrl.searchParams.set(
    "businessProfileId",
    businessProfileId || "default",
  );
  previewUrl.searchParams.set("builderMode", builderMode ? "true" : "false");
  // A aba que o Puppeteer abre vai usar essa chave para buscar em
  // GET /api/state/:jobId o retrato do localStorage do usuário (logo,
  // cores, módulos escolhidos etc.) — ver src/bootstrap/hydrateFromServer.js
  previewUrl.searchParams.set("stateKey", String(job.id));
  previewUrl.searchParams.set("printing", "true");
  previewUrl.searchParams.set("_t", Date.now().toString());

  console.log(
    `[worker] Job ${job.id} — gerando "${filename}" a partir de ${previewUrl.toString()}`,
  );

  const pdfBuffer = await generatePDFFromUrl(previewUrl.toString());

  console.log(
    `[worker] Job ${job.id} concluído — ${(pdfBuffer.length / 1024).toFixed(0)}KB`,
  );

  return {
    pdfBase64: pdfBuffer.toString("base64"),
    filename,
    size: pdfBuffer.length,
  };
}

const worker = new Worker(QUEUE_NAME, processJob, {
  connection: getConnection(),
  // concurrency: 1 é o que garante a fila FIFO de verdade — só um PDF é
  // gerado por vez, então várias pessoas pedindo ao mesmo tempo não
  // disputam CPU/memória do mesmo Chromium. Se precisar de mais
  // throughput no futuro, suba esse número COM CUIDADO — cada job aberto
  // é um Chromium inteiro na memória.
  concurrency: 1,
  lockDuration: 5 * 60 * 1000, // 5min — templates grandes (300+ páginas) podem demorar
});

worker.on("completed", (job) => {
  console.log(`[worker] ✅ Job ${job.id} finalizado com sucesso.`);
});

worker.on("failed", (job, err) => {
  console.error(`[worker] ❌ Job ${job?.id} falhou:`, err.message);
});

worker.on("error", (err) => {
  console.error("[worker] Erro na conexão/worker:", err.message);
});

console.log(
  `🚀 Worker de geração de PDF rodando (fila "${QUEUE_NAME}", FIFO, concurrency=1).\n` +
    `   FRONTEND_URL: ${FRONTEND_URL}`,
);