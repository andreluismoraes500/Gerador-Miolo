// src/components/layouts/DoisDiasComercial.jsx
//
// Agenda comercial — 2 dias por página, SEM grade de horário fixa.
// `data` é o primeiro dia do par; o segundo dia é sempre data+1.
// Como não há grade de hora ocupando a página inteira, dois dias cabem
// confortavelmente numa única folha A4 (padrão comum em agendas de
// papelaria vendidas como "2 dias por página").

import Footer from "../Footer";
import Watermark from "../Watermark";
import Logo from "../Logo";
import { TEMAS } from "../../themes";
import DiaComercialBloco from "./DiaComercialBloco";

function addDias(data, n) {
  const d = new Date(data);
  d.setDate(d.getDate() + n);
  return d;
}

export default function DoisDiasComercial({
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
  const diaBBruto = addDias(data, 1);
  // Se o dia seguinte já cair no próximo mês, esta folha fica só com o
  // último dia do mês corrente — o próximo mês sempre começa em folha
  // nova, então a página "quebra" exatamente no último dia do mês.
  const mesmoMes = diaBBruto.getMonth() === data.getMonth();
  const diaB = mesmoMes ? diaBBruto : null;

  const bgColor = customColors.background || "#ffffff";
  const primaryColor = customColors.primary || tema.text || "#000000";
  const secondaryColor = customColors.secondary || tema.border || "#cbd5e1";

  return (
    <div
      className="printable-page font-sans text-gray-900 flex flex-col box-border select-none border-0 shadow-none rounded-none"
      style={{ backgroundColor: bgColor, fontFamily }}
    >
      {watermarkSrc && <Watermark src={watermarkSrc} opacity={watermarkOpacity} />}

      {/* Mini cabeçalho da página com logo (aparece uma única vez) */}
      {logo && (
        <div className="shrink-0 mb-1.5">
          <Logo src={logo} />
        </div>
      )}

      <div className="flex flex-col flex-1 min-h-0 gap-3">
        <DiaComercialBloco
          data={data}
          primaryColor={primaryColor}
          secondaryColor={secondaryColor}
          compact={!!diaB}
          mostrarMiniCalendario={false}
        />

        {/* Último dia do mês sozinho na folha: o mês seguinte só começa na
            próxima página. */}
        {diaB && (
          <DiaComercialBloco
            data={diaB}
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
            compact
            mostrarMiniCalendario={false}
          />
        )}
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
