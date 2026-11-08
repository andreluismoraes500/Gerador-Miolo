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
});

// Qual tipo de pauta cada página usa (0..paginas-1).
export function tipoDaPagina(i, { tipos, modo, paginas }) {
  const lista = tipos.length ? tipos : ["sol"];
  if (modo === "blocos") {
    const bloco = Math.ceil(paginas / lista.length);
    return lista[Math.min(lista.length - 1, Math.floor(i / bloco))];
  }
  return lista[i % lista.length];
}
