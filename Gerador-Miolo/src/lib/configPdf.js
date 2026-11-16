import { criarStore } from "./storeSimples";

// Opções visuais do "Imprimir PDF" (imagens ficam fora do armazenamento: são grandes).
export const pdfCfg = criarStore("pdf-cfg", {
  bgCor: "", // "" = sem fundo
  bgOp: 35,
  marcaTipo: "nenhuma", // nenhuma | texto | imagem
  marcaTexto: "RASCUNHO",
  marcaCor: "#888888",
  marcaOp: 15,
  marcaTam: 30,
  marcaGiro: -30,
});

export const TONS = ["#fde1e1", "#fdebd3", "#fdf6c9", "#e3eedd", "#dfeefa", "#ece4f8", "#efe9df", "#e5e5e5"];
