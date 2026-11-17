// Tamanho do logo (vale para todas as páginas): escala sobre o tamanho padrão de cada modelo.
import { criarStore } from "./storeSimples";

export const LOGO_PADRAO = { escala: 100, larguraMax: 60, alturaMax: 22 };
export const logoCfg = criarStore("logo-cfg", { ...LOGO_PADRAO });
