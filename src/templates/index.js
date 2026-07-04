// src/templates/index.js
//
// Registro central de todos os templates disponíveis.
// Para adicionar um novo template: importe-o e adicione à constante TEMPLATES.

import diario from "./diario.jsx";
import diarioLivre from "./diarioLivre.jsx"; // ← NOVO
import diarioComercial from "./diarioComercial.jsx"; // ← NOVO — sem horário, 1 dia/página
import diarioComercialDuplo from "./diarioComercialDuplo.jsx"; // ← NOVO — sem horário, 2 dias/página
import mensalCompleto from "./mensalCompleto.jsx";
import mensalLivre from "./mensalLivre.jsx"; // ← NOVO — mensal sem pix
import mensalComercialDuplo from "./mensalComercialDuplo.jsx"; // ← NOVO — mensal, 2 dias/página, sem horário
import anualCompleto from "./anualCompleto.jsx";
import anualLivre from "./anualLivre.jsx"; // ← NOVO — anual sem pix
import anualComercialDuplo from "./anualComercialDuplo.jsx"; // ← NOVO — anual, 2 dias/página, sem horário
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
  diarioComercial, // ← NOVO — 1 dia/página, sem horário
  diarioComercialDuplo, // ← NOVO — 2 dias/página, sem horário
  mensalCompleto,
  mensalLivre, // ← NOVO — aparece logo após "Mensal (completo)" no seletor
  mensalComercialDuplo, // ← NOVO — mês inteiro, 2 dias/página, sem horário
  anualCompleto,
  anualLivre, // ← NOVO — aparece logo após "Anual (completo)" no seletor
  anualComercialDuplo, // ← NOVO — ano inteiro, 2 dias/página, sem horário
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
