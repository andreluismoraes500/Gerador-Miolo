import { logoCfg } from "../lib/logoCfg";

// O tamanho vem das configurações (escala + limites em mm), então o logo nunca "estoura" a página.
export default function Logo({ src, alt = "Logo", className = "" }) {
  const { escala, larguraMax, alturaMax } = logoCfg.useStore();
  if (!src) return null;
  return (
    <img
      src={src}
      alt={alt}
      className={`h-8 w-auto object-contain ${className}`}
      style={{ zoom: (Number(escala) || 100) / 100, maxWidth: `${larguraMax}mm`, maxHeight: `${alturaMax}mm` }}
    />
  );
}
