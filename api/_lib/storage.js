// api/_lib/storage.js
//
// Fonte única de armazenamento dos PDFs gerados. Substitui o fluxo antigo
// (PDF inteiro em Base64 dentro do resultado do job, indo e voltando pela
// API) por um fluxo em que o Worker salva o arquivo aqui e devolve apenas
// metadados pequenos ({ fileKey, filename, size }); o download acontece
// direto do storage (Object Storage) ou via streaming (disco local),
// nunca carregando o PDF inteiro na memória do processo da API.
//
// Dois backends, escolhidos automaticamente por variável de ambiente:
//
//   1) OBJECT STORAGE (recomendado para produção no Render, já que o
//      filesystem de um Web/Background Service do Render NÃO é
//      compartilhado nem persiste entre deploys/instâncias — cada
//      instância tem seu próprio disco efêmero). Compatível com S3
//      (AWS S3, Cloudflare R2, Backblaze B2, DigitalOcean Spaces etc).
//      Ativado quando STORAGE_ENDPOINT + STORAGE_BUCKET +
//      STORAGE_ACCESS_KEY + STORAGE_SECRET_KEY estão definidos.
//      Requer as dependências opcionais:
//        npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
//
//   2) DISCO LOCAL (fallback simples, only ok se rodar como UMA única
//      instância — ex: teste local, ou um único Render Background
//      Worker que também serve os arquivos). Salva em STORAGE_DIR
//      (padrão /tmp/pdf-storage) e serve via streaming em
//      GET /files/:fileKey (ver server/index.js).
//
// Em ambos os casos, o "resultado" do job no BullMQ é só:
//   { fileKey, filename, size }
// nunca o PDF inteiro nem Base64.

import { randomUUID } from "node:crypto";
import { createReadStream } from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";

const STORAGE_DIR = process.env.STORAGE_DIR || "/tmp/pdf-storage";
const FILE_RETENTION_MS = 60 * 60 * 1000; // 1h — mesma janela do JOB_RETENTION

const useObjectStorage = Boolean(
  process.env.STORAGE_ENDPOINT &&
    process.env.STORAGE_BUCKET &&
    process.env.STORAGE_ACCESS_KEY &&
    process.env.STORAGE_SECRET_KEY,
);

// ─── Backend: Object Storage (S3-compatible) ───────────────────────────────
let s3ClientPromise = null;
async function getS3() {
  if (s3ClientPromise) return s3ClientPromise;

  s3ClientPromise = (async () => {
    let S3Client, PutObjectCommand, GetObjectCommand, getSignedUrl;
    try {
      ({ S3Client, PutObjectCommand, GetObjectCommand } = await import(
        "@aws-sdk/client-s3"
      ));
      ({ getSignedUrl } = await import("@aws-sdk/s3-request-presigner"));
    } catch (err) {
      throw new Error(
        "STORAGE_ENDPOINT/STORAGE_BUCKET estão configurados, mas as " +
          "dependências de Object Storage não estão instaladas. Rode:\n" +
          "  npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner\n" +
          `(erro original: ${err.message})`,
      );
    }

    const client = new S3Client({
      endpoint: process.env.STORAGE_ENDPOINT,
      region: process.env.STORAGE_REGION || "auto",
      forcePathStyle: process.env.STORAGE_FORCE_PATH_STYLE !== "false",
      credentials: {
        accessKeyId: process.env.STORAGE_ACCESS_KEY,
        secretAccessKey: process.env.STORAGE_SECRET_KEY,
      },
    });

    return { client, PutObjectCommand, GetObjectCommand, getSignedUrl };
  })();

  return s3ClientPromise;
}

async function saveToObjectStorage(buffer, filename) {
  const { client, PutObjectCommand } = await getS3();
  const fileKey = `${randomUUID()}.pdf`;

  await client.send(
    new PutObjectCommand({
      Bucket: process.env.STORAGE_BUCKET,
      Key: fileKey,
      Body: buffer,
      ContentType: "application/pdf",
      ContentDisposition: `attachment; filename="${filename}"`,
      // Object Storage limpa sozinho depois de um tempo, se o provedor
      // suportar lifecycle rules baseadas em prefixo/idade — configure
      // isso no bucket. Aqui garantimos apenas a geração da URL temporária.
    }),
  );

  return { fileKey, size: buffer.length };
}

async function getObjectStorageDownloadUrl(fileKey, filename) {
  const { client, GetObjectCommand, getSignedUrl } = await getS3();
  const command = new GetObjectCommand({
    Bucket: process.env.STORAGE_BUCKET,
    Key: fileKey,
    ResponseContentDisposition: `attachment; filename="${filename}"`,
    ResponseContentType: "application/pdf",
  });
  const ttlSeconds = Number(process.env.STORAGE_URL_TTL_SECONDS || 900); // 15min
  return getSignedUrl(client, command, { expiresIn: ttlSeconds });
}

// ─── Backend: disco local ───────────────────────────────────────────────────
async function ensureDir() {
  await fs.mkdir(STORAGE_DIR, { recursive: true });
}

async function saveToDisk(buffer, filename) {
  await ensureDir();
  const fileKey = `${randomUUID()}.pdf`;
  const filePath = path.join(STORAGE_DIR, fileKey);
  await fs.writeFile(filePath, buffer);

  // Limpeza automática — evita acumular PDFs órfãos no disco do host.
  setTimeout(() => {
    fs.rm(filePath, { force: true }).catch(() => {});
  }, FILE_RETENTION_MS).unref?.();

  return { fileKey, size: buffer.length };
}

function diskFilePath(fileKey) {
  // Blindagem simples contra path traversal (fileKey vem só do backend,
  // mas não custa validar antes de tocar no filesystem).
  const safe = path.basename(fileKey);
  return path.join(STORAGE_DIR, safe);
}

async function getDiskDownloadUrl(fileKey) {
  const base = process.env.PUBLIC_API_URL || "";
  return `${base}/files/${encodeURIComponent(fileKey)}`;
}

// Usado pela rota de streaming em server/index.js — nunca carrega o
// arquivo inteiro em memória, só abre um stream de leitura.
export function createDiskReadStream(fileKey) {
  return createReadStream(diskFilePath(fileKey));
}

export async function diskFileExists(fileKey) {
  try {
    await fs.access(diskFilePath(fileKey));
    return true;
  } catch {
    return false;
  }
}

// ─── API pública (usada pelo Worker e pela API HTTP) ───────────────────────

export const storageBackend = useObjectStorage ? "object-storage" : "disk";

// Chamado pelo Worker depois de gerar o PDF. Retorna só metadados
// pequenos — é isso (e não o PDF em si) que fica salvo no resultado do
// job no BullMQ/Redis.
export async function savePdf(buffer, filename) {
  if (useObjectStorage) {
    return saveToObjectStorage(buffer, filename);
  }
  return saveToDisk(buffer, filename);
}

// Chamado pela API (GET /api/result/:id) para devolver ao front-end uma
// URL de onde baixar o arquivo — nunca o Buffer do PDF em si.
export async function getDownloadUrl(fileKey, filename) {
  if (useObjectStorage) {
    return getObjectStorageDownloadUrl(fileKey, filename);
  }
  return getDiskDownloadUrl(fileKey);
}
