// src/config/businessProfiles/index.js

import { BASE_PROFILE } from "./base.js";
import { ADVOGADO_PROFILE } from "./advogado.js";
import { MEDICO_PROFILE } from "./medico.js";
import { MANICURE_PROFILE } from "./manicure.js";
import { PERSONAL_TRAINER_PROFILE } from "./personalTrainer.js";
import { PSICOLOGO_PROFILE } from "./psicologo.js";
import { FOTOGRAFO_PROFILE } from "./fotografo.js";
import { CONSULTOR_PROFILE } from "./consultor.js";
import { PROFESSOR_PROFILE } from "./professor.js";

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
};

// Funções auxiliares
export function getBusinessProfile(id) {
  return BUSINESS_PROFILES[id] || BUSINESS_PROFILES.default;
}

export function getBusinessProfileOptions() {
  return Object.values(BUSINESS_PROFILES).map((profile) => ({
    id: profile.id,
    label: `${profile.icon} ${profile.nome}`,
    description: profile.description,
    icon: profile.icon,
    nome: profile.nome,
  }));
}

export function getBusinessProfileByKeyword(keyword) {
  const lowerKeyword = keyword.toLowerCase();
  return (
    Object.values(BUSINESS_PROFILES).find((profile) =>
      profile.keywords?.some((k) => k.toLowerCase().includes(lowerKeyword)),
    ) || BUSINESS_PROFILES.default
  );
}

// Para compatibilidade com o código existente
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
