// src/templates/index.js
//
// Registro central de todos os templates disponíveis.
// Para adicionar um novo template: importe-o e adicione à constante TEMPLATES.

import diario from "./diario.jsx";
import diarioLivre from "./diarioLivre.jsx"; // ← NOVO
import mensalCompleto from "./mensalCompleto.jsx";
import anualCompleto from "./anualCompleto.jsx";
import semanal from "./semanal.jsx";
import tarefas from "./tarefas.jsx";
import dadosPessoais from "./dadosPessoais.jsx";
import calendarios from "./calendarios.jsx";
import plannerMensal from "./plannerMensal.jsx";
import gratidao from "./gratidao.jsx";
import habitos from "./habitos.jsx";
import financas from "./financas.jsx";
import conteudo from "./conteudo.jsx";
import refeicoes from "./refeicoes.jsx";
import metas from "./metas.jsx";
import saude from "./saude.jsx";
import pet from "./pet.jsx";
import capa from "./capa.jsx";

export const TEMPLATES = {
  diario,
  diarioLivre, // ← NOVO — aparece logo após "Diário" no seletor
  mensalCompleto,
  anualCompleto,
  semanal,
  tarefas,
  dadosPessoais,
  calendarios,
  plannerMensal,
  gratidao,
  habitos,
  financas,
  conteudo,
  refeicoes,
  metas,
  saude,
  pet,
  capa,
};
