// src/components/layouts/DiaCompleto.jsx

import { FaPix, FaCalendarDays } from "react-icons/fa6";
import { GiMoneyStack } from "react-icons/gi";
import { CiCreditCard2 } from "react-icons/ci";
import { MdStarBorder, MdPushPin } from "react-icons/md";
import {
  getFeriado,
  getComemorativa,
  gerarHorarios,
  somarMinutos,
} from "../../utils/agendaUtils";
import Footer from "../Footer";
import { TEMAS } from "../../themes";
import Logo from "../Logo";
import { getBusinessProfile } from "../../config/businessProfiles";
import Watermark from "../Watermark";
import Background from "../Background";
import { useBusinessProfileContext } from "../../context/BusinessProfileContext";
import EditableField from "../EditableField";

export default function DiaCompleto({
  data,
  footerName,
  colorTheme = "classico",
  businessType = "default",
  logo,
  footerType = "default",
  customColors = {},
  fontFamily = "sans-serif",
  watermarkSrc,
  watermarkOpacity,
  backgroundSrc,
  backgroundOpacity,
  // Receber o perfil via props (do contexto ou diretamente)
  businessProfile: propBusinessProfile,
}) {
  const feriado = getFeriado(data);
  const comemorativa = getComemorativa(data);
  const tema = TEMAS[colorTheme] || TEMAS.classico;

  // Tenta usar o contexto primeiro, depois fallback para props
  let contextProfile = null;
  try {
    const context = useBusinessProfileContext();
    contextProfile = context?.profile;
  } catch (e) {
    // Contexto não disponível, usar props
  }

  const perfil = propBusinessProfile ||
    contextProfile ||
    getBusinessProfile(businessType) || {
      campos: { cliente: "Cliente", servico: "Serviço" },
    };

  const bgColor = customColors.background || "#ffffff";
  const primaryColor = customColors.primary || tema.text || "#000000";
  const secondaryColor = customColors.secondary || tema.border || "#cbd5e1";

  // Grade de horário do perfil (ex.: Personal Trainer 06:00–22:00, Psicólogo
  // sessões de 50min) — antes era sempre fixa em 07:00–20:00/30min,
  // ignorando esses valores em src/config/*.js.
  const horarioCfg = perfil.horario || {};
  const HORARIOS = gerarHorarios(horarioCfg.inicio, horarioCfg.fim, horarioCfg.intervalo);
  const mostrarHoraFim = perfil.layout?.mostrarHoraFim === true;

  // Altura de linha calculada a partir da quantidade de horários, em vez de
  // um valor fixo — perfis com mais horários (ex.: Personal Trainer, 33
  // linhas) não estouram mais a página, e perfis com menos (ex.: Advogado,
  // 21 linhas) preenchem o espaço direito, sem forçar duas páginas.
  const TABLE_BUDGET_MM = 205;
  const rowHeightMm = Math.min(7.75, TABLE_BUDGET_MM / HORARIOS.length);

  // Obter labels dos campos
  const clienteLabel = perfil.campos?.cliente || "Cliente";
  const servicoLabel = perfil.campos?.servico || "Serviço";
  const extraLabel = perfil.campos?.extra || "Observações";

  return (
    <div
      className="printable-page font-sans text-gray-900 flex flex-col justify-between box-border select-none border-0 shadow-none rounded-none"
      style={{ backgroundColor: bgColor, fontFamily }}
    >
      {backgroundSrc && <Background src={backgroundSrc} opacity={backgroundOpacity} />}
      {watermarkSrc && (
        <Watermark src={watermarkSrc} opacity={watermarkOpacity} />
      )}
      <div className="flex flex-col flex-1 min-h-0">
        {/* Cabeçalho */}
        <div
          className={`border-b-2 ${tema.headerBorder} pb-3 flex items-end justify-between mb-4 w-full shrink-0 print:mb-2`}
          style={{ borderBottomColor: primaryColor }}
        >
          <div className="flex items-center gap-3.5">
            <Logo src={logo} />
            <div className="flex items-center gap-3.5">
              <FaCalendarDays
                className={`w-5 h-5 mb-1`}
                style={{ color: primaryColor }}
              />
              <div className="space-y-0.5">
                <div>
                  {perfil.nome && (
                    <span className={`text-xs`} style={{ color: primaryColor }}>
                      {perfil.icon} {perfil.nome}
                    </span>
                  )}
                  <h2 style={{ color: primaryColor }}>
                    {data.toLocaleDateString("pt-BR", {
                      weekday: "long",
                    })}
                  </h2>
                </div>
                <p className="text-[11px] uppercase tracking-wide text-gray-400 font-sans font-semibold">
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
                <span className="text-black border border-black px-1.5 py-0.5 rounded-sm flex items-center gap-1 bg-gray-50 max-w-[46mm] whitespace-nowrap overflow-hidden text-ellipsis">
                  <MdStarBorder className="w-3 h-3 text-amber-500 shrink-0" />{" "}
                  <span className="overflow-hidden text-ellipsis">{feriado.nome}</span>
                </span>
              )}
              {comemorativa && !feriado && (
                <span
                  className={`italic font-medium flex items-center justify-end gap-1 text-gray-500 max-w-[46mm] whitespace-nowrap overflow-hidden text-ellipsis ${tema.bodyFont}`}
                >
                  <MdPushPin className="w-2.5 h-2.5 text-gray-400 shrink-0" />{" "}
                  <span className="overflow-hidden text-ellipsis">{comemorativa}</span>
                </span>
              )}
            </div>
            <span className="text-5xl font-extralight tracking-tighter font-serif text-black leading-none min-w-11.25">
              {String(data.getDate()).padStart(2, "0")}
            </span>
          </div>
        </div>

        {/* Tabela */}
        <div className="flex-1 overflow-hidden min-h-0">
          <table className="w-full table-fixed text-[11.5px] border-collapse">
            <thead>
              <tr
                className={`border-b-2 ${tema.headerBorder} text-gray-500 text-[8.5px] uppercase tracking-widest text-left font-bold`}
                style={{ borderBottomColor: primaryColor }}
              >
                <th
                  className={`${mostrarHoraFim ? "w-[9%]" : "w-[12%]"} pb-2 text-black border-r ${tema.border} pr-1`}
                  style={{ borderRightColor: secondaryColor }}
                >
                  Hora
                </th>
                {mostrarHoraFim && (
                  <th
                    className={`w-[9%] pb-2 text-black border-r ${tema.border} pr-1`}
                    style={{ borderRightColor: secondaryColor }}
                  >
                    Até
                  </th>
                )}
                <th
                  className={`${mostrarHoraFim ? "w-[31%]" : "w-[34%]"} pb-2 text-black border-r ${tema.border} px-2`}
                  style={{ borderRightColor: secondaryColor }}
                >
                  {clienteLabel}
                </th>
                <th
                  className={`${mostrarHoraFim ? "w-[27%]" : "w-[30%]"} pb-2 text-black border-r ${tema.border} px-2`}
                  style={{ borderRightColor: secondaryColor }}
                >
                  {servicoLabel}
                </th>
                <th
                  className={`w-[8%] pb-2 text-center border-r ${tema.border} font-normal`}
                  style={{ borderRightColor: secondaryColor }}
                >
                  <div className="flex flex-col items-center justify-center">
                    <GiMoneyStack
                      className={`w-4 h-4 mb-0.5`}
                      style={{ color: primaryColor }}
                    />
                    <span className="text-[7px] text-gray-500 font-bold tracking-tight">
                      DINHEIRO
                    </span>
                  </div>
                </th>
                <th
                  className={`w-[8%] pb-2 text-center border-r ${tema.border} font-normal`}
                  style={{ borderRightColor: secondaryColor }}
                >
                  <div className="flex flex-col items-center justify-center">
                    <CiCreditCard2
                      className={`w-4 h-4 font-bold mb-0.5`}
                      style={{ color: primaryColor }}
                    />
                    <span className="text-[7px] text-gray-500 font-bold tracking-tight">
                      CARTÃO
                    </span>
                  </div>
                </th>
                <th className="w-[8%] pb-2 text-center font-normal">
                  <div className="flex flex-col items-center justify-center">
                    <FaPix
                      className={`w-3.5 h-3.5 mb-0.5`}
                      style={{ color: primaryColor }}
                    />
                    <span className="text-[7px] text-gray-500 font-bold tracking-tight">
                      PIX
                    </span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {HORARIOS.map((hora) => (
                <tr
                  key={hora}
                  className={`border-b-[1.5px] border-solid ${tema.border}`}
                  style={{ borderBottomColor: secondaryColor, height: `${rowHeightMm}mm` }}
                >
                  <td
                    className={`font-mono text-black font-bold text-[11px] align-middle border-r ${tema.border} pr-1`}
                    style={{ borderRightColor: secondaryColor }}
                  >
                    {hora}
                  </td>
                  {mostrarHoraFim && (
                    <td
                      className={`font-mono text-gray-500 text-[10px] align-middle border-r ${tema.border} pr-1`}
                      style={{ borderRightColor: secondaryColor }}
                    >
                      {somarMinutos(hora, horarioCfg.intervalo || 30)}
                    </td>
                  )}
                  <td
                    className={`border-r ${tema.border} align-middle px-2 overflow-hidden`}
                    style={{ borderRightColor: secondaryColor }}
                  >
                    <EditableField
                      fieldKey={`${data.toISOString().split("T")[0]}-${hora}-cliente`}
                      className="w-full border-gray-300 text-sm"
                      placeholder={``}
                    />
                  </td>
                  <td
                    className={`border-r ${tema.border} align-middle px-2 overflow-hidden`}
                    style={{ borderRightColor: secondaryColor }}
                  >
                    <EditableField
                      fieldKey={`${data.toISOString().split("T")[0]}-${hora}-servico`}
                      className="w-full border-gray-300 text-sm"
                      placeholder={``}
                    />
                  </td>
                  <td
                    className={`text-center align-middle border-r ${tema.border}`}
                    style={{ borderRightColor: secondaryColor }}
                  >
                    <div
                      className={`w-3.5 h-3.5 border ${tema.border} rounded-sm mx-auto bg-transparent`}
                      style={{ borderColor: secondaryColor }}
                    ></div>
                  </td>
                  <td
                    className={`text-center align-middle border-r ${tema.border}`}
                    style={{ borderRightColor: secondaryColor }}
                  >
                    <div
                      className={`w-3.5 h-3.5 border ${tema.border} rounded-sm mx-auto bg-transparent`}
                      style={{ borderColor: secondaryColor }}
                    ></div>
                  </td>
                  <td className="text-center align-middle">
                    <div
                      className={`w-3.5 h-3.5 border ${tema.border} rounded-sm mx-auto bg-transparent`}
                      style={{ borderColor: secondaryColor }}
                    ></div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
