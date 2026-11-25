// "Baixar PDF leve" para qualquer modelo: fotografa cada folha/página da tela (JPEG) e monta o PDF com pdf-lib.
// Uma imagem por folha, sem o peso do "Imprimir → Salvar como PDF" do navegador.
import { toast } from "react-hot-toast";
import { getFontEmbedCSS, toJpeg } from "html-to-image";
import { PDFDocument } from "pdf-lib";
import { gerarPdfLeve } from "./pdfLeve";
import { aguardarImagens } from "./configImpressao";

const PX_MM = 96 / 25.4;
const espera = (ms) => new Promise((r) => setTimeout(r, ms));

// Deixa a área de impressão (normalmente escondida na tela) visível fora da tela, só durante a captura.
async function comVisivel(raiz, fn) {
  const guarda = raiz.getAttribute("style");
  raiz.style.setProperty("display", "block", "important");
  raiz.style.setProperty("position", "fixed", "important");
  raiz.style.setProperty("left", "-100000px", "important");
  raiz.style.setProperty("top", "0", "important");
  raiz.style.setProperty("visibility", "visible", "important");
  raiz.style.setProperty("pointer-events", "none", "important");
  try { return await fn(); } finally { if (guarda === null) raiz.removeAttribute("style"); else raiz.setAttribute("style", guarda); }
}

// Copia, só para dentro da área de impressão, as regras "@media print" que dimensionam as páginas (210×297 mm, margens...),
// para a foto na tela sair igual à impressão.
function regrasDePagina(escopo = ".print-container", padrao = /\.page-break|\.printable-page|\.print\\:/) {
  let css = "";
  for (const sh of document.styleSheets) {
    let regras;
    try { regras = sh.cssRules; } catch { continue; }
    for (const r of regras) {
      if (!(r instanceof CSSMediaRule) || !/print/.test(r.media.mediaText)) continue;
      for (const q of r.cssRules) {
        if (!(q instanceof CSSStyleRule)) continue;
        const sel = q.selectorText;
        if (!padrao.test(sel)) continue;
        if (/data-lados|\.folha|\.celula|sticker-editando|body|html|print\\:hidden/.test(sel)) continue;
        css += `${q.cssText}\n`;
      }
    }
  }
  return css ? `${escopo} { ${css} }` : "";
}
async function comRegrasDePagina(fn, escopo, padrao) {
  const st = document.createElement("style");
  st.dataset.captura = "1";
  st.textContent = regrasDePagina(escopo, padrao);
  document.head.appendChild(st);
  try { return await fn(); } finally { st.remove(); }
}

let fontesCache = null; // CSS das fontes embutido uma vez só (evita baixar as fontes a cada página)
async function fotografar(el, { pixelRatio = 2.5, mm }) {
  if (fontesCache === null) fontesCache = await getFontEmbedCSS(el).catch(() => "");
  const guarda = el.getAttribute("style");
  if (mm) { el.style.width = `${mm.w}mm`; el.style.height = `${mm.h}mm`; }
  try {
    const larg = el.offsetWidth, alt = el.offsetHeight;
    const url = await toJpeg(el, { pixelRatio, fontEmbedCSS: fontesCache, quality: 0.92, backgroundColor: "#ffffff", width: larg, height: alt, style: { margin: "0", transform: "none" } });
    return { url, larg: larg * pixelRatio, alt: alt * pixelRatio, wmm: larg / PX_MM, hmm: alt / PX_MM };
  } finally { if (guarda === null) el.removeAttribute("style"); else el.setAttribute("style", guarda); }
}

function baixar(bytes, nome) {
  const url = URL.createObjectURL(new Blob([bytes], { type: "application/pdf" }));
  const a = document.createElement("a");
  a.href = url; a.download = `${nome}.pdf`; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}

// Modelos cuja "folha" já é a folha final (adesivos, cartazes, capas, embalagens…): 1 imagem = 1 página do PDF.
export function limparCacheFontes() { fontesCache = null; }

export async function baixarPdfLeveFolhas({ raiz, folhas, nome = "impressao", mm, pixelRatio, aoProgresso, regras }) {
  fontesCache = null;
  const r = document.querySelector(raiz);
  if (!r) throw new Error("Área de impressão não encontrada");
  await aguardarImagens(r).catch(() => {});
  const fotos = await comRegrasDePagina(() => comVisivel(r, async () => {
    await espera(150);
    const els = [...r.querySelectorAll(folhas)];
    const out = [];
    for (let i = 0; i < els.length; i += 1) {
      out.push(await fotografar(els[i], { pixelRatio, mm }));
      aoProgresso && aoProgresso(i + 1, els.length);
    }
    return out;
  }), regras ? raiz : ".nada", regras || /^$/);
  if (!fotos.length) throw new Error("Nenhuma folha para gerar");
  const doc = await PDFDocument.create();
  doc.setTitle(nome);
  for (const f of fotos) {
    const img = await doc.embedJpg(await (await fetch(f.url)).arrayBuffer());
    const w = (f.wmm / 25.4) * 72, h = (f.hmm / 25.4) * 72;
    doc.addPage([w, h]).drawImage(img, { x: 0, y: 0, width: w, height: h });
  }
  const bytes = await doc.save();
  baixar(bytes, nome);
  toast.success(`PDF leve pronto: ${fotos.length} folha(s), ${(bytes.length / 1048576).toFixed(1)} MB.`);
  return fotos.length;
}

// Modelos em páginas soltas (miolos de agenda): fotografa cada página e usa o mesmo montador do PDF leve
// (frente/verso, 2 por folha, brochura, wire-o…).
export async function baixarPdfLeveMiolo({ raiz = ".print-container", paginas = ".page-break", nome = "miolo", pixelRatio = 2.2, aoProgresso }) {
  fontesCache = null;
  const r = document.querySelector(raiz);
  if (!r) throw new Error("Páginas não encontradas");
  await aguardarImagens(r).catch(() => {});
  const fotos = await comRegrasDePagina(() => comVisivel(r, async () => {
    await espera(300);
    const els = [...r.querySelectorAll(`:scope > ${paginas}`)];
    const out = [];
    for (let i = 0; i < els.length; i += 1) {
      out.push(await fotografar(els[i], { pixelRatio }));
      aoProgresso && aoProgresso(i + 1, els.length);
    }
    return out;
  }), ".print-container");
  if (!fotos.length) throw new Error("Nenhuma página para gerar");
  const { impressao } = await import("./configImpressao");
  const imp = impressao.get();
  const bytes = await gerarPdfLeve({ paginas: fotos, indices: fotos.map((_, i) => i), formato: imp.formato, lados: imp.lados, ajuste: "caber", girar: false, imp });
  baixar(bytes, nome);
  toast.success(`PDF leve pronto: ${fotos.length} página(s), ${(bytes.length / 1048576).toFixed(1)} MB.`);
  return fotos.length;
}

export const comAviso = (fn) => async (...a) => { try { await fn(...a); } catch (e) { console.error(e); toast.error("Não consegui gerar o PDF leve. Tente de novo ou use Imprimir."); } };
