import { criarStore } from "./storeSimples";

// A imagem (data URL grande) fica só na memória, para não estourar o localStorage.
export const pautadoImg = criarStore("pautado-img", { src: "" }, false);

export const ESTILOS_PAUTA = [
  { id: "linha", nome: "Linha contínua" },
  { id: "pontilhada", nome: "Pontilhada" },
  { id: "tracejada", nome: "Tracejada" },
];
export const CORES_PAUTA = ["#b9b4a8", "#8f99a8", "#7a7a7a", "#6aa6d6", "#d58a8a", "#c9a24a"];

// Caderno só pautado: nenhuma outra informação na folha, só as linhas.
export const pautadoCfg = criarStore("pautado-cfg", {
  paginas: 60,
  espac: 8, // mm entre as linhas
  estilo: "linha",
  espessura: 0.25, // mm
  cor: "#b9b4a8",
  inicio: 0, // mm de folga antes da 1ª linha
  margemLinha: false, // linha vertical de margem (caderno escolar)
  margemX: 22, // mm da borda esquerda
  cabecalho: false, // uma linha para nome e data no topo
  numerar: false,
  imgOpac: 0.9, // opacidade da imagem de fundo
  painel: true, // área de escrita translúcida por cima da imagem (efeito moldura)
  painelOpac: 0.78, // opacidade do painel branco
  moldura: 6, // mm entre a borda da folha e o painel
  painelRaio: 3, // mm de arredondamento do painel
});
