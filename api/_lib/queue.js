// api/_lib/queue.js
//
// Fonte única da fila BullMQ usada tanto pelo endpoint que recebe os
// pedidos de PDF (api/generate.js, roda na Vercel) quanto pelo worker que
// efetivamente processa cada job (worker/pdfWorker.js, roda como processo
// Node.js persistente — NÃO na Vercel, ver SETUP.md).
//
// Requer uma variável de ambiente REDIS_URL. Para produção na Vercel,
// recomendamos Redis gerenciado compatível (ex: Upstash Redis), que
// funciona bem tanto a partir de funções serverless quanto de um worker
// externo rodando 24/7.
import { Queue } from "bullmq";
import IORedis from "ioredis";

export const QUEUE_NAME = "pdf-generation";

let connection = null;
export function getConnection() {
  if (connection) return connection;

  const url = process.env.REDIS_URL;
  if (!url) {
    throw new Error(
      "REDIS_URL não está definida. Configure a URL de conexão do Redis " +
        "(ver .env.example) — sem ela a fila de geração de PDF não funciona.",
    );
  }

  connection = new IORedis(url, {
    // Exigido pelo BullMQ ao usar Workers com Redis "bloqueante".
    maxRetriesPerRequest: null,
  });
  return connection;
}

let queue = null;
export function getQueue() {
  if (!queue) {
    queue = new Queue(QUEUE_NAME, { connection: getConnection() });
  }
  return queue;
}

// Tempo que um job concluído/falho fica disponível no Redis para o
// front-end conseguir buscar status/resultado antes de ser limpo.
export const JOB_RETENTION = {
  removeOnComplete: { age: 60 * 60, count: 500 }, // 1h ou até 500 jobs
  removeOnFail: { age: 60 * 60, count: 500 },
};
