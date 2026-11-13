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
  cabecalho: {
    nome: "Ímã só com cabeçalho (calendário colado depois)", desc: "Cabeçalho com nome, logo e telefone + fundo na cor que o cliente escolher. O calendário pequeno você cola em cima.",
    tamanhos: { c55: ["55 × 100 mm (em pé)", 55, 100], c50: ["50 × 90 mm (em pé)", 50, 90], c60: ["60 × 110 mm (em pé)", 60, 110], c70: ["70 × 100 mm (em pé)", 70, 100], pers: ["Personalizado (você digita)", 55, 100] }, tam: "c55",
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
  fotoPct: 50, escala: 1, margemInt: 1, anoPos: "auto", corTitulo: "", corTexto: "#2f3140", corFeriado: "#d6455d", posterFundo: false, corPagina: "", deslocX: 0, deslocY: 0, capa: true, listaFeriados: true, nomesNaGrade: true, notas: true, titulo: "Meu Calendário", subtitulo: "",
  persW: 76, persH: 76,
  cabNome: "SEU NEGÓCIO", cabLinha: "DELIVERY", cabFone: "(00) 00000-0000", cabZap: true, cabAltPct: 58, corCab: "#1f5fbf", corCabTxt: "#ffffff", corDetalhe: "#d6213a", corAreaCal: "#ffffff", guiaCal: true,
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

// salvo de versão antiga com o modelo removido (ímã/bolso): passa para o ímã com cabeçalho
if (!MODELOS_CAL[calendarioCfg.get().modelo]) calendarioCfg.set({ modelo: "cabecalho", tam: "c55" });

export function dimensoes(cfg) {
  const m = MODELOS_CAL[cfg.modelo];
  const t = m.tamanhos[cfg.tam] || m.tamanhos[m.tam];
  let [, w, h] = t;
  if (cfg.modelo === "cabecalho" && cfg.tam === "pers") return { w: Math.max(20, Number(cfg.persW) || 55), h: Math.max(20, Number(cfg.persH) || 100) };
  // orientação só vale para parede e pôster (os demais já definem a posição)
  if (["parede", "poster"].includes(cfg.modelo) && cfg.orientacao === "paisagem" && h > w) [w, h] = [h, w];
  if (["parede", "poster"].includes(cfg.modelo) && cfg.orientacao === "retrato" && w > h) [w, h] = [h, w];
  return { w, h };
}

export function montarPaginasCal(cfg) {
  const p = [];
  if (cfg.modelo === "poster" || cfg.modelo === "cabecalho") return [{ tipo: cfg.modelo }];
  if (cfg.capa) p.push({ tipo: "capa" });
  for (let m = 0; m < 12; m += 1) p.push({ tipo: cfg.modelo === "planner" ? "planner" : "mes", mes: m });
  return p;
}

// Feriados nacionais (incl. móveis) + datas comemorativas, para o ano escolhido.
// Retorna { "mes-dia": { nome, tipo } } com mes 0-based; tipo "f" = feriado, "d" = data comemorativa.
function pascoa(ano) {
  const a = ano % 19, b = Math.floor(ano / 100), c = ano % 100, d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30, i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7, m = Math.floor((a + 11 * h + 22 * l) / 451);
  const mes = Math.floor((h + l - 7 * m + 114) / 31), dia = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(ano, mes - 1, dia);
}
export function feriadosCal(ano) {
  const mapa = {};
  const add = (mes, dia, nome, tipo) => {
    const k = `${mes}-${dia}`;
    if (mapa[k]) { mapa[k] = { nome: `${mapa[k].nome} / ${nome}`, tipo: mapa[k].tipo === "f" || tipo === "f" ? "f" : "d" }; } else mapa[k] = { nome, tipo };
  };
  const rel = (n, nome, tipo) => { const d = new Date(pascoa(ano)); d.setDate(d.getDate() + n); add(d.getMonth(), d.getDate(), nome, tipo); };
  const enesimo = (mes, dow, n) => { const d0 = new Date(ano, mes, 1); return 1 + ((7 + dow - d0.getDay()) % 7) + 7 * (n - 1); };
  add(0, 1, "Confraternização Universal", "f");
  rel(-48, "Carnaval", "f"); rel(-47, "Carnaval", "f"); rel(-46, "Quarta-feira de Cinzas", "d");
  add(2, 8, "Dia Internacional da Mulher", "d");
  rel(-2, "Sexta-feira Santa", "f"); rel(0, "Páscoa", "f");
  add(3, 19, "Dia dos Povos Indígenas", "d"); add(3, 21, "Tiradentes", "f");
  add(4, 1, "Dia do Trabalho", "f"); add(4, enesimo(4, 0, 2), "Dia das Mães", "d");
  rel(60, "Corpus Christi", "f");
  add(5, 12, "Dia dos Namorados", "d");
  add(7, enesimo(7, 0, 2), "Dia dos Pais", "d");
  add(8, 7, "Independência do Brasil", "f");
  add(9, 12, "N. Sra. Aparecida", "f"); add(9, 12, "Dia das Crianças", "d"); add(9, 15, "Dia do Professor", "d");
  add(10, 2, "Finados", "f"); add(10, 15, "Proclamação da República", "f"); add(10, 20, "Consciência Negra", "f");
  add(11, 24, "Véspera de Natal", "d"); add(11, 25, "Natal", "f"); add(11, 31, "Réveillon", "d");
  return mapa;
}
export function feriadosDoMesCal(ano, mes) {
  return Object.entries(feriadosCal(ano)).map(([k, v]) => { const [m, d] = k.split("-").map(Number); return { m, d, n: v.nome, tipo: v.tipo }; }).filter((x) => x.m === mes).sort((a, b) => a.d - b.d);
}
