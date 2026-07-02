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
  // Obtém a cor secundária customizada ou define um fallback seguro
  const secondaryColor = customColors.secondary || tema.secondary || "#374151";

  // Extrai o ano da string YYYY-MM-DD (sem usar new Date)
  const ano = selectedDate
    ? parseInt(selectedDate.split("-")[0], 10)
    : new Date().getFullYear();

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

      <div className="flex-1 flex items-center justify-center p-12 relative overflow-visible">
        {estilo.extra && estilo.extra()}
        <div className={estilo.container}>
          {logo && <Logo src={logo} className="h-16 mb-8 z-10" />}

          {capaEstilo === "destaque" && (
            <>
              <span
                className="
                  absolute
                  top-1/2
                  left-1/2
                  -translate-x-1/2
                  -translate-y-1/2
                  flex
                  items-center
                  justify-center
                  font-japanese
                  font-bold
                  opacity-15
                  select-none
                  pointer-events-none
                  z-0
                  whitespace-nowrap
                  overflow-visible
                  leading-none
                "
                style={{
                  color: primaryColor, // Símbolo japonês no fundo usa a cor primária
                  fontSize: "clamp(10rem, 40vh, 14rem)",
                  lineHeight: "1",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {japaneseLetter}
              </span>

              <p
                className="absolute -top-4 left-0 right-0 mx-auto text-sm tracking-[0.3em] uppercase z-10"
                style={{ color: secondaryColor }} // Texto "AGENDA" usa a cor secundária
              >
                AGENDA {ano}
              </p>
            </>
          )}

          <h1
            className={estilo.nomeClasse}
            style={{ color: secondaryColor }} // Título do Nome usa a cor secundária
          >
            {capaNome || "Seu Nome Aqui"}
          </h1>

          {estilo.linhaClasse && (
            <div
              className={estilo.linhaClasse}
              style={{ backgroundColor: primaryColor }}
            />
          )}

          {capaEstilo !== "destaque" && (
            <p className={estilo.subClasse} style={{ color: secondaryColor }}>
              {ano}
            </p>
          )}

          {capaFrase && (
            <p
              className={`${estilo.subClasse} mt-24`}
              style={{ color: secondaryColor }}
            >
              {capaFrase}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
