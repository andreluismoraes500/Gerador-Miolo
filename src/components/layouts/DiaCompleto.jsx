// src/components/layouts/DiaCompleto.jsx
import { FaPix, FaCalendarDays } from "react-icons/fa6";
import { GiMoneyStack } from "react-icons/gi";
import { CiCreditCard2 } from "react-icons/ci";
import { MdStarBorder, MdPushPin } from "react-icons/md";
import {
  getFeriado,
  getComemorativa,
  gerarHorarios,
} from "../../utils/agendaUtils";
import Footer from "../Footer";
import { TEMAS } from "../../themes";

export default function DiaCompleto({
  data,
  footerName,
  colorTheme = "classico",
}) {
  const feriado = getFeriado(data);
  const comemorativa = getComemorativa(data);
  const horarios = gerarHorarios();
  const tema = TEMAS[colorTheme] || TEMAS.classico;

  return (
    <div className="printable-page bg-white font-sans text-gray-900 flex flex-col justify-between box-border select-none border-0 shadow-none rounded-none">
      <div className="flex flex-col flex-1 min-h-0">
        {/* Cabeçalho */}
        <div
          className={`border-b-2 ${tema.headerBorder} pb-3 flex items-end justify-between mb-4 w-full shrink-0 print:mb-2`}
        >
          <div className="flex items-center gap-3.5">
            <FaCalendarDays className={`w-5 h-5 ${tema.text} mb-1`} />
            <div className="space-y-0.5">
              <h2
                className={`text-[14px] font-semibold tracking-widest text-gray-900 uppercase ${tema.headingFont}`}
              >
                {data.toLocaleDateString("pt-BR", { weekday: "long" })}
              </h2>
              <p className="text-[11px] uppercase tracking-wide text-gray-400 font-sans font-semibold">
                {data.toLocaleDateString("pt-BR", {
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>

          <div className="flex items-baseline gap-4 text-right">
            <div className="flex flex-col justify-end text-[9px] uppercase tracking-wider font-semibold text-gray-400 space-y-1 mb-1">
              {feriado && (
                <span className="text-black border border-black px-1.5 py-0.5 rounded-sm flex items-center gap-1 bg-gray-50">
                  <MdStarBorder className="w-3 h-3 text-amber-500" />{" "}
                  {feriado.nome}
                </span>
              )}
              {comemorativa && !feriado && (
                <span
                  className={`italic font-medium flex items-center justify-end gap-1 text-gray-500 ${tema.bodyFont}`}
                >
                  <MdPushPin className="w-2.5 h-2.5 text-gray-400" />{" "}
                  {comemorativa}
                </span>
              )}
            </div>
            <span className="text-5xl font-extralight tracking-tighter font-serif text-black leading-none min-w-11.25">
              {String(data.getDate()).padStart(2, "0")}
            </span>
          </div>
        </div>

        {/* Tabela */}
        <div className="flex-1 overflow-auto min-h-0">
          <table className="w-full table-fixed text-[11.5px] border-collapse">
            <thead>
              <tr
                className={`border-b-2 ${tema.headerBorder} text-gray-500 text-[8.5px] uppercase tracking-widest text-left font-bold`}
              >
                <th
                  className={`w-[12%] pb-2 text-black border-r ${tema.border} pr-1`}
                >
                  Hora
                </th>
                <th
                  className={`w-[34%] pb-2 text-black border-r ${tema.border} px-2`}
                >
                  Cliente / Compromisso
                </th>
                <th
                  className={`w-[30%] pb-2 text-black border-r ${tema.border} px-2`}
                >
                  Serviço / Procedimento
                </th>
                <th
                  className={`w-[8%] pb-2 text-center border-r ${tema.border} font-normal`}
                >
                  <div className="flex flex-col items-center justify-center">
                    <GiMoneyStack className={`w-4 h-4 ${tema.text} mb-0.5`} />
                    <span className="text-[7px] text-gray-500 font-bold tracking-tight">
                      DINHEIRO
                    </span>
                  </div>
                </th>
                <th
                  className={`w-[8%] pb-2 text-center border-r ${tema.border} font-normal`}
                >
                  <div className="flex flex-col items-center justify-center">
                    <CiCreditCard2
                      className={`w-4 h-4 ${tema.text} font-bold mb-0.5`}
                    />
                    <span className="text-[7px] text-gray-500 font-bold tracking-tight">
                      CARTÃO
                    </span>
                  </div>
                </th>
                <th className="w-[8%] pb-2 text-center font-normal">
                  <div className="flex flex-col items-center justify-center">
                    <FaPix className={`w-3.5 h-3.5 ${tema.text} mb-0.5`} />
                    <span className="text-[7px] text-gray-500 font-bold tracking-tight">
                      PIX
                    </span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {horarios.map((hora) => (
                <tr
                  key={hora}
                  className={`border-b-[1.5px] border-solid ${tema.border} h-7.75 print:h-7.75`}
                >
                  <td
                    className={`font-mono text-black font-bold text-[12px] align-middle border-r ${tema.border} pr-1`}
                  >
                    {hora}
                  </td>
                  <td
                    className={`border-r ${tema.border} align-middle px-2`}
                  ></td>
                  <td
                    className={`border-r ${tema.border} align-middle px-2`}
                  ></td>
                  <td
                    className={`text-center align-middle border-r ${tema.border}`}
                  >
                    <div
                      className={`w-3.5 h-3.5 border ${tema.border} rounded-sm mx-auto bg-transparent`}
                    ></div>
                  </td>
                  <td
                    className={`text-center align-middle border-r ${tema.border}`}
                  >
                    <div
                      className={`w-3.5 h-3.5 border ${tema.border} rounded-sm mx-auto bg-transparent`}
                    ></div>
                  </td>
                  <td className="text-center align-middle">
                    <div
                      className={`w-3.5 h-3.5 border ${tema.border} rounded-sm mx-auto bg-transparent`}
                    ></div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Footer name={footerName} />
    </div>
  );
}
