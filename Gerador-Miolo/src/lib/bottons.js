// Bottons: folha com várias imagens em quadrados (com guia circular de corte).
import { criarStore } from "./storeSimples";
import { PAPEIS } from "./cartaoVisita";

export const DIAMETROS = [25, 32, 35, 38, 45, 50, 55, 58, 75];

export const bottonsCfg = criarStore("bottons-cfg", {
  diametro: 38, dobra: 9.5, papel: "a4", margem: 8, espaco: 2, guias: true, guiaVisivel: true, orientacao: "auto",
});

export function calcularBottons(cfg, total) {
  const p = PAPEIS[cfg.papel] || PAPEIS.a4;
  const cell = cfg.diametro + 2 * cfg.dobra;
  const tenta = (W, H) => {
    const cols = Math.max(0, Math.floor((W - 2 * cfg.margem + cfg.espaco) / (cell + cfg.espaco)));
    const rows = Math.max(0, Math.floor((H - 2 * cfg.margem + cfg.espaco) / (cell + cfg.espaco)));
    return { W, H, cols, rows, n: cols * rows };
  };
  const a = tenta(p.w, p.h), b = tenta(p.h, p.w);
  const g = cfg.orientacao === "retrato" ? a : cfg.orientacao === "paisagem" ? b : (b.n > a.n ? b : a);
  const gridW = g.cols * cell + (g.cols - 1) * cfg.espaco, gridH = g.rows * cell + (g.rows - 1) * cfg.espaco;
  const x0 = (g.W - gridW) / 2, y0 = (g.H - gridH) / 2;
  const posicoes = [];
  for (let r = 0; r < g.rows; r += 1) for (let c = 0; c < g.cols; c += 1) posicoes.push({ x: x0 + c * (cell + cfg.espaco), y: y0 + r * (cell + cfg.espaco) });
  const folhas = g.n ? Math.ceil(total / g.n) : 0;
  return { ...g, cell, posicoes, porFolha: g.n, folhas };
}
