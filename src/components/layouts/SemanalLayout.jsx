import { FaRegCalendarAlt } from "react-icons/fa";
import { MdOutlineLightbulb } from "react-icons/md";
import Footer from "../Footer";

const PALETAS = {
  slate: {
    border: "border-slate-300",
    text: "text-slate-600",
    headerBorder: "border-slate-900",
    bgLight: "bg-slate-50/50",
  },
  zinc: {
    border: "border-zinc-300",
    text: "text-zinc-600",
    headerBorder: "border-zinc-900",
    bgLight: "bg-zinc-50/50",
  },
  blue: {
    border: "border-blue-200",
    text: "text-blue-600",
    headerBorder: "border-blue-700",
    bgLight: "bg-blue-50/30",
  },
  emerald: {
    border: "border-emerald-200",
    text: "text-emerald-600",
    headerBorder: "border-emerald-700",
    bgLight: "bg-emerald-50/30",
  },
  amber: {
    border: "border-amber-200",
    text: "text-amber-600",
    headerBorder: "border-amber-700",
    bgLight: "bg-amber-50/30",
  },
  rose: {
    border: "border-rose-200",
    text: "text-rose-600",
    headerBorder: "border-rose-700",
    bgLight: "bg-rose-50/30",
  },
};

export default function SemanalLayout({ footerName, colorTheme = "slate" }) {
  const tema = PALETAS[colorTheme] || PALETAS.slate;

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
        {/* Cabeçalho Principal */}
        <div
          className={`border-b-2 ${tema.headerBorder} pb-3 flex items-end justify-between mb-4 w-full shrink-0 print:mb-3`}
        >
          <div className="flex items-center gap-3.5">
            <FaRegCalendarAlt className={`w-5 h-5 ${tema.text} mb-1`} />
            <div className="space-y-0.5">
              <h2 className="text-[15px] font-semibold tracking-widest text-gray-900 uppercase font-serif italic">
                Planejamento Semanal
              </h2>
              <p className="text-[10px] uppercase tracking-wide text-gray-400 font-sans font-semibold">
                Foco & Visão de Todo o Período
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[9px] font-mono text-gray-300 font-bold uppercase tracking-wider"></span>
          </div>
        </div>

        {/* Grade Principal de 3 Colunas — Organiza os 7 dias simetricamente */}
        <div className="flex-1 grid grid-cols-3 gap-x-4 gap-y-3 min-h-0">
          {todosOsDias.map((dia) => {
            // Destaca sutilmente o Domingo com o fundo light temático
            const isDomingo = dia === "Domingo";
            return (
              <div
                key={dia}
                className={`border border-solid ${tema.border} rounded-sm p-2.5 flex flex-col justify-between min-h-[46mm] ${
                  isDomingo ? tema.bgLight : ""
                }`}
              >
                <span
                  className={`text-[11px] font-bold uppercase tracking-wider font-serif italic border-b pb-1 border-gray-100 ${
                    isDomingo ? tema.text : "text-gray-900"
                  }`}
                >
                  {dia}
                </span>

                {/* Linhas de Pauta Internas */}
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

          {/* O 8º bloco da grade do Grid (3x3) seria um espaço vazio. 
              Para manter o design limpo e preencher perfeitamente a página, 
              adicionamos um espaço de Anotações Rápidas na última célula da grade de dias */}
          <div
            className={`border border-dashed ${tema.border} rounded-sm p-2.5 flex flex-col justify-between min-h-[46mm] bg-gray-50/40`}
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

        {/* Campo de Prioridades Horizontal Avançado — Posicionado na base */}
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

      {/* Rodapé Padrão */}
      <Footer name={footerName} />
    </div>
  );
}
