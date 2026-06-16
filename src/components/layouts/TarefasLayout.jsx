import {
  MdOutlineCheckCircleOutline,
  MdOutlineStarBorder,
  MdFactCheck,
} from "react-icons/md";
import Footer from "../Footer";
import { TEMAS } from "../../themes";
import Logo from "../Logo";

export default function TarefasLayout({
  footerName,
  colorTheme = "classico",
  logo,
  footerType = "default",
}) {
  console.log("🟡 TarefasLayout: footerType recebido =", footerType);

  const tema = TEMAS[colorTheme] || TEMAS.classico;
  const diasSemana = ["S", "T", "Q", "Q", "S", "S", "D"];

  return (
    <div className="printable-page bg-white font-sans text-gray-900 flex flex-col justify-between box-border select-none border-0 shadow-none rounded-none">
      <div className="flex flex-col flex-1 min-h-0">
        <div
          className={`border-b-2 ${tema.headerBorder} pb-3 flex items-end justify-between mb-5 w-full shrink-0 print:mb-4`}
        >
          <div className="flex items-center gap-3.5">
            <Logo src={logo} />
            <div className="flex items-center gap-3.5">
              <MdFactCheck className={`w-5 h-5 ${tema.text} mb-1`} />
              <div className="space-y-0.5">
                <h2
                  className={`text-[15px] font-semibold tracking-widest text-gray-900 uppercase ${tema.headingFont}`}
                >
                  Lista de Tarefas
                </h2>
                <p className="text-[10px] uppercase tracking-wide text-gray-400 font-sans font-semibold">
                  Gerenciamento de Ações e Fluxo de Trabalho
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-5 gap-x-5 min-h-0">
          <div className="col-span-3 flex flex-col justify-between h-full">
            <div
              className={`border border-solid ${tema.border} rounded-sm p-4 flex flex-col h-full justify-between`}
            >
              <div className="flex items-center gap-1.5 border-b pb-1.5 border-gray-100 mb-2">
                <MdOutlineCheckCircleOutline
                  className={`w-4 h-4 ${tema.text}`}
                />
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-800 font-sans">
                  Ações para Executar
                </span>
              </div>
              <div className="flex-1 flex flex-col justify-between py-1">
                {[...Array(14)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3 w-full">
                    <div
                      className={`w-3.5 h-3.5 border border-solid ${tema.border} rounded-full shrink-0 bg-transparent`}
                    ></div>
                    <div className="border-b border-dotted border-gray-300 w-full h-5 mb-0.5"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="col-span-2 flex flex-col gap-4 h-full">
            <div
              className={`border border-solid ${tema.border} rounded-sm p-3.5 ${tema.bgLight} shrink-0`}
            >
              <div className="flex items-center gap-1.5 border-b pb-1.5 border-gray-200 mb-3">
                <MdOutlineStarBorder className="w-4 h-4 text-amber-500" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-800 font-sans">
                  Prioridades Críticas
                </span>
              </div>
              <div className="space-y-4 py-1">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center gap-2 w-full">
                    <span
                      className={`text-xs font-bold text-gray-400 ${tema.bodyFont}`}
                    >
                      {i + 1}.
                    </span>
                    <div className="border-b border-solid border-gray-300 w-full h-5"></div>
                  </div>
                ))}
              </div>
            </div>

            <div
              className={`border border-solid ${tema.border} rounded-sm p-4 flex flex-col flex-1 justify-between`}
            >
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 font-sans border-b pb-1 border-gray-100">
                Insights & Anotações
              </span>
              <div className="flex-1 mt-2 flex flex-col justify-between">
                {[...Array(10)].map((_, idx) => (
                  <div
                    key={idx}
                    className="border-b border-dashed border-gray-200 w-full h-5"
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div
          className={`mt-4 border border-solid ${tema.border} rounded-sm p-3.5 shrink-0 ${tema.bgLight} h-[34mm] flex flex-col justify-between`}
        >
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-800 font-sans border-b pb-1 border-gray-200">
            Monitoramento de Rotinas Diárias (Foco Semanal)
          </span>
          <div className="grid grid-cols-2 gap-x-6 mt-2 flex-1 items-center">
            {[...Array(2)].map((_, rowIdx) => (
              <div
                key={rowIdx}
                className="flex items-center justify-between gap-4"
              >
                <div className="border-b border-dotted border-gray-300 flex-1 h-6"></div>
                <div className="flex gap-1.5">
                  {diasSemana.map((dia, diaIdx) => (
                    <div
                      key={diaIdx}
                      className="flex flex-col items-center gap-0.5"
                    >
                      <span className="text-[7px] font-bold font-mono text-gray-400">
                        {dia}
                      </span>
                      <div className="w-3.5 h-3.5 rounded-full border border-gray-300 bg-white flex items-center justify-center"></div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer name={footerName} type={footerType} colorTheme={colorTheme} />
    </div>
  );
}
