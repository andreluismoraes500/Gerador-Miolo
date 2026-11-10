// Dispatcher dos produtos 3D (agenda/bloco/calendário/kit + produtos de gráfica).
import { construirBase } from "./build";
import { construirAcessorios } from "./acessorios3d";
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
  const m = fn ? fn(ctx3, o) : construirBase(ctx3, o);
  if (o.acessorios3d?.length && !m.userData.parede) {
    m.add(construirAcessorios(o.acessorios3d, m.userData.w || 1.5, m.userData.h || 2));
  }
  return m;
}
