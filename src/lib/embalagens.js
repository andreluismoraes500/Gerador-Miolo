// Embalagens: planificações (moldes) paramétricas em mm. Cada modelo devolve peças (polígonos);
// arestas compartilhadas viram linhas de DOBRA (tracejadas) e as demais, linhas de CORTE.
import { criarStore } from "./storeSimples";
import { FONTES_PAR } from "./fontes";

export const PT = 0.3528;
export const idNovo = () => Math.random().toString(36).slice(2, 9);

const R = (x, y, w, h) => [[x, y], [x + w, y], [x + w, y + h], [x, y + h]];
// aba trapezoidal presa à aresta a→b, saindo na direção n (vetor unitário), com profundidade t e recuo i nas pontas
const aba = (a, b, n, t, i = 3) => {
  const ex = b[0] - a[0], ey = b[1] - a[1], L = Math.hypot(ex, ey) || 1, ux = ex / L, uy = ey / L;
  return [a, b, [b[0] + n[0] * t - ux * i, b[1] + n[1] * t - uy * i], [a[0] + n[0] * t + ux * i, a[1] + n[1] * t + uy * i]];
};
const CIMA = [0, -1], BAIXO = [0, 1], ESQ = [-1, 0], DIR = [1, 0];
const face = (id, nome, pts, rot = 0) => ({ id, nome, pts, tipo: "face", rot });
const ab = (id, pai, pts) => ({ id, nome: "Aba", pts, tipo: "aba", pai });

// ---------- construtores ----------
function caixaEncaixe(p) {
  const { W, D, H } = p, cola = p.cola || 10, tab = 12, x1 = cola, y0 = D + tab;
  const frente = face("frente", "Frente", R(x1, y0, W, H));
  const lat1 = face("lat1", "Lateral 1", R(x1 + W, y0, D, H));
  const costas = face("costas", "Costas", R(x1 + W + D, y0, W, H));
  const lat2 = face("lat2", "Lateral 2", R(x1 + 2 * W + D, y0, D, H));
  const xc = x1 + W + D;
  const tampa = face("tampa", "Tampa", R(xc, y0 - D, W, D));
  const fundo = face("fundo", "Fundo", R(xc, y0 + H, W, D));
  const dh = Math.min(D * 0.5 + 2, 14);
  const pecas = [
    frente, lat1, costas, lat2, tampa, fundo,
    ab("cola", "frente", aba([x1, y0], [x1, y0 + H], ESQ, cola, 4)),
    ab("tabT", "tampa", aba([xc, y0 - D], [xc + W, y0 - D], CIMA, tab, 4)),
    ab("tabF", "fundo", aba([xc, y0 + H + D], [xc + W, y0 + H + D], BAIXO, tab, 4)),
  ];
  [[x1 + W, "1"], [x1 + 2 * W + D, "2"]].forEach(([x, n]) => {
    pecas.push(ab(`pt${n}`, `lat${n}`, aba([x, y0], [x + D, y0], CIMA, dh, 2)));
    pecas.push(ab(`pb${n}`, `lat${n}`, aba([x, y0 + H], [x + D, y0 + H], BAIXO, dh, 2)));
  });
  return { pecas, furos: [] };
}

function sacola(p) {
  const { W, D, H } = p, cola = 12, bainha = 15, x1 = cola, y0 = bainha;
  const fr = face("frente", "Frente", R(x1, y0, W, H));
  const l1 = face("lat1", "Lateral 1", R(x1 + W, y0, D, H));
  const co = face("costas", "Costas", R(x1 + W + D, y0, W, H));
  const l2 = face("lat2", "Lateral 2", R(x1 + 2 * W + D, y0, D, H));
  const xs = [[x1, W, "frente"], [x1 + W, D, "lat1"], [x1 + W + D, W, "costas"], [x1 + 2 * W + D, D, "lat2"]];
  const pecas = [fr, l1, co, l2, ab("cola", "frente", aba([x1, y0], [x1, y0 + H], ESQ, cola, 4))];
  xs.forEach(([x, w, id]) => pecas.push(ab(`ba-${id}`, id, aba([x, y0], [x + w, y0], CIMA, bainha, 0))));
  pecas.push(ab("fb-frente", "frente", aba([x1, y0 + H], [x1 + W, y0 + H], BAIXO, D * 0.6, 3)));
  pecas.push(ab("fb-costas", "costas", aba([x1 + W + D, y0 + H], [x1 + 2 * W + D, y0 + H], BAIXO, D * 0.6, 3)));
  pecas.push(ab("fb-lat1", "lat1", aba([x1 + W, y0 + H], [x1 + W + D, y0 + H], BAIXO, D * 0.4, 4)));
  pecas.push(ab("fb-lat2", "lat2", aba([x1 + 2 * W + D, y0 + H], [x1 + 2 * W + 2 * D, y0 + H], BAIXO, D * 0.4, 4)));
  const furos = [];
  if (p.alca) [x1 + W / 2, x1 + W + D + W / 2].forEach((cx) => furos.push({ x: cx, y: y0 + 11, rx: Math.min(W * 0.2, 22), ry: 3.5 }));
  return { pecas, furos };
}

function milk(p) {
  const { W, D, H } = p, cola = 12, rp = D * 0.5, fin = 14, x1 = cola, y0 = rp + fin;
  const fr = face("frente", "Frente", R(x1, y0, W, H));
  const l1 = face("lat1", "Lateral 1", R(x1 + W, y0, D, H));
  const co = face("costas", "Costas", R(x1 + W + D, y0, W, H));
  const l2 = face("lat2", "Lateral 2", R(x1 + 2 * W + D, y0, D, H));
  const xc = x1 + W + D;
  const pecas = [
    fr, l1, co, l2,
    face("telhaF", "Teto frente", R(x1, y0 - rp, W, rp)),
    face("telhaC", "Teto costas", R(xc, y0 - rp, W, rp)),
    ab("finF", "telhaF", R(x1, y0 - rp - fin, W, fin)),
    ab("finC", "telhaC", R(xc, y0 - rp - fin, W, fin)),
    ab("cola", "frente", aba([x1, y0], [x1, y0 + H], ESQ, cola, 4)),
  ];
  [[x1 + W, "lat1"], [x1 + 2 * W + D, "lat2"]].forEach(([x, id]) => {
    pecas.push(ab(`tri-${id}`, id, [[x, y0], [x + D, y0], [x + D / 2, y0 - rp]]));
    pecas.push(ab(`fb-${id}`, id, aba([x, y0 + H], [x + D, y0 + H], BAIXO, D * 0.4, 4)));
  });
  pecas.push(ab("fb-frente", "frente", aba([x1, y0 + H], [x1 + W, y0 + H], BAIXO, D * 0.55, 3)));
  pecas.push(ab("fb-costas", "costas", aba([xc, y0 + H], [xc + W, y0 + H], BAIXO, D * 0.55, 3)));
  return { pecas, furos: [] };
}

function pizza(p) {
  const { W, D, H } = p, x0 = H, y0 = H, t = Math.min(10, H * 0.8);
  const xt = x0 + W + H;
  const pecas = [
    face("base", "Base (fundo)", R(x0, y0, W, D)),
    face("tras", "Parede de trás", R(x0, 0, W, H)),
    face("frente", "Parede da frente", R(x0, y0 + D, W, H)),
    face("esq", "Parede esquerda", R(0, y0, H, D), 270),
    face("dir", "Parede direita", R(x0 + W, y0, H, D), 90),
    face("tampa", "Tampa", R(xt, y0, W, D)),
    ab("aba-tampa", "tampa", aba([xt + W, y0], [xt + W, y0 + D], DIR, H, 4)),
    ab("tampa-cima", "tampa", aba([xt, y0], [xt + W, y0], CIMA, H * 0.9, 4)),
    ab("tampa-baixo", "tampa", aba([xt, y0 + D], [xt + W, y0 + D], BAIXO, H * 0.9, 4)),
  ];
  [["tras", 0], ["frente", y0 + D]].forEach(([id, y]) => {
    pecas.push(ab(`t-${id}-e`, id, aba([x0, y], [x0, y + H], ESQ, t, 3)));
    pecas.push(ab(`t-${id}-d`, id, aba([x0 + W, y], [x0 + W, y + H], DIR, t, 3)));
  });
  return { pecas, furos: [] };
}

function piramide(p) {
  const a = p.W, hp = p.H, x0 = hp, y0 = hp;
  const apexT = [x0 + a / 2, y0 - hp], P1 = [x0 + a, y0];
  const L = Math.hypot(a / 2, hp), n = [hp / L, -a / 2 / L], d = [(apexT[0] - P1[0]) / L, (apexT[1] - P1[1]) / L];
  const c = 8;
  const cola = [P1, apexT, [apexT[0] + n[0] * c - d[0] * 3, apexT[1] + n[1] * c - d[1] * 3], [P1[0] + n[0] * c + d[0] * 3, P1[1] + n[1] * c + d[1] * 3]];
  const pecas = [
    face("base", "Base", R(x0, y0, a, a)),
    face("f1", "Face 1", [[x0, y0], [x0 + a, y0], apexT], 0),
    face("f2", "Face 2", [[x0 + a, y0], [x0 + a, y0 + a], [x0 + a + hp, y0 + a / 2]], 90),
    face("f3", "Face 3", [[x0 + a, y0 + a], [x0, y0 + a], [x0 + a / 2, y0 + a + hp]], 180),
    face("f4", "Face 4", [[x0, y0 + a], [x0, y0], [x0 - hp, y0 + a / 2]], 270),
    ab("cola", "f1", cola),
  ];
  return { pecas, furos: [] };
}

function cone(p) {
  const Rr = p.H, d = p.W;
  const th = Math.min(330, (360 * (d / 2)) / Rr);
  const a0 = ((90 - th / 2) * Math.PI) / 180, passos = Math.max(24, Math.ceil(th / 3));
  const pts = [[0, 0]];
  for (let i = 0; i <= passos; i += 1) { const ang = a0 + ((th * Math.PI) / 180) * (i / passos); pts.push([Rr * Math.cos(ang), Rr * Math.sin(ang)]); }
  const P0 = pts[1], nrm = [Math.sin(a0), -Math.cos(a0)];
  return { pecas: [face("cone", "Cone", pts), ab("cola", "cone", aba([0, 0], P0, nrm, 9, 2))], furos: [] };
}

function marcador(p) {
  const w = p.W, h = p.H, gap = p.gap ?? 8, r = Math.min(6, w / 4, h / 4);
  const forma = (ox) => {
    if (p.forma === "ponta") return [[ox, 0], [ox + w, 0], [ox + w, h - w * 0.35], [ox + w / 2, h], [ox, h - w * 0.35]];
    if (p.forma === "reta") return R(ox, 0, w, h);
    const pts = [], arco = (cx, cy, a1) => { for (let i = 0; i <= 6; i += 1) { const t = ((a1 + 90 * (i / 6)) * Math.PI) / 180; pts.push([cx + r * Math.cos(t), cy + r * Math.sin(t)]); } };
    arco(ox + w - r, r, -90); arco(ox + w - r, h - r, 0); arco(ox + r, h - r, 90); arco(ox + r, r, 180);
    return pts;
  };
  const furos = p.furo ? [{ x: w / 2, y: 8, rx: 2.3, ry: 2.3 }, { x: w + gap + w / 2, y: 8, rx: 2.3, ry: 2.3 }] : [];
  return { pecas: [face("frente", "Frente", forma(0)), face("verso", "Verso", forma(w + gap))], furos };
}

const num = (k, rotulo, def, min, max, passo = 1) => ({ k, rotulo, def, min, max, passo });

export const MODELOS_EMB = {
  bala: {
    nome: "Caixa de bala / bombom", icone: "🍬", desc: "Caixinha com tampa de encaixe e fundo, ideal para balas e lembrancinhas.", montar: caixaEncaixe,
    campos: [num("W", "Largura (mm)", 60, 15, 250), num("D", "Profundidade (mm)", 25, 8, 150), num("H", "Altura (mm)", 90, 15, 250)],
  },
  cubo: {
    nome: "Caixa cubo / presente", icone: "🎁", desc: "Caixa quadrada com tampa de encaixe. Mude as medidas para o tamanho que quiser.", montar: caixaEncaixe,
    campos: [num("W", "Largura (mm)", 50, 15, 200), num("D", "Profundidade (mm)", 50, 15, 200), num("H", "Altura (mm)", 50, 15, 200)],
  },
  sacola: {
    nome: "Sacola", icone: "🛍️", desc: "Sacolinha com fundo, bainha e alça vazada opcional.", montar: sacola,
    campos: [num("W", "Largura (mm)", 80, 30, 250), num("D", "Fundo / lateral (mm)", 40, 15, 150), num("H", "Altura (mm)", 110, 30, 300), { k: "alca", rotulo: "Alça vazada (furo oval)", tipo: "check", def: true }],
  },
  milk: {
    nome: "Caixa milk (leitinho)", icone: "🥛", desc: "Caixinha de leite com telhado e selo no topo.", montar: milk,
    campos: [num("W", "Largura (mm)", 55, 20, 200), num("D", "Profundidade (mm)", 55, 20, 200), num("H", "Altura do corpo (mm)", 90, 20, 250)],
  },
  pizza: {
    nome: "Caixa de pizza", icone: "🍕", desc: "Caixa quadrada com tampa articulada e abas de fechamento.", montar: pizza,
    campos: [num("W", "Largura (mm)", 80, 30, 250), num("D", "Profundidade (mm)", 80, 30, 250), num("H", "Altura das paredes (mm)", 30, 12, 120)],
  },
  churros: {
    nome: "Cone de churros / pipoca", icone: "🥐", desc: "Cone enrolado (setor circular) com aba de cola. Boca e altura ajustáveis.", montar: cone,
    campos: [num("W", "Diâmetro da boca (mm)", 70, 30, 200), num("H", "Altura inclinada (mm)", 180, 60, 400)],
  },
  piramide: {
    nome: "Caixa pirâmide", icone: "🔺", desc: "Pirâmide de base quadrada com 4 faces triangulares.", montar: piramide,
    campos: [num("W", "Lado da base (mm)", 60, 25, 200), num("H", "Altura das faces (mm)", 65, 25, 200)],
  },
  marcador: {
    nome: "Marcador de página", icone: "🔖", desc: "Frente e verso, com cantos retos, arredondados ou em ponta e furo para fita.", montar: marcador,
    campos: [
      num("W", "Largura (mm)", 50, 20, 120), num("H", "Altura (mm)", 150, 60, 280), num("gap", "Espaço entre frente e verso (mm)", 8, 0, 40),
      { k: "forma", rotulo: "Formato", tipo: "sel", def: "arredondada", ops: [["reta", "Reto"], ["arredondada", "Cantos arredondados"], ["ponta", "Ponta (seta)"]] },
      { k: "furo", rotulo: "Furo para fita", tipo: "check", def: true },
    ],
  },
};

export const paramsPadrao = (id) => Object.fromEntries(MODELOS_EMB[id].campos.map((c) => [c.k, c.def]));

// ---------- geometria final ----------
const chv = (x, y) => `${Math.round(x * 100)}_${Math.round(y * 100)}`;

export function geometria(id, params) {
  const m = MODELOS_EMB[id];
  const { pecas, furos } = m.montar({ ...paramsPadrao(id), ...params });
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  pecas.forEach((p) => p.pts.forEach(([x, y]) => { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); }));
  const pad = 0.4;
  const mov = ([x, y]) => [x - x0 + pad, y - y0 + pad];
  const ps = pecas.map((p) => {
    const pts = p.pts.map(mov);
    const xs = pts.map((q) => q[0]), ys = pts.map((q) => q[1]);
    const bx = Math.min(...xs), by = Math.min(...ys);
    return { ...p, pts, bx, by, bw: Math.max(...xs) - bx, bh: Math.max(...ys) - by };
  });
  const fu = furos.map((f) => { const [x, y] = mov([f.x, f.y]); return { ...f, x, y }; });
  const mapa = new Map();
  ps.forEach((p) => p.pts.forEach((a, i) => {
    const b = p.pts[(i + 1) % p.pts.length], ka = chv(...a), kb = chv(...b), key = ka < kb ? `${ka}|${kb}` : `${kb}|${ka}`;
    const e = mapa.get(key) || { a, b, n: 0 };
    e.n += 1; mapa.set(key, e);
  }));
  const arestas = [...mapa.values()];
  const d = (lista) => lista.map((e) => `M${e.a[0].toFixed(2)} ${e.a[1].toFixed(2)}L${e.b[0].toFixed(2)} ${e.b[1].toFixed(2)}`).join("");
  return {
    w: x1 - x0 + 2 * pad, h: y1 - y0 + 2 * pad, pecas: ps, furos: fu,
    corte: d(arestas.filter((e) => e.n === 1)), dobra: d(arestas.filter((e) => e.n > 1)),
    faces: ps.filter((p) => p.tipo === "face"),
  };
}

// ---------- estado ----------
export const FONTES_EMB = FONTES_PAR;
export const TEMAS_EMB = ["#d6567a", "#2f6fd0", "#5f8f6b", "#e0a526", "#24344D", "#7b5cc4", "#c0643a", "#3a3f48", "#ffffff"];

export const itemTextoEmb = (p = {}) => ({ id: idNovo(), texto: "Seu texto", fonte: "'DM Serif Display', serif", tam: 22, cor: "#ffffff", x: 50, y: 50, alinh: "center", negrito: false, italico: false, caixaAlta: false, esp: 0, ...p });
export const faceNova = (cor, comTexto) => ({ fundo: cor, imgOn: false, op: 100, modo: "cobrir", rot: null, textos: comTexto ? [itemTextoEmb({ texto: "Seu nome", cor: corTexto(cor) })] : [] });
export const corTexto = (bg) => {
  const h = /^#[0-9a-f]{6}$/i.test(bg) ? bg.slice(1) : "ffffff";
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
  return (r * 299 + g * 587 + b * 114) / 1000 > 150 ? "#24344D" : "#ffffff";
};

export const EMB_PADRAO = {
  modelo: "bala", tema: "#d6567a", params: {}, arte: {}, sel: "",
  linhaCorte: true, linhaDobra: true, corLinha: "#231f20", espLinha: 0.25, rotulos: true,
  papel: "a4", orient: "auto", margem: 8, espaco: 4, escala: 100, qtd: 1, usarNomes: false, nomes: "Maria\nJoão\nAna",
};
export const embCfg = criarStore("embalagens-cfg", EMB_PADRAO);
// imagens (não persistem): chave `${modelo}:${face}`
export const embImgs = {};
