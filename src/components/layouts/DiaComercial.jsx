// src/components/layouts/DiaComercial.jsx
//
// Agenda comercial — 1 dia por página, SEM grade de horário fixa.
// Apenas linhas em branco preenchendo a página inteira (sem cabeçalho de
// coluna, sem numeração, sem colunas de pagamento).

import Footer from "../Footer";
import Watermark from "../Watermark";
import { TEMAS } from "../../themes";
import DiaComercialBloco from "./DiaComercialBloco";

export default function DiaComercial({
  data,
  footerName,
  colorTheme = "classico",
  logo,
  footerType = "default",
  customColors = {},
  fontFamily = "sans-serif",
  watermarkSrc,
  watermarkOpacity,
}) {
  const tema = TEMAS[colorTheme] || TEMAS.classico;

  const bgColor = customColors.background || "#ffffff";
  const primaryColor = customColors.primary || tema.text || "#000000";
  const secondaryColor = customColors.secondary || tema.border || "#cbd5e1";

  return (
    <div
      className="printable-page font-sans text-gray-900 flex flex-col justify-between box-border select-none border-0 shadow-none rounded-none"
      style={{ backgroundColor: bgColor, fontFamily }}
    >
      {watermarkSrc && <Watermark src={watermarkSrc} opacity={watermarkOpacity} />}

      <DiaComercialBloco
        data={data}
        primaryColor={primaryColor}
        secondaryColor={secondaryColor}
        logo={logo}
        compact={false}
        posicaoMiniCalendario="direita"
      />

      <Footer
        name={footerName}
        type={footerType}
        colorTheme={colorTheme}
        customColors={customColors}
        fontFamily={fontFamily}
      />
    </div>
  );
}
