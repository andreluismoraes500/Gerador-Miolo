// src/templates/manifest.js
//
// Metadados de todos os templates (chave + nome de exibição), SEM importar
// os componentes de layout em si. Isso é o que permite às telas de seleção
// (TemplateSelector, BuilderPanel) montar a galeria/dropdown sem puxar o
// código pesado dos ~37 templates para o bundle inicial.
//
// Se adicionar um novo template, lembre de registrar o nome aqui também
// (e o loader correspondente em `./index.js`).

// Categorias da galeria, na ordem em que aparecem na tela.
export const TEMPLATE_CATEGORIAS = [
  { id: "agendas", nome: "Agendas", descricao: "Diário, semanal, mensal e anual" },
  { id: "floral", nome: "Floral", descricao: "Agendas com visual floral" },
  { id: "bemestar", nome: "Vida e bem-estar", descricao: "Hábitos, saúde, gratidão, pet e bebê" },
  { id: "organizacao", nome: "Organização e finanças", descricao: "Tarefas, finanças, compras e viagem" },
  { id: "escolar", nome: "Escolar e estudos", descricao: "Estudos, leitura e material de professor" },
  { id: "criativos", nome: "Cadernos criativos", descricao: "Bullet journal, receitas, caligrafia e mais" },
  { id: "avulsas", nome: "Páginas avulsas", descricao: "Capa e dados pessoais" },
];

export const TEMPLATE_MANIFEST = {
  semData: { nome: "Agenda Sem Data (Permanente)", categoria: "agendas" },
  diario: { nome: "Diário", categoria: "agendas" },
  diarioLivre: { nome: "Diário Livre", categoria: "agendas" },
  diarioHorario: { nome: "Diário Hora a Hora (amplo)", categoria: "agendas" },
  diarioFloral: { nome: "Agenda Floral", categoria: "floral" },
  floralMensal: { nome: "Agenda Floral (mensal)", categoria: "floral" },
  floralAnual: { nome: "Agenda Floral (anual)", categoria: "floral" },
  diarioComercial: { nome: "Diário Comercial (sem horário)", categoria: "agendas" },
  diarioComercialDuplo: { nome: "Diário Comercial (2 dias por página)", categoria: "agendas" },
  mensalCompleto: { nome: "Mensal (completo)", categoria: "agendas" },
  mensalLivre: { nome: "Mensal (agenda comercial)", categoria: "agendas" },
  mensalComercialDuplo: { nome: "Mensal Comercial (2 dias por página)", categoria: "agendas" },
  anualCompleto: { nome: "Anual (completo)", categoria: "agendas" },
  anualLivre: { nome: "Anual (agenda comercial)", categoria: "agendas" },
  anualComercialDuplo: { nome: "Anual Comercial (2 dias por página)", categoria: "agendas" },
  semanal: { nome: "Semanal", categoria: "agendas" },
  tarefas: { nome: "Lista de Tarefas", categoria: "organizacao" },
  dadosPessoais: { nome: "Dados Pessoais", categoria: "avulsas" },
  calendarios: { nome: "Calendários", categoria: "agendas" },
  plannerMensal: { nome: "Planner Mensal", categoria: "agendas" },
  gratidao: { nome: "Diário de Gratidão", categoria: "bemestar" },
  habitos: { nome: "Rastreador de Hábitos", categoria: "bemestar" },
  financas: { nome: "Planejamento Financeiro", categoria: "organizacao" },
  conteudo: { nome: "Planner de Conteúdo", categoria: "organizacao" },
  refeicoes: { nome: "Agenda de Refeições", categoria: "bemestar" },
  metas: { nome: "Mapa de Metas", categoria: "bemestar" },
  saude: { nome: "Registro de Saúde", categoria: "bemestar" },
  pet: { nome: "Pet", categoria: "bemestar" },
  capa: { nome: "Capa", categoria: "avulsas" },
  sono: { nome: "Sono & Bem-estar", categoria: "bemestar" },
  estudos: { nome: "Planner de Estudos", categoria: "escolar" },
  leitura: { nome: "Controle de Leitura", categoria: "escolar" },
  viagem: { nome: "Planner de Viagem", categoria: "organizacao" },
  compras: { nome: "Lista de Compras", categoria: "organizacao" },
  sonhos: { nome: "Diário de Sonhos", categoria: "bemestar" },
  wishlist: { nome: "Wishlist de Metas", categoria: "organizacao" },
  cadernoUniversitario: { nome: "Caderno Universitário", categoria: "escolar" },
  cadernoReceitas: { nome: "Caderno de Receitas Culinárias", categoria: "criativos" },
  bulletJournal: { nome: "Bullet Journal / Caderno Pontilhado", categoria: "criativos" },
  babyBook: { nome: "Diário de Bebê", categoria: "bemestar" },
  listaChamada: { nome: "Lista de Chamada", categoria: "escolar" },
  boletim: { nome: "Boletim Escolar", categoria: "escolar" },
  planoAula: { nome: "Plano de Aula", categoria: "escolar" },
  caligrafia: { nome: "Guia de Caligrafia", categoria: "criativos" },
  noivas: { nome: "Planner de Noivas", categoria: "criativos" },
  partituras: { nome: "Caderno de Partituras", categoria: "criativos" },
  devocional: { nome: "Diário Devocional", categoria: "criativos" },
  agendaAnual: { nome: "Agenda Anual Completa", categoria: "agendas" },
};

export const TEMPLATE_KEYS = Object.keys(TEMPLATE_MANIFEST);

/**
 * Agrupa os templates por categoria (na ordem de TEMPLATE_CATEGORIAS).
 * `filtro` opcional: texto buscado no nome (sem acento/maiúsculas).
 * Retorna [{ ...categoria, itens: [{ key, nome }] }] sem categorias vazias.
 */
const norm = (t) =>
  t.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

export function getTemplatesPorCategoria(filtro = "") {
  const q = norm(filtro.trim());
  return TEMPLATE_CATEGORIAS.map((cat) => ({
    ...cat,
    itens: Object.entries(TEMPLATE_MANIFEST)
      .filter(([, t]) => t.categoria === cat.id)
      .filter(([, t]) => !q || norm(t.nome).includes(q))
      .map(([key, t]) => ({ key, nome: t.nome })),
  })).filter((cat) => cat.itens.length > 0);
}
