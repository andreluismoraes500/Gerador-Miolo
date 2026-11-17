// Ajustes do rodapé: mostrar o crédito "Desenho de Miolo por" (bíblico) e tamanho das letras.
import { criarStore } from "./storeSimples";

export const rodapeCfg = criarStore("rodape-cfg", { mostrarCredito: true, tamanho: 100 });
