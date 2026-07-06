// src/config/businessProfiles.js

// ============================================
// PERFIL BASE
// ============================================
const BASE_PROFILE = {
  id: "default",
  nome: "Geral",
  icon: "📋",
  description: "Perfil padrão para qualquer tipo de negócio",
  slogan: "Organize sua agenda profissionalmente",

  colors: {
    primary: "#475569",
    secondary: "#cbd5e1",
    background: "#f8fafc",
  },

  campos: {
    cliente: "Cliente",
    servico: "Compromisso",
    extra: "Observações",
    valor: "Valor",
    status: "Status",
  },

  layout: {
    mostrarValor: true,
    mostrarStatus: true,
    mostrarHoraInicio: true,
    mostrarHoraFim: false,
  },

  horario: {
    inicio: "08:00",
    fim: "20:00",
    intervalo: 30,
    diasUteis: [1, 2, 3, 4, 5],
  },

  placeholders: {
    cliente: "Nome do cliente",
    servico: "Descreva o serviço",
    extra: "Observações adicionais",
    valor: "R$ 0,00",
    status: "Pendente / Concluído",
  },

  keywords: ["geral", "padrão", "negócio"],
};

// ============================================
// PERFIL ADVOGADO
// ============================================
const ADVOGADO_PROFILE = {
  ...BASE_PROFILE,
  id: "advogado",
  nome: "Advogado",
  icon: "⚖️",
  description: "Perfil otimizado para profissionais do direito",
  slogan: "Organização jurídica profissional",

  colors: {
    primary: "#44403c",
    secondary: "#d6d3d1",
    background: "#f5f5f4",
  },

  campos: {
    cliente: "Cliente",
    servico: "Processo / Ação",
    extra: "Número do Processo",
    valor: "Honorários",
    status: "Status do Processo",
  },

  placeholders: {
    cliente: "Nome do cliente",
    servico: "Nº do processo / Descrição",
    extra: "Ex: 0012345-67.2023",
    valor: "R$ 0,00",
    status: "Andamento / Concluído",
  },

  keywords: ["direito", "jurídico", "advocacia", "processo"],
};

// ============================================
// PERFIL MÉDICO
// ============================================
const MEDICO_PROFILE = {
  ...BASE_PROFILE,
  id: "medico",
  nome: "Médico",
  icon: "🩺",
  description: "Perfil para profissionais da saúde",
  slogan: "Agenda clínica profissional",

  colors: {
    primary: "#0369a1",
    secondary: "#bae6fd",
    background: "#f0f9ff",
  },

  campos: {
    cliente: "Paciente",
    servico: "Procedimento / Consulta",
    extra: "Convênio",
    valor: "Valor da Consulta",
    status: "Status do Paciente",
  },

  placeholders: {
    cliente: "Nome do paciente",
    servico: "Tipo de consulta",
    extra: "Nome do convênio",
    valor: "R$ 0,00",
    status: "Agendado / Realizado",
  },

  keywords: ["saúde", "médico", "hospital", "consulta"],
};

// ============================================
// PERFIL MANICURE
// ============================================
const MANICURE_PROFILE = {
  ...BASE_PROFILE,
  id: "manicure",
  nome: "Manicure",
  icon: "💅",
  description: "Perfil para profissionais de beleza e estética",
  slogan: "Agenda de atendimentos",

  colors: {
    primary: "#db2777",
    secondary: "#fbcfe8",
    background: "#fdf2f8",
  },

  campos: {
    cliente: "Cliente",
    servico: "Serviço",
    extra: "Observações",
    valor: "Valor",
    status: "Status",
  },

  placeholders: {
    cliente: "Nome da cliente",
    servico: "Ex: Unhas, Sobrancelha",
    extra: "Observações sobre o atendimento",
    valor: "R$ 0,00",
    status: "Pendente / Realizado",
  },

  keywords: ["beleza", "estética", "unhas", "manicure"],
};

// ============================================
// PERFIL PERSONAL TRAINER
// ============================================
const PERSONAL_TRAINER_PROFILE = {
  ...BASE_PROFILE,
  id: "personalTrainer",
  nome: "Personal Trainer",
  icon: "💪",
  description: "Perfil para profissionais de educação física",
  slogan: "Transforme vidas através do movimento",

  colors: {
    primary: "#dc2626",
    secondary: "#fca5a5",
    background: "#fef2f2",
  },

  campos: {
    cliente: "Aluno",
    servico: "Treino / Atividade",
    extra: "Série / Carga",
    valor: "Valor da Sessão",
    status: "Progresso",
  },

  placeholders: {
    cliente: "Nome do aluno",
    servico: "Ex: Treino A - Superiores",
    extra: "3x12 supino, 4x10 remada",
    valor: "R$ 0,00",
    status: "Iniciante / Intermediário",
  },

  keywords: ["treino", "academia", "fitness", "musculação"],
};

// ============================================
// PERFIL PSICÓLOGO
// ============================================
const PSICOLOGO_PROFILE = {
  ...BASE_PROFILE,
  id: "psicologo",
  nome: "Psicólogo(a)",
  icon: "🧠",
  description: "Perfil para profissionais da psicologia",
  slogan: "Cuidando da mente e das emoções",

  colors: {
    primary: "#7c3aed",
    secondary: "#c4b5fd",
    background: "#f5f3ff",
  },

  campos: {
    cliente: "Paciente",
    servico: "Sessão / Abordagem",
    extra: "Tema da Sessão",
    valor: "Valor da Sessão",
    status: "Evolução",
  },

  placeholders: {
    cliente: "Nome do paciente",
    servico: "Abordagem: TCC / Psicanálise",
    extra: "Trabalhando ansiedade",
    valor: "R$ 0,00",
    status: "Evolução positiva",
  },

  keywords: ["psicologia", "terapia", "saúde mental", "bem-estar"],
};

// ============================================
// PERFIL FOTÓGRAFO
// ============================================
const FOTOGRAFO_PROFILE = {
  ...BASE_PROFILE,
  id: "fotografo",
  nome: "Fotógrafo",
  icon: "📸",
  description: "Perfil para fotógrafos profissionais",
  slogan: "Capturando momentos especiais",

  colors: {
    primary: "#1a1a2e",
    secondary: "#e2e8f0",
    background: "#fafafa",
  },

  campos: {
    cliente: "Cliente",
    servico: "Tipo de Ensaio",
    extra: "Local",
    valor: "Valor do Pacote",
    status: "Status",
  },

  placeholders: {
    cliente: "Nome do cliente",
    servico: "Ex: Casamento, Aniversário",
    extra: "Local do ensaio",
    valor: "R$ 0,00",
    status: "Agendado / Realizado",
  },

  keywords: ["fotografia", "ensaio", "fotos", "casamento"],
};

// ============================================
// PERFIL CONSULTOR
// ============================================
const CONSULTOR_PROFILE = {
  ...BASE_PROFILE,
  id: "consultor",
  nome: "Consultor",
  icon: "💼",
  description: "Perfil para consultores e assessores",
  slogan: "Consultoria profissional de resultados",

  colors: {
    primary: "#0f766e",
    secondary: "#ccfbf1",
    background: "#f0fdfa",
  },

  campos: {
    cliente: "Cliente",
    servico: "Projeto / Consultoria",
    extra: "Prazo",
    valor: "Valor do Projeto",
    status: "Status",
  },

  placeholders: {
    cliente: "Nome do cliente",
    servico: "Ex: Planejamento Estratégico",
    extra: "Prazo: 30 dias",
    valor: "R$ 0,00",
    status: "Em andamento / Concluído",
  },

  keywords: ["consultoria", "projetos", "estratégia", "negócios"],
};

// ============================================
// PERFIL PROFESSOR
// ============================================
const PROFESSOR_PROFILE = {
  ...BASE_PROFILE,
  id: "professor",
  nome: "Professor",
  icon: "📚",
  description: "Perfil para educadores e professores",
  slogan: "Educação que transforma",

  colors: {
    primary: "#b45309",
    secondary: "#fde68a",
    background: "#fffbeb",
  },

  campos: {
    cliente: "Aluno",
    servico: "Disciplina / Aula",
    extra: "Turma",
    valor: "Valor da Hora",
    status: "Status",
  },

  placeholders: {
    cliente: "Nome do aluno",
    servico: "Ex: Matemática, Português",
    extra: "Turma A / B",
    valor: "R$ 0,00",
    status: "Pendente / Realizado",
  },

  keywords: ["educação", "aula", "professor", "escola"],
};

// ============================================
// PERFIL DENTISTA
// ============================================
const DENTISTA_PROFILE = {
  ...BASE_PROFILE,
  id: "dentista",
  nome: "Dentista",
  icon: "🦷",
  description: "Perfil para cirurgiões-dentistas e clínicas odontológicas",
  slogan: "Sorrisos organizados, agenda impecável",

  colors: {
    primary: "#0e7490",
    secondary: "#a5f3fc",
    background: "#ecfeff",
  },

  campos: {
    cliente: "Paciente",
    servico: "Procedimento",
    extra: "Convênio / Plano",
    valor: "Valor do Procedimento",
    status: "Status do Tratamento",
  },

  placeholders: {
    cliente: "Nome do paciente",
    servico: "Ex: Limpeza, Canal, Restauração",
    extra: "Nome do convênio",
    valor: "R$ 0,00",
    status: "Em andamento / Concluído",
  },

  keywords: ["dentista", "odontologia", "dental", "ortodontia"],
};

// ============================================
// PERFIL NUTRICIONISTA
// ============================================
const NUTRICIONISTA_PROFILE = {
  ...BASE_PROFILE,
  id: "nutricionista",
  nome: "Nutricionista",
  icon: "🥗",
  description: "Perfil para nutricionistas e consultórios de nutrição",
  slogan: "Saúde e equilíbrio em cada consulta",

  colors: {
    primary: "#15803d",
    secondary: "#bbf7d0",
    background: "#f0fdf4",
  },

  campos: {
    cliente: "Paciente",
    servico: "Tipo de Consulta",
    extra: "Objetivo / Plano Alimentar",
    valor: "Valor da Consulta",
    status: "Evolução",
  },

  placeholders: {
    cliente: "Nome do paciente",
    servico: "Ex: Retorno, Avaliação inicial",
    extra: "Emagrecimento / Ganho de massa",
    valor: "R$ 0,00",
    status: "Em acompanhamento",
  },

  keywords: ["nutrição", "dieta", "alimentação", "nutricionista"],
};

// ============================================
// PERFIL BARBEIRO
// ============================================
const BARBEIRO_PROFILE = {
  ...BASE_PROFILE,
  id: "barbeiro",
  nome: "Barbeiro",
  icon: "💈",
  description: "Perfil para barbeiros e barbearias",
  slogan: "Estilo e precisão em cada corte",

  colors: {
    primary: "#1c1917",
    secondary: "#d6d3d1",
    background: "#fafaf9",
  },

  campos: {
    cliente: "Cliente",
    servico: "Serviço",
    extra: "Observações",
    valor: "Valor",
    status: "Status",
  },

  placeholders: {
    cliente: "Nome do cliente",
    servico: "Ex: Corte, Barba, Sobrancelha",
    extra: "Preferências do cliente",
    valor: "R$ 0,00",
    status: "Agendado / Concluído",
  },

  keywords: ["barbearia", "barbeiro", "corte", "barba"],
};

// ============================================
// PERFIL TATUADOR
// ============================================
const TATUADOR_PROFILE = {
  ...BASE_PROFILE,
  id: "tatuador",
  nome: "Tatuador(a)",
  icon: "🖋️",
  description: "Perfil para tatuadores e estúdios de tatuagem",
  slogan: "Arte que fica para sempre",

  colors: {
    primary: "#18181b",
    secondary: "#a1a1aa",
    background: "#f4f4f5",
  },

  campos: {
    cliente: "Cliente",
    servico: "Estilo / Tema da Tattoo",
    extra: "Tamanho / Local no Corpo",
    valor: "Valor da Sessão",
    status: "Status",
  },

  placeholders: {
    cliente: "Nome do cliente",
    servico: "Ex: Realismo, Fineline",
    extra: "Ex: 15cm, antebraço",
    valor: "R$ 0,00",
    status: "Orçado / Agendado / Concluído",
  },

  keywords: ["tatuagem", "tattoo", "tatuador", "estúdio"],
};

// ============================================
// PERFIL DESIGNER DE SOBRANCELHAS
// ============================================
const DESIGNER_SOBRANCELHAS_PROFILE = {
  ...BASE_PROFILE,
  id: "designerSobrancelhas",
  nome: "Designer de Sobrancelhas",
  icon: "✨",
  description: "Perfil para designers de sobrancelhas e cílios",
  slogan: "Realçando o seu melhor olhar",

  colors: {
    primary: "#9d174d",
    secondary: "#fbcfe8",
    background: "#fdf2f8",
  },

  campos: {
    cliente: "Cliente",
    servico: "Serviço",
    extra: "Técnica Utilizada",
    valor: "Valor",
    status: "Status",
  },

  placeholders: {
    cliente: "Nome da cliente",
    servico: "Ex: Design, Henna, Micropigmentação",
    extra: "Ex: Fio a fio, volume russo",
    valor: "R$ 0,00",
    status: "Agendado / Realizado",
  },

  keywords: ["sobrancelha", "cílios", "design", "henna", "micropigmentação"],
};

// ============================================
// PERFIL CORRETOR DE IMÓVEIS
// ============================================
const CORRETOR_IMOVEIS_PROFILE = {
  ...BASE_PROFILE,
  id: "corretorImoveis",
  nome: "Corretor de Imóveis",
  icon: "🏠",
  description: "Perfil para corretores e consultores imobiliários",
  slogan: "Conectando pessoas ao lar ideal",

  colors: {
    primary: "#78350f",
    secondary: "#fde68a",
    background: "#fffbeb",
  },

  campos: {
    cliente: "Cliente",
    servico: "Tipo de Imóvel / Visita",
    extra: "Endereço do Imóvel",
    valor: "Valor do Imóvel",
    status: "Status da Negociação",
  },

  placeholders: {
    cliente: "Nome do cliente",
    servico: "Ex: Visita, Apresentação de proposta",
    extra: "Endereço completo do imóvel",
    valor: "R$ 0,00",
    status: "Em negociação / Fechado",
  },

  keywords: ["imóveis", "corretor", "imobiliária", "aluguel", "venda"],
};

// ============================================
// PERFIL VETERINÁRIO
// ============================================
const VETERINARIO_PROFILE = {
  ...BASE_PROFILE,
  id: "veterinario",
  nome: "Veterinário(a)",
  icon: "🐾",
  description: "Perfil para veterinários e clínicas veterinárias",
  slogan: "Cuidando de quem não pode falar",

  colors: {
    primary: "#0d9488",
    secondary: "#99f6e4",
    background: "#f0fdfa",
  },

  campos: {
    cliente: "Tutor / Pet",
    servico: "Procedimento",
    extra: "Espécie / Raça",
    valor: "Valor da Consulta",
    status: "Status do Atendimento",
  },

  placeholders: {
    cliente: "Nome do tutor e do pet",
    servico: "Ex: Consulta, Vacina, Cirurgia",
    extra: "Ex: Cão, SRD",
    valor: "R$ 0,00",
    status: "Agendado / Atendido",
  },

  keywords: ["veterinário", "pet", "animais", "clínica veterinária"],
};

// ============================================
// EXPORTAÇÕES
// ============================================

// Mapeamento de todos os perfis disponíveis
export const BUSINESS_PROFILES = {
  default: BASE_PROFILE,
  advogado: ADVOGADO_PROFILE,
  medico: MEDICO_PROFILE,
  manicure: MANICURE_PROFILE,
  personalTrainer: PERSONAL_TRAINER_PROFILE,
  psicologo: PSICOLOGO_PROFILE,
  fotografo: FOTOGRAFO_PROFILE,
  consultor: CONSULTOR_PROFILE,
  professor: PROFESSOR_PROFILE,
  dentista: DENTISTA_PROFILE,
  nutricionista: NUTRICIONISTA_PROFILE,
  barbeiro: BARBEIRO_PROFILE,
  tatuador: TATUADOR_PROFILE,
  designerSobrancelhas: DESIGNER_SOBRANCELHAS_PROFILE,
  corretorImoveis: CORRETOR_IMOVEIS_PROFILE,
  veterinario: VETERINARIO_PROFILE,
};

// Função para obter um perfil pelo ID
export function getBusinessProfile(id) {
  return BUSINESS_PROFILES[id] || BUSINESS_PROFILES.default;
}

// Função para obter as opções de perfil (para selects)
export function getBusinessProfileOptions() {
  return Object.values(BUSINESS_PROFILES).map((profile) => ({
    id: profile.id,
    label: `${profile.icon} ${profile.nome}`,
    description: profile.description,
    icon: profile.icon,
    nome: profile.nome,
  }));
}

// Função para buscar perfil por palavra-chave
export function getBusinessProfileByKeyword(keyword) {
  const lowerKeyword = keyword.toLowerCase();
  return (
    Object.values(BUSINESS_PROFILES).find((profile) =>
      profile.keywords?.some((k) => k.toLowerCase().includes(lowerKeyword)),
    ) || BUSINESS_PROFILES.default
  );
}

// Para compatibilidade com o código existente que usa BUSINESS_PROFILES_LEGACY
export const BUSINESS_PROFILES_LEGACY = Object.fromEntries(
  Object.entries(BUSINESS_PROFILES).map(([key, profile]) => [
    key,
    {
      nome: profile.nome,
      theme: key,
      icon: profile.icon,
      slogan: profile.slogan,
      campos: profile.campos,
    },
  ]),
);

// Exportação padrão
export default BUSINESS_PROFILES;
