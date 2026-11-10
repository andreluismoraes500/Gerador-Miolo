// Operações sobre os elementos do editor 2D (funções puras sobre o estado).
import { novoId } from "./projetos";

export const FONTES = ["'DM Serif Display', serif", "'Cormorant Garamond', serif", "Inter, system-ui, sans-serif", "'Playfair Display', serif", "'Courier New', monospace", "cursive"];

export function elemento(tipo, extra = {}) {
  return { id: "e" + novoId(), tipo, x: 100, y: 100, w: 200, h: 200, rotation: 0, opacidade: 1, locked: false, hidden: false, grupo: null, sombra: { on: false, cor: "#000000", blur: 18, x: 6, y: 10, op: 0.3 }, ...extra };
}
export const novoTexto = (texto = "Seu texto aqui") => elemento("texto", { nome: "Texto", texto, w: 420, h: 64, fontSize: 56, fonte: FONTES[0], cor: "#1e293b", negrito: false, alinhar: "left" });
export function novaImagem(src, w, h, W, H, nome = "Imagem") {
  const k = Math.min((W * 0.6) / w, (H * 0.6) / h, 1);
  const ww = Math.round(w * k), hh = Math.round(h * k);
  return elemento("imagem", { nome, src, w: ww, h: hh, x: Math.round((W - ww) / 2), y: Math.round((H - hh) / 2), sombra: { on: true, cor: "#000000", blur: 20, x: 6, y: 10, op: 0.28 } });
}
export function novoAcessorio(a, W, H) {
  const k = Math.min(1, (H * 0.38) / a.h);
  const w = Math.round(a.w * k), h = Math.round(a.h * k);
  return elemento("acessorio", { nome: a.nome, acId: a.id, c: a.c, d: a.d, w, h, x: Math.round((W - w) / 2), y: Math.round((H - h) / 2), sombra: { on: true, cor: "#000000", blur: 14, x: 5, y: 8, op: 0.28 } });
}
export function novoProduto(p, W, H, capa) {
  const k = Math.min(1, (H * 0.6) / p.h);
  const w = Math.round(p.w * k), h = Math.round(p.h * k);
  return elemento("produto", { nome: p.nome, kind: p.id, cor: "#1e293b", moldura: "#1b1d22", capa: capa || null, w, h, x: Math.round((W - w) / 2), y: Math.round((H - h) / 2) });
}

export const alterar = (l, ids, patch) => ({ ...l, elementos: l.elementos.map((e) => (ids.includes(e.id) ? { ...e, ...(typeof patch === "function" ? patch(e) : patch) } : e)) });
export const duplicar = (l, ids) => {
  const novos = l.elementos.filter((e) => ids.includes(e.id)).map((e) => ({ ...e, id: "e" + novoId(), x: e.x + 30, y: e.y + 30, grupo: null, locked: false, nome: e.nome }));
  return { l: { ...l, elementos: [...l.elementos, ...novos] }, ids: novos.map((n) => n.id) };
};
export const excluir = (l, ids) => ({ ...l, elementos: l.elementos.filter((e) => !ids.includes(e.id)) });
export function ordem(l, ids, modo) {
  const el = l.elementos, sel = el.filter((e) => ids.includes(e.id)), resto = el.filter((e) => !ids.includes(e.id));
  if (modo === "frente") return { ...l, elementos: [...resto, ...sel] };
  if (modo === "fundo") return { ...l, elementos: [...sel, ...resto] };
  const a = [...el];
  const idx = modo === "sobe" ? [...a.keys()].reverse() : [...a.keys()];
  idx.forEach((i) => {
    const j = modo === "sobe" ? i + 1 : i - 1;
    if (ids.includes(a[i].id) && a[j] && !ids.includes(a[j].id)) [a[i], a[j]] = [a[j], a[i]];
  });
  return { ...l, elementos: a };
}
export const agrupar = (l, ids) => { const g = "g" + novoId(); return alterar(l, ids, { grupo: g }); };
export const desagrupar = (l, ids) => alterar(l, ids, { grupo: null });

// Alinha à prancheta (um elemento) ou ao conjunto selecionado (vários).
export function alinhar(l, ids, modo, tamanhos) {
  const sel = l.elementos.filter((e) => ids.includes(e.id));
  if (!sel.length) return l;
  const caixa = (e) => { const r = ((e.rotation || 0) * Math.PI) / 180; const c = Math.abs(Math.cos(r)), s = Math.abs(Math.sin(r)); const w = e.w * c + e.h * s, h = e.w * s + e.h * c; const cx = e.x + (e.w * Math.cos(r) - e.h * Math.sin(r)) / 2, cy = e.y + (e.w * Math.sin(r) + e.h * Math.cos(r)) / 2; return { w, h, cx, cy }; };
  const cs = sel.map(caixa);
  const ref = sel.length > 1
    ? { x0: Math.min(...cs.map((c) => c.cx - c.w / 2)), x1: Math.max(...cs.map((c) => c.cx + c.w / 2)), y0: Math.min(...cs.map((c) => c.cy - c.h / 2)), y1: Math.max(...cs.map((c) => c.cy + c.h / 2)) }
    : { x0: 0, x1: tamanhos.W, y0: 0, y1: tamanhos.H };
  return { ...l, elementos: l.elementos.map((e) => {
    const i = sel.indexOf(e); if (i < 0) return e;
    const c = cs[i]; let dx = 0, dy = 0;
    if (modo === "esq") dx = ref.x0 - (c.cx - c.w / 2);
    if (modo === "centroH") dx = (ref.x0 + ref.x1) / 2 - c.cx;
    if (modo === "dir") dx = ref.x1 - (c.cx + c.w / 2);
    if (modo === "topo") dy = ref.y0 - (c.cy - c.h / 2);
    if (modo === "centroV") dy = (ref.y0 + ref.y1) / 2 - c.cy;
    if (modo === "base") dy = ref.y1 - (c.cy + c.h / 2);
    return { ...e, x: Math.round(e.x + dx), y: Math.round(e.y + dy) };
  }) };
}
export function centralizar(l, ids, tam) {
  const sel = l.elementos.filter((e) => ids.includes(e.id));
  if (!sel.length) return l;
  const x0 = Math.min(...sel.map((e) => e.x)), x1 = Math.max(...sel.map((e) => e.x + e.w));
  const y0 = Math.min(...sel.map((e) => e.y)), y1 = Math.max(...sel.map((e) => e.y + e.h));
  const dx = Math.round(tam.W / 2 - (x0 + x1) / 2), dy = Math.round(tam.H / 2 - (y0 + y1) / 2);
  return { ...l, elementos: l.elementos.map((e) => (ids.includes(e.id) ? { ...e, x: e.x + dx, y: e.y + dy } : e)) };
}
