// src/config/businessProfiles/personalTrainer.js

import { BASE_PROFILE } from "./base.js";

export const PERSONAL_TRAINER_PROFILE = {
  ...BASE_PROFILE,
  id: "personalTrainer",
  nome: "Personal Trainer",
  icon: "💪",
  description: "Perfil para profissionais de educação física",
  slogan: "Transforme vidas através do movimento",

  colors: {
    primary: "#dc2626", // Red-600
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

  layout: {
    mostrarValor: true,
    mostrarStatus: true,
    mostrarHoraInicio: true,
    mostrarHoraFim: true,
  },

  horario: {
    inicio: "06:00",
    fim: "22:00",
    intervalo: 30,
    diasUteis: [1, 2, 3, 4, 5, 6], // Inclui sábado
  },

  placeholders: {
    cliente: "Nome do aluno",
    servico: "Ex: Treino A - Superiores",
    extra: "3x12 supino, 4x10 remada",
    valor: "R$ 0,00",
    status: "Iniciante / Intermediário / Avançado",
  },

  keywords: ["treino", "academia", "fitness", "musculação"],

  assets: {
    watermark: "/watermarks/fitness.png",
    icon: "/icons/dumbbell.svg",
  },
};
