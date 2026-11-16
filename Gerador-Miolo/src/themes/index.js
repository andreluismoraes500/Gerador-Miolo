// src/themes/index.js

import classico from "./classico";
import floral from "./floral";
import floralAzul from "./floralAzul";
import comercial from "./comercial";
import moderno from "./moderno";
import rustico from "./rustico";
import tecnologico from "./tecnologico";
import advogado from "./segments/advogado";
import medico from "./segments/medico";
import manicure from "./segments/manicure";

// Objeto com todos os temas disponíveis
export const TEMAS = {
  classico,
  floral,
  floralAzul,
  comercial,
  moderno,
  rustico,
  tecnologico,

  advogado,
  medico,
  manicure,
  // Adicione novos temas aqui conforme criar
};

// Função opcional para registrar temas dinamicamente (caso queira carregar sob demanda)
export function registerTheme(id, theme) {
  TEMAS[id] = theme;
}

export default TEMAS;
