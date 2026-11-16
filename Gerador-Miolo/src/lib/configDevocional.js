// Diário Devocional: configuração, calendário, livros da Bíblia e a lista
// de páginas (ordem + quantidade) que o template monta.
import { criarStore } from "./storeSimples";
import { getFeriado } from "../utils/agendaUtils";

export const PALETAS = {
  rosa: { nome: "Rosa", banda: "#fde1e1", linha: "#4b4b4b", destaque: "#e0703a", flor: ["#f4a9a8", "#e9858b", "#f7cdb8"], folha: "#b7c7a3", titulo: "#5a4a4a" },
  lavanda: { nome: "Lavanda", banda: "#ece4f8", linha: "#4a4560", destaque: "#7b5cc4", flor: ["#c7b0ee", "#a98de0", "#e4d6f7"], folha: "#a9c2ae", titulo: "#4a4560" },
  azul: { nome: "Azul", banda: "#dfeefa", linha: "#3f4e60", destaque: "#2f7fc1", flor: ["#9ccaee", "#6aa9dc", "#cfe6f7"], folha: "#a8c4b0", titulo: "#3f4e60" },
  salvia: { nome: "Sálvia", banda: "#e3eedd", linha: "#45503f", destaque: "#5a8a4a", flor: ["#bcd3a5", "#93b57d", "#e2d4b0"], folha: "#8fae83", titulo: "#45503f" },
  dourado: { nome: "Bege & dourado", banda: "#f6ecd7", linha: "#4f4638", destaque: "#b8862d", flor: ["#e6c27a", "#d4a24e", "#f2dfb4"], folha: "#b5bd96", titulo: "#4f4638" },
};

export const FONTES_TITULO = [
  { v: "'DM Serif Display', serif", n: "DM Serif" },
  { v: "'Great Vibes', cursive", n: "Great Vibes" },
  { v: "'Satisfy', cursive", n: "Satisfy" },
  { v: "'Pacifico', cursive", n: "Pacifico" },
  { v: "'Amatic SC', cursive", n: "Amatic" },
  { v: "'Cormorant Garamond', serif", n: "Cormorant" },
];

const ANO_ATUAL = new Date().getFullYear();

export const devocionalCfg = criarStore("devocional-cfg", {
  titulo: "Diário Devocional",
  frase: "Seja o vento que espalha a mudança!",
  paleta: "rosa",
  fonteTitulo: "'DM Serif Display', serif",
  ano: ANO_ATUAL + (new Date().getMonth() >= 9 ? 1 : 0),
  anosCalendario: 2, // 0, 1 ou 2 anos
  dadosPessoais: true,
  anotacoesIni: 1,
  devocional: 30,
  versiculos: 6,
  gratidao: 6,
  jejum: 4,
  oracao: 8,
  leitura: true,
  tradicao: "catolica", // catolica (73) | protestante (66)
  completar4: true, // completa com anotações até múltiplo de 4 (caderno)
});

/* ---------- Calendário ---------- */
export const MESES = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

export function diasDoMes(ano, mes) {
  const prim = new Date(ano, mes, 1).getDay();
  const total = new Date(ano, mes + 1, 0).getDate();
  const cel = Array(prim).fill(null).concat(Array.from({ length: total }, (_, i) => i + 1));
  while (cel.length < 42) cel.push(null);
  return cel;
}

// Feriados/datas do ano como { mes, dia, nome } (nacionais + móveis).
export function feriadosDoAno(ano) {
  const out = [];
  for (let m = 0; m < 12; m += 1) {
    const n = new Date(ano, m + 1, 0).getDate();
    for (let d = 1; d <= n; d += 1) {
      const f = getFeriado(new Date(ano, m, d));
      if (f) out.push({ mes: m, dia: d, nome: typeof f === "string" ? f : f.nome });
    }
  }
  return out;
}

/* ---------- Bíblia (capítulos por livro) ---------- */
// [nome, capítulos, deuterocanônico]
const AT = [
  ["Gênesis", 50], ["Êxodo", 40], ["Levítico", 27], ["Números", 36], ["Deuteronômio", 34], ["Josué", 24], ["Juízes", 21], ["Rute", 4],
  ["1 Samuel", 31], ["2 Samuel", 24], ["1 Reis", 22], ["2 Reis", 25], ["1 Crônicas", 29], ["2 Crônicas", 36], ["Esdras", 10], ["Neemias", 13],
  ["Tobias", 14, 1], ["Judite", 16, 1], ["Ester", 10], ["1 Macabeus", 16, 1], ["2 Macabeus", 15, 1], ["Jó", 42], ["Salmos", 150], ["Provérbios", 31],
  ["Eclesiastes", 12], ["Cântico dos Cânticos", 8], ["Sabedoria", 19, 1], ["Eclesiástico (Sirácida)", 51, 1], ["Isaías", 66], ["Jeremias", 52],
  ["Lamentações", 5], ["Baruc", 6, 1], ["Ezequiel", 48], ["Daniel", 12], ["Oseias", 14], ["Joel", 4], ["Amós", 9], ["Obadias", 1], ["Jonas", 4],
  ["Miqueias", 7], ["Naum", 3], ["Habacuque", 3], ["Sofonias", 3], ["Ageu", 2], ["Zacarias", 14], ["Malaquias", 3],
];
const NT = [
  ["Mateus", 28], ["Marcos", 16], ["Lucas", 24], ["João", 21], ["Atos dos Apóstolos", 28], ["Romanos", 16], ["1 Coríntios", 16], ["2 Coríntios", 13],
  ["Gálatas", 6], ["Efésios", 6], ["Filipenses", 4], ["Colossenses", 4], ["1 Tessalonicenses", 5], ["2 Tessalonicenses", 3], ["1 Timóteo", 6],
  ["2 Timóteo", 4], ["Tito", 3], ["Filemom", 1], ["Hebreus", 13], ["Tiago", 5], ["1 Pedro", 5], ["2 Pedro", 3], ["1 João", 5], ["2 João", 1],
  ["3 João", 1], ["Judas", 1], ["Apocalipse", 22],
];

export function livros(tradicao) {
  const cat = tradicao === "catolica";
  const fix = (l) => {
    let [n, c] = l;
    if (cat && n === "Daniel") c = 14;
    if (!cat && n === "Joel") c = 3;
    if (!cat && n === "Malaquias") c = 4;
    return { nome: n, cap: c };
  };
  return {
    at: AT.filter((l) => cat || !l[2]).map(fix),
    nt: NT.map(fix),
  };
}

export const CAP_POR_LINHA = 25;
const ALT_BANDA = 5.5, ALT_LINHA = 5, ALT_GAP = 1.5, ALT_TESTAMENTO = 7, CAPACIDADE = 212;

// Distribui os livros em páginas (altura estimada em mm).
export function paginarLeitura(tradicao) {
  const { at, nt } = livros(tradicao);
  const paginas = [];
  let atual = null;
  const nova = () => { atual = { itens: [], altura: 0 }; paginas.push(atual); };
  const adiciona = (secao, lista) => {
    let primeiro = true;
    lista.forEach((l) => {
      const linhas = Math.ceil(l.cap / CAP_POR_LINHA);
      const h = ALT_BANDA + linhas * ALT_LINHA + ALT_GAP;
      const preciso = h + (primeiro || !atual ? ALT_TESTAMENTO : 0);
      if (!atual || atual.altura + preciso > CAPACIDADE) { nova(); primeiro = true; }
      if (primeiro || atual.itens.length === 0) {
        atual.itens.push({ secao });
        atual.altura += ALT_TESTAMENTO;
        primeiro = false;
      }
      atual.itens.push({ livro: l });
      atual.altura += h;
    });
  };
  adiciona("Velho Testamento", at);
  adiciona("Novo Testamento", nt);
  return paginas;
}

/* ---------- Lista de páginas ---------- */
export function montarPaginas(cfg) {
  const p = [{ tipo: "capa" }];
  if (cfg.dadosPessoais) p.push({ tipo: "dados" });
  for (let i = 0; i < cfg.anotacoesIni; i += 1) p.push({ tipo: "anotacoes", estilo: "linhas" });
  for (let i = 0; i < cfg.anosCalendario; i += 1) p.push({ tipo: "calendario", ano: cfg.ano + i });
  for (let i = 0; i < cfg.devocional; i += 1) p.push({ tipo: "devocional" });
  for (let i = 0; i < cfg.versiculos; i += 1) p.push({ tipo: "versiculos" });
  for (let i = 0; i < cfg.gratidao; i += 1) p.push({ tipo: "gratidao" });
  for (let i = 0; i < cfg.jejum; i += 1) p.push({ tipo: "jejum" });
  for (let i = 0; i < cfg.oracao; i += 1) p.push({ tipo: "oracao" });
  if (cfg.leitura) paginarLeitura(cfg.tradicao).forEach((pg, i, a) => p.push({ tipo: "leitura", pagina: pg, parte: i + 1, partes: a.length }));
  let extra = 0;
  if (cfg.completar4) while (p.length % 4 !== 0) { p.push({ tipo: "anotacoes", estilo: extra % 2 === 0 ? "pontilhado" : "linhas" }); extra += 1; }
  return p;
}
