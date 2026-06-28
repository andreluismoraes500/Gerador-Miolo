// src/config/businessProfiles/base.js

export const BASE_PROFILE = {
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

  assets: {
    watermark: "/watermarks/default.png",
    icon: "/icons/default.svg",
  },
};
