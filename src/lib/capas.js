// Capas A5 (placa de papelão + dobra): molde de corte, textos arrastáveis e mala direta (CSV).
import { criarStore } from "./storeSimples";
import { emLargura } from "./cartaz";
import { FONTES_PAR } from "./fontes";

export const A4 = { w: 210, h: 297 };
export const folhaDe = (c) => (c.orient === "paisagem" ? { w: 297, h: 210 } : A4);
export const PT = 0.3528; // 1 pt em mm
export const COR_MOLDE = "#231f20";

export const FONTES_CAPA2 = FONTES_PAR;

export const idNovo = () => Math.random().toString(36).slice(2, 9);
export const itemTexto = (p = {}) => ({
  id: idNovo(), tipo: "texto", texto: "Texto", fonte: "'Montserrat', sans-serif", tam: 24, cor: "#24344D",
  x: 50, y: 50, larg: 80, alinh: "center", negrito: false, italico: false, caixaAlta: false, esp: 0, caber: false, quebra: true, fundoForma: "nenhum", fundoCor: "#ffffff", fundoOp: 100, fundoPad: 4, fundoBorda: 0, fundoBordaCor: "#24344D", ...p,
});
export const itemImagem = (p = {}) => ({ id: idNovo(), tipo: "imagem", x: 50, y: 25, w: 60, opac: 100, ...p });

export const ITENS_PADRAO = () => [
  itemTexto({ texto: "AGENDA", fonte: "'Montserrat', sans-serif", tam: 18, cor: "#8B6A1F", y: 30, negrito: true, esp: 4 }),
  itemTexto({ texto: "{nome}", fonte: "'DM Serif Display', serif", tam: 44, cor: "#24344D", y: 50, caber: true }),
  itemTexto({ texto: "2027", fonte: "'Montserrat', sans-serif", tam: 20, cor: "#24344D", y: 70, esp: 3 }),
];

export const CAPA_CFG_PADRAO = {
  orient: "retrato", placaW: 160, placaH: 220, dobra: 17.5,
  molde: "linhas", corMolde: COR_MOLDE, moldeFrente: true, verso: "molde", intercalar: true,
  cobrirFolha: false, fundo: "#ffffff", fundoImg: false, fundoModo: "cobrir", fundoOpac: 100, fundoZoom: 100, fundoX: 50, fundoY: 50,
  itens: ITENS_PADRAO(), csv: "Maria Souza\nJoão Pereira\nAna Clara Lima", sel: 0, usarCsv: true, saida: "a4", virar: "longa",
};
export const capasCfg = criarStore("capas-cfg", CAPA_CFG_PADRAO);

// imagens (não vão para o localStorage): { fundo, [idItem] }
export const capasImgs = {};

// octógono (mm): dobra + chanfro proporcional ao molde original (17,5 → 30,5)
export function geom(c) {
  const W = c.placaW + 2 * c.dobra, H = c.placaH + 2 * c.dobra, ch = c.dobra * (30.5 / 17.5);
  const F = folhaDe(c);
  const ox = (F.w - W) / 2, oy = (F.h - H) / 2;
  const pts = [[ch, 0], [W - ch, 0], [W, ch], [W, H - ch], [W - ch, H], [ch, H], [0, H - ch], [0, ch]];
  return { W, H, ch, ox, oy, F, pts, px: (W - c.placaW) / 2, py: (H - c.placaH) / 2 };
}
export const poligono = (pts) => pts.map(([x, y]) => `${x},${y}`).join(" ");

const semAcento = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "");
export const chave = (h) => semAcento(String(h)).toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "") || "nome";

// CSV básico: 1ª linha = cabeçalho (nome, turma…); separador , ; ou tab; aceita aspas
export function lerCsv(txt) {
  const linhas = String(txt || "").replace(/^\uFEFF/, "").split(/\r?\n/).filter((l) => l.trim() !== "");
  if (!linhas.length) return { cols: [], rows: [] };
  const sep = [";", "\t", ","].find((s) => linhas[0].includes(s)) || ",";
  const quebra = (l) => {
    const out = []; let cur = "", asp = false;
    for (let i = 0; i < l.length; i += 1) {
      const ch = l[i];
      if (asp) { if (ch === '"') { if (l[i + 1] === '"') { cur += '"'; i += 1; } else asp = false; } else cur += ch; }
      else if (ch === '"') asp = true;
      else if (ch === sep) { out.push(cur.trim()); cur = ""; }
      else cur += ch;
    }
    out.push(cur.trim());
    return out;
  };
  const cab = quebra(linhas[0]);
  // lista simples (uma coluna): só é cabeçalho se for "nome", "nomes", "aluno"…; senão todas as linhas são nomes
  const palavras = ["nome", "nomes", "name", "aluno", "aluna", "alunos", "pessoa", "cliente"];
  const temCab = cab.length > 1 || palavras.includes(chave(cab[0]));
  const cols = temCab ? cab.map(chave) : ["nome"];
  const rows = (temCab ? linhas.slice(1) : linhas).map(quebra).map((v) => Object.fromEntries(cols.map((k, i) => [k, v[i] || ""])));
  return { cols, rows };
}

export const aplicar = (texto, dados) => String(texto).replace(/\{(\w+)\}/g, (m, k) => (dados && dados[k.toLowerCase()] !== undefined ? dados[k.toLowerCase()] : m));

// Tamanho (pt) que faz o texto caber em 1 linha na largura (mm)
export function tamanhoCaber(txt, it, larguraMm) {
  const em = Math.max(...String(it.caixaAlta ? txt.toUpperCase() : txt).split("\n").map((l) => emLargura(l, it.fonte)), 0.01);
  const max = it.tam, mm = larguraMm / Math.max(0.01, em) / PT;
  return Math.min(max, Math.max(6, mm));
}

// Formas de fundo do texto (SVG em 100×100, esticado até a caixa). `extra` = respiro extra embaixo (mm).
export const FORMAS_TEXTO = [
  ["nenhum", "Sem fundo"], ["retangulo", "Retângulo"], ["arredondado", "Arredondado"], ["pilula", "Pílula"], ["oval", "Oval"],
  ["nuvem", "Nuvem"], ["balao", "Balão de fala"], ["estrela", "Explosão"], ["onda", "Faixa ondulada"], ["fita", "Fita"],
  ["coracao", "Coração"], ["losango", "Losango"], ["hexagono", "Hexágono"], ["octogono", "Octógono"], ["selo", "Selo"],
  ["flor", "Flor"], ["estrela5", "Estrela"], ["etiqueta", "Etiqueta"], ["seta", "Seta"], ["bandeira", "Bandeira"],
  ["cupom", "Cupom"], ["arco", "Arco"], ["pergaminho", "Pergaminho"], ["cartela", "Cartela"], ["folha", "Folha"],
  ["gota", "Gota"], ["circulo", "Círculo"], ["bolhas", "Bolhas"], ["recorte", "Cantos cortados"], ["moldura", "Moldura vazada"],
];
function scallop(nx, ny) {
  const x0 = 9, x1 = 91, y0 = 14, y1 = 86; let d = `M${x0} ${y0}`;
  const sx = (x1 - x0) / nx, sy = (y1 - y0) / ny;
  for (let i = 1; i <= nx; i += 1) d += `A${sx / 2} 8 0 0 1 ${x0 + sx * i} ${y0}`;
  for (let i = 1; i <= ny; i += 1) d += `A8 ${sy / 2} 0 0 1 ${x1} ${y0 + sy * i}`;
  for (let i = 1; i <= nx; i += 1) d += `A${sx / 2} 8 0 0 1 ${x1 - sx * i} ${y1}`;
  for (let i = 1; i <= ny; i += 1) d += `A8 ${sy / 2} 0 0 1 ${x0} ${y1 - sy * i}`;
  return `${d}Z`;
}
function explosao(n) {
  const p = [];
  for (let i = 0; i < n * 2; i += 1) { const a = (Math.PI * i) / n, r = i % 2 ? 40 : 50; p.push(`${(50 + r * Math.cos(a)).toFixed(1)},${(50 + r * 0.98 * Math.sin(a)).toFixed(1)}`); }
  return p.join(" ");
}

function serrilha(n, r1, r2, rot = 0) {
  const p = [];
  for (let i = 0; i < n * 2; i += 1) { const a = (Math.PI * i) / n + rot, r = i % 2 ? r1 : r2; p.push(`${(50 + r * Math.cos(a)).toFixed(1)},${(50 + r * Math.sin(a)).toFixed(1)}`); }
  return p.join(" ");
}
function petalas(n) {
  let d = ""; const R0 = 30, R1 = 68;
  for (let i = 0; i < n; i += 1) {
    const a0 = (2 * Math.PI * i) / n, a1 = (2 * Math.PI * (i + 1)) / n, am = (a0 + a1) / 2;
    const P = (r, a) => `${(50 + r * Math.cos(a)).toFixed(1)} ${(50 + r * Math.sin(a)).toFixed(1)}`;
    d += `${i ? "" : `M${P(R0, a0)}`}Q${P(R1, am)} ${P(R0, a1)}`;
  }
  return `${d}Z`;
}
function bolhas() {
  const c = [[50, 50, 26], [16, 50, 16], [34, 34, 20], [54, 28, 22], [74, 36, 19], [86, 54, 14], [72, 68, 18], [50, 72, 20], [28, 66, 17]];
  return c.map(([x, y, r]) => `M${x - r} ${y}a${r} ${r} 0 1 0 ${r * 2} 0a${r} ${r} 0 1 0 ${-r * 2} 0Z`).join("");
}
export const CAMINHO_FORMA = {
  nuvem: { d: scallop(6, 3), pad: 3.2 },
  balao: { d: "M8 0H92Q100 0 100 8V72Q100 80 92 80H38L20 100L27 80H8Q0 80 0 72V8Q0 0 8 0Z", pad: 1, extra: 6 },
  estrela: { pol: explosao(14), pad: 3.8 },
  onda: { d: "M0 10Q12.5 0 25 10T50 10T75 10T100 10V90Q87.5 100 75 90T50 90T25 90T0 90Z", pad: 2 },
  fita: { pol: "0,8 100,8 93,50 100,92 0,92 7,50", pad: 1.7 },
  coracao: { d: "M50 94C20 70 3 52 3 31C3 16 14 6 27 6C37 6 46 12 50 22C54 12 63 6 73 6C86 6 97 16 97 31C97 52 80 70 50 94Z", pad: 2.6, prop: 1, ocupa: 0.64 },
  losango: { pol: "50,2 98,50 50,98 2,50", pad: 2.8, prop: 1, ocupa: 0.52 },
  hexagono: { pol: "25,4 75,4 99,50 75,96 25,96 1,50", pad: 1.7, prop: 1, ocupa: 0.8 },
  octogono: { pol: "30,2 70,2 98,30 98,70 70,98 30,98 2,70 2,30", pad: 1.6, prop: 1, ocupa: 0.82 },
  selo: { pol: serrilha(20, 44, 50), pad: 3.4, prop: 1, ocupa: 0.76 },
  flor: { d: petalas(8), pad: 3.6, prop: 1, ocupa: 0.58 },
  estrela5: { pol: serrilha(5, 21, 50, -Math.PI / 2), pad: 5, prop: 1, ocupa: 0.42 },
  etiqueta: { pol: "0,12 80,12 100,50 80,88 0,88", pad: 1.5 },
  seta: { pol: "0,12 82,12 82,0 100,50 82,100 82,88 0,88", pad: 1.5 },
  bandeira: { pol: "0,0 100,0 100,100 50,80 0,100", pad: 1.4 },
  cupom: { d: "M0 0H100V38A10 10 0 0 0 100 62V100H0V62A10 10 0 0 0 0 38Z", pad: 1.4 },
  arco: { d: "M0 100V48Q0 0 50 0Q100 0 100 48V100Z", pad: 1.5 },
  pergaminho: { d: "M12 8H88Q100 8 100 20Q92 26 100 32V80Q100 92 88 92H12Q0 92 0 80Q8 74 0 68V20Q0 8 12 8Z", pad: 1.6 },
  cartela: { d: "M10 0H90Q100 0 100 10V90Q100 100 90 100H10Q0 100 0 90V10Q0 0 10 0ZM18 12H82Q88 12 88 18V82Q88 88 82 88H18Q12 88 12 82V18Q12 12 18 12Z", pad: 1.5, vazado: true },
  folha: { d: "M0 100Q0 20 60 4Q100 0 100 0Q100 70 48 96Q20 106 0 100Z", pad: 2.6 },
  gota: { d: "M50 2C50 2 92 46 92 66C92 86 74 98 50 98C26 98 8 86 8 66C8 46 50 2 50 2Z", pad: 3.2, prop: 1, ocupa: 0.52 },
  circulo: { d: "M50 2A48 48 0 1 1 50 98A48 48 0 1 1 50 2Z", pad: 1, prop: 1, ocupa: 0.76 },
  bolhas: { d: bolhas(), pad: 2.6, prop: 1, ocupa: 0.72 },
  recorte: { pol: "12,0 88,0 100,12 100,88 88,100 12,100 0,88 0,12", pad: 1.3 },
  moldura: { d: "M0 0H100V100H0ZM9 9V91H91V9Z", pad: 1.5, vazado: true },
};
export const CORES_FUNDO_TEXTO = ["#ffffff", "#fff4d6", "#ffd6e0", "#d6ecff", "#d9f2d9", "#ffe08a", "#24344D", "#000000"];
