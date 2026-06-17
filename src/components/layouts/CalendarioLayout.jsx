import Footer from "../Footer";
import { FERIADOS, getFeriado, getComemorativa } from "../../utils/agendaUtils";
import { TEMAS } from "../../themes";
import Logo from "../Logo";

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
const DIAS_SEMANA = ["D", "S", "T", "Q", "Q", "S", "S"];

function obterDiasDoMes(ano, mes) {
  const primeiroDiaData = new Date(ano, mes, 1);
  const diaInicio = primeiroDiaData.getDay();
  const totalDias = new Date(ano, mes + 1, 0).getDate();
  const semanas = [];
  let linhaData = Array(7).fill(null);
  for (let i = 0; i < diaInicio; i++) linhaData[i] = null;
  let diaCorrente = 1;
  for (let i = diaInicio; i < 7; i++) linhaData[i] = diaCorrente++;
  semanas.push(linhaData);
  while (diaCorrente <= totalDias) {
    linhaData = Array(7).fill(null);
    for (let i = 0; i < 7; i++) {
      if (diaCorrente <= totalDias) linhaData[i] = diaCorrente++;
    }
    semanas.push(linhaData);
  }
  return semanas;
}

export default function CalendarioLayout({
  ano,
  footerName,
  colorTheme = "classico",
  logo,
  footerType = "default",
  businessType = "manicure",
}) {
  const tema = TEMAS[colorTheme] || TEMAS.classico;

  const obtenerLegendaCompleta = () => {
    const eventos = [];
    for (let m = 0; m < 12; m++) {
      const ultimoDia = new Date(ano, m + 1, 0).getDate();
      for (let d = 1; d <= ultimoDia; d++) {
        const dataFoco = new Date(ano, m, d);
        const feriado = getFeriado(dataFoco);
        const comemorativa = getComemorativa(dataFoco);
        if (feriado) {
          eventos.push({
            mes: m + 1,
            dia: d,
            nome: feriado.nome,
            tipo: "feriado",
          });
        } else if (comemorativa) {
          eventos.push({
            mes: m + 1,
            dia: d,
            nome: comemorativa,
            tipo: "comemorativa",
          });
        }
      }
    }
    return eventos.sort((a, b) => a.mes - b.mes || a.dia - b.dia);
  };

  const legendaCompleta = obtenerLegendaCompleta();

  return (
    <div className="printable-page bg-white font-sans text-gray-900 flex flex-col justify-between box-border select-none border-0 shadow-none rounded-none">
      <div className="flex flex-col flex-1 min-h-0">
        <div
          className={`border-b-2 ${tema.headerBorder} pb-3 flex items-end justify-between mb-4 w-full shrink-0 print:mb-3`}
        >
          <div className="flex items-center gap-3">
            <Logo src={logo} />
            <div className="space-y-0.5">
              <h2
                className={`text-[15px] font-semibold tracking-widest text-gray-900 uppercase ${tema.headingFont}`}
              >
                Calendário Geral
              </h2>
              <p className="text-[10px] uppercase tracking-wider text-gray-400 font-sans font-bold">
                Início no Domingo • Feriados & Datas Comemorativas
              </p>
            </div>
          </div>
          <div className="text-right">
            <span
              className={`text-4xl font-extralight tracking-widest ${tema.headingFont} ${tema.text}`}
            >
              {ano}
            </span>
          </div>
        </div>

        {/* Grid dos Meses */}
        <div className="flex-1 grid grid-cols-3 gap-x-4 gap-y-3 items-stretch min-h-0">
          {NOMES_MESES.map((nomeMes, indexMes) => {
            const semanas = obterDiasDoMes(ano, indexMes);
            return (
              <div
                key={nomeMes}
                className={`border border-solid ${tema.border} rounded-sm p-2 flex flex-col justify-between ${tema.cardBg}`}
              >
                <h3
                  className={`text-[11px] font-bold uppercase tracking-widest text-center pb-0.5 mb-1 border-b border-gray-100 ${tema.headingFont} ${tema.text}`}
                >
                  {nomeMes}
                </h3>
                <div className="grid grid-cols-7 text-center text-[8px] font-bold text-gray-400 mb-1">
                  {DIAS_SEMANA.map((d, i) => (
                    <span
                      key={i}
                      className={`h-3.5 flex items-center justify-center ${i === 0 ? "text-red-400 font-extrabold" : i === 6 ? "text-blue-500 font-extrabold" : ""}`}
                    >
                      {d}
                    </span>
                  ))}
                </div>
                <div className="flex-1 flex flex-col justify-between space-y-0.5">
                  {semanas.map((semana, indexSemana) => (
                    <div
                      key={indexSemana}
                      className="grid grid-cols-7 text-center text-[10px] font-mono leading-none h-3.5 items-center"
                    >
                      {semana.map((dia, indexDia) => {
                        if (!dia) return <span key={indexDia}></span>;
                        const dataAtual = new Date(ano, indexMes, dia);
                        const isDomingo = indexDia === 0;
                        const isSabado = indexDia === 6;
                        const feriadoObj = getFeriado(dataAtual);
                        const comemorativaNome = getComemorativa(dataAtual);

                        let classeDia = "text-gray-700 hover:bg-gray-50";
                        if (isDomingo)
                          classeDia = "text-red-500 font-bold bg-red-50/40";
                        else if (isSabado)
                          classeDia = tema.sabado + " font-bold";
                        if (comemorativaNome) {
                          classeDia =
                            "text-amber-700 font-bold bg-amber-50 rounded-full border border-dashed border-amber-300";
                        }
                        if (feriadoObj) {
                          classeDia =
                            "text-red-700 font-extrabold bg-red-100/70 rounded-full border border-solid border-red-200";
                        }

                        return (
                          <span
                            key={indexDia}
                            title={
                              feriadoObj
                                ? feriadoObj.nome
                                : comemorativaNome || undefined
                            }
                            className={`w-full h-full flex items-center justify-center rounded-sm transition-colors ${classeDia}`}
                          >
                            {String(dia).padStart(2, "0")}
                          </span>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Legenda */}
        <div
          className={`mt-4 border border-solid ${tema.border} rounded-sm p-2.5 shrink-0 h-[38mm] print:h-[36mm] flex flex-col justify-between ${tema.bgLight}`}
        >
          <div className="text-[9px] font-bold uppercase tracking-wider text-gray-400 border-b pb-1 border-gray-200 mb-1.5 flex items-center justify-between">
            <span>Guia de Datas e Eventos do Ano (Ordem Cronológica)</span>
            <div className="flex items-center gap-3 font-sans normal-case text-[8px] text-gray-500 font-normal">
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-red-100 border border-red-300"></span>{" "}
                Feriado Nacional
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-50 border border-dashed border-amber-300"></span>{" "}
                Data Comemorativa
              </div>
            </div>
          </div>
          <div className="flex-1 grid grid-cols-4 gap-x-4 gap-y-0.5 overflow-hidden text-[8.5px] font-sans">
            {legendaCompleta.map((evento, idx) => {
              const isFeriado = evento.tipo === "feriado";
              return (
                <div
                  key={idx}
                  className="flex items-center gap-1.5 text-gray-700 border-b border-gray-100/30 py-0.5 min-w-0"
                >
                  <span
                    className={`font-mono font-bold shrink-0 px-1 rounded-sm ${isFeriado ? "text-red-600 bg-red-50" : "text-amber-700 bg-amber-50/60"}`}
                  >
                    {String(evento.dia).padStart(2, "0")}/
                    {String(evento.mes).padStart(2, "0")}
                  </span>
                  <span
                    className="truncate text-gray-600 font-medium"
                    title={evento.nome}
                  >
                    {evento.nome}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <Footer
        name={footerName}
        type={footerType}
        colorTheme={colorTheme}
        businessType={businessType}
      />
    </div>
  );
}
