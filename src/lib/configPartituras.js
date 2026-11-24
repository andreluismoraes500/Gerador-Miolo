import { criarStore } from "./storeSimples";

export const TIPOS_PAUTA = [
  { id: "sol", nome: "Clave de sol", sistemas: 10, altura: 22 },
  { id: "fa", nome: "Clave de fá", sistemas: 10, altura: 22 },
  { id: "piano", nome: "Piano (sol + fá)", sistemas: 6, altura: 37 },
  { id: "violao", nome: "Tablatura (violão)", sistemas: 11, altura: 20 },
  { id: "cifra", nome: "Pauta com cifra", sistemas: 8, altura: 28 },
  { id: "canto", nome: "Pauta com letra", sistemas: 8, altura: 28 },
  { id: "bateria", nome: "Bateria / percussão", sistemas: 10, altura: 22 },
];

export const partiturasCfg = criarStore("partituras-cfg", {
  tipos: ["sol"],
  modo: "alternar", // alternar | blocos
  paginas: 16,
  soLinhas: false, // só as cinco linhas: sem claves, chaves, barras, TAB nem rótulos
  semCabecalho: false, // tira o cabeçalho (nome do caderno e n/total)
  altSist: 0, // mm de cada pauta com seu espaço (0 = automático, um pouco menor que o padrão antigo)
  notasDeco: true, // notas musicais decorativas (capa e cabeçalho)
});

// Altura (mm) de cada sistema e quantos cabem na folha.
export const ALT_UTIL = 246; // área útil aproximada da folha A4 para as pautas
export function alturaSistema(cfgTipo, altSist) {
  return altSist > 0 ? altSist : Math.round(cfgTipo.altura * 0.9);
}
export function sistemasPorFolha(cfgTipo, altSist, comCampos, semCabecalho) {
  const util = ALT_UTIL - (semCabecalho ? 0 : 0) - (comCampos ? 18 : 0);
  return Math.max(1, Math.floor(util / alturaSistema(cfgTipo, altSist)));
}

// Qual tipo de pauta cada página usa (0..paginas-1).
export function tipoDaPagina(i, { tipos, modo, paginas }) {
  const lista = tipos.length ? tipos : ["sol"];
  if (modo === "blocos") {
    const bloco = Math.ceil(paginas / lista.length);
    return lista[Math.min(lista.length - 1, Math.floor(i / bloco))];
  }
  return lista[i % lista.length];
}
