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
};

// Faixa de quantidade de argolas por tipo (null = automático).
export const FAIXA_ARGOLAS = {
  wireo: { min: 8, max: 40, padrao: 24 },
  espiral: { min: 8, max: 40, padrao: 20 },
  argolas: { min: 2, max: 8, padrao: 3 },
};

const BASE = {
  produto: "agenda", view: "fechada", disp: "esquerda", mat: "carton", metal: "prata",
  tamanho: "a5", aneisAuto: true, elastico: false, fita: false, caneta: false, cantos: false,
};

export const MODELOS_PRONTOS = [
  { id: "espiral", nome: "Caderno espiral", set: { ...BASE, tipo: "espiral" } },
  { id: "wireo-topo", nome: "Wire-o no topo", set: { ...BASE, tipo: "wireo", disp: "topo", metal: "dourado" } },
  { id: "elastico", nome: "Capa dura + elástico", set: { ...BASE, tipo: "brochura", mat: "couro", cantos: true, elastico: true, fita: true } },
  { id: "executiva", nome: "Executiva com caneta", set: { ...BASE, tipo: "brochura", mat: "couro", cantos: true, elastico: true, caneta: true, metal: "dourado" } },
  { id: "fichario", nome: "Fichário 4 argolas", set: { ...BASE, tipo: "argolas", aneisAuto: false, aneisN: 4, mat: "linho" } },
  { id: "costura", nome: "Costura premium", set: { ...BASE, tipo: "costura", mat: "linho", metal: "dourado", fita: true, cantos: true } },
  { id: "calendario", nome: "Calendário de mesa", set: { ...BASE, produto: "calendario", tipo: "wireo", tamanho: "paisagem", metal: "preto" } },
  { id: "kit", nome: "Kit escritório", set: { ...BASE, produto: "kit", tipo: "wireo", metal: "dourado" } },
];
