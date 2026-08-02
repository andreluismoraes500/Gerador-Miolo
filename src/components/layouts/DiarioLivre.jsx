// src/components/layouts/DiarioLivre.jsx

import { FaCalendarDays } from "react-icons/fa6";
import { MdStarBorder, MdPushPin } from "react-icons/md";
import {
  getFeriado,
  getComemorativa,
  gerarHorarios,
} from "../../utils/agendaUtils";
import Footer from "../Footer";
import { TEMAS } from "../../themes";
import Logo from "../Logo";
import Watermark from "../Watermark";
import Background from "../Background";
import EditableField from "../EditableField";
import { useAgendaConfig } from "../../context/AgendaConfigContext";

const HORARIOS = gerarHorarios();
const LINHAS_NOTAS = 5;

export default function DiarioLivre({
  data,
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
  footerHidden = false,
}) {
  const { horaColor, colunaHora, colunaCliente, colunaServico } =
    useAgendaConfig();

  const feriado = getFeriado(data);
  const comemorativa = getComemorativa(data);
  const tema = TEMAS[colorTheme] || TEMAS.classico;

  const bgColor = customColors.background || "#ffffff";
  const primaryColor = customColors.primary || tema.text || "#000000";
  const secondary = customColors.secondary || tema.border || "#cbd5e1";
  const numeroDiaColor = customColors.numeroDia || "#000000"; // <-- NOVO

  const diaKey = data.toISOString().split("T")[0];

  return (
    <div
      className="printable-page font-sans text-gray-900 flex flex-col justify-between box-border select-none border-0 shadow-none rounded-none"
      style={{ backgroundColor: bgColor, fontFamily }}
    >
      {backgroundSrc && (
        <Background src={backgroundSrc} opacity={backgroundOpacity} />
      )}
      {watermarkSrc && (
        <Watermark src={watermarkSrc} opacity={watermarkOpacity} />
      )}

      <div className="flex flex-col flex-1 min-h-0">
        {/* Cabeçalho */}
        <div
          className="border-b-2 pb-3 flex items-end justify-between mb-4 w-full shrink-0 print:mb-2"
          style={{ borderBottomColor: primaryColor }}
        >
          <div className="flex items-center gap-3.5">
            <Logo src={logo} />
            <div className="flex items-center gap-3.5">
              <FaCalendarDays
                className="w-5 h-5 mb-1"
                style={{ color: primaryColor }}
              />
              <div className="space-y-0.5">
                <h2 className="capitalize" style={{ color: primaryColor }}>
                  {data.toLocaleDateString("pt-BR", { weekday: "long" })}
                </h2>
                <p className="text-[11px] uppercase tracking-wide text-gray-400 font-semibold">
                  {data.toLocaleDateString("pt-BR", {
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-baseline gap-4 text-right">
            <div className="flex flex-col justify-end text-[9px] uppercase tracking-wider font-semibold text-gray-400 space-y-1 mb-1">
              {feriado && (
                <span className="text-black border border-black px-1.5 py-0.5 rounded-sm flex items-center gap-1 bg-gray-50">
                  <MdStarBorder className="w-3 h-3 text-amber-500" />
                  {feriado.nome}
                </span>
              )}
              {comemorativa && !feriado && (
                <span className="italic font-medium flex items-center justify-end gap-1 text-gray-500">
                  <MdPushPin className="w-2.5 h-2.5 text-gray-400" />
                  {comemorativa}
                </span>
              )}
            </div>
            <span
              className="text-5xl font-extralight tracking-tighter font-serif leading-none min-w-[2.8rem]"
              style={{ color: numeroDiaColor }} // <-- ALTERADO: usa cor personalizada
            >
              {String(data.getDate()).padStart(2, "0")}
            </span>
          </div>
        </div>

        {/* Tabela de horários */}
        <div className="flex-1 overflow-hidden min-h-0">
          <table className="w-full table-fixed text-[11.5px] border-collapse">
            <thead>
              <tr
                className="border-b-2 text-gray-500 text-[8.5px] uppercase tracking-widest text-left font-bold"
                style={{ borderBottomColor: primaryColor }}
              >
                <th
                  className="w-[14%] pb-2 text-black border-r pr-1"
                  style={{ borderRightColor: secondary }}
                >
                  {colunaHora}
                </th>
                <th
                  className="w-[55%] pb-2 text-black border-r px-2"
                  style={{ borderRightColor: secondary }}
                >
                  {colunaCliente} {/* Compromisso / Tarefa */}
                </th>
                <th className="w-[31%] pb-2 text-black px-2">
                  {colunaServico} {/* Observações */}
                </th>
              </tr>
            </thead>
            <tbody>
              {HORARIOS.map((hora) => (
                <tr
                  key={hora}
                  className="border-b-[1.5px] border-solid h-[1.94rem] print:h-[1.94rem]"
                  style={{ borderBottomColor: secondary }}
                >
                  <td
                    className="font-mono font-bold text-[12px] align-middle border-r pr-1"
                    style={{ borderRightColor: secondary, color: horaColor }}
                  >
                    {hora}
                  </td>
                  <td
                    className="border-r align-middle px-2"
                    style={{ borderRightColor: secondary }}
                  >
                    <EditableField
                      fieldKey={`${diaKey}-${hora}-compromisso`}
                      className="w-full"
                      placeholder=""
                    />
                  </td>
                  <td className="align-middle px-2">
                    <EditableField
                      fieldKey={`${diaKey}-${hora}-obs`}
                      className="w-full"
                      placeholder=""
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Notas do Dia */}
        <div className="mt-4 shrink-0 print:mt-2">
          <p
            className="text-[8.5px] uppercase tracking-widest font-bold mb-1.5"
            style={{ color: primaryColor }}
          >
            Notas do Dia
          </p>
          <div className="border-t" style={{ borderColor: secondary }}>
            {Array.from({ length: LINHAS_NOTAS }).map((_, i) => (
              <div
                key={i}
                className="border-b h-6 print:h-6"
                style={{ borderColor: secondary }}
              >
                <EditableField
                  fieldKey={`${diaKey}-nota-${i}`}
                  className="w-full h-full px-1 text-[11px]"
                  placeholder=""
                />
              </div>
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
        hidden={footerHidden}
      />
    </div>
  );
}