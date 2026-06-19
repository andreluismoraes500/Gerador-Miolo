// src/components/layouts/CapaLayout.jsx

import Footer from "../Footer";
import Logo from "../Logo";
import Watermark from "../Watermark";
import { TEMAS } from "../../themes";
import { getCapaEstiloById } from "../../config/capaStyles.jsx";
import { getJapaneseInitial } from "../../utils/japaneseInitials";

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

  const japaneseLetter = getJapaneseInitial(capaNome);

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
          {logo && <Logo src={logo} className="h-16 mb-8 z-10" />}

          {capaEstilo === "destaque" && (
            <>
              <span
                className="
    absolute
    inset-0
    flex
    items-center
    justify-center
    font-japanese
    font-bold
    opacity-15
    select-none
    pointer-events-none
    z-0
  "
                style={{
                  color: primaryColor,
                  fontSize: "clamp(10rem, 30vw, 16rem)",
                  lineHeight: 1,
                }}
              >
                {japaneseLetter}
              </span>

              <p className="absolute top-12 text-sm tracking-[0.3em] uppercase text-gray-300">
                AGENDA {ano}
              </p>
            </>
          )}

          <h1 className={estilo.nomeClasse}>{capaNome || "Seu Nome Aqui"}</h1>

          {estilo.linhaClasse && (
            <div
              className={estilo.linhaClasse}
              style={{ backgroundColor: primaryColor }}
            />
          )}

          {capaEstilo !== "destaque" && (
            <p className={estilo.subClasse}>{ano}</p>
          )}

          {capaFrase && (
            <p className={`${estilo.subClasse} mt-24`}>{capaFrase}</p>
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
