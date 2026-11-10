// Biblioteca de acessórios (SVG originais). `c` é a cor principal editável, `d` a secundária.
const sh = (c, f) => {
  const n = parseInt(c.slice(1), 16);
  const k = (v) => Math.max(0, Math.min(255, Math.round(f >= 0 ? v + (255 - v) * f : v * (1 + f)))).toString(16).padStart(2, "0");
  return `#${k((n >> 16) & 255)}${k((n >> 8) & 255)}${k(n & 255)}`;
};
const flor = (c, d) => {
  const p = Array.from({ length: 6 }, (_, i) => `<ellipse cx="50" cy="26" rx="14" ry="24" fill="${c}" transform="rotate(${i * 60} 50 50)"/>`).join("");
  return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">${p}<circle cx="50" cy="50" r="12" fill="${d}"/><circle cx="50" cy="50" r="12" fill="none" stroke="${sh(d, -0.25)}" stroke-width="1.5"/></svg>`;
};

export const CATEGORIAS = ["Escritório", "Natureza", "Decoração", "Casa", "Adesivos"];

export const ACESSORIOS = [
  { id: "caneta", nome: "Caneta", cat: "Escritório", w: 40, h: 280, c: "#1e3a8a", d: "#c9a24b",
    svg: (c, d) => `<svg viewBox="0 0 40 280" xmlns="http://www.w3.org/2000/svg"><rect x="10" y="30" width="20" height="190" rx="9" fill="${c}"/><rect x="10" y="30" width="7" height="190" rx="3" fill="${sh(c, 0.35)}" opacity=".55"/><rect x="12" y="8" width="5" height="75" rx="2.5" fill="${d}"/><rect x="9" y="214" width="22" height="10" fill="${d}"/><path d="M11 224h18l-6 40h-6z" fill="${sh(c, -0.2)}"/><path d="M18 264h4l-2 12z" fill="#222"/></svg>` },
  { id: "lapis", nome: "Lápis", cat: "Escritório", w: 34, h: 290, c: "#f2b705", d: "#e58a8a",
    svg: (c, d) => `<svg viewBox="0 0 34 290" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="30" width="26" height="200" fill="${c}"/><rect x="4" y="30" width="9" height="200" fill="${sh(c, 0.35)}" opacity=".6"/><rect x="4" y="12" width="26" height="22" rx="3" fill="${d}"/><rect x="4" y="32" width="26" height="8" fill="#b6bcc4"/><path d="M4 230h26l-13 44z" fill="#f1d7a8"/><path d="M13 262h8l-4 16z" fill="#333"/></svg>` },
  { id: "clipe", nome: "Clipe", cat: "Escritório", w: 60, h: 140, c: "#8f98a3", d: "#fff",
    svg: (c) => `<svg viewBox="0 0 60 140" xmlns="http://www.w3.org/2000/svg"><path d="M20 90V28a14 14 0 0 1 28 0v84a22 22 0 0 1-44 0V44" fill="none" stroke="${c}" stroke-width="6" stroke-linecap="round"/></svg>` },
  { id: "prendedor", nome: "Prendedor", cat: "Escritório", w: 160, h: 90, c: "#d4a63c", d: "#1e293b",
    svg: (c, d) => `<svg viewBox="0 0 160 90" xmlns="http://www.w3.org/2000/svg"><path d="M8 20h110l30 -12v74l-30-12H8z" fill="${d}"/><rect x="118" y="26" width="30" height="38" rx="4" fill="${c}"/><circle cx="133" cy="45" r="6" fill="${sh(c, -0.3)}"/></svg>` },
  { id: "regua", nome: "Régua", cat: "Escritório", w: 300, h: 50, c: "#7ec0ee", d: "#1e293b",
    svg: (c, d) => `<svg viewBox="0 0 300 50" xmlns="http://www.w3.org/2000/svg"><rect width="300" height="50" rx="6" fill="${c}" opacity=".85"/>${Array.from({ length: 31 }, (_, i) => `<line x1="${6 + i * 9.5}" x2="${6 + i * 9.5}" y1="0" y2="${i % 5 ? 12 : 22}" stroke="${d}" stroke-width="1.2"/>`).join("")}</svg>` },
  { id: "tesoura", nome: "Tesoura", cat: "Escritório", w: 110, h: 220, c: "#c9ced6", d: "#e06a8d",
    svg: (c, d) => `<svg viewBox="0 0 110 220" xmlns="http://www.w3.org/2000/svg"><path d="M52 118L26 6l14 -2 22 100z M58 118L84 6 70 4 48 104z" fill="${c}" stroke="#7b838f" stroke-width="2"/><ellipse cx="32" cy="168" rx="22" ry="38" fill="none" stroke="${d}" stroke-width="10"/><ellipse cx="78" cy="168" rx="22" ry="38" fill="none" stroke="${d}" stroke-width="10"/></svg>` },
  { id: "flor", nome: "Flor", cat: "Natureza", w: 140, h: 140, c: "#f48fb1", d: "#f6c453", svg: flor },
  { id: "margarida", nome: "Margarida", cat: "Natureza", w: 140, h: 140, c: "#ffffff", d: "#f6c453",
    svg: (c, d) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">${Array.from({ length: 12 }, (_, i) => `<ellipse cx="50" cy="22" rx="7" ry="20" fill="${c}" stroke="#d8d8d8" stroke-width=".8" transform="rotate(${i * 30} 50 50)"/>`).join("")}<circle cx="50" cy="50" r="11" fill="${d}"/></svg>` },
  { id: "folha", nome: "Folha", cat: "Natureza", w: 90, h: 160, c: "#5aa469", d: "#3f7d4c",
    svg: (c, d) => `<svg viewBox="0 0 90 160" xmlns="http://www.w3.org/2000/svg"><path d="M45 4C95 50 90 120 45 156 0 120-5 50 45 4z" fill="${c}"/><path d="M45 10V156" stroke="${d}" stroke-width="3"/>${[40, 65, 90, 115].map((y) => `<path d="M45 ${y}l-22 -14M45 ${y}l22 -14" stroke="${d}" stroke-width="2" fill="none"/>`).join("")}</svg>` },
  { id: "ramo", nome: "Ramo de folhas", cat: "Natureza", w: 200, h: 260, c: "#6aa86f", d: "#47794d",
    svg: (c, d) => `<svg viewBox="0 0 200 260" xmlns="http://www.w3.org/2000/svg"><path d="M100 255C95 190 110 90 120 10" stroke="${d}" stroke-width="4" fill="none"/>${[40, 80, 120, 160, 200].map((y, i) => `<ellipse cx="${i % 2 ? 78 : 134}" cy="${y}" rx="14" ry="34" fill="${c}" transform="rotate(${i % 2 ? -50 : 50} ${i % 2 ? 78 : 134} ${y})"/>`).join("")}</svg>` },
  { id: "borboleta", nome: "Borboleta", cat: "Natureza", w: 160, h: 130, c: "#9b6bd6", d: "#f6c453",
    svg: (c, d) => `<svg viewBox="0 0 160 130" xmlns="http://www.w3.org/2000/svg"><path d="M78 62C60 10 10 6 8 40c-2 30 36 40 70 26z" fill="${c}"/><path d="M82 62C100 10 150 6 152 40c2 30-36 40-70 26z" fill="${c}"/><path d="M76 70C50 78 28 96 44 118c20 8 34-24 36-42z" fill="${sh(c, 0.25)}"/><path d="M84 70c26 8 48 26 32 48-20 8-34-24-36-42z" fill="${sh(c, 0.25)}"/><circle cx="35" cy="42" r="9" fill="${d}"/><circle cx="125" cy="42" r="9" fill="${d}"/><rect x="77" y="38" width="6" height="64" rx="3" fill="#2a2330"/></svg>` },
  { id: "oculos", nome: "Óculos", cat: "Decoração", w: 240, h: 100, c: "#2a2a2e", d: "#bfe3f2",
    svg: (c, d) => `<svg viewBox="0 0 240 100" xmlns="http://www.w3.org/2000/svg"><rect x="8" y="20" width="96" height="66" rx="30" fill="${d}" opacity=".55" stroke="${c}" stroke-width="7"/><rect x="136" y="20" width="96" height="66" rx="30" fill="${d}" opacity=".55" stroke="${c}" stroke-width="7"/><path d="M104 44q16-12 32 0" stroke="${c}" stroke-width="7" fill="none"/></svg>` },
  { id: "xicara", nome: "Xícara", cat: "Casa", w: 200, h: 170, c: "#ffffff", d: "#6b4226",
    svg: (c, d) => `<svg viewBox="0 0 200 170" xmlns="http://www.w3.org/2000/svg"><ellipse cx="90" cy="150" rx="86" ry="14" fill="#00000022"/><path d="M20 40h140v50a60 60 0 0 1-60 60h-20a60 60 0 0 1-60-60z" fill="${c}" stroke="#d9d9de" stroke-width="3"/><ellipse cx="90" cy="40" rx="70" ry="12" fill="${d}"/><path d="M160 58h14a22 22 0 0 1 0 46h-22" fill="none" stroke="${c}" stroke-width="12"/><path d="M160 58h14a22 22 0 0 1 0 46h-22" fill="none" stroke="#d9d9de" stroke-width="2"/></svg>` },
  { id: "livro", nome: "Livro", cat: "Casa", w: 220, h: 290, c: "#7b2d3a", d: "#e9d9a8",
    svg: (c, d) => `<svg viewBox="0 0 220 290" xmlns="http://www.w3.org/2000/svg"><rect x="6" y="6" width="200" height="278" rx="6" fill="${c}"/><rect x="198" y="12" width="14" height="266" fill="${d}"/><rect x="6" y="6" width="22" height="278" rx="4" fill="${sh(c, -0.25)}"/><rect x="52" y="60" width="110" height="10" rx="3" fill="${d}"/><rect x="62" y="82" width="90" height="6" rx="3" fill="${d}" opacity=".7"/></svg>` },
  { id: "pilha", nome: "Pilha de livros", cat: "Casa", w: 280, h: 150, c: "#3f6e8c", d: "#f2e8cf",
    svg: (c, d) => `<svg viewBox="0 0 280 150" xmlns="http://www.w3.org/2000/svg"><rect x="10" y="100" width="260" height="42" rx="4" fill="${sh(c, -0.2)}"/><rect x="22" y="104" width="236" height="34" fill="${d}" opacity=".35"/><rect x="26" y="56" width="236" height="42" rx="4" fill="${c}"/><rect x="40" y="62" width="206" height="30" fill="${d}" opacity=".35"/><rect x="40" y="12" width="220" height="42" rx="4" fill="${sh(c, 0.3)}"/></svg>` },
  { id: "papel", nome: "Papel decorativo", cat: "Decoração", w: 230, h: 300, c: "#f7d9d9", d: "#e8a9a9",
    svg: (c, d) => `<svg viewBox="0 0 230 300" xmlns="http://www.w3.org/2000/svg"><rect width="230" height="300" fill="${c}"/>${Array.from({ length: 12 }, (_, i) => Array.from({ length: 9 }, (__, j) => `<circle cx="${14 + j * 25}" cy="${14 + i * 25}" r="3.5" fill="${d}"/>`).join("")).join("")}</svg>` },
  { id: "washi", nome: "Fita washi", cat: "Decoração", w: 220, h: 48, c: "#f2b5c8", d: "#ffffff",
    svg: (c, d) => `<svg viewBox="0 0 220 48" xmlns="http://www.w3.org/2000/svg"><path d="M4 0l8 8-8 8 8 8-8 8 8 8-8 8H210l6-8-6-8 6-8-6-8 6-8-6-8z" fill="${c}" opacity=".9"/>${Array.from({ length: 9 }, (_, i) => `<circle cx="${22 + i * 22}" cy="24" r="5" fill="${d}" opacity=".8"/>`).join("")}</svg>` },
  { id: "estrela", nome: "Adesivo estrela", cat: "Adesivos", w: 120, h: 120, c: "#f6c453", d: "#ffffff",
    svg: (c, d) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M50 4l13 30 33 3-25 22 8 32-29-17-29 17 8-32L4 37l33-3z" fill="${d}" stroke="${d}" stroke-width="8" stroke-linejoin="round"/><path d="M50 10l11 27 29 3-22 19 7 29-25-15-25 15 7-29-22-19 29-3z" fill="${c}"/></svg>` },
  { id: "coracao", nome: "Adesivo coração", cat: "Adesivos", w: 120, h: 110, c: "#ef5b7c", d: "#ffffff",
    svg: (c, d) => `<svg viewBox="0 0 100 92" xmlns="http://www.w3.org/2000/svg"><path d="M50 86C10 56 2 30 18 14c14-12 28-4 32 8 4-12 18-20 32-8 16 16 8 42-32 72z" fill="${d}" stroke="${d}" stroke-width="8" stroke-linejoin="round"/><path d="M50 82C14 54 8 32 21 19c11-9 25-2 29 10 4-12 18-19 29-10 13 13 7 35-29 63z" fill="${c}"/></svg>` },
  { id: "sol", nome: "Adesivo sol", cat: "Adesivos", w: 130, h: 130, c: "#ffb703", d: "#ffffff",
    svg: (c, d) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">${Array.from({ length: 12 }, (_, i) => `<rect x="47" y="4" width="6" height="18" rx="3" fill="${c}" transform="rotate(${i * 30} 50 50)"/>`).join("")}<circle cx="50" cy="50" r="22" fill="${c}" stroke="${d}" stroke-width="4"/></svg>` },
  { id: "tag", nome: "Etiqueta", cat: "Adesivos", w: 170, h: 90, c: "#ffffff", d: "#1e293b",
    svg: (c, d) => `<svg viewBox="0 0 170 90" xmlns="http://www.w3.org/2000/svg"><path d="M4 10h130l32 35-32 35H4z" fill="${c}" stroke="${d}" stroke-width="2.5"/><circle cx="26" cy="45" r="7" fill="none" stroke="${d}" stroke-width="2.5"/><rect x="46" y="38" width="70" height="6" rx="3" fill="${d}" opacity=".5"/></svg>` },
];

const cache = new Map();
export function imagemAcessorio(a, c = a.c, d = a.d) {
  const url = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(a.svg(c, d));
  if (!cache.has(url)) cache.set(url, new Promise((ok) => { const i = new Image(); i.onload = () => ok(i); i.src = url; }));
  return { url, promessa: cache.get(url) };
}
export const acessorioPorId = (id) => ACESSORIOS.find((a) => a.id === id);
