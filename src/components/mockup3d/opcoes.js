// Opções leves (sem three.js) usadas pela página e pelo construtor 3D.

export const TAMANHOS = {
  a5: { nome: "A5", w: 1.48, h: 2.1 },
  a4: { nome: "A4", w: 2.1, h: 2.97 },
  quadrado: { nome: "Quadrado", w: 1.8, h: 1.8 },
  paisagem: { nome: "Paisagem", w: 2.1, h: 1.48 },
  bolso: { nome: "Bolso", w: 1.05, h: 1.48 },
};

export const FORMATOS_BLOCO = {
  retrato: { nome: "Retrato", w: 1.49, h: 2.06 },
  paisagem: { nome: "Paisagem", w: 2.17, h: 1.49 },
  quadrado: { nome: "Quadrado", w: 1.71, h: 1.71 },
  pequeno: { nome: "Pequeno", w: 1.14, h: 1.6 },
};

export const MATERIAIS = {
  carton: { nome: "Cartão fosco", rough: 0.85, clear: 0, bump: 0.0 },
  brilho: { nome: "Laminado brilhante", rough: 0.25, clear: 1, bump: 0.0 },
  couro: { nome: "Couro", rough: 0.55, clear: 0.15, bump: 1 },
  linho: { nome: "Linho", rough: 0.95, clear: 0, bump: 0.6 },
  tecido: { nome: "Tecido (sarja)", rough: 0.98, clear: 0, bump: 0.7 },
  kraft: { nome: "Kraft", rough: 0.96, clear: 0, bump: 0.5 },
  fosco: { nome: "Laminação fosca (soft touch)", rough: 0.6, clear: 0.25, bump: 0 },
  metalizado: { nome: "Acabamento metálico", rough: 0.3, clear: 0.6, bump: 0, metal: 0.85 },
};

// Acabamentos localizados aplicados sobre a capa (verniz UV e hot stamping).
export const ACABAMENTOS = {
  nenhum: { nome: "Nenhum" },
  verniz: { nome: "Verniz localizado" },
  hot: { nome: "Hot stamping" },
};

export const ACESSORIOS_3D = {
  caneta: "Caneta", lapis: "Lápis", xicara: "Xícara", livro: "Livro", flor: "Flor", oculos: "Óculos", clipe: "Clipe", folha: "Folhas",
};

export const METAIS3D = {
  prata: { nome: "Prata", color: "#c9ced6" },
  dourado: { nome: "Dourado", color: "#d4a63c" },
  preto: { nome: "Preto", color: "#23262c" },
  rose: { nome: "Rosé", color: "#d9958f" },
  branco: { nome: "Branco", color: "#f2f4f7" },
};

export const PAPELAO3D = {
  kraft: "#b99366",
  branco: "#f1efe9",
  preto: "#2a2d33",
  azul: "#2f4a72",
};


export const DISPOSICOES = {
  esquerda: "Esquerda",
  topo: "Topo",
  direita: "Direita",
};

export const PRODUTOS = {
  agenda: "Agenda",
  bloco: "Bloco",
  calendario: "Calendário",
  kit: "Kit",
  quadro: "Quadro",
  botton: "Botton",
  caneca: "Caneca",
  cartoes: "Cartões",
  caixa: "Caixa",
  sacola: "Sacola",
};

// Faixa de quantidade de argolas por tipo (null = automático).
export const FAIXA_ARGOLAS = {
  wireo: { min: 8, max: 40, padrao: 24 },
  espiral: { min: 8, max: 40, padrao: 20 },
  argolas: { min: 2, max: 8, padrao: 3 },
  discos: { min: 6, max: 24, padrao: 12 },
};

const BASE = {
  produto: "agenda", view: "fechada", disp: "esquerda", mat: "carton", metal: "prata",
  tamanho: "a5", aneisAuto: true, furo: "auto", passante: false, elasticoLarg: 6, elasticoPos: 22, elastico: false, fita: false, caneta: false, cantos: false,
};

export const MODELOS_PRONTOS = [
  { id: "espiral", nome: "Caderno espiral", set: { ...BASE, tipo: "espiral" } },
  { id: "wireo-topo", nome: "Wire-o no topo", set: { ...BASE, tipo: "wireo", disp: "topo", metal: "dourado" } },
  { id: "elastico", nome: "Capa dura + elástico", set: { ...BASE, tipo: "brochura", mat: "couro", cantos: true, elastico: true, fita: true } },
  { id: "executiva", nome: "Executiva com caneta", set: { ...BASE, tipo: "brochura", mat: "couro", cantos: true, elastico: true, caneta: true, metal: "dourado" } },
  { id: "infinita", nome: "Agenda infinita (discos)", set: { ...BASE, tipo: "discos", mat: "couro", cantos: true, metal: "dourado", elastico: true } },
  { id: "fichario", nome: "Fichário 4 argolas", set: { ...BASE, tipo: "argolas", aneisAuto: false, aneisN: 4, mat: "linho" } },
  { id: "costura", nome: "Costura premium", set: { ...BASE, tipo: "costura", mat: "linho", metal: "dourado", fita: true, cantos: true } },
  { id: "calendario", nome: "Calendário de mesa", set: { ...BASE, produto: "calendario", tipo: "wireo", tamanho: "paisagem", metal: "preto" } },
  { id: "kit", nome: "Kit escritório", set: { ...BASE, produto: "kit", tipo: "wireo", metal: "dourado" } },
  { id: "quadro", nome: "Quadro na parede", set: { ...BASE, produto: "quadro" } },
  { id: "caneca", nome: "Caneca personalizada", set: { ...BASE, produto: "caneca" } },
  { id: "botton", nome: "Kit de bottons", set: { ...BASE, produto: "botton" } },
  { id: "cartoes", nome: "Cartões de visita", set: { ...BASE, produto: "cartoes" } },
  { id: "caixa", nome: "Caixa de presente", set: { ...BASE, produto: "caixa" } },
  { id: "sacola", nome: "Sacola de papel", set: { ...BASE, produto: "sacola" } },
];

// ---------------------------------------------------------------- gráfica
export const QUADRO_TAMANHOS = {
  a4: { nome: "A4", w: 2.1, h: 2.97 },
  a3: { nome: "A3", w: 2.97, h: 4.2 },
  "30x40": { nome: "30×40", w: 3.0, h: 4.0 },
};

export const MOLDURAS = {
  preto: { nome: "Preta", cor: "#1b1d22" },
  branco: { nome: "Branca", cor: "#f4f2ee" },
  madeira: { nome: "Madeira", cor: "#a9794a" },
  dourado: { nome: "Dourada", cor: "#c9a24b" },
};

export const BOTTON_TAMANHOS = {
  25: { nome: "25 mm", d: 0.25 },
  38: { nome: "38 mm", d: 0.38 },
  58: { nome: "58 mm", d: 0.58 },
};

export const CAIXA_TAMANHOS = {
  p: { nome: "Pequena", w: 1.4, d: 1.4, h: 0.7 },
  m: { nome: "Média", w: 2.0, d: 1.6, h: 0.9 },
  g: { nome: "Grande", w: 2.8, d: 2.0, h: 1.1 },
};

export const SACOLA_TAMANHOS = {
  p: { nome: "Pequena", w: 1.1, d: 0.4, h: 1.4 },
  m: { nome: "Média", w: 1.5, d: 0.55, h: 1.9 },
  g: { nome: "Grande", w: 2.0, d: 0.7, h: 2.4 },
};

export const PRODUTOS_GRAFICOS = ["quadro", "botton", "caneca", "cartoes", "caixa", "sacola"];

export const MIOLOS = [
  { id: "pautado", nome: "Pautado" },
  { id: "pontilhado", nome: "Pontilhado" },
  { id: "quadriculado", nome: "Quadriculado" },
  { id: "semanal", nome: "Semanal" },
  { id: "partitura", nome: "Partitura" },
  { id: "branco", nome: "Em branco" },
];
