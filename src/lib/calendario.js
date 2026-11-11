// Calendários: modelos de mercado (parede, pôster, mesa, ímã/bolso, planner de mesa).
import { criarStore } from "./storeSimples";
import { PAPEIS } from "./cartaoVisita";

const ANO = new Date().getFullYear();

export const MODELOS_CAL = {
  parede: {
    nome: "Parede — 1 mês por folha", desc: "12 folhas com arte no topo e grade do mês. O clássico de parede.",
    tamanhos: { a4: ["A4 (210 × 297)", 210, 297], a3: ["A3 (297 × 420)", 297, 420], a5: ["A5 (148 × 210)", 148, 210], q30: ["Quadrado 30 × 30", 300, 300], a2: ["A2 (420 × 594)", 420, 594] }, tam: "a4",
  },
  poster: {
    nome: "Pôster anual — 12 meses em 1 folha", desc: "Ano inteiro numa só folha, para fixar na parede ou na mesa.",
    tamanhos: { a4: ["A4 (210 × 297)", 210, 297], a3: ["A3 (297 × 420)", 297, 420], a2: ["A2 (420 × 594)", 420, 594], p3042: ["30 × 42", 300, 420] }, tam: "a3",
  },
  mesa: {
    nome: "Mesa triangular (cavalete)", desc: "Um painel por mês, dobrado em prisma; vários painéis por folha A4.",
    tamanhos: { h148: ["148 × 105 mm (deitado)", 148, 105], v105: ["105 × 148 mm (em pé)", 105, 148], l210: ["210 × 105 mm (panorâmico)", 210, 105] }, tam: "h148",
  },
  mini: {
    nome: "Ímã / bolso — ano compacto", desc: "Calendário pequeno com o ano inteiro. Ideal para ímã de geladeira, brinde e cartão.",
    tamanhos: { m90: ["90 × 50 mm", 90, 50], m76: ["76 × 76 mm (quadrado)", 76, 76], m100: ["100 × 70 mm", 100, 70], v70: ["70 × 100 mm (em pé)", 70, 100] }, tam: "m76",
  },
  planner: {
    nome: "Planner mensal de mesa (desk pad)", desc: "Bloco de mesa: grade grande do mês com semanas numeradas, metas e notas.",
    tamanhos: { a4: ["A4 (297 × 210 deitado)", 297, 210], a3: ["A3 (420 × 297 deitado)", 420, 297], a5: ["A5 (210 × 148 deitado)", 210, 148] }, tam: "a4",
  },
};

export const ESTILOS_GRADE = { classico: "Clássico", colorido: "Colorido", minimal: "Minimalista" };
export const PALETAS_CAL = [
  { nome: "Rosé", cor: "#d6567a" }, { nome: "Azul", cor: "#2f6fd0" }, { nome: "Sálvia", cor: "#5f8f6b" }, { nome: "Dourado", cor: "#b8862d" },
  { nome: "Marinho", cor: "#24344D" }, { nome: "Lavanda", cor: "#7b5cc4" }, { nome: "Terracota", cor: "#c0643a" }, { nome: "Grafite", cor: "#3a3f48" },
];

export const calendarioCfg = criarStore("calendario-cfg", {
  modelo: "parede", tam: "a4", ano: ANO + (new Date().getMonth() >= 9 ? 1 : 0), semanaComeca: 0, cor: "#d6567a",
  fonteTitulo: "'DM Serif Display', serif", fonteTexto: "'Montserrat', sans-serif", estilo: "colorido", orientacao: "retrato",
  fotoPct: 50, capa: true, listaFeriados: true, nomesNaGrade: true, notas: true, titulo: "Meu Calendário", subtitulo: "",
  papel: "a4", margem: 8, espaco: 0, marcas: true, semanaNumero: false, fases: false,
});

// Posiciona painéis pequenos (mesa / ímã) em folhas.
export function encaixar(papel, cw, ch, margem, espaco, orient = "auto") {
  const p = PAPEIS[papel] || PAPEIS.a4;
  const tenta = (W, H) => {
    const cols = Math.max(0, Math.floor((W - 2 * margem + espaco) / (cw + espaco)));
    const rows = Math.max(0, Math.floor((H - 2 * margem + espaco) / (ch + espaco)));
    return { W, H, cols, rows, n: cols * rows };
  };
  const a = tenta(p.w, p.h), b = tenta(p.h, p.w);
  const g = orient === "retrato" ? a : orient === "paisagem" ? b : (b.n > a.n ? b : a);
  const gw = g.cols * cw + (g.cols - 1) * espaco, gh = g.rows * ch + (g.rows - 1) * espaco;
  const x0 = (g.W - gw) / 2, y0 = (g.H - gh) / 2;
  const pos = [];
  for (let r = 0; r < g.rows; r += 1) for (let c = 0; c < g.cols; c += 1) pos.push({ x: x0 + c * (cw + espaco), y: y0 + r * (ch + espaco) });
  return { ...g, pos, porFolha: g.n };
}

export function dimensoes(cfg) {
  const m = MODELOS_CAL[cfg.modelo];
  const t = m.tamanhos[cfg.tam] || m.tamanhos[m.tam];
  let [, w, h] = t;
  // orientação só vale para parede e pôster (os demais já definem a posição)
  if (["parede", "poster"].includes(cfg.modelo) && cfg.orientacao === "paisagem" && h > w) [w, h] = [h, w];
  if (["parede", "poster"].includes(cfg.modelo) && cfg.orientacao === "retrato" && w > h) [w, h] = [h, w];
  return { w, h };
}

export function montarPaginasCal(cfg) {
  const p = [];
  if (cfg.modelo === "poster" || cfg.modelo === "mini") return [{ tipo: cfg.modelo }];
  if (cfg.capa) p.push({ tipo: "capa" });
  for (let m = 0; m < 12; m += 1) p.push({ tipo: cfg.modelo === "planner" ? "planner" : "mes", mes: m });
  return p;
}
