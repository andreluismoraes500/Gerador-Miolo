// server/index.js
//
// API HTTP (Express). Responsável SÓ por validar requisições, enfileirar
// jobs no BullMQ/Redis e consultar status/resultado — a geração pesada de
// PDF (Puppeteer/Chromium) roda em um processo separado
// (worker/pdfWorker.js), local ou em outra instância do Render
// ("Background Worker"), nunca dentro deste processo.
//
// Reaproveita os mesmos handlers usados nas funções serverless da Vercel
// (api/generate.js, api/status/[id].js, api/result/[id].js,
// api/state/[id].js) — eles não sabem se estão rodando na Vercel ou aqui.
import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "node:path";
import { fileURLToPath } from "node:url";
import generateHandler from "../api/generate.js";
import statusHandler from "../api/status/[id].js";
import resultHandler from "../api/result/[id].js";
import stateHandler from "../api/state/[id].js";
import {
  storageBackend,
  createDiskReadStream,
  diskFileExists,
} from "../api/_lib/storage.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: "20mb" }));

// Os handlers da Vercel leem o parâmetro de rota em req.query.id (padrão
// dos arquivos [id].js). Em Express ele vem em req.params.id — copiamos
// para req.query.id antes de delegar, para o mesmo handler funcionar nos
// dois ambientes sem nenhuma adaptação.
function withIdParam(handler) {
  return (req, res) => {
    req.query = { ...req.query, id: req.params.id };
    return handler(req, res);
  };
}

app.post("/api/generate", (req, res) => generateHandler(req, res));
app.get("/api/status/:id", withIdParam(statusHandler));
app.get("/api/result/:id", withIdParam(resultHandler));
app.get("/api/state/:id", withIdParam(stateHandler));

app.get("/api/health", (req, res) => {
  res.json({ ok: true, env: "local-express", storage: storageBackend });
});

// ============================================================
// Download em streaming (só existe/entra em uso quando o storage é
// "disco local" — STORAGE_ENDPOINT/STORAGE_BUCKET não configurados; ver
// api/_lib/storage.js). O arquivo NUNCA é lido inteiro em memória: é
// aberto um stream de leitura e "canalizado" (pipe) direto para a
// resposta HTTP.
//
// Quando um Object Storage (S3-compatible) está configurado, esta rota
// não é usada — GET /api/result/:id devolve diretamente uma URL assinada
// do provedor, e o navegador baixa de lá, sem passar por este servidor.
// ============================================================
app.get("/files/:fileKey", async (req, res) => {
  const { fileKey } = req.params;
  const exists = await diskFileExists(fileKey);
  if (!exists) {
    return res.status(404).json({ error: "Arquivo não encontrado (pode ter expirado)" });
  }

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename="${fileKey}"`);
  res.setHeader("Cache-Control", "no-cache");

  const stream = createDiskReadStream(fileKey);
  stream.on("error", (err) => {
    console.error("[server] Erro ao ler arquivo do storage local:", err.message);
    if (!res.headersSent) res.status(500).end();
  });
  stream.pipe(res);
});

// ============================================================
// Serve o front-end já buildado (dist/), quando existir.
// Isso permite rodar o front-end + a API como um único Web Service no
// Render: rode `npm run build` e depois `node server/index.js`.
// Localmente em modo dev (`npm run dev:all`) o front-end continua sendo
// servido pelo Vite (porta 5173); este bloco só entra em ação se a pasta
// dist/ existir.
// ============================================================
const distPath = path.join(__dirname, "..", "dist");
app.use(express.static(distPath));
app.get(/^(?!\/api\/|\/files\/).*/, (req, res, next) => {
  res.sendFile(path.join(distPath, "index.html"), (err) => {
    if (err) next();
  });
});

app.listen(PORT, () => {
  console.log(`✅ API rodando em http://localhost:${PORT}`);
  console.log(
    `   Fila: BullMQ + Redis. Storage: ${storageBackend}. Geração de PDF acontece em worker/pdfWorker.js (processo separado).`,
  );
});

// Rede de segurança: um erro raro que escape do try/catch de algum
// handler não deve derrubar a API inteira (isso é o que causa 502 Bad
// Gateway prolongados em produção, até o host reiniciar o container).
process.on("unhandledRejection", (reason) => {
  console.error("[server] unhandledRejection:", reason);
});
process.on("uncaughtException", (err) => {
  console.error("[server] uncaughtException:", err);
});
