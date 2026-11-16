import { criarStore } from "./storeSimples";

// Tamanho global das letras do documento (agenda e talonário), em %.
export const fonteCfg = criarStore("fonte-escala", { escala: 100 });

const PX = [6, 7, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 12.5, 13, 13.5, 14, 15, 19, 22, 44];
const TW = { xs: 0.75, sm: 0.875, base: 1, lg: 1.125, xl: 1.25, "2xl": 1.5, "3xl": 1.875, "4xl": 2.25, "5xl": 3, "6xl": 3.75 };

// CSS que escala o texto das páginas: variáveis de tamanho do Tailwind e as
// classes text-[Npx]. Só vale dentro de .printable-page (a interface não muda).
export function cssFonte(escala, alvo = ".printable-page") {
  const k = escala / 100;
  if (k === 1) return "";
  const vars = Object.entries(TW).map(([n, r]) => `--text-${n}:${(r * k).toFixed(4)}rem;`).join("");
  const regras = PX.map((n) => `${alvo} [class~="text-[${n}px]"]{font-size:${(n * k).toFixed(2)}px !important;}`).join("\n");
  return `${alvo}{${vars}}\n${regras}`;
}
