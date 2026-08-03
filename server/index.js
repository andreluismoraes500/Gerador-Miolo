// server/index.js
//
// Servidor local (Express) — agora é TAMBÉM quem processa a fila de PDFs,
// já que ela vive em memória dentro deste mesmo processo (ver
// api/_lib/memoryQueue.js). Não existe mais um worker separado: basta
// este processo ficar rodando.
//
// Reaproveita EXATAMENTE os mesmos handlers usados nas funções
// serverless da Vercel (api/generate.js, api/status/[id].js,
// api/result/[id].js, api/state/[id].js).
import express from "express";
import cors from "cors";
import path from "node:path";
import { fileURLToPath } from "node:url";
import generateHandler from "../api/generate.js";
import statusHandler from "../api/status/[id].js";
import resultHandler from "../api/result/[id].js";
import stateHandler from "../api/state/[id].js";

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
  res.json({ ok: true, env: "local-express" });
});

// ============================================================
// Serve o front-end já buildado (dist/), quando existir.
// Isso permite rodar TUDO — front-end + API + fila de PDF — como um
// único serviço Node persistente (ex: Railway, Render, Fly.io, VPS),
// sem precisar da Vercel: rode `npm run build` e depois
// `node server/index.js`. Localmente em modo dev (`npm run dev:all`) o
// front-end continua sendo servido pelo Vite (porta 5173) normalmente;
// este bloco só entra em ação se a pasta dist/ existir.
// ============================================================
const distPath = path.join(__dirname, "..", "dist");
app.use(express.static(distPath));
app.get(/^(?!\/api\/).*/, (req, res, next) => {
  res.sendFile(path.join(distPath, "index.html"), (err) => {
    if (err) next();
  });
});

app.listen(PORT, () => {
  console.log(`✅ Backend local rodando em http://localhost:${PORT}`);
  console.log(
    `   Fila de PDF em memória, processando neste mesmo processo (sem Redis, sem worker separado).`,
  );
});