// Cabeçalho dos documentos do Talonário: posição do logo, alinhamento do texto, tamanho e deslocamento do logo.
import { criarStore } from "./storeSimples";

export const CAB_PADRAO = { logoPos: "esq", textoAlin: "esq", logoTam: 100, logoX: 0, logoY: 0 };
export const talCab = criarStore("talonario-cabecalho", CAB_PADRAO);
