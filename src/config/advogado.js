// src/config/businessProfiles/advogado.js

import { BASE_PROFILE } from "./base.js";

export const ADVOGADO_PROFILE = {
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

  layout: {
    mostrarValor: true,
    mostrarStatus: true,
    mostrarHoraInicio: true,
    mostrarHoraFim: false,
  },

  horario: {
    inicio: "09:00",
    fim: "19:00",
    intervalo: 30,
    diasUteis: [1, 2, 3, 4, 5],
  },

  placeholders: {
    cliente: "Nome do cliente",
    servico: "Nº do processo / Descrição",
    extra: "Ex: 0012345-67.2023",
    valor: "R$ 0,00",
    status: "Andamento / Concluído",
  },

  keywords: ["direito", "jurídico", "advocacia", "processo"],

  assets: {
    watermark: "/watermarks/justice.png",
    icon: "/icons/law.svg",
  },
};
