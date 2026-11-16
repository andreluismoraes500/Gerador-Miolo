// Abre um PDF e renderiza uma página como imagem (dataURL), para usar como folha do mockup.
export async function abrirPdf(arquivo) {
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = (await import("pdfjs-dist/build/pdf.worker.min.mjs?url")).default;
  return pdfjs.getDocument({ data: new Uint8Array(await arquivo.arrayBuffer()) }).promise;
}
export async function renderPagina(doc, n, largura = 1000) {
  const pg = await doc.getPage(n), v0 = pg.getViewport({ scale: 1 }), v = pg.getViewport({ scale: largura / v0.width });
  const c = document.createElement("canvas"); c.width = Math.round(v.width); c.height = Math.round(v.height);
  await pg.render({ canvasContext: c.getContext("2d"), viewport: v }).promise;
  return c.toDataURL("image/jpeg", 0.9);
}
