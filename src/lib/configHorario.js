import { criarStore } from "./storeSimples";

export const horarioCfg = criarStore("horario-cfg", {
  inicio: 8,
  fim: 18,
  linhas: 2, // linhas de escrita por horário
  meiaHora: false, // um bloco a cada 30 min
  calendario: "grande", // grande | pequeno | nenhum
  notasAltura: 38, // % da faixa inferior ocupada por Anotações (largura)
});
