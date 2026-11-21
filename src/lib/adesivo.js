// Adesivos: formas (redondo, quadrado, retângulo, oval, selo, coração…), modelos prontos e folha n-up.
import { criarStore } from "./storeSimples";
import { emLargura } from "./cartaz";
import { encaixar } from "./calendario";
import { FONTES_TODAS } from "./fontes";

export const FORMAS = {
  circulo: { nome: "Redondo", tam: [[20, 20], [25, 25], [30, 30], [38, 38], [40, 40], [50, 50], [60, 60], [76, 76]], quadradas: true },
  quadrado: { nome: "Quadrado", tam: [[20, 20], [25, 25], [30, 30], [40, 40], [50, 50], [60, 60]], quadradas: true },
  quadradoArred: { nome: "Quadrado arredondado", tam: [[20, 20], [25, 25], [30, 30], [40, 40], [50, 50], [60, 60]], quadradas: true },
  retangulo: { nome: "Retângulo", tam: [[25, 10], [40, 20], [50, 30], [60, 40], [70, 30], [90, 50]] },
  retanguloArred: { nome: "Retângulo arredondado", tam: [[25, 10], [40, 20], [50, 30], [60, 40], [70, 30], [90, 50]] },
  oval: { nome: "Oval", tam: [[30, 20], [40, 25], [50, 35], [60, 40], [80, 50]] },
  selo: { nome: "Selo ondulado", tam: [[30, 30], [40, 40], [50, 50], [60, 60]], quadradas: true },
  coracao: { nome: "Coração", tam: [[30, 28], [40, 37], [50, 46], [60, 55]] },
  lacreMedalhao: { nome: "Lacre com medalhão", tam: [[30, 100], [35, 120], [40, 130], [40, 150], [50, 160]] },
  lacrePonta: { nome: "Lacre com círculo na ponta", tam: [[35, 100], [40, 120], [50, 135], [50, 160]] },
};
export const ehLacre = (f) => f === "lacreMedalhao" || f === "lacrePonta";

export const FONTES_AD = FONTES_TODAS.map(([v, n, peso]) => [v, n, peso]);
export const pesoFonte = (f) => (FONTES_AD.find((x) => x[0] === f) || [0, 0, 700])[2];

export const LAYOUTS_AD = { texto: "Só texto", imagem: "Só imagem (como botton)", imagemTexto: "Imagem + texto embaixo" };
export const PADROES_AD = { liso: "Liso", degrade: "Degradê", bolinhas: "Bolinhas", listras: "Listras", raios: "Raios", lacre: "Segurança (hachura)" };

export const itemNovo = (p = {}) => ({
  id: Math.random().toString(36).slice(2, 9), nome: "Adesivo", qtd: 12, layout: "texto",
  t1: "SEU TEXTO", t2: "", t3: "", fonte1: "'Anton', sans-serif", fonte2: "'Montserrat', sans-serif",
  fundo: "#ffffff", fundo2: "#e9e9e9", padrao: "liso", fundoMed: "#ffffff", corT1: "#1b1b1b", corT2: "#444444",
  anel: 0, corAnel: "#1b1b1b", anelDuplo: false, imgPct: 60, ...p,
});

export const adesivoCfg = criarStore("adesivo-cfg", {
  forma: "circulo", w: 40, h: 40, sangria: 1, fontesTodos: true, papel: "a4", margem: 8, espaco: 2, guias: true, corGuia: "#000000", orientacao: "auto",
  itens: [itemNovo({ modelo: "gratidaoRosa", modeloIdx: 0, nome: "Gratidão", t1: "Gratidão", t2: "ter você como cliente", fundo: "#f6b9c6", corT1: "#3a2a4d", corT2: "#3a2a4d", fonte1: "'Pacifico', cursive", fonte2: "'Fredoka', sans-serif", anel: 1, corAnel: "#ffffff", qtd: 12 })],
});

/* ---------- geometria (mm). `o` expande (+) ou encolhe (−) o contorno ---------- */
const f = (n) => Number(n.toFixed(3));
const arco = (cx, cy, rx, ry) => `M${f(cx - rx)} ${f(cy)}a${f(rx)} ${f(ry)} 0 1 0 ${f(2 * rx)} 0a${f(rx)} ${f(ry)} 0 1 0 ${f(-2 * rx)} 0Z`;
function rr(x, y, W, H, r) {
  r = Math.max(0, Math.min(r, W / 2, H / 2));
  if (!r) return `M${f(x)} ${f(y)}h${f(W)}v${f(H)}h${f(-W)}Z`;
  return `M${f(x + r)} ${f(y)}h${f(W - 2 * r)}a${f(r)} ${f(r)} 0 0 1 ${f(r)} ${f(r)}v${f(H - 2 * r)}a${f(r)} ${f(r)} 0 0 1 ${f(-r)} ${f(r)}h${f(-(W - 2 * r))}a${f(r)} ${f(r)} 0 0 1 ${f(-r)} ${f(-r)}v${f(-(H - 2 * r))}a${f(r)} ${f(r)} 0 0 1 ${f(r)} ${f(-r)}Z`;
}
const poly = (pts) => `M${pts.map(([x, y]) => `${f(x)} ${f(y)}`).join("L")}Z`;

export function caminho(forma, cx, cy, w, h, o = 0) {
  const W = Math.max(0.5, w + 2 * o), H = Math.max(0.5, h + 2 * o);
  switch (forma) {
    case "circulo": return arco(cx, cy, W / 2, W / 2);
    case "oval": return arco(cx, cy, W / 2, H / 2);
    case "quadrado": case "retangulo": return rr(cx - W / 2, cy - H / 2, W, H, 0);
    case "quadradoArred": case "retanguloArred": return rr(cx - W / 2, cy - H / 2, W, H, Math.min(w, h) * 0.2 + o);
    case "selo": {
      const R = W / 2 * 0.965, n = 18, pts = [];
      for (let i = 0; i < 240; i += 1) { const a = (i / 240) * Math.PI * 2; const r = R * (1 + 0.035 * Math.cos(n * a)); pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]); }
      return poly(pts);
    }
    case "coracao": {
      const pts = []; let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
      for (let i = 0; i < 160; i += 1) {
        const t = (i / 160) * Math.PI * 2;
        const x = 16 * Math.sin(t) ** 3, y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
        pts.push([x, y]); x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y);
      }
      return poly(pts.map(([x, y]) => [cx + ((x - (x0 + x1) / 2) / (x1 - x0)) * W, cy + ((y - (y0 + y1) / 2) / (y1 - y0)) * H]));
    }
    case "lacreMedalhao": {
      const R = w / 2 + o, a = w * 0.24 + o, top = cy - h / 2 - o, bot = cy + h / 2 + o, dy = Math.sqrt(Math.max(0, R * R - a * a));
      return `M${f(cx - a)} ${f(top)}L${f(cx - a)} ${f(cy - dy)}A${f(R)} ${f(R)} 0 0 0 ${f(cx - a)} ${f(cy + dy)}L${f(cx - a)} ${f(bot)}L${f(cx + a)} ${f(bot)}L${f(cx + a)} ${f(cy + dy)}A${f(R)} ${f(R)} 0 0 0 ${f(cx + a)} ${f(cy - dy)}L${f(cx + a)} ${f(top)}Z`;
    }
    case "lacrePonta": {
      const R = w / 2 + o, a = w * 0.15 + o, top = cy - h / 2 - o, cc = cy + h / 2 - w / 2, dy = Math.sqrt(Math.max(0, R * R - a * a));
      return `M${f(cx - a)} ${f(top + a)}A${f(a)} ${f(a)} 0 0 1 ${f(cx + a)} ${f(top + a)}L${f(cx + a)} ${f(cc - dy)}A${f(R)} ${f(R)} 0 1 1 ${f(cx - a)} ${f(cc - dy)}Z`;
    }
    default: return rr(cx - W / 2, cy - H / 2, W, H, 0);
  }
}

// área útil para texto (fração da largura/altura) em cada forma
export const AREA_TXT = { circulo: [0.76, 0.76], oval: [0.76, 0.7], quadrado: [0.88, 0.88], quadradoArred: [0.84, 0.84], retangulo: [0.9, 0.84], retanguloArred: [0.86, 0.8], selo: [0.7, 0.7], coracao: [0.56, 0.5] };

/* ---------- texto em várias linhas, medido com a fonte real ---------- */
function linhasEm(txt, w, fonte, fs) {
  const pal = txt.split(/\s+/).filter(Boolean), out = []; let cur = "";
  pal.forEach((p) => {
    const t = cur ? `${cur} ${p}` : p;
    if (!cur || emLargura(t, fonte) * fs <= w) cur = t; else { out.push(cur); cur = p; }
  });
  if (cur) out.push(cur);
  return out;
}
// menor largura que ainda mantém o mesmo número de linhas (quebras equilibradas, sem palavra sozinha)
function equilibrar(t, w, fonte, fs, n) {
  let lo = w * 0.35, hi = w;
  for (let i = 0; i < 12; i += 1) { const m = (lo + hi) / 2; if (linhasEm(t, m, fonte, fs).length <= n) hi = m; else lo = m; }
  return linhasEm(t, hi, fonte, fs);
}
export function ajustar(txt, w, h, maxFs, fonte, { upper = false, lh = 1.08, min = 1.2 } = {}) {
  const t = upper ? String(txt || "").toUpperCase() : String(txt || "").trim();
  if (!t || w <= 0 || h <= 0) return { fs: 0, linhas: [] };
  for (let fs = maxFs; fs >= min; fs -= maxFs * 0.03) {
    const l = linhasEm(t, w, fonte, fs);
    if (l.length * fs * lh <= h && l.every((x) => emLargura(x, fonte) * fs <= w + 0.01)) return { fs, linhas: l.length > 1 ? equilibrar(t, w, fonte, fs, l.length) : l };
  }
  return { fs: min, linhas: linhasEm(t, w, fonte, min) };
}

// largura livre numa altura dy do centro (formas curvas), para o texto não encostar na borda
export function larguraLivre(forma, w, h, dy) {
  if (forma === "circulo" || forma === "selo") { const R = (w / 2) * (forma === "selo" ? 0.86 : 0.92); return 2 * Math.sqrt(Math.max(0, R * R - dy * dy)); }
  if (forma === "oval") { const rx = (w / 2) * 0.92, ry = (h / 2) * 0.92; return 2 * rx * Math.sqrt(Math.max(0, 1 - (dy / ry) ** 2)); }
  return Infinity;
}

/* ---------- modelos prontos ---------- */
const it = (p) => itemNovo(p);
export const MODELOS_AD = [
  { id: "tomada", nome: "Tomada 110V / 220V", forma: "retanguloArred", w: 25, h: 10, itens: () => [
    it({ nome: "110V", t1: "110V", fundo: "#111111", corT1: "#ffffff", fonte1: "'Archivo Black', sans-serif", qtd: 24 }),
    it({ nome: "220V", t1: "220V", fundo: "#e30613", corT1: "#ffffff", fonte1: "'Archivo Black', sans-serif", qtd: 24 })] },
  { id: "gratidaoRosa", nome: "Gratidão rosa", forma: "circulo", w: 40, h: 40, itens: () => [it({ nome: "Gratidão", t1: "Gratidão", t2: "ter você como cliente", fundo: "#f6b9c6", fundo2: "#f9d6dd", padrao: "bolinhas", corT1: "#3a2a4d", corT2: "#3a2a4d", fonte1: "'Pacifico', cursive", fonte2: "'Fredoka', sans-serif", anel: 1, corAnel: "#ffffff" })] },
  { id: "gratidaoOuro", nome: "Gratidão dourado", forma: "circulo", w: 40, h: 40, itens: () => [it({ nome: "Gratidão", t1: "Gratidão", t2: "em ter você como cliente", fundo: "#ffffff", corT1: "#b8913a", corT2: "#b8913a", fonte1: "'Great Vibes', cursive", fonte2: "'Montserrat', sans-serif", anel: 0.5, corAnel: "#b8913a", anelDuplo: true })] },
  { id: "feitoAmor", nome: "Feito com amor", forma: "circulo", w: 38, h: 38, itens: () => [it({ nome: "Feito com amor", t1: "Feito com amor", t2: "Nome da sua marca", t3: "Fab: ___/___  Val: ___/___", fundo: "#ffffff", corT1: "#2a7fb8", corT2: "#555555", fonte1: "'Dancing Script', cursive", fonte2: "'Montserrat', sans-serif", anel: 1.2, corAnel: "#4fb3e8", anelDuplo: true })] },
  { id: "obrigado", nome: "Obrigado kraft", forma: "quadradoArred", w: 40, h: 40, itens: () => [it({ nome: "Obrigado", t1: "OBRIGADO", t2: "pela sua compra", t3: "@seuinstagram", fundo: "#d9b98a", fundo2: "#c9a572", padrao: "listras", corT1: "#4a2f17", corT2: "#4a2f17", fonte1: "'Bebas Neue', sans-serif", fonte2: "'Caveat', cursive", anel: 0.6, corAnel: "#4a2f17", anelDuplo: true })] },
  { id: "gourmet", nome: "Etiqueta gourmet", forma: "retanguloArred", w: 60, h: 40, itens: () => [it({ nome: "Gourmet", t1: "Geladinho Gourmet", t2: "Sabor: ____________", t3: "Fab: ___/___  Val: ___/___", fundo: "#ffffff", corT1: "#d6456e", corT2: "#333333", fonte1: "'Pacifico', cursive", fonte2: "'Fredoka', sans-serif", anel: 1, corAnel: "#4fb3e8" })] },
  { id: "promo", nome: "Selo promoção", forma: "selo", w: 40, h: 40, itens: () => [it({ nome: "Promo", t1: "PROMO", t2: "leve 2 pague 1", fundo: "#ffd500", corT1: "#e30613", corT2: "#1b1b1b", fonte1: "'Anton', sans-serif", fonte2: "'Montserrat', sans-serif" })] },
  { id: "coracao", nome: "Coração com amor", forma: "coracao", w: 40, h: 37, itens: () => [it({ nome: "Com amor", t1: "Com amor", t2: "para você", fundo: "#e8456b", fundo2: "#f3748f", padrao: "degrade", corT1: "#ffffff", corT2: "#ffffff", fonte1: "'Great Vibes', cursive", fonte2: "'Fredoka', sans-serif" })] },
  { id: "frágil", nome: "Frágil", forma: "retangulo", w: 70, h: 30, itens: () => [it({ nome: "Frágil", t1: "FRÁGIL", t2: "manuseie com cuidado", fundo: "#e30613", fundo2: "#b8000f", padrao: "listras", corT1: "#ffffff", corT2: "#ffffff", fonte1: "'Anton', sans-serif", fonte2: "'Oswald', sans-serif", anel: 0.8, corAnel: "#ffffff" })] },
  { id: "lacreDelivery", nome: "Lacre delivery (medalhão)", forma: "lacreMedalhao", w: 40, h: 130, itens: () => [it({ nome: "Lacre delivery", layout: "imagemTexto", t1: "SEU PEDIDO CHEGOU!", t2: "NÃO RECEBA COM O LACRE VIOLADO", t3: "EBA!", fundo: "#1c1c20", fundo2: "#5a5a66", padrao: "lacre", fundoMed: "#ffffff", corT1: "#111111", corT2: "#ececf0", fonte1: "'Archivo Black', sans-serif", fonte2: "'Oswald', sans-serif", anel: 0.8, corAnel: "#111111", anelDuplo: false, qtd: 12 })] },
  { id: "lacrePote", nome: "Lacre de pote (círculo)", forma: "lacrePonta", w: 50, h: 135, itens: () => [it({ nome: "Lacre de pote", layout: "imagemTexto", t1: "Feito com amor", t2: "Produto 100% artesanal", t3: "", fundo: "#f6f0e4", fundoMed: "#f6f0e4", corT1: "#9b7b3a", corT2: "#9b7b3a", fonte1: "'Great Vibes', cursive", fonte2: "'Montserrat', sans-serif", anel: 0.5, corAnel: "#9b7b3a", anelDuplo: true, qtd: 10 })] },
  { id: "lacreVermelho", nome: "Lacre de segurança vermelho", forma: "retangulo", w: 70, h: 30, itens: () => [it({ nome: "Lacre vermelho", t1: "NÃO ACEITE", t2: "COM O LACRE VIOLADO", t3: "LACRE DE SEGURANÇA", fundo: "#d71920", fundo2: "#b5121a", padrao: "listras", corT1: "#ffffff", corT2: "#ffffff", fonte1: "'Anton', sans-serif", fonte2: "'Oswald', sans-serif", anel: 0.7, corAnel: "#ffffff", qtd: 16 })] },
  { id: "marcaPreta", nome: "Marca preta", forma: "circulo", w: 38, h: 38, itens: () => [it({ nome: "Marca", t1: "SUA MARCA", t2: "@seuinstagram", fundo: "#111111", corT1: "#ffffff", corT2: "#cfcfcf", fonte1: "'Oswald', sans-serif", fonte2: "'Montserrat', sans-serif", anel: 0.5, corAnel: "#d4a63c", anelDuplo: true })] },
  { id: "logo", nome: "Logo (só imagem)", forma: "circulo", w: 38, h: 38, itens: () => [it({ nome: "Logo", layout: "imagem", t1: "", fundo: "#ffffff", qtd: 24 })] },
  { id: "logoTexto", nome: "Logo + texto", forma: "quadradoArred", w: 50, h: 50, itens: () => [it({ nome: "Logo + texto", layout: "imagemTexto", imgPct: 62, t1: "NOME DA LOJA", t2: "@seuinstagram", fundo: "#ffffff", corT1: "#1b1b1b", corT2: "#666666", fonte1: "'Montserrat', sans-serif", fonte2: "'Montserrat', sans-serif" })] },
];

/* ---------- folha ---------- */
export function layoutFolha(cfg, total) {
  const cw = cfg.w + 2 * cfg.sangria, ch = cfg.h + 2 * cfg.sangria;
  const g = encaixar(cfg.papel, cw, ch, cfg.margem, cfg.espaco, cfg.orientacao);
  return { ...g, cw, ch, folhas: g.porFolha ? Math.ceil(total / g.porFolha) : 0 };
}

// cores originais do adesivo (as do modelo de onde veio; senão, as de um adesivo novo)
const CAMPOS_COR = ["fundo", "fundo2", "padrao", "fundoMed", "corT1", "corT2", "corAnel", "anel", "anelDuplo"];
export function coresPadrao(item) {
  const m = MODELOS_AD.find((x) => x.id === item.modelo);
  const base = (m && m.itens()[item.modeloIdx ?? 0]) || itemNovo();
  return Object.fromEntries(CAMPOS_COR.map((k) => [k, base[k]]));
}
