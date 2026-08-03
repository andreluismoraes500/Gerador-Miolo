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
import { useAgendaConfig } from "../../context/AgendaConfigContext";

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
  businessProfile: propBusinessProfile,
  footerHidden = false,
}) {
  const feriado = getFeriado(data);
  const comemorativa = getComemorativa(data);
  const tema = TEMAS[colorTheme] || TEMAS.classico;

  let contextProfile = null;
  try {
    const context = useBusinessProfileContext();
    contextProfile = context?.profile;
  } catch (e) {}

  const perfil = propBusinessProfile ||
    contextProfile ||
    getBusinessProfile(businessType) || {
      campos: { cliente: "Cliente", servico: "Serviço" },
    };

  const bgColor = customColors.background || "#ffffff";
  const primaryColor = customColors.primary || tema.text || "#000000";
  const secondaryColor = customColors.secondary || tema.border || "#cbd5e1";
  const numeroDiaColor = customColors.numeroDia || "#000000";
  const mesColor = customColors.mes || "#9ca3af";
  const diaSemanaColor = customColors.diaSemana || primaryColor;
  const diaKey = data.toISOString().split("T")[0];

  // Obtém a cor dos horários do contexto (aplicada também aos textos da tabela)
  const {
    horaColor,
    colunaHora,
    colunaCliente,
    colunaServico,
    colunaValor,
    colunaStatus,
  } = useAgendaConfig();

  const horarioCfg = perfil.horario || {};
  const HORARIOS = gerarHorarios(
    horarioCfg.inicio,
    horarioCfg.fim,
    horarioCfg.intervalo,
  );
  const mostrarHoraFim = perfil.layout?.mostrarHoraFim === true;

  const TABLE_BUDGET_MM = 205;
  const rowHeightMm = Math.min(7.75, TABLE_BUDGET_MM / HORARIOS.length);

  const clienteLabel = perfil.campos?.cliente || "Cliente";
  const servicoLabel = perfil.campos?.servico || "Serviço";
  const extraLabel = perfil.campos?.extra || "Observações";

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
                  <h2 style={{ color: diaSemanaColor }}>
                    {data.toLocaleDateString("pt-BR", {
                      weekday: "long",
                    })}
                  </h2>
                </div>
                <p
                  className="text-[11px] uppercase tracking-wide font-sans font-semibold"
                  style={{ color: mesColor }}
                >
                  {data.toLocaleDateString("pt-BR", {
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-4 text-right">
            <div className="flex flex-col items-end justify-start text-[9px] uppercase tracking-wider font-semibold text-gray-400 space-y-1 mb-1 max-w-[46mm]">
              {feriado && (
                <span className="text-black border border-black px-1.5 py-0.5 rounded-sm flex items-center gap-1 bg-gray-50 whitespace-normal leading-tight text-right">
                  <MdStarBorder className="w-3 h-3 text-amber-500 shrink-0" />{" "}
                  <span>{feriado.nome}</span>
                </span>
              )}
              {comemorativa && !feriado && (
                <span
                  className={`italic font-medium flex items-center justify-end gap-1 text-gray-500 whitespace-normal leading-tight text-right ${tema.bodyFont}`}
                >
                  <MdPushPin className="w-2.5 h-2.5 text-gray-400 shrink-0" />{" "}
                  <span>{comemorativa}</span>
                </span>
              )}
            </div>
            <span
              className="text-5xl font-extralight tracking-tighter font-serif leading-none min-w-11.25"
              style={{ color: numeroDiaColor }}
            >
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
                  style={{
                    borderRightColor: secondaryColor,
                    color: horaColor, // aplica a cor dos horários ao cabeçalho
                  }}
                >
                  {colunaHora}
                </th>
                {mostrarHoraFim && (
                  <th
                    className={`w-[9%] pb-2 text-black border-r ${tema.border} pr-1`}
                    style={{
                      borderRightColor: secondaryColor,
                      color: horaColor,
                    }}
                  >
                    Até
                  </th>
                )}
                <th
                  className={`${mostrarHoraFim ? "w-[28%]" : "w-[30%]"} pb-2 text-black border-r ${tema.border} px-2`}
                  style={{
                    borderRightColor: secondaryColor,
                    color: horaColor,
                  }}
                >
                  {colunaCliente}
                </th>
                <th
                  className={`${mostrarHoraFim ? "w-[23%]" : "w-[25%]"} pb-2 text-black border-r ${tema.border} px-2`}
                  style={{
                    borderRightColor: secondaryColor,
                    color: horaColor,
                  }}
                >
                  {colunaServico}
                </th>
                <th
                  className={`w-[10%] pb-2 text-black border-r ${tema.border} text-center`}
                  style={{
                    borderRightColor: secondaryColor,
                    color: horaColor,
                  }}
                >
                  <span className="text-[7px] font-bold tracking-tight uppercase">
                    {colunaValor}
                  </span>
                </th>
                <th
                  className={`w-[8%] pb-2 text-center border-r ${tema.border} font-normal`}
                  style={{
                    borderRightColor: secondaryColor,
                    color: horaColor,
                  }}
                >
                  <div className="flex flex-col items-center justify-center">
                    <GiMoneyStack
                      className={`w-4 h-4 mb-0.5`}
                      style={{ color: primaryColor }}
                    />
                    <span className="text-[7px] font-bold tracking-tight">
                      DINHEIRO
                    </span>
                  </div>
                </th>
                <th
                  className={`w-[8%] pb-2 text-center border-r ${tema.border} font-normal`}
                  style={{
                    borderRightColor: secondaryColor,
                    color: horaColor,
                  }}
                >
                  <div className="flex flex-col items-center justify-center">
                    <CiCreditCard2
                      className={`w-4 h-4 font-bold mb-0.5`}
                      style={{ color: primaryColor }}
                    />
                    <span className="text-[7px] font-bold tracking-tight">
                      CARTÃO
                    </span>
                  </div>
                </th>
                <th
                  className="w-[8%] pb-2 text-center font-normal"
                  style={{ color: horaColor }}
                >
                  <div className="flex flex-col items-center justify-center">
                    <FaPix
                      className={`w-3.5 h-3.5 mb-0.5`}
                      style={{ color: primaryColor }}
                    />
                    <span className="text-[7px] font-bold tracking-tight">
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
                  style={{
                    borderBottomColor: secondaryColor,
                    height: `${rowHeightMm}mm`,
                  }}
                >
                  <td
                    className={`font-mono text-black font-bold text-[11px] align-middle border-r ${tema.border} pr-1`}
                    style={{
                      borderRightColor: secondaryColor,
                      color: horaColor,
                    }}
                  >
                    {hora}
                  </td>
                  {mostrarHoraFim && (
                    <td
                      className={`font-mono text-gray-500 text-[10px] align-middle border-r ${tema.border} pr-1`}
                      style={{
                        borderRightColor: secondaryColor,
                        color: horaColor,
                      }}
                    >
                      {somarMinutos(hora, horarioCfg.intervalo || 30)}
                    </td>
                  )}
                  <td
                    className={`border-r ${tema.border} align-middle px-2 overflow-hidden`}
                    style={{ borderRightColor: secondaryColor }}
                  >
                    <EditableField
                      fieldKey={`${diaKey}-${hora}-cliente`}
                      className="w-full border-gray-300 text-sm"
                      style={{ color: horaColor }} // aplica a cor ao texto do campo
                      placeholder=""
                    />
                  </td>
                  <td
                    className={`border-r ${tema.border} align-middle px-2 overflow-hidden`}
                    style={{ borderRightColor: secondaryColor }}
                  >
                    <EditableField
                      fieldKey={`${diaKey}-${hora}-servico`}
                      className="w-full border-gray-300 text-sm"
                      style={{ color: horaColor }}
                      placeholder=""
                    />
                  </td>
                  <td
                    className={`border-r ${tema.border} align-middle px-1`}
                    style={{ borderRightColor: secondaryColor }}
                  >
                    <EditableField
                      fieldKey={`${diaKey}-${hora}-valor`}
                      className="w-full text-sm text-right"
                      style={{ color: horaColor }} // valor com a mesma cor dos horários
                      placeholder=""
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

        {/* Resumo do dia */}
        <div
          className="flex items-center justify-end gap-6 border-t-2 pt-2 mt-2 shrink-0 print:pt-1.5 print:mt-1.5"
          style={{ borderTopColor: primaryColor }}
        >
          <div className="flex items-baseline gap-1.5">
            <span className="text-[8px] uppercase tracking-widest font-bold text-gray-500">
              Total Entrada
            </span>
            <EditableField
              fieldKey={`${diaKey}-total-entrada`}
              className="w-16 text-[11px] text-right border-b"
              style={{ borderColor: secondaryColor, color: horaColor }}
              placeholder=""
            />
          </div>

          <div className="flex items-baseline gap-1.5">
            <span className="text-[8px] uppercase tracking-widest font-bold text-gray-500">
              Total Saída
            </span>
            <EditableField
              fieldKey={`${diaKey}-total-saida`}
              className="w-16 text-[11px] text-right border-b"
              style={{ borderColor: secondaryColor, color: horaColor }}
              placeholder=""
            />
          </div>

          <div className="flex items-baseline gap-1.5">
            <span
              className="text-[8.5px] uppercase tracking-widest font-extrabold"
              style={{ color: primaryColor }}
            >
              Total do Dia
            </span>
            <EditableField
              fieldKey={`${diaKey}-total-dia`}
              className="w-20 text-[13px] text-right font-bold border-b-2"
              style={{ borderColor: primaryColor, color: primaryColor }}
              placeholder=""
            />
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
