// src/config/businessProfiles/psicologo.js

import { BASE_PROFILE } from "./base.js";

export const PSICOLOGO_PROFILE = {
  ...BASE_PROFILE,
  id: "psicologo",
  nome: "Psicólogo(a)",
  icon: "🧠",
  description: "Perfil para profissionais da psicologia",
  slogan: "Cuidando da mente e das emoções",

  colors: {
    primary: "#7c3aed", // Violet-600
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

  layout: {
    mostrarValor: true,
    mostrarStatus: true,
    mostrarHoraInicio: true,
    mostrarHoraFim: true,
  },

  horario: {
    inicio: "08:00",
    fim: "20:00",
    intervalo: 50, // Sessão de 50min
    diasUteis: [1, 2, 3, 4, 5],
  },

  placeholders: {
    cliente: "Nome do paciente",
    servico: "Abordagem: TCC / Psicanálise",
    extra: "Trabalhando ansiedade",
    valor: "R$ 0,00",
    status: "Evolução positiva",
  },

  keywords: ["psicologia", "terapia", "saúde mental", "bem-estar"],

  assets: {
    watermark: "/watermarks/psychology.png",
    icon: "/icons/brain.svg",
  },
};
