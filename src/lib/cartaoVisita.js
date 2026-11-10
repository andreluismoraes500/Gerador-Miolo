// Cartão de visita: configuração e cálculo do encaixe na folha (frente/verso alinhados).
import { criarStore } from "./storeSimples";

export const PAPEIS = {
  a4: { nome: "A4 (210 × 297 mm)", w: 210, h: 297 },
  carta: { nome: "Carta (216 × 279 mm)", w: 215.9, h: 279.4 },
  a3: { nome: "A3 (297 × 420 mm)", w: 297, h: 420 },
};
export const TAMANHOS = {
  "90x50": { nome: "90 × 50 mm (padrão Brasil)", w: 90, h: 50 },
  "85x55": { nome: "85 × 55 mm (padrão Europa)", w: 85, h: 55 },
  "90x54": { nome: "90 × 54 mm", w: 90, h: 54 },
  "50x90": { nome: "50 × 90 mm (vertical)", w: 50, h: 90 },
  "55x55": { nome: "55 × 55 mm (quadrado)", w: 55, h: 55 },
};
export const FONTES = [
  ["'DM Serif Display', serif", "DM Serif Display"], ["'Playfair Display', serif", "Playfair Display"],
  ["'Cormorant Garamond', serif", "Cormorant Garamond"], ["'Lora', serif", "Lora"], ["'Montserrat', sans-serif", "Montserrat"],
  ["'Poppins', sans-serif", "Poppins"], ["'Inter', sans-serif", "Inter"], ["'Raleway', sans-serif", "Raleway"],
  ["'Oswald', sans-serif", "Oswald"], ["'Great Vibes', cursive", "Great Vibes"],
];
export const PALETAS = [
  { nome: "Marinho e dourado", fundo: "#14213d", texto: "#ffffff", acento: "#d4a63c" },
  { nome: "Branco clássico", fundo: "#ffffff", texto: "#1f2937", acento: "#b8860b" },
  { nome: "Rosé", fundo: "#fdf1f3", texto: "#4a2430", acento: "#d6567a" },
  { nome: "Verde sálvia", fundo: "#eef3ec", texto: "#26382b", acento: "#5f8f6b" },
  { nome: "Preto e branco", fundo: "#111111", texto: "#f5f5f5", acento: "#ffffff" },
  { nome: "Azul moderno", fundo: "#ffffff", texto: "#0f172a", acento: "#2563eb" },
  { nome: "Terracota", fundo: "#f8efe6", texto: "#40281c", acento: "#c0643a" },
];

export const AJUSTE_ARTE = { modo: "caber", zoom: 1, x: 0, y: 0, girar: false, fundoModo: "desfoque", fundoCor: "#ffffff" };

export const cartaoCfg = criarStore("cartao-visita", {
  nome: "Ana Souza", cargo: "Designer de Papelaria", empresa: "Studio Bella", slogan: "Feito com carinho, impresso com capricho",
  telefone: "(11) 99999-0000", email: "contato@studiobella.com", site: "www.studiobella.com", instagram: "@studiobella", endereco: "Rua das Flores, 123 · São Paulo/SP",
  logo: null, arteFrente: null, arteVerso: null, usarArteFrente: false, usarArteVerso: false,
  layoutF: "classico", layoutV: "logo", fonte: "'DM Serif Display', serif", fonteTexto: "'Montserrat', sans-serif",
  fundo: "#14213d", texto: "#ffffff", acento: "#d4a63c", fundoV: "#d4a63c", textoV: "#14213d",
  tamanho: "90x50", sangria: 0, quantidade: 100, papel: "a4", margem: 8, espaco: 0, marcas: true,
  ajusteF: { ...AJUSTE_ARTE }, ajusteV: { ...AJUSTE_ARTE },
  verso: true, virar: "lado", ajusteX: 0, ajusteY: 0, orientacao: "auto", mesmaCorVerso: false,
});

// Calcula quantos cartões cabem e onde cada um fica (em mm, canto superior esquerdo do cartão com sangria).
export function calcularLayout(cfg) {
  const t = TAMANHOS[cfg.tamanho] || TAMANHOS["90x50"];
  const p = PAPEIS[cfg.papel] || PAPEIS.a4;
  const cw = t.w + 2 * cfg.sangria, ch = t.h + 2 * cfg.sangria;
  const tenta = (W, H) => {
    const cols = Math.max(0, Math.floor((W - 2 * cfg.margem + cfg.espaco) / (cw + cfg.espaco)));
    const rows = Math.max(0, Math.floor((H - 2 * cfg.margem + cfg.espaco) / (ch + cfg.espaco)));
    return { W, H, cols, rows, n: cols * rows };
  };
  const retrato = tenta(p.w, p.h), paisagem = tenta(p.h, p.w);
  const g = cfg.orientacao === "retrato" ? retrato : cfg.orientacao === "paisagem" ? paisagem : (paisagem.n > retrato.n ? paisagem : retrato);
  const gridW = g.cols * cw + (g.cols - 1) * cfg.espaco, gridH = g.rows * ch + (g.rows - 1) * cfg.espaco;
  const x0 = (g.W - gridW) / 2, y0 = (g.H - gridH) / 2;
  const posicoes = [];
  for (let r = 0; r < g.rows; r += 1) for (let c = 0; c < g.cols; c += 1) posicoes.push({ c, r, x: x0 + c * (cw + cfg.espaco), y: y0 + r * (ch + cfg.espaco) });
  const porFolha = g.n;
  const folhas = porFolha ? Math.ceil(cfg.quantidade / porFolha) : 0;
  return { ...g, cw, ch, t, x0, y0, gridW, gridH, posicoes, porFolha, folhas, ultima: porFolha ? cfg.quantidade - (folhas - 1) * porFolha : 0 };
}
