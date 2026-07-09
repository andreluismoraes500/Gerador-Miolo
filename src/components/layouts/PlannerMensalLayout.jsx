import { useMemo } from "react";
import Footer from "../Footer";
import { TEMAS } from "../../themes";
import Logo from "../Logo";
import { getFeriado, getComemorativa } from "../../utils/agendaUtils";
import Watermark from "../Watermark";
import Background from "../Background";

const NOMES_MESES = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

export default function PlannerMensalLayout({
  ano,
  mes,
  footerName,
  colorTheme = "classico",
  logo,
  footerType = "default",
  customColors = {},
  fontFamily = "sans-serif",
  watermarkSrc,
  watermarkOpacity,
  backgroundSrc,
  backgroundOpacity,
}) {
  const tema = TEMAS[colorTheme] || TEMAS.classico;
  const nomeMes = NOMES_MESES[mes];
  const bgColor = customColors.background || "#ffffff";
  const primaryColor = customColors.primary || tema.text || "#000000";
  const secondaryColor = customColors.secondary || tema.border || "#cbd5e1";

  const diasDoMes = useMemo(() => {
    const primeiroDia = new Date(ano, mes, 1).getDay();
    const totalDias = new Date(ano, mes + 1, 0).getDate();
    const dias = [];
    let diaAtual = 1;
    for (let i = 0; i < 42; i++) {
      if (i < primeiroDia || diaAtual > totalDias) {
        dias.push(null);
      } else {
        dias.push(diaAtual++);
      }
    }
    return dias;
  }, [ano, mes]);

  return (
    <div
      className="printable-page bg-white font-sans text-gray-900 flex flex-col justify-between box-border select-none border-0 shadow-none rounded-none"
      style={{ backgroundColor: bgColor, fontFamily }}
    >
      {backgroundSrc && <Background src={backgroundSrc} opacity={backgroundOpacity} />}
      {watermarkSrc && (
        <Watermark src={watermarkSrc} opacity={watermarkOpacity} />
      )}
      <div className="flex flex-col flex-1 min-h-0">
        <div
          className={`border-b-2 ${tema.headerBorder} pb-4 flex items-end justify-between mb-6`}
          style={{ borderBottomColor: primaryColor }}
        >
          <div className="flex items-center gap-4">
            <Logo src={logo} />
            <div>
              <h2
                className={`text-2xl font-light tracking-widest uppercase ${tema.headingFont}`}
                style={{ color: primaryColor }}
              >
                PLANNER MENSAL
              </h2>
              <p className="text-xl font-medium text-gray-600 mt-1">
                {nomeMes} de {ano}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div
              className={`text-6xl font-light tracking-tighter ${tema.text}`}
              style={{ color: primaryColor }}
            >
              {String(mes + 1).padStart(2, "0")}
            </div>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-7 gap-px bg-gray-200 p-px mb-8">
          {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((dia, idx) => (
            <div
              key={idx}
              className={`bg-white py-2 text-center text-xs font-bold uppercase tracking-widest border-b-2 ${idx === 0 || idx === 6 ? "text-red-500" : ""}`}
              style={{ borderBottomColor: primaryColor }}
            >
              {dia}
            </div>
          ))}
          {diasDoMes.map((dia, idx) => {
            if (!dia) {
              return <div key={idx} className="bg-white h-20" />;
            }
            const data = new Date(ano, mes, dia);
            const feriado = getFeriado(data);
            const comemorativa = getComemorativa(data);
            return (
              <div
                key={idx}
                className={`bg-white h-20 p-1 border border-transparent hover:border-gray-200 flex flex-col relative ${feriado || comemorativa ? "bg-amber-50" : ""}`}
              >
                <div className="flex justify-between items-start">
                  <span
                    className={`text-lg font-semibold ${feriado ? "text-red-600" : ""}`}
                  >
                    {dia}
                  </span>
                  {(feriado || comemorativa) && (
                    <span className="text-[10px] text-amber-600 font-medium leading-tight text-right max-w-15 wrap-break-word">
                      {feriado?.nome || comemorativa}
                    </span>
                  )}
                </div>
                <div className="flex-1 mt-1 border-t border-dotted border-gray-300" />
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div
            className={`border border-solid ${tema.border} rounded p-4 ${tema.bgLight}`}
            style={{ borderColor: secondaryColor }}
          >
            <h3
              className={`font-bold uppercase tracking-widest text-sm mb-4 flex items-center gap-2 ${tema.text}`}
              style={{ color: primaryColor }}
            >
              🎯 METAS DO MÊS
            </h3>
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 mb-3">
                <div
                  className={`w-5 h-5 border-2 ${tema.border} rounded-full shrink-0`}
                  style={{ borderColor: secondaryColor }}
                />
                <div className="flex-1 h-6 border-b border-dotted border-gray-400" />
              </div>
            ))}
          </div>
          <div
            className={`border border-solid ${tema.border} rounded p-4 ${tema.bgLight}`}
            style={{ borderColor: secondaryColor }}
          >
            <h3
              className={`font-bold uppercase tracking-widest text-sm mb-4 flex items-center gap-2 ${tema.text}`}
              style={{ color: primaryColor }}
            >
              📝 NOTAS & REFLEXÕES
            </h3>
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="border-b border-dotted border-gray-300 h-7 mb-2"
              />
            ))}
          </div>
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
