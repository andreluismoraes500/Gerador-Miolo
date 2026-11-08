import { criarStore } from "./storeSimples";

// Opções globais do talonário (valem para todos os modelos).
export const talonarioExtras = criarStore("talonario-extras", {
  linhasExtras: 0, // linhas para escrever ao final do cartão
  tituloExtras: "Anotações",
  soPautado: false, // mantém só o cabeçalho e preenche com linhas
  linhasPauta: 18,
  escala: 100, // tamanho das letras em %
});

const TAMANHOS = [9.5, 10, 10.5, 11, 11.5, 13, 13.5, 14, 19, 22, 44];

// CSS que amplia as letras do talonário (as classes usam text-[Npx]) e
// esconde o conteúdo no modo "só pautado".
export function cssTalonario() {
  const regras = TAMANHOS.map(
    (n) => `.tal-escala .doc-card [class~="text-[${n}px]"]{font-size:calc(${n}px * var(--tal-escala,1)) !important;}`,
  ).join("\n");
  return `${regras}
.tal-so-pautado .doc-card .relative.z-2 > *:not(:first-child):not(.tal-extras){display:none !important;}
.tal-so-pautado .doc-card .tal-extras{margin-top:6mm;}`;
}
