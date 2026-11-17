// Enquadramento da imagem de fundo da página.
import { criarStore } from "./storeSimples";

export const FUNDO_PADRAO = { modo: "cobrir", tamanho: 60, x: 50, y: 50, repetir: false };
export const fundoCfg = criarStore("fundo-cfg", { ...FUNDO_PADRAO });

// background-* para a página (e para a miniatura)
export function estiloFundo(c) {
  const base = { backgroundPosition: `${c.x}% ${c.y}%`, backgroundRepeat: c.repetir ? "repeat" : "no-repeat" };
  if (c.modo === "inteira") return { ...base, backgroundSize: "contain" };
  if (c.modo === "pct") return { ...base, backgroundSize: `${c.tamanho}% auto` };
  return { ...base, backgroundSize: "cover", backgroundRepeat: "no-repeat", backgroundPosition: "center" };
}
