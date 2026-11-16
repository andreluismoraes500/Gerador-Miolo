// Mockup de agenda desenhado em canvas 2D: capa fechada em 3/4 e folhas abertas, com wire-o/espiral e elástico.
import { criarStore } from "./storeSimples";

export const FIOS = [
  { nome: "Branco", cor: "#f4f4f2" }, { nome: "Prata", cor: "#c4c8ce" }, { nome: "Dourado", cor: "#d4a63c" }, { nome: "Rosé gold", cor: "#d9a08f" },
  { nome: "Cobre", cor: "#b8693a" }, { nome: "Preto", cor: "#26272b" }, { nome: "Azul", cor: "#2f6fd0" }, { nome: "Rosa", cor: "#e86a9a" },
  { nome: "Vermelho", cor: "#c9243a" }, { nome: "Verde", cor: "#3f9a6a" }, { nome: "Roxo", cor: "#7b5cc4" }, { nome: "Laranja", cor: "#ef8a2f" },
];
export const FORMATOS = {
  a6: ["A6 · 105 × 148", 105, 148], a5: ["A5 · 148 × 210", 148, 210], c14: ["14 × 20 cm", 140, 200],
  c15: ["15 × 21 cm", 150, 210], c17: ["17 × 24 cm", 170, 240], a4: ["A4 · 210 × 297", 210, 297],
};
export const mockCfg = criarStore("mock-agenda-cfg", {
  formato: "a5", espessura: 16, yaw: 32, pitch: 16, tipoWire: "espiral", corWire: "#f4f4f2", passo: 9,
  elastico: true, corElastico: "#e9e4d9", posElastico: 11, larguraElastico: 8,
  corCapa: "#d6567a", corBorda: "#9fb0c0", papel: "#fffdf8", corTitulo: "#ffffff", tituloX: 50, tituloY: 50, tituloTam: 11, tituloFonte: "'Great Vibes', cursive", cantos: 2, brilho: true,
  fundo: "estudio", corFundo: "#eee9e1", ajuste: "inteira", folhaZoom: 1, folhaX: 0, folhaY: 0, capaModo: "inteira", capaZoom: 1, capaX: 0, capaY: 0, tituloAgenda: "minha agenda", pertence: "Pertence a:",
  src1: "branco", src2: "pertence",
});

/* ---------- utilidades ---------- */
const hex = (h) => { let s = h.replace("#", ""); if (s.length === 3) s = s.split("").map((c) => c + c).join(""); return [0, 2, 4].map((i) => parseInt(s.slice(i, i + 2), 16)); };
const rgb = (a) => `rgb(${a.map((v) => Math.round(Math.max(0, Math.min(255, v)))).join(",")})`;
export const claro = (c, f) => rgb(hex(c).map((v) => v + (255 - v) * f));
export const escuro = (c, f) => rgb(hex(c).map((v) => v * (1 - f)));
const rad = (d) => (d * Math.PI) / 180;
const novoCanvas = (w, h) => { const c = document.createElement("canvas"); c.width = Math.round(w); c.height = Math.round(h); return c; };
const rr = (ctx, x, y, w, h, r) => {
  const k = Math.min(r, w / 2, h / 2);
  ctx.beginPath(); ctx.moveTo(x + k, y); ctx.arcTo(x + w, y, x + w, y + h, k); ctx.arcTo(x + w, y + h, x, y + h, k); ctx.arcTo(x, y + h, x, y, k); ctx.arcTo(x, y, x + w, y, k); ctx.closePath();
};
const poly = (ctx, pts, fill) => { ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath(); ctx.fillStyle = fill; ctx.fill(); };

export function carregarImg(src) {
  return new Promise((ok) => { if (!src) { ok(null); return; } const i = new Image(); i.onload = () => ok(i); i.onerror = () => ok(null); i.src = src; });
}
// cor do canto da imagem (fundo quando ela é exibida inteira)
function corCanto(img) {
  try {
    const c = novoCanvas(4, 4), x = c.getContext("2d");
    x.drawImage(img, 0, 0, 4, 4);
    const [r, g, b, a] = x.getImageData(0, 0, 1, 1).data;
    return a < 40 ? null : `rgb(${r},${g},${b})`;
  } catch { return null; }
}
// modo "inteira" = cabe sem cortar (fundo = cor do canto da imagem); "preencher" = corta o excesso.
function cobrir(ctx, img, w, h, modo, { zoom = 1, x = 0, y = 0, bg } = {}) {
  const iw = img.naturalWidth || img.width, ih = img.naturalHeight || img.height;
  const inteira = modo === "inteira";
  const k = (inteira ? Math.min(w / iw, h / ih) : Math.max(w / iw, h / ih)) * zoom;
  if (inteira) { ctx.fillStyle = bg || corCanto(img) || "#ffffff"; ctx.fillRect(0, 0, w, h); }
  ctx.drawImage(img, (w - iw * k) / 2 + (x / 100) * (w / 2), (h - ih * k) / 2 + (y / 100) * (h / 2), iw * k, ih * k);
}

/* ---------- texturas ---------- */
function florais(ctx, w, h, cor) {
  let s = 11; const rnd = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
  const g = ctx.createLinearGradient(0, 0, w, h); g.addColorStop(0, claro(cor, 0.9)); g.addColorStop(1, claro(cor, 0.74));
  ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
  for (let i = 0; i < 60; i += 1) {
    ctx.save(); ctx.translate(rnd() * w, rnd() * h); ctx.rotate(rnd() * 6.28);
    const l = w * (0.05 + rnd() * 0.06);
    ctx.fillStyle = rnd() > 0.5 ? "rgba(95,143,107,.5)" : "rgba(120,165,125,.32)";
    ctx.beginPath(); ctx.ellipse(0, 0, l, l * 0.3, 0, 0, 6.283); ctx.fill(); ctx.restore();
  }
  for (let i = 0; i < 20; i += 1) {
    const x = rnd() * w, y = rnd() * h, r = w * (0.04 + rnd() * 0.05), n = 5 + Math.floor(rnd() * 2), tom = 0.1 + rnd() * 0.35;
    for (let k = 0; k < n; k += 1) {
      ctx.save(); ctx.translate(x, y); ctx.rotate((k / n) * 6.283 + i);
      ctx.fillStyle = claro(cor, tom + (k % 2) * 0.12); ctx.beginPath(); ctx.ellipse(r * 0.55, 0, r * 0.55, r * 0.34, 0, 0, 6.283); ctx.fill(); ctx.restore();
    }
    ctx.fillStyle = "#e8bf5a"; ctx.beginPath(); ctx.arc(x, y, r * 0.22, 0, 6.283); ctx.fill();
  }
}

export function texturaCapa(cfg, img, wmm, hmm) {
  const W = 1000, H = Math.round((W * hmm) / wmm);
  const c = novoCanvas(W, H), ctx = c.getContext("2d");
  const raio = (cfg.cantos / wmm) * W;
  ctx.save(); rr(ctx, 0, 0, W, H, raio); ctx.clip();
  if (img) cobrir(ctx, img, W, H, cfg.capaModo, { zoom: cfg.capaZoom, x: cfg.capaX, y: cfg.capaY }); else florais(ctx, W, H, cfg.corCapa);
  const titulo = (cfg.tituloAgenda || "").trim();
  if (titulo) {
    const tx = (W * cfg.tituloX) / 100, ty = (H * cfg.tituloY) / 100, fs = (W * cfg.tituloTam) / 100, maxW = W * 0.9;
    ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.font = `${fs}px ${cfg.tituloFonte}`;
    const tw = Math.min(ctx.measureText(titulo).width, maxW);
    if (img) { // texto por cima da arte, sem caixa
      ctx.save(); ctx.shadowColor = "rgba(0,0,0,.55)"; ctx.shadowBlur = W * 0.02; ctx.shadowOffsetY = W * 0.006;
      ctx.fillStyle = cfg.corTitulo; ctx.fillText(titulo, tx, ty, maxW); ctx.restore();
    } else {
      const bw = tw + fs * 0.9, bh = fs * 1.7;
      ctx.fillStyle = "rgba(255,255,255,.88)"; rr(ctx, tx - bw / 2, ty - bh / 2, bw, bh, bh * 0.2); ctx.fill();
      ctx.fillStyle = escuro(cfg.corCapa, 0.1); ctx.font = `${fs}px ${cfg.tituloFonte}`; ctx.fillText(titulo, tx, ty, maxW);
    }
  }
  // dobradiça (lombada) e brilho
  const d = ctx.createLinearGradient(0, 0, W * 0.07, 0);
  d.addColorStop(0, "rgba(0,0,0,.32)"); d.addColorStop(0.45, "rgba(0,0,0,.05)"); d.addColorStop(0.55, "rgba(255,255,255,.14)"); d.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = d; ctx.fillRect(0, 0, W * 0.07, H);
  if (cfg.brilho) {
    const g = ctx.createLinearGradient(0, 0, W, H);
    g.addColorStop(0, "rgba(255,255,255,.26)"); g.addColorStop(0.32, "rgba(255,255,255,0)"); g.addColorStop(0.7, "rgba(255,255,255,0)"); g.addColorStop(1, "rgba(255,255,255,.12)");
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  }
  ctx.restore();
  ctx.strokeStyle = "rgba(255,255,255,.35)"; ctx.lineWidth = 2; rr(ctx, 1, 1, W - 2, H - 2, raio); ctx.stroke();
  return c;
}

export function texturaFolha(cfg, tipo, img, wmm, hmm) {
  const W = 900, H = Math.round((W * hmm) / wmm);
  const c = novoCanvas(W, H), ctx = c.getContext("2d");
  ctx.fillStyle = cfg.papel; ctx.fillRect(0, 0, W, H);
  const acento = cfg.corCapa;
  if (img && tipo !== "branco") cobrir(ctx, img, W, H, cfg.ajuste, { zoom: cfg.folhaZoom, x: cfg.folhaX, y: cfg.folhaY });
  if (tipo === "linhas") {
    ctx.strokeStyle = "rgba(90,100,120,.28)"; ctx.lineWidth = 1.4;
    for (let y = H * 0.12; y < H * 0.95; y += H * 0.045) { ctx.beginPath(); ctx.moveTo(W * 0.1, y); ctx.lineTo(W * 0.9, y); ctx.stroke(); }
  } else if (tipo === "pertence") {
    ctx.fillStyle = acento; ctx.textBaseline = "alphabetic"; ctx.textAlign = "left";
    ctx.font = `italic ${W * 0.12}px 'Great Vibes', 'Playfair Display', Georgia, serif`; ctx.fillText(cfg.tituloAgenda || "", W * 0.12, H * 0.2, W * 0.62);
    ctx.font = `${W * 0.07}px Georgia, serif`; ctx.fillText("♥", W * 0.76, H * 0.2);
    ctx.font = `${W * 0.045}px 'Montserrat', sans-serif`; ctx.fillStyle = escuro(acento, 0.2);
    ctx.fillText(cfg.pertence || "", W * 0.12, H * 0.31);
    ctx.strokeStyle = claro(acento, 0.35); ctx.lineWidth = 2;
    [0.34, 0.41, 0.48].forEach((y) => { ctx.beginPath(); ctx.moveTo(W * 0.12, H * y); ctx.lineTo(W * 0.88, H * y); ctx.stroke(); });
    ctx.fillStyle = "#777"; ctx.font = `${W * 0.032}px 'Montserrat', sans-serif`;
    ctx.fillText("Telefone:", W * 0.12, H * 0.56); ctx.fillText("E-mail:", W * 0.12, H * 0.64);
    [0.57, 0.65].forEach((y) => { ctx.beginPath(); ctx.moveTo(W * 0.32, H * y); ctx.lineTo(W * 0.88, H * y); ctx.stroke(); });
  }
  return c;
}

/* ---------- câmera 3D e texturas em perspectiva ---------- */
function camera(cfg, w, h, t) {
  const ya = -rad(cfg.yaw), pa = rad(cfg.pitch);
  const cy = Math.cos(ya), sy = Math.sin(ya), cp = Math.cos(pa), sp = Math.sin(pa), D = Math.max(w, h) * 3.4;
  return ([x, y, z]) => {
    const X = x - w / 2, Y = y - h / 2, Z = z + t / 2;
    const x1 = X * cy + Z * sy, z1 = -X * sy + Z * cy;
    const y2 = Y * cp - z1 * sp, z2 = Y * sp + z1 * cp, s = D / (D - z2);
    return [x1 * s, -y2 * s];
  };
}
function tri(ctx, tex, s0, s1, s2, d0, d1, d2) {
  const p1 = s1[0] - s0[0], q1 = s1[1] - s0[1], p2 = s2[0] - s0[0], q2 = s2[1] - s0[1];
  const r1 = d1[0] - d0[0], w1 = d1[1] - d0[1], r2 = d2[0] - d0[0], w2 = d2[1] - d0[1];
  const det = p1 * q2 - p2 * q1; if (!det) return;
  const a = (r1 * q2 - r2 * q1) / det, cc = (p1 * r2 - p2 * r1) / det, b = (w1 * q2 - w2 * q1) / det, d = (p1 * w2 - p2 * w1) / det;
  const e = d0[0] - a * s0[0] - cc * s0[1], f = d0[1] - b * s0[0] - d * s0[1];
  const mx = (d0[0] + d1[0] + d2[0]) / 3, my = (d0[1] + d1[1] + d2[1]) / 3;
  const ex = (p) => { const dx = p[0] - mx, dy = p[1] - my, l = Math.hypot(dx, dy) || 1; return [p[0] + (dx / l) * 1.6, p[1] + (dy / l) * 1.6]; };
  ctx.save(); const [A, B, C] = [ex(d0), ex(d1), ex(d2)];
  ctx.beginPath(); ctx.moveTo(A[0], A[1]); ctx.lineTo(B[0], B[1]); ctx.lineTo(C[0], C[1]); ctx.closePath(); ctx.clip();
  ctx.setTransform(a, b, cc, d, e, f); ctx.drawImage(tex, 0, 0); ctx.restore();
}
function texturaEm(ctx, tex, P, N = 12, M = 16) {
  const tw = tex.width, th = tex.height;
  for (let i = 0; i < N; i += 1) for (let j = 0; j < M; j += 1) {
    const u0 = i / N, u1 = (i + 1) / N, v0 = j / M, v1 = (j + 1) / M;
    const a = P(u0, v0), b = P(u1, v0), c = P(u1, v1), d = P(u0, v1);
    tri(ctx, tex, [u0 * tw, v0 * th], [u1 * tw, v0 * th], [u1 * tw, v1 * th], a, b, c);
    tri(ctx, tex, [u0 * tw, v0 * th], [u1 * tw, v1 * th], [u0 * tw, v1 * th], a, c, d);
  }
}

function fundo(ctx, W, H, cfg) {
  ctx.clearRect(0, 0, W, H);
  if (cfg.fundo === "transparente") return;
  if (cfg.fundo === "cor") { ctx.fillStyle = cfg.corFundo; ctx.fillRect(0, 0, W, H); return; }
  const g = ctx.createRadialGradient(W * 0.5, H * 0.42, W * 0.05, W * 0.5, H * 0.5, W * 0.75);
  g.addColorStop(0, claro(cfg.corFundo, 0.7)); g.addColorStop(1, escuro(cfg.corFundo, 0.1));
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
}

function tracar(ctx, pts, cor, lw) {
  const caminho = () => { ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); };
  ctx.lineCap = "round"; ctx.lineJoin = "round";
  caminho(); ctx.strokeStyle = escuro(cor, 0.5); ctx.lineWidth = lw + 1.4; ctx.stroke();
  caminho(); ctx.strokeStyle = cor; ctx.lineWidth = lw; ctx.stroke();
  ctx.save(); ctx.translate(-lw * 0.12, -lw * 0.2); caminho(); ctx.strokeStyle = claro(cor, 0.7); ctx.lineWidth = lw * 0.3; ctx.stroke(); ctx.restore();
}
const nAneis = (cfg, h) => Math.max(2, Math.floor((h - cfg.passo * 1.4) / cfg.passo) + 1);

/* ---------- vista fechada (3/4) ---------- */
export function desenharFechada(cv, cfg, imgs) {
  const ctx = cv.getContext("2d"), W = cv.width, H = cv.height;
  ctx.setTransform(1, 0, 0, 1, 0, 0); fundo(ctx, W, H, cfg);
  const [, w, h] = FORMATOS[cfg.formato], t = cfg.espessura;
  const proj = camera(cfg, w, h, t), espiral = cfg.tipoWire === "espiral";
  const wireMm = espiral ? 1.5 : 1.25, hole = 4.5, r = t / 2 + 1.7, q = Math.sqrt(r * r - (t * t) / 4), x0 = hole - q, zc = -t / 2;
  const caixa = [[0, 0, 0], [w, 0, 0], [0, h, 0], [w, h, 0], [0, 0, -t], [w, 0, -t], [0, h, -t], [w, h, -t], [x0 - r, 0, zc], [x0 - r, h, zc]].map(proj);
  const xs = caixa.map((p) => p[0]), ys = caixa.map((p) => p[1]);
  const minX = Math.min(...xs), maxX = Math.max(...xs), minY = Math.min(...ys), maxY = Math.max(...ys);
  const sc = Math.min((W * 0.8) / (maxX - minX), (H * 0.76) / (maxY - minY));
  const ox = W / 2 - ((minX + maxX) / 2) * sc, oy = H / 2 - ((minY + maxY) / 2) * sc - H * 0.015;
  const P = (x, y, z) => { const [a, b] = proj([x, y, z]); return [ox + a * sc, oy + b * sc]; };
  const borda = cfg.corBorda, papel = escuro(cfg.papel, 0.05), tb = Math.min(2.4, t * 0.12);

  // sombra projetada
  ctx.save(); ctx.shadowColor = "rgba(30,20,10,.38)"; ctx.shadowBlur = 38 * (W / 1500); ctx.shadowOffsetX = 18 * (W / 1500); ctx.shadowOffsetY = 34 * (W / 1500);
  if (cfg.fundo !== "transparente") {
    [[P(0, 0, 0), P(w, 0, 0), P(w, 0, -t), P(0, 0, -t)], [P(0, 0, 0), P(w, 0, 0), P(w, h, 0), P(0, h, 0)], [P(w, 0, 0), P(w, h, 0), P(w, h, -t), P(w, 0, -t)]].forEach((p) => poly(ctx, p, "#000"));
  }
  ctx.restore();

  // anéis: camada de trás
  const passo = cfg.passo, n = nAneis(cfg, h), y0 = (h - (n - 1) * passo) / 2, segs = [];
  const dup = espiral ? [0] : [-passo * 0.2, passo * 0.2]; // wire-o: duas hastes por anel
  for (let i = 0; i < n; i += 1) for (const off of dup) {
    const yi = y0 + i * passo + off, pts = [];
    for (let k = 0; k <= 36; k += 1) { const a = (k / 36) * 6.2832; pts.push([x0 + r * Math.cos(a), yi + (espiral ? passo * (k / 36) - passo / 2 : 0), zc + r * Math.sin(a)]); }
    let cur = null;
    for (let k = 0; k < 36; k += 1) {
      const A = pts[k], B = pts[k + 1], mx = (A[0] + B[0]) / 2, mz = (A[2] + B[2]) / 2;
      if (mx > 0 && mx < w && mz < 0 && mz > -t) { cur = null; continue; }
      const camada = mz >= zc ? "f" : "t";
      if (!cur || cur.camada !== camada) { cur = { camada, pts: [A] }; segs.push(cur); }
      cur.pts.push(B);
    }
  }
  const lw = Math.max(2, wireMm * sc);
  const anel = (camada) => segs.filter((s) => s.camada === camada).forEach((s) => tracar(ctx, s.pts.map(([x, y, z]) => P(x, y, z)), cfg.corWire, lw));
  anel("t");

  // laterais (páginas) — direita e topo
  const zs = [0, -tb, -(t - tb), -t], cores = [borda, papel, borda], nl = Math.max(4, Math.round((t - 2 * tb) * 2));
  for (let i = 0; i < 3; i += 1) {
    poly(ctx, [P(w, 0, zs[i]), P(w, h, zs[i]), P(w, h, zs[i + 1]), P(w, 0, zs[i + 1])], cores[i]);
    poly(ctx, [P(0, h, zs[i]), P(w, h, zs[i]), P(w, h, zs[i + 1]), P(0, h, zs[i + 1])], cores[i]);
  }
  ctx.lineWidth = 0.7; ctx.strokeStyle = "rgba(110,100,80,.35)";
  for (let k = 0; k <= nl; k += 1) {
    const z = -tb - (k * (t - 2 * tb)) / nl;
    ctx.beginPath(); const a = P(w, 0, z), b = P(w, h, z); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
    ctx.beginPath(); const c = P(0, h, z), d = P(w, h, z); ctx.moveTo(c[0], c[1]); ctx.lineTo(d[0], d[1]); ctx.stroke();
  }
  poly(ctx, [P(w, 0, 0), P(w, h, 0), P(w, h, -t), P(w, 0, -t)], "rgba(0,0,0,.10)");

  // capa
  const tex = texturaCapa(cfg, imgs.capa, w, h);
  texturaEm(ctx, tex, (u, v) => P(u * w, (1 - v) * h, 0));
  anel("f");

  // elástico
  if (cfg.elastico) {
    const xe = w - cfg.posElastico, bw = cfg.larguraElastico, e = 0.9, yt = h + e * 0.5;
    const frente = [P(xe - bw / 2, -e * 0.5, e), P(xe + bw / 2, -e * 0.5, e), P(xe + bw / 2, yt, e), P(xe - bw / 2, yt, e)];
    const topo = [P(xe - bw / 2, yt, e), P(xe + bw / 2, yt, e), P(xe + bw / 2, yt, -t), P(xe - bw / 2, yt, -t)];
    ctx.save(); ctx.shadowColor = "rgba(0,0,0,.4)"; ctx.shadowBlur = 8; ctx.shadowOffsetX = 4; ctx.shadowOffsetY = 4;
    poly(ctx, frente, cfg.corElastico); poly(ctx, topo, escuro(cfg.corElastico, 0.12)); ctx.restore();
    ctx.save(); ctx.lineWidth = 1; ctx.strokeStyle = "rgba(0,0,0,.09)";
    for (let y = 0; y < h; y += 2.2) { const a = P(xe - bw / 2, y, e), b = P(xe + bw / 2, y, e); ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); }
    ctx.restore();
    [frente, topo].forEach((p) => { ctx.beginPath(); p.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath(); ctx.strokeStyle = escuro(cfg.corElastico, 0.35); ctx.lineWidth = 1; ctx.stroke(); });
  }
}

/* ---------- vista aberta ---------- */
export function desenharAberta(cv, cfg, imgs) {
  const ctx = cv.getContext("2d"), W = cv.width, H = cv.height;
  ctx.setTransform(1, 0, 0, 1, 0, 0); fundo(ctx, W, H, cfg);
  const [, w, h] = FORMATOS[cfg.formato];
  const bd = Math.max(3.2, w * 0.03), g = 2.4, totW = 2 * (w + bd) + g, totH = h + 2 * bd;
  const sc = Math.min((W * 0.88) / totW, (H * 0.8) / totH), ox = (W - totW * sc) / 2, oy = (H - totH * sc) / 2 - H * 0.01;
  const X = (x) => ox + x * sc, Y = (y) => oy + y * sc, cx = w + bd + g / 2, raio = cfg.cantos * sc * 1.2;
  const espiral = cfg.tipoWire === "espiral";

  ctx.save(); ctx.shadowColor = "rgba(30,20,10,.4)"; ctx.shadowBlur = 36 * (W / 1800); ctx.shadowOffsetY = 20 * (W / 1800);
  if (cfg.fundo !== "transparente") { rr(ctx, X(0), Y(0), totW * sc, totH * sc, raio); ctx.fillStyle = "#000"; ctx.fill(); }
  ctx.restore();
  const gb = ctx.createLinearGradient(0, Y(0), 0, Y(totH));
  gb.addColorStop(0, claro(cfg.corBorda, 0.12)); gb.addColorStop(1, escuro(cfg.corBorda, 0.08));
  rr(ctx, X(0), Y(0), totW * sc, totH * sc, raio); ctx.fillStyle = gb; ctx.fill();
  ctx.strokeStyle = escuro(cfg.corBorda, 0.3); ctx.lineWidth = 1.5; ctx.stroke();

  const folhas = [{ x: bd, tex: texturaFolha(cfg, cfg.src1, imgs.p1, w, h), lado: -1 }, { x: w + bd + g, tex: texturaFolha(cfg, cfg.src2, imgs.p2, w, h), lado: 1 }];
  folhas.forEach(({ x, tex, lado }) => {
    for (let i = 3; i >= 1; i -= 1) { // pilha de páginas
      ctx.fillStyle = escuro(cfg.papel, 0.06 + i * 0.01); ctx.fillRect(X(x + lado * i * 0.45), Y(bd + i * 0.5), w * sc, h * sc);
      ctx.strokeStyle = "rgba(0,0,0,.10)"; ctx.lineWidth = 1; ctx.strokeRect(X(x + lado * i * 0.45), Y(bd + i * 0.5), w * sc, h * sc);
    }
    ctx.drawImage(tex, X(x), Y(bd), w * sc, h * sc);
    const gx = lado < 0 ? X(x + w) : X(x), g0 = lado < 0 ? X(x + w - w * 0.13) : X(x + w * 0.13);
    const sh = ctx.createLinearGradient(gx, 0, g0, 0);
    sh.addColorStop(0, "rgba(0,0,0,.34)"); sh.addColorStop(0.12, "rgba(0,0,0,.14)"); sh.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = sh; ctx.fillRect(Math.min(gx, g0), Y(bd), Math.abs(g0 - gx), h * sc);
    ctx.strokeStyle = "rgba(0,0,0,.15)"; ctx.lineWidth = 1; ctx.strokeRect(X(x), Y(bd), w * sc, h * sc);
  });

  // anéis no vinco
  const passo = cfg.passo, n = nAneis(cfg, h), y0 = bd + (h - (n - 1) * passo) / 2, R = g / 2 + 4.5, lw = Math.max(2.5, (espiral ? 1.6 : 1.9) * sc);
  const lwo = Math.max(2.2, (espiral ? 1.6 : 1.3) * sc), dup = espiral ? [0] : [-passo * 0.2, passo * 0.2];
  for (let i = 0; i < n; i += 1) for (const off of dup) {
    const y = y0 + i * passo + off, dy = espiral ? passo * 0.28 : 0;
    [-R, R].forEach((dx) => {
      const hx = X(cx + dx), hy = Y(y + (dx < 0 ? dy : -dy));
      ctx.fillStyle = "rgba(20,15,10,.7)"; ctx.beginPath();
      if (espiral) ctx.ellipse(hx, hy, 1.7 * sc, 1.2 * sc, 0, 0, 6.283); else rr(ctx, hx - 1.3 * sc, hy - 0.9 * sc, 2.6 * sc, 1.8 * sc, 0.6 * sc);
      ctx.fill();
    });
    const a = [X(cx - R), Y(y + dy)], b = [X(cx + R), Y(y - dy)], m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2 - 0.9 * sc];
    ctx.save(); ctx.shadowColor = "rgba(0,0,0,.45)"; ctx.shadowBlur = 7 * (W / 1800); ctx.shadowOffsetX = 1.2 * sc; ctx.shadowOffsetY = 1.8 * sc;
    ctx.lineCap = "round"; ctx.strokeStyle = cfg.corWire; ctx.lineWidth = lwo; ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.quadraticCurveTo(m[0], m[1], b[0], b[1]); ctx.stroke(); ctx.restore();
    const pts = []; for (let k = 0; k <= 16; k += 1) { const s2 = k / 16, u = 1 - s2; pts.push([u * u * a[0] + 2 * u * s2 * m[0] + s2 * s2 * b[0], u * u * a[1] + 2 * u * s2 * m[1] + s2 * s2 * b[1]]); }
    tracar(ctx, pts, cfg.corWire, lwo);
  }

  // elástico na borda da capa direita
  if (cfg.elastico) {
    const bw = Math.min(cfg.larguraElastico, bd * 0.85), ex = totW - bd / 2;
    ctx.save(); ctx.shadowColor = "rgba(0,0,0,.4)"; ctx.shadowBlur = 8; ctx.shadowOffsetX = -2; ctx.shadowOffsetY = 2;
    ctx.fillStyle = cfg.corElastico; ctx.fillRect(X(ex - bw / 2), Y(-0.6), bw * sc, (totH + 1.2) * sc); ctx.restore();
    ctx.strokeStyle = "rgba(0,0,0,.09)"; ctx.lineWidth = 1;
    for (let y = 0; y < totH; y += 2.2) { ctx.beginPath(); ctx.moveTo(X(ex - bw / 2), Y(y)); ctx.lineTo(X(ex + bw / 2), Y(y)); ctx.stroke(); }
    ctx.strokeStyle = escuro(cfg.corElastico, 0.35); ctx.strokeRect(X(ex - bw / 2), Y(-0.6), bw * sc, (totH + 1.2) * sc);
  }
}
