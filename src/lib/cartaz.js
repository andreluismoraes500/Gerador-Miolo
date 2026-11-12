// Cartazes de supermercado: modelos prontos, formatos e utilitários de texto/preço.
import { criarStore } from "./storeSimples";

export const FORMATOS_CZ = { a3: ["A3 · 297 × 420", 297, 420], a4: ["A4 · 210 × 297", 210, 297], a5: ["A5 · 148 × 210", 148, 210], a6: ["A6 · 105 × 148", 105, 148] };
export const FONTES_CZ = [
  ["'Anton', sans-serif", "Anton (impacto)"], ["'Bebas Neue', sans-serif", "Bebas Neue"], ["'Archivo Black', sans-serif", "Archivo Black"],
  ["'Oswald', sans-serif", "Oswald"], ["'Montserrat', sans-serif", "Montserrat"], ["'Fredoka', sans-serif", "Fredoka (arredondada)"],
  ["'DM Serif Display', serif", "DM Serif Display"], ["'Poppins', sans-serif", "Poppins"],
];

export const LAYOUTS_CZ = { empilhado: "Clássico (cartão de preço)", faixa: "Faixa de preço", destaque: "Estrela de preço", limpo: "Limpo moderno" };
export const PADROES_CZ = { liso: "Liso", raios: "Raios", bolinhas: "Bolinhas", listras: "Listras", degrade: "Degradê" };

export const MODELOS_CZ = [
  { id: "vermelho", nome: "Oferta vermelha", layout: "empilhado", fundo: "#e30613", texto: "#ffffff", destaque: "#ffd500", precoBg: "#ffd500", precoTxt: "#e30613", seloBg: "#ffd500", seloTxt: "#c4000f", padrao: "raios", fonteNome: "'Anton', sans-serif", fontePreco: "'Anton', sans-serif", seloPadrao: "OFERTA" },
  { id: "amarelo", nome: "Amarelão atacarejo", layout: "faixa", fundo: "#ffd500", texto: "#1b1b1b", destaque: "#e30613", precoBg: "#e30613", precoTxt: "#ffffff", seloBg: "#1b1b1b", seloTxt: "#ffd500", padrao: "listras", fonteNome: "'Archivo Black', sans-serif", fontePreco: "'Archivo Black', sans-serif", seloPadrao: "SUPER OFERTA" },
  { id: "hortifruti", nome: "Hortifruti", layout: "destaque", fundo: "#2e9b4f", texto: "#ffffff", destaque: "#ffe14d", precoBg: "#ffe14d", precoTxt: "#1f6b35", seloBg: "#e8431f", seloTxt: "#ffffff", padrao: "bolinhas", fonteNome: "'Fredoka', sans-serif", fontePreco: "'Fredoka', sans-serif", seloPadrao: "FRESQUINHO" },
  { id: "acougue", nome: "Açougue", layout: "faixa", fundo: "#5a0f1b", texto: "#fff4e0", destaque: "#d4a63c", precoBg: "#d4a63c", precoTxt: "#3b0a12", seloBg: "#d4a63c", seloTxt: "#3b0a12", padrao: "degrade", fonteNome: "'Bebas Neue', sans-serif", fontePreco: "'Bebas Neue', sans-serif", seloPadrao: "CORTE NOBRE" },
  { id: "padaria", nome: "Padaria", layout: "limpo", fundo: "#fff3dc", texto: "#5b3418", destaque: "#c0643a", precoBg: "#c0643a", precoTxt: "#ffffff", seloBg: "#5b3418", seloTxt: "#ffe9c2", padrao: "bolinhas", fonteNome: "'DM Serif Display', serif", fontePreco: "'DM Serif Display', serif", seloPadrao: "QUENTINHO" },
  { id: "black", nome: "Black Friday", layout: "destaque", fundo: "#0c0c0c", texto: "#ffffff", destaque: "#f4ff3a", precoBg: "#f4ff3a", precoTxt: "#0c0c0c", seloBg: "#ff2e63", seloTxt: "#ffffff", padrao: "raios", fonteNome: "'Anton', sans-serif", fontePreco: "'Anton', sans-serif", seloPadrao: "BLACK FRIDAY" },
  { id: "limpeza", nome: "Limpeza e higiene", layout: "empilhado", fundo: "#0a6cd6", texto: "#ffffff", destaque: "#ffffff", precoBg: "#ffffff", precoTxt: "#0a6cd6", seloBg: "#ffd500", seloTxt: "#0a3d7a", padrao: "bolinhas", fonteNome: "'Montserrat', sans-serif", fontePreco: "'Montserrat', sans-serif", seloPadrao: "LEVE MAIS" },
  { id: "relampago", nome: "Relâmpago", layout: "destaque", fundo: "#ff7a00", texto: "#ffffff", destaque: "#2b0a5e", precoBg: "#2b0a5e", precoTxt: "#ffe14d", seloBg: "#ffe14d", seloTxt: "#2b0a5e", padrao: "raios", fonteNome: "'Archivo Black', sans-serif", fontePreco: "'Anton', sans-serif", seloPadrao: "SÓ HOJE" },
  { id: "clean", nome: "Clean moderno", layout: "limpo", fundo: "#ffffff", texto: "#111111", destaque: "#e30613", precoBg: "#e30613", precoTxt: "#ffffff", seloBg: "#111111", seloTxt: "#ffffff", padrao: "liso", fonteNome: "'Montserrat', sans-serif", fontePreco: "'Montserrat', sans-serif", seloPadrao: "OFERTA" },
];
const ESTILO_INICIAL = { ...MODELOS_CZ[0] };
export const itemNovo = (o = {}) => ({ id: Math.random().toString(36).slice(2, 9), nome: "NOME DO PRODUTO", desc: "", de: "", por: "9,99", unid: "", selo: "", obs: "", copias: 1, fotoModo: "caber", fotoZoom: 1, fotoX: 0, fotoY: 0, ...o });

export const cartazCfg = criarStore("cartaz-cfg", {
  ...ESTILO_INICIAL, modelo: "vermelho", mercado: "SUPERMERCADO BOM PREÇO", mostrarLogo: true, mostrarSelo: true, borda: true,
  formato: "a4", orient: "retrato", papel: "a4", margem: 5, espaco: 0, guias: true,
  itens: [itemNovo({ nome: "ARROZ TIPO 1 5KG", desc: "Pacote com 5 kg", de: "29,90", por: "24,99", unid: "un", obs: "Oferta válida enquanto durarem os estoques." })],
});

export function splitPreco(v) {
  const t = String(v ?? "").replace(/[^\d.,]/g, "").replace(".", ",");
  if (!t) return null;
  const [r, c = ""] = t.split(",");
  return { r: r || "0", c: (c + "00").slice(0, 2) };
}
// Mede o texto com a fonte real (canvas) para o cartaz nunca estourar a caixa.
let ctxMedida = null;
const cache = new Map();
function emLargura(txt, fonte) {
  const k = `${fonte}|${txt}`;
  if (cache.has(k)) return cache.get(k);
  try {
    ctxMedida = ctxMedida || document.createElement("canvas").getContext("2d");
    ctxMedida.font = `100px ${fonte}`;
    const v = ctxMedida.measureText(txt).width / 100;
    cache.set(k, v);
    return v;
  } catch { return txt.length * 0.62; }
}
export const limparCacheMedida = () => cache.clear();
// Maior tamanho de fonte (mm) em que `txt` cabe em w × h mm, quebrando linhas por palavra.
export function fitTexto(txt, w, h, maxFs, fonte = "'Montserrat', sans-serif", { upper = false, lh = 1.05, min = 2 } = {}) {
  const t = upper ? String(txt || "").toUpperCase() : String(txt || "");
  const palavras = t.trim().split(/\s+/).filter(Boolean);
  if (!palavras.length || w <= 0 || h <= 0) return Math.max(min, Math.min(maxFs, h));
  const esp = emLargura("a a", fonte) - emLargura("aa", fonte);
  const ws = palavras.map((p) => emLargura(p, fonte));
  for (let fs = maxFs; fs >= min; fs -= maxFs * 0.03) {
    const lim = w / fs; // largura da caixa em "em"
    let linhas = 1, atual = 0;
    ws.forEach((L) => {
      if (L > lim) { linhas += Math.ceil(L / lim) - (atual === 0 ? 1 : 0) + (atual === 0 ? 0 : 0); atual = L % lim; if (atual === 0) atual = lim; return; }
      if (atual === 0) atual = L;
      else if (atual + esp + L <= lim) atual += esp + L;
      else { linhas += 1; atual = L; }
    });
    if (linhas * fs * lh <= h && ws.every((L) => L * fs <= w)) return fs;
  }
  return min;
}
