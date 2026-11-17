// src/components/Background.jsx
//
// Imagem de fundo da página impressa (atrás de todo o conteúdo). O enquadramento
// (cobrir / caber inteira / tamanho personalizado + posição) vem de fundoCfg.
import { fundoCfg, estiloFundo } from "../lib/fundoCfg";

export default function Background({ src, opacity = 0.12 }) {
  const c = fundoCfg.useStore();
  if (!src) return null;
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{ backgroundImage: `url(${src})`, ...estiloFundo(c), opacity }}
      aria-hidden="true"
    />
  );
}
