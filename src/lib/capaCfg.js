// Ajustes de fonte, tamanho e posição dos textos da capa genérica.
import { criarStore } from "./storeSimples";

export const CAPA_PADRAO = { fonte: "", tamNome: 100, tamAno: 100, tamFrase: 100, x: 0, y: 0, alinh: "padrao", espaco: 0, corNome: "" };
export const capaCfg = criarStore("capa-cfg", { ...CAPA_PADRAO });

export const FONTES_CAPA = [
  ["", "Padrão do estilo"],
  ["'DM Serif Display', serif", "DM Serif Display"], ["'Playfair Display', serif", "Playfair Display"],
  ["'Cormorant Garamond', serif", "Cormorant Garamond"], ["'Montserrat', sans-serif", "Montserrat"],
  ["'Oswald', sans-serif", "Oswald"], ["'Bebas Neue', sans-serif", "Bebas Neue"], ["'Anton', sans-serif", "Anton"],
  ["'Fredoka', sans-serif", "Fredoka (arredondada)"], ["'Great Vibes', cursive", "Great Vibes (cursiva)"],
  ["'Dancing Script', cursive", "Dancing Script"], ["'Pacifico', cursive", "Pacifico"],
];
