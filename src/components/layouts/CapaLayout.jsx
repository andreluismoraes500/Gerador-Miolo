// src/components/layouts/CapaLayout.jsx

import Footer from "../Footer";
import Logo from "../Logo";
import Watermark from "../Watermark";
import { TEMAS } from "../../themes";
import { getCapaEstiloById } from "../../config/capaStyles.jsx";

export default function CapaLayout({
  capaNome = "",
  capaEstilo = "classico",
  footerName,
  colorTheme = "classico",
  logo,
  footerType = "default",
  customColors = {},
  fontFamily = "sans-serif",
  watermarkSrc,
  watermarkOpacity,
  selectedDate,
  capaFrase,
}) {
  const tema = TEMAS[colorTheme] || TEMAS.classico;
  const bgColor = customColors.background || "#ffffff";
  const primaryColor = customColors.primary || tema.text || "#000000";

  // Extrai o ano da string YYYY-MM-DD (sem usar new Date)
  const ano = selectedDate
    ? parseInt(selectedDate.split("-")[0], 10)
    : new Date().getFullYear();

  // (Opcional) log para depuração
  // console.log("CapaLayout - selectedDate:", selectedDate, "ano:", ano);

  const estilo = getCapaEstiloById(capaEstilo);

  return (
    <div
      className="printable-page bg-white text-gray-900 flex flex-col justify-between relative overflow-hidden"
      style={{ backgroundColor: bgColor, fontFamily }}
    >
      {watermarkSrc && (
        <Watermark src={watermarkSrc} opacity={watermarkOpacity} />
      )}

      <div className="flex-1 flex items-center justify-center p-12 relative">
        {estilo.extra && estilo.extra()}
        <div className={estilo.container}>
          {logo && <Logo src={logo} className="h-16 mb-8" />}
          <h1 className={estilo.nomeClasse} style={{ color: primaryColor }}>
            {capaNome || "Minha Agenda"}
          </h1>
          {estilo.linhaClasse && (
            <div
              className={estilo.linhaClasse}
              style={{ backgroundColor: primaryColor }}
            />
          )}
          <p className={estilo.subClasse}>{ano}</p>
          {capaFrase && (
            <p className={`${estilo.subClasse} mt-2`}>{capaFrase}</p>
          )}
        </div>
      </div>

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
