export const BUSINESS_PROFILES = {
  default: {
    nome: "",
    theme: "classico",
    icon: "",
    slogan: "Gerador de Agendas Profissional",

    campos: {
      cliente: "Cliente",
      servico: "Compromisso",
      extra: "",
    },
  },

  advogado: {
    nome: "Advogado",
    theme: "advogado",
    icon: "⚖️",
    slogan: "Organização jurídica profissional",

    campos: {
      cliente: "Cliente",
      servico: "Processo",
      extra: "Número OAB",
    },
  },

  medico: {
    nome: "Médico",
    theme: "medico",
    icon: "🩺",
    slogan: "Agenda clínica profissional",

    campos: {
      cliente: "Paciente",
      servico: "Procedimento",
      extra: "Convênio",
    },
  },

  manicure: {
    nome: "Manicure",
    theme: "manicure",
    icon: "💅",
    slogan: "Agenda de atendimentos",

    campos: {
      cliente: "Cliente",
      servico: "Serviço",
      extra: "Valor",
    },
  },
};
