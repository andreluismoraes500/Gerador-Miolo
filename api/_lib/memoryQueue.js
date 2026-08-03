// api/_lib/memoryQueue.js
//
// Fila FIFO simples, 100% em memória — sem Redis, sem BullMQ. Guarda os
// jobs num array e processa UM DE CADA VEZ (concurrency 1), na ordem em
// que chegaram, dentro do próprio processo Node.
//
// IMPORTANTE — limitação real e inevitável de qualquer fila em memória:
// ela só existe DENTRO de um processo Node que fica rodando. Isso quer
// dizer:
//   ✅ Funciona perfeitamente com `node server/index.js` (local ou em
//      qualquer host "always-on": Railway, Render, Fly.io, VPS/pm2).
//   ❌ NÃO funciona de forma confiável em funções serverless da Vercel:
//      cada requisição pode cair numa instância diferente (ou numa nova,
//      em "cold start"), então a memória de uma requisição não é vista
//      pela próxima. Nesse ambiente, "fila" viraria só "um Chromium por
//      requisição", exatamente o problema que queríamos evitar.
//
// Se um dia precisar escalar para múltiplas instâncias/processos ao
// mesmo tempo, aí sim vale trocar isso por Redis+BullMQ (ou outro
// backend compartilhado) — mas para um único processo persistente, isto
// resolve o problema de "vários usuários ao mesmo tempo" sem precisar de
// nenhuma peça de infraestrutura extra.

import { randomUUID } from "node:crypto";

const STATUS = {
  WAITING: "waiting",
  ACTIVE: "active",
  COMPLETED: "completed",
  FAILED: "failed",
};

// Quanto tempo manter jobs concluídos/falhos em memória antes de limpar
// (dá tempo do front-end buscar o resultado mesmo com alguma lentidão de
// rede).
const RETENTION_MS = 60 * 60 * 1000; // 1 hora

class MemoryQueue {
  constructor(processFn, { concurrency = 1 } = {}) {
    this.processFn = processFn;
    this.concurrency = concurrency;
    this.jobs = new Map(); // id -> job
    this.queue = []; // ids aguardando, em ordem de chegada
    this.activeCount = 0;
  }

  add(data) {
    const id = randomUUID();
    const job = {
      id,
      data,
      status: STATUS.WAITING,
      result: null,
      error: null,
      createdAt: Date.now(),
    };
    this.jobs.set(id, job);
    this.queue.push(id);
    this._scheduleCleanup(job);
    this._tick();
    return job;
  }

  getJob(id) {
    return this.jobs.get(id) || null;
  }

  // Posição do job na fila de espera (1 = próximo a ser processado).
  getPosition(id) {
    const idx = this.queue.indexOf(id);
    return idx === -1 ? null : idx + 1;
  }

  _tick() {
    if (this.activeCount >= this.concurrency) return;
    const nextId = this.queue.shift();
    if (!nextId) return;

    const job = this.jobs.get(nextId);
    if (!job) {
      this._tick();
      return;
    }

    this.activeCount += 1;
    job.status = STATUS.ACTIVE;
    job.startedAt = Date.now();

    Promise.resolve()
      .then(() => this.processFn(job.data, job))
      .then((result) => {
        job.status = STATUS.COMPLETED;
        job.result = result;
        job.finishedAt = Date.now();
      })
      .catch((err) => {
        job.status = STATUS.FAILED;
        job.error = err.message || String(err);
        job.finishedAt = Date.now();
        console.error(`[memoryQueue] Job ${job.id} falhou:`, err);
      })
      .finally(() => {
        this.activeCount -= 1;
        this._scheduleCleanup(job);
        this._tick(); // processa o próximo da fila
      });
  }

  _scheduleCleanup(job) {
    setTimeout(() => {
      // Só remove se já tiver terminado (evita apagar job em andamento)
      if (job.status === STATUS.COMPLETED || job.status === STATUS.FAILED) {
        this.jobs.delete(job.id);
      }
    }, RETENTION_MS).unref?.();
  }
}

let queueInstance = null;

// Cria (uma única vez por processo) a fila de geração de PDF. O
// `processFn` é passado pelo chamador para evitar import circular com o
// renderer.
export function getPdfQueue(processFn) {
  if (!queueInstance) {
    queueInstance = new MemoryQueue(processFn, { concurrency: 1 });
  }
  return queueInstance;
}

export { STATUS };