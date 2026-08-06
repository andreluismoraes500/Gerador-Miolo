// api/_lib/pdfQueue.js
import { getPdfQueue } from "./memoryQueue.js";
import { generatePDFFromUrl, closeBrowser } from "./renderer.js";

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

// ... resto do código igual ...

async function processJob(data, job) {
  const {
    kind = "agenda",
    template,
    selectedDate,
    customName,
    footerType,
    businessProfileId,
    builderMode,
    filename,
  } = data;

  const basePath = kind === "talonario" ? "/talonario" : "/preview";
  const previewUrl = new URL(basePath, FRONTEND_URL);

  if (kind === "talonario") {
    // Talonário não precisa de parâmetros extras
  } else {
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

  previewUrl.searchParams.set("stateKey", job.id);
  previewUrl.searchParams.set("printing", "true");
  previewUrl.searchParams.set("_t", Date.now().toString());

  console.log(
    `[pdfQueue] Job ${job.id} (${kind}) — gerando "${filename}" via Vercel Service a partir de ${previewUrl.toString()}`,
  );

  try {
    // 🔥 GERAÇÃO VIA VERCEL
    const pdfBuffer = await generatePDFFromUrl(previewUrl.toString());
    console.log(
      `[pdfQueue] Job ${job.id} concluído — ${(pdfBuffer.length / 1024).toFixed(0)}KB`,
    );
    return {
      pdfBase64: pdfBuffer.toString("base64"),
      filename,
      size: pdfBuffer.length,
    };
  } finally {
    stateByJobId.delete(job.id);
  }
}

export const pdfQueue = getPdfQueue(processJob);

export function enqueuePdfJob(data) {
  const job = pdfQueue.add(data);
  stateByJobId.set(job.id, {
    kind: data.kind || "agenda",
    state: data.state || {},
  });
  return job;
}
