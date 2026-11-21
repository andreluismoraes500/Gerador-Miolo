// Ajustes de fonte, tamanho e posição dos textos da capa genérica.
import { criarStore } from "./storeSimples";
import { FONTES_PAR } from "./fontes";

export const CAPA_PADRAO = { fonte: "", tamNome: 100, tamAno: 100, tamFrase: 100, x: 0, y: 0, alinh: "padrao", espaco: 0, corNome: "" };
export const capaCfg = criarStore("capa-cfg", { ...CAPA_PADRAO });

export const FONTES_CAPA = [["", "Padrão do estilo"], ...FONTES_PAR];
