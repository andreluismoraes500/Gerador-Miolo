// PDF leve: monta as folhas direto com pdf-lib, embutindo cada JPEG UMA vez (sem recodificar).
// Evita os arquivos gigantes que o navegador gera ao "imprimir" páginas de imagem.
import { PDFDocument, degrees, popGraphicsState, pushGraphicsState, clip, endPath, moveTo, lineTo, closePath } from "pdf-lib";
import { FORMATOS, montarFolhas } from "./configImpressao";

const PT = 72 / 25.4;

export async function gerarPdfLeve({ paginas, formato = "a4", lados = "ambos", ajuste = "caber", girar = true, inv = {}, paisagem = false, indices, aoProgresso }) {
  const f0 = FORMATOS.find((x) => x.id === formato) || FORMATOS[0];
  const f = paisagem ? { ...f0, folha: [f0.folha[1], f0.folha[0]], cols: f0.rows, rows: f0.cols } : f0;
  const lista = indices.filter((i) => paginas[i]);
  let folhas = montarFolhas(lista.length, f0);
  if (lados === "frente") folhas = folhas.filter((x) => x.lado === "frente");
  if (lados === "verso") folhas = folhas.filter((x) => x.lado === "verso");

  const doc = await PDFDocument.create();
  doc.setTitle("Miolo para impressão");
  const embutidas = new Map();
  const embutir = async (k) => {
    if (!embutidas.has(k)) {
      const buf = await (await fetch(paginas[lista[k]].url)).arrayBuffer();
      embutidas.set(k, await doc.embedJpg(buf));
    }
    return embutidas.get(k);
  };

  let feitas = 0;
  for (const fl of folhas) {
    const W = f.folha[0] * PT, H = f.folha[1] * PT;
    const page = doc.addPage([W, H]);
    const cw = W / f.cols, ch = H / f.rows;
    for (let c = 0; c < fl.cells.length; c += 1) {
      const k = fl.cells[c];
      if (k == null || !paginas[lista[k]]) continue;
      const pg = paginas[lista[k]];
      const img = await embutir(k);
      const col = c % f.cols, row = Math.floor(c / f.cols);
      const cx = col * cw, cy = H - (row + 1) * ch;
      const gira = (pg.larg > pg.alt && girar && !paisagem) !== !!inv[lista[k]];
      const iw = pg.larg, ih = pg.alt;
      const vw = gira ? ih : iw, vh = gira ? iw : ih; // dimensões visuais
      const s = ajuste === "preencher" ? Math.max(cw / vw, ch / vh) : Math.min(cw / vw, ch / vh);
      const dw = iw * s, dh = ih * s;
      page.pushOperators(pushGraphicsState(), moveTo(cx, cy), lineTo(cx + cw, cy), lineTo(cx + cw, cy + ch), lineTo(cx, cy + ch), closePath(), clip(), endPath());
      if (gira) page.drawImage(img, { x: cx + (cw - dh) / 2, y: cy + (ch + dw) / 2, width: dw, height: dh, rotate: degrees(-90) });
      else page.drawImage(img, { x: cx + (cw - dw) / 2, y: cy + (ch - dh) / 2, width: dw, height: dh });
      page.pushOperators(popGraphicsState());
    }
    feitas += 1;
    aoProgresso && aoProgresso(feitas, folhas.length);
  }
  return doc.save();
}
