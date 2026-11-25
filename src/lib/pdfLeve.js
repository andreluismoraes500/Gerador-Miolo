// PDF leve: monta as folhas direto com pdf-lib, embutindo cada JPEG UMA vez (sem recodificar).
// Evita os arquivos gigantes que o navegador gera ao "imprimir" páginas de imagem.
import { PDFDocument, BlendMode, rgb, degrees, popGraphicsState, pushGraphicsState, clip, endPath, moveTo, lineTo, closePath } from "pdf-lib";
import { FORMATOS, impressao, margemWire, folhasDoLado } from "./configImpressao";

const PT = 72 / 25.4;

// ---- Extras (fundo, marca d'água, stickers): viram imagens embutidas UMA vez e são desenhadas em cada página ----
const PX_MM = 12; // resolução de rasterização (px por mm)
const carregarImg = (src) => new Promise((ok, no) => { const im = new Image(); im.onload = () => ok(im); im.onerror = no; im.src = src; });
const canvasPng = (cv) => new Promise((ok) => cv.toBlob((b) => b.arrayBuffer().then(ok), "image/png"));
const nova = (w, h) => { const cv = document.createElement("canvas"); cv.width = Math.max(1, Math.round(w)); cv.height = Math.max(1, Math.round(h)); return cv; };

// Converte qualquer imagem (webp, svg, png…) em PNG, limitando o lado maior (px).
async function imagemParaPng(src, maxLado = 1600) {
  const im = await carregarImg(src);
  const k = Math.min(1, maxLado / Math.max(im.naturalWidth, im.naturalHeight));
  const cv = nova(im.naturalWidth * k, im.naturalHeight * k);
  cv.getContext("2d").drawImage(im, 0, 0, cv.width, cv.height);
  return { bytes: await canvasPng(cv), w: im.naturalWidth, h: im.naturalHeight };
}
async function stickerParaPng(st) {
  if (st.tipo === "img") { const r = await imagemParaPng(st.v, Math.max(200, st.tam * PX_MM)); return { bytes: r.bytes, wmm: st.tam, hmm: (st.tam * r.h) / r.w }; }
  if (st.tipo === "washi") {
    const wmm = st.tam * 3, hmm = st.tam * 0.6, cv = nova(wmm * PX_MM, hmm * PX_MM), g = cv.getContext("2d");
    g.globalAlpha = 0.88; g.fillStyle = st.v; g.fillRect(0, 0, cv.width, cv.height);
    g.fillStyle = `${st.v}cc`; g.save(); g.beginPath(); g.rect(0, 0, cv.width, cv.height); g.clip();
    const P = 4 * PX_MM, Q = 2 * PX_MM;
    for (let x = -cv.height; x < cv.width + cv.height; x += P) { g.beginPath(); g.moveTo(x + Q, 0); g.lineTo(x + P, 0); g.lineTo(x + P - cv.height, cv.height); g.lineTo(x + Q - cv.height, cv.height); g.closePath(); g.fill(); }
    g.restore();
    return { bytes: await canvasPng(cv), wmm, hmm };
  }
  const px = st.tam * PX_MM, cv = nova(px * 1.3, px * 1.3), g = cv.getContext("2d");
  g.font = `${px}px 'Noto Color Emoji','Apple Color Emoji','Segoe UI Emoji',sans-serif`; g.textAlign = "center"; g.textBaseline = "middle";
  g.fillText(st.v, cv.width / 2, cv.height / 2 + px * 0.06);
  return { bytes: await canvasPng(cv), wmm: st.tam * 1.3, hmm: st.tam * 1.3 };
}
async function textoParaPng(texto, cor, tamMm) {
  const px = tamMm * PX_MM, fam = getComputedStyle(document.body).fontFamily || "sans-serif";
  const m = nova(10, 10).getContext("2d"); m.font = `800 ${px}px ${fam}`;
  const w = Math.ceil(m.measureText(texto).width) + 8, cv = nova(Math.min(w, 8000), px * 1.3), g = cv.getContext("2d");
  g.font = `800 ${px}px ${fam}`; g.fillStyle = cor; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(texto, cv.width / 2, cv.height / 2);
  return { bytes: await canvasPng(cv), wmm: cv.width / PX_MM, hmm: cv.height / PX_MM };
}
const hexRgb = (h) => { const m = /^#?([0-9a-f]{6})$/i.exec(h || ""); const n = m ? parseInt(m[1], 16) : 0xffffff; return rgb(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255); };
// Desenha uma imagem centrada em (cx,cy) (pt), com largura/altura (pt) e giro horário em graus (como no CSS).
function desenharCentro(page, img, cx, cy, w, h, rotCss, opacity = 1) {
  const a = (-rotCss * Math.PI) / 180, c = Math.cos(a), sn = Math.sin(a);
  page.drawImage(img, { x: cx - (w / 2) * c + (h / 2) * sn, y: cy - (w / 2) * sn - (h / 2) * c, width: w, height: h, rotate: degrees(-rotCss), opacity });
}

export async function gerarPdfLeve({ paginas, formato = "a4", lados = "ambos", ajuste = "caber", girar = true, inv = {}, paisagem = false, indices, aoProgresso, imp: imp0, extras }) {
  const f0 = FORMATOS.find((x) => x.id === formato) || FORMATOS[0];
  const imp = { ...impressao.get(), ...(imp0 || {}) };
  if (f0.livro) imp.wire = false;
  const f = paisagem ? { ...f0, folha: [f0.folha[1], f0.folha[0]], cols: f0.rows, rows: f0.cols } : f0;
  const lista = indices.filter((i) => paginas[i]);
  const folhas = folhasDoLado(lista.length, f0, lados);

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

  // Extras: fundo (cor/imagem), marca d'água e stickers
  const ex = extras || {};
  const cfgx = ex.cfg || {};
  const emb = async (r) => ({ img: await doc.embedPng(r.bytes), ...r });
  const bgImgE = ex.bgImg ? await emb(await imagemParaPng(ex.bgImg, 2000)) : null;
  let marcaE = null;
  if (cfgx.marcaTipo === "texto" && cfgx.marcaTexto) marcaE = await emb(await textoParaPng(cfgx.marcaTexto, cfgx.marcaCor || "#000", cfgx.marcaTam));
  else if (cfgx.marcaTipo === "imagem" && ex.marcaImg) { const r = await imagemParaPng(ex.marcaImg, 1200); marcaE = await emb({ ...r, wmm: cfgx.marcaTam * 2.5, hmm: (cfgx.marcaTam * 2.5 * r.h) / r.w }); }
  const stCache = new Map();
  const stEmb = async (st) => { const k = `${st.tipo}|${st.v}|${st.tam}`; if (!stCache.has(k)) stCache.set(k, await emb(await stickerParaPng(st))); return stCache.get(k); };
  const stItens = ex.stickers || [];
  const temFundo = !!cfgx.bgCor || !!bgImgE;

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
      const mg = margemWire(imp, cw / PT, ch / PT, fl.lado);
      const [ml, mr, mt, mb] = [mg.l * PT, mg.r * PT, mg.t * PT, mg.b * PT];
      const cx0 = col * cw + ml, cy0 = H - (row + 1) * ch + mb;
      const cw1 = cw - ml - mr, ch1 = ch - mt - mb; // área útil da célula, sem a margem do wire-o
      // "folha virtual" (210×297 mm, ou deitada) igual à da impressão; encaixa na célula mantendo a proporção
      const gira = (pg.larg > pg.alt && girar && !paisagem) !== !!inv[lista[k]];
      const Vw = gira ? 297 : 210, Vh = gira ? 210 : 297;
      const sc = ex.cfg ? Math.min(cw1 / Vw, ch1 / Vh) : null; // pt por mm da folha virtual
      const cw2 = sc ? Vw * sc : cw1, ch2 = sc ? Vh * sc : ch1;
      const cx = cx0 + (cw1 - cw2) / 2, cy = cy0 + (ch1 - ch2) / 2;
      const iw = pg.larg, ih = pg.alt;
      const vw = gira ? ih : iw, vh = gira ? iw : ih; // dimensões visuais
      const s = ajuste === "preencher" ? Math.max(cw2 / vw, ch2 / vh) : Math.min(cw2 / vw, ch2 / vh);
      const dw = iw * s, dh = ih * s;
      page.pushOperators(pushGraphicsState(), moveTo(cx, cy), lineTo(cx + cw2, cy), lineTo(cx + cw2, cy + ch2), lineTo(cx, cy + ch2), closePath(), clip(), endPath());
      if (cfgx.bgCor) page.drawRectangle({ x: cx, y: cy, width: cw2, height: ch2, color: hexRgb(cfgx.bgCor), opacity: (cfgx.bgOp ?? 100) / 100 });
      if (bgImgE) { const kb = Math.max(cw2 / bgImgE.w, ch2 / bgImgE.h), bw = bgImgE.w * kb, bh = bgImgE.h * kb; page.drawImage(bgImgE.img, { x: cx + (cw2 - bw) / 2, y: cy + (ch2 - bh) / 2, width: bw, height: bh, opacity: (cfgx.bgOp ?? 100) / 100 }); }
      const bm = temFundo ? { blendMode: BlendMode.Multiply } : {};
      if (gira) page.drawImage(img, { x: cx + (cw2 - dh) / 2, y: cy + (ch2 + dw) / 2, width: dw, height: dh, rotate: degrees(-90), ...bm });
      else page.drawImage(img, { x: cx + (cw2 - dw) / 2, y: cy + (ch2 - dh) / 2, width: dw, height: dh, ...bm });
      if (marcaE) desenharCentro(page, marcaE.img, cx + cw2 / 2, cy + ch2 / 2, marcaE.wmm * (sc || 1), marcaE.hmm * (sc || 1), cfgx.marcaGiro || 0, (cfgx.marcaOp ?? 20) / 100);
      for (const st of stItens.filter((t) => t.pagina === `pdf-${lista[k]}`)) {
        const e = await stEmb(st);
        desenharCentro(page, e.img, cx + (st.x / 100) * cw2, cy + ch2 - (st.y / 100) * ch2, e.wmm * (sc || 1), e.hmm * (sc || 1), st.rot || 0, 1);
      }
      page.pushOperators(popGraphicsState());
    }
    feitas += 1;
    aoProgresso && aoProgresso(feitas, folhas.length);
  }
  return doc.save();
}
