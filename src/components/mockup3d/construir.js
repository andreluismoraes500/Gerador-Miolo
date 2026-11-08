// Dispatcher dos produtos 3D (agenda/bloco/calendário/kit + produtos de gráfica).
import { construirBase } from "./build";
import {
  construirQuadro, construirBotton, construirCaneca, construirCartoes, construirCaixa, construirSacola,
} from "./produtosGraficos";

const GRAFICOS = {
  quadro: construirQuadro,
  botton: construirBotton,
  caneca: construirCaneca,
  cartoes: construirCartoes,
  caixa: construirCaixa,
  sacola: construirSacola,
};

export function construir(ctx3, o) {
  const fn = GRAFICOS[o.produto];
  return fn ? fn(ctx3, o) : construirBase(ctx3, o);
}
