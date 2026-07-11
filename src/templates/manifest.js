// src/templates/manifest.js
//
// Metadados de todos os templates (chave + nome de exibição), SEM importar
// os componentes de layout em si. Isso é o que permite às telas de seleção
// (TemplateSelector, BuilderPanel) montar a galeria/dropdown sem puxar o
// código pesado dos ~37 templates para o bundle inicial.
//
// Se adicionar um novo template, lembre de registrar o nome aqui também
// (e o loader correspondente em `./index.js`).

export const TEMPLATE_MANIFEST = {
  semData: { nome: "Agenda Sem Data (Permanente)" },
  diario: { nome: "Diário" },
  diarioLivre: { nome: "Diário Livre" },
  diarioFloral: { nome: "Agenda Floral" },
  floralMensal: { nome: "Agenda Floral (mensal)" },
  floralAnual: { nome: "Agenda Floral (anual)" },
  diarioComercial: { nome: "Diário Comercial (sem horário)" },
  diarioComercialDuplo: { nome: "Diário Comercial (2 dias por página)" },
  mensalCompleto: { nome: "Mensal (completo)" },
  mensalLivre: { nome: "Mensal (agenda comercial)" },
  mensalComercialDuplo: { nome: "Mensal Comercial (2 dias por página)" },
  anualCompleto: { nome: "Anual (completo)" },
  anualLivre: { nome: "Anual (agenda comercial)" },
  anualComercialDuplo: { nome: "Anual Comercial (2 dias por página)" },
  semanal: { nome: "Semanal" },
  tarefas: { nome: "Lista de Tarefas" },
  dadosPessoais: { nome: "Dados Pessoais" },
  calendarios: { nome: "Calendários" },
  plannerMensal: { nome: "Planner Mensal" },
  gratidao: { nome: "Diário de Gratidão" },
  habitos: { nome: "Rastreador de Hábitos" },
  financas: { nome: "Planejamento Financeiro" },
  conteudo: { nome: "Planner de Conteúdo" },
  refeicoes: { nome: "Agenda de Refeições" },
  metas: { nome: "Mapa de Metas" },
  saude: { nome: "Registro de Saúde" },
  pet: { nome: "Pet" },
  capa: { nome: "Capa" },
  sono: { nome: "Sono & Bem-estar" },
  estudos: { nome: "Planner de Estudos" },
  leitura: { nome: "Controle de Leitura" },
  viagem: { nome: "Planner de Viagem" },
  compras: { nome: "Lista de Compras" },
  sonhos: { nome: "Diário de Sonhos" },
  wishlist: { nome: "Wishlist de Metas" },
  cadernoUniversitario: { nome: "Caderno Universitário" },
  listaChamada: { nome: "Lista de Chamada" },
  boletim: { nome: "Boletim Escolar" },
  planoAula: { nome: "Plano de Aula" },
  caligrafia: { nome: "Guia de Caligrafia" },
};

export const TEMPLATE_KEYS = Object.keys(TEMPLATE_MANIFEST);
