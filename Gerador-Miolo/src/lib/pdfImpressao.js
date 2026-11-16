// Utilidades da página "Imprimir PDF": leitura das páginas e intervalo "1-3, 7".
export function parseIntervalo(txt, total) {
  const t = (txt || "").trim();
  if (!t) return Array.from({ length: total }, (_, i) => i);
  const out = [];
  t.split(/[,;\s]+/).filter(Boolean).forEach((parte) => {
    const m = parte.match(/^(\d+)(?:-(\d+))?$/);
    if (!m) return;
    const a = Math.max(1, Number(m[1]));
    const b = Math.min(total, Number(m[2] ?? m[1]));
    for (let i = a; i <= b; i += 1) if (!out.includes(i - 1)) out.push(i - 1);
  });
  return out.sort((x, y) => x - y);
}

// Renderiza cada página do PDF em JPEG (~200 dpi em A4). Chama onPagina(i, {url, larg, alt}).
export async function lerPdf(arquivo, { onTotal, onPagina, cancelado }) {
  const pdfjs = await import("pdfjs-dist");
  const worker = (await import("pdfjs-dist/build/pdf.worker.min.mjs?url")).default;
  pdfjs.GlobalWorkerOptions.workerSrc = worker;
  const dados = new Uint8Array(await arquivo.arrayBuffer());
  const doc = await pdfjs.getDocument({ data: dados }).promise;
  onTotal(doc.numPages);
  for (let n = 1; n <= doc.numPages; n += 1) {
    if (cancelado()) break;
    const page = await doc.getPage(n);
    const v1 = page.getViewport({ scale: 1 });
    const escala = 2339 / Math.max(v1.width, v1.height);
    const vp = page.getViewport({ scale: escala });
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(vp.width);
    canvas.height = Math.round(vp.height);
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    await page.render({ canvasContext: ctx, viewport: vp }).promise;
    const blob = await new Promise((r) => canvas.toBlob(r, "image/jpeg", 0.93));
    onPagina(n - 1, { url: URL.createObjectURL(blob), larg: canvas.width, alt: canvas.height });
    page.cleanup();
  }
  doc.destroy();
}
