// src/themes/index.js

import classico from "./classico";
import floral from "./floral";
import comercial from "./comercial";
import moderno from "./moderno";
import rustico from "./rustico";

// Objeto com todos os temas disponíveis
export const TEMAS = {
  classico,
  floral,
  comercial,
  moderno,
  rustico,
  // Adicione novos temas aqui conforme criar
};

// Função opcional para registrar temas dinamicamente (caso queira carregar sob demanda)
export function registerTheme(id, theme) {
  TEMAS[id] = theme;
}

export default TEMAS;
