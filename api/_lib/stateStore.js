// api/_lib/stateStore.js
//
// Guarda o "retrato" de configuração (localStorage da agenda, ou estado do
// Talonário — incluindo logo/marca d'água/fundo em Base64, potencialmente
// grandes) em uma chave Redis própria, separada dos dados do job no
// BullMQ. Isso mantém os jobs do BullMQ pequenos (o painel /admin do
// BullMQ, retries, etc. não precisam carregar imagens grandes toda vez) e
// dá a esse "retrato" uma janela de expiração própria e curta — ele só é
// necessário enquanto o Puppeteer carrega a página, não pelo tempo todo
// que o job fica retido para consulta de status.
//
// GET /api/state/:id (chamado pela aba que o Puppeteer abre, ver
// src/bootstrap/hydrateFromServer.js) lê daqui.
import { getConnection } from "./queue.js";

const PREFIX = "pdf-job-state:";
const TTL_SECONDS = 30 * 60; // 30min — generoso para filas grandes, mas não eterno

export async function setState(jobId, payload) {
  const redis = getConnection();
  await redis.set(`${PREFIX}${jobId}`, JSON.stringify(payload), "EX", TTL_SECONDS);
}

export async function getState(jobId) {
  const redis = getConnection();
  const raw = await redis.get(`${PREFIX}${jobId}`);
  return raw ? JSON.parse(raw) : null;
}

export async function deleteState(jobId) {
  const redis = getConnection();
  await redis.del(`${PREFIX}${jobId}`);
}
