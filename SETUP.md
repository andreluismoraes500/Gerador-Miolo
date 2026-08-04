# Setup — BullMQ + Redis + Worker separado (Render)

## Arquitetura

```
Frontend React (Vite)
        │  POST /api/generate
        ▼
Node API (server/index.js / Express)
        │  cria job
        ▼
      BullMQ  ──────────────►  Redis
        ▲                          │
        │ consome jobs             │
        │                          ▼
Worker Node separado (worker/pdfWorker.js)
        │  Puppeteer + Chromium
        ▼
   PDF gerado
        │  savePdf()
        ▼
Storage (Object Storage S3-compatible, ou disco local)
        │  fileKey, size
        ▼
API devolve { downloadUrl }
        │
        ▼
Navegador baixa direto da URL
```

A API nunca executa Puppeteer. O Worker nunca serve requisições HTTP.
Ambos só compartilham o Redis (`REDIS_URL`).

## Rodando localmente

1. `cp .env.example .env` e ajuste o que precisar (por padrão já aponta
   para um Redis local).
2. Suba um Redis: `redis-server` (ou `docker run -p 6379:6379 redis`).
3. `npm install`
4. `npm run dev:all` — sobe Vite (5173), a API (3000) e o Worker no mesmo
   comando (`concurrently`).

Sem Object Storage configurado, os PDFs ficam em `STORAGE_DIR` (padrão
`/tmp/pdf-storage`) e são baixados via `GET /files/:fileKey` — funciona
localmente porque API e Worker rodam no mesmo filesystem.

## Rodando em produção no Render

Use o `render.yaml` (Blueprint) incluso na raiz do projeto, que cria:

- **Web Service** (`gerador-miolo-api`) — build `npm install && npm run
  build`, start `node server/index.js`. Serve o front-end buildado (dist/)
  e a API.
- **Background Worker** (`gerador-miolo-worker`) — build `npm install`,
  start `node worker/pdfWorker.js`. Processa a fila, executa Puppeteer.
- **Key Value (Redis)** (`gerador-miolo-redis`) — compartilhado pelos dois
  serviços acima via `REDIS_URL`.

**Importante:** Web Service e Background Worker no Render rodam em
instâncias/discos **separados e efêmeros**. Isso quer dizer que o modo
"disco local" do storage (`STORAGE_DIR`) só funciona de forma confiável
se API e Worker estiverem no mesmo processo/disco — o que NÃO é o caso
com Web Service + Background Worker separados. **Configure um Object
Storage S3-compatible em produção** (`STORAGE_ENDPOINT`,
`STORAGE_BUCKET`, `STORAGE_ACCESS_KEY`, `STORAGE_SECRET_KEY` — ver
`.env.example`), e instale as dependências opcionais:

```
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

Sem essas variáveis, cada serviço vai enxergar apenas os arquivos salvos
no seu próprio disco efêmero, e os downloads vão falhar de forma
intermitente.

## Escalando

- Para mais throughput, prefira subir mais **instâncias** do Background
  Worker (todas competem pela mesma fila) a subir
  `PDF_WORKER_CONCURRENCY` — cada job ativo é um Chromium inteiro na
  memória.
- A API é stateless (não guarda PDFs nem estado de job em memória — tudo
  fica no Redis/Storage), então pode escalar horizontalmente sem
  restrição.
