// src/components/layouts/CapaLayout.jsx

import Footer from "../Footer";
import Logo from "../Logo";
import Watermark from "../Watermark";
import { TEMAS } from "../../themes";

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
}) {
  const tema = TEMAS[colorTheme] || TEMAS.classico;
  const bgColor = customColors.background || "#ffffff";
  const primaryColor = customColors.primary || tema.text || "#000000";

  // Definição dos estilos
  const estilos = {
    classico: {
      container: "text-center flex flex-col items-center justify-center h-full",
      nome: `font-serif text-5xl tracking-widest uppercase ${tema.headingFont}`,
      sub: "text-sm uppercase tracking-[0.3em] text-gray-500 font-sans",
      linha: "w-24 h-px bg-gray-300 mx-auto my-6",
      extra: "",
    },
    moderno: {
      container: "flex items-center justify-center h-full",
      nome: "font-sans text-7xl font-light tracking-[0.2em] uppercase",
      sub: "text-base font-light tracking-[0.4em] text-gray-400",
      linha: "hidden",
      extra: "",
    },
    caligrafia: {
      container: "text-center flex flex-col items-center justify-center h-full",
      nome: "font-cursive text-6xl italic",
      sub: "text-sm font-serif tracking-widest text-gray-500",
      linha: "w-32 h-0.5 bg-amber-300 mx-auto my-6",
      extra: "",
    },
    minimalista: {
      container: "flex items-start justify-start h-full pl-16 flex-col",
      nome: "font-sans text-5xl font-light tracking-[0.1em]",
      sub: "text-xs uppercase tracking-[0.4em] text-gray-400 mt-4",
      linha: "hidden",
      extra: "",
    },
    vintage: {
      container:
        "text-center flex flex-col items-center justify-center h-full border-4 border-double border-amber-700 p-12",
      nome: "font-serif text-5xl tracking-widest italic",
      sub: "text-sm uppercase tracking-[0.3em] text-amber-800",
      linha: "w-32 h-0.5 bg-amber-700 mx-auto my-6",
      extra: (
        <div className="absolute inset-0 pointer-events-none border-4 border-amber-700/30 rounded-sm" />
      ),
    },
  };

  const estiloAtual = estilos[capaEstilo] || estilos.classico;

  return (
    <div
      className="printable-page bg-white text-gray-900 flex flex-col justify-between relative overflow-hidden"
      style={{ backgroundColor: bgColor, fontFamily }}
    >
      {watermarkSrc && (
        <Watermark src={watermarkSrc} opacity={watermarkOpacity} />
      )}

      <div className="flex-1 flex items-center justify-center p-12 relative">
        {estiloAtual.extra}
        <div className={estiloAtual.container}>
          {logo && <Logo src={logo} className="h-16 mb-8" />}
          <h1 className={estiloAtual.nome} style={{ color: primaryColor }}>
            {capaNome || "Minha Agenda"}
          </h1>
          {estiloAtual.linha && (
            <div
              className={estiloAtual.linha}
              style={{ backgroundColor: primaryColor }}
            />
          )}
          <p className={estiloAtual.sub}>{new Date().getFullYear()}</p>
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
