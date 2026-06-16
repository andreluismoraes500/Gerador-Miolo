import { FaRegCalendarAlt } from "react-icons/fa";
import { MdOutlineLightbulb } from "react-icons/md";
import Footer from "../Footer";
import { TEMAS } from "../../themes";
import Logo from "../Logo";

export default function SemanalLayout({
  footerName,
  colorTheme = "classico",
  logo,
}) {
  const tema = TEMAS[colorTheme] || TEMAS.classico;
  const todosOsDias = [
    "Segunda-feira",
    "Terça-feira",
    "Quarta-feira",
    "Quinta-feira",
    "Sexta-feira",
    "Sábado",
    "Domingo",
  ];

  return (
    <div className="printable-page bg-white font-sans text-gray-900 flex flex-col justify-between box-border select-none border-0 shadow-none rounded-none">
      <div className="flex flex-col flex-1 min-h-0">
        <div
          className={`border-b-2 ${tema.headerBorder} pb-3 flex items-end justify-between mb-4 w-full shrink-0 print:mb-3`}
        >
          <div className="flex items-center gap-3.5">
            <Logo src={logo} />
            <div className="flex items-center gap-3.5">
              <FaRegCalendarAlt className={`w-5 h-5 ${tema.text} mb-1`} />
              <div className="space-y-0.5">
                <h2
                  className={`text-[15px] font-semibold tracking-widest text-gray-900 uppercase ${tema.headingFont}`}
                >
                  Planejamento Semanal
                </h2>
                <p className="text-[10px] uppercase tracking-wide text-gray-400 font-sans font-semibold">
                  Foco & Visão de Todo o Período
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-3 gap-x-4 gap-y-3 min-h-0">
          {todosOsDias.map((dia) => {
            const isDomingo = dia === "Domingo";
            return (
              <div
                key={dia}
                className={`border border-solid ${tema.border} rounded-sm p-2.5 flex flex-col justify-between min-h-[46mm] ${isDomingo ? tema.bgLight : ""}`}
              >
                <span
                  className={`text-[11px] font-bold uppercase tracking-wider ${tema.headingFont} border-b pb-1 border-gray-100 ${isDomingo ? tema.text : "text-gray-900"}`}
                >
                  {dia}
                </span>
                <div className="flex-1 mt-1.5 flex flex-col justify-evenly">
                  {[...Array(5)].map((_, idx) => (
                    <div
                      key={idx}
                      className="border-b border-dotted border-gray-300 w-full h-4"
                    ></div>
                  ))}
                </div>
              </div>
            );
          })}

          <div
            className={`border border-dashed ${tema.border} rounded-sm p-2.5 flex flex-col justify-between min-h-[46mm] ${tema.bgLight}`}
          >
            <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400 font-sans border-b pb-1 border-gray-200">
              Lembretes
            </span>
            <div className="flex-1 mt-1.5 flex flex-col justify-evenly">
              <div className="border-b border-dashed border-gray-200 w-full h-4"></div>
              <div className="border-b border-dashed border-gray-200 w-full h-4"></div>
              <div className="border-b border-dashed border-gray-200 w-full h-4"></div>
            </div>
          </div>
        </div>

        <div
          className={`mt-4 border border-solid ${tema.border} rounded-sm p-3 shrink-0 ${tema.bgLight} h-[38mm] print:h-[36mm] flex flex-col justify-between`}
        >
          <div className="flex items-center gap-1.5 border-b pb-1 border-gray-200">
            <MdOutlineLightbulb className={`w-3.5 h-3.5 ${tema.text}`} />
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-800 font-sans">
              Prioridades da Semana & Objetivos Principais
            </span>
          </div>
          <div className="flex-1 grid grid-cols-2 gap-x-6 gap-y-1 mt-2">
            {[...Array(4)].map((_, idx) => (
              <div key={idx} className="flex items-center gap-2.5 w-full">
                <div
                  className={`w-3 h-3 border ${tema.border} rounded-sm shrink-0 bg-white`}
                ></div>
                <div className="border-b border-dotted border-gray-300 w-full h-5 mb-0.5"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer name={footerName} />
    </div>
  );
}
