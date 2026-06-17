import DiaCompleto from "../components/layouts/DiaCompleto";
import { MdCalendarToday } from "react-icons/md";
import { gerarDiasDoMes } from "../utils/agendaUtils";

export default {
  nome: "Mensal (completo)",
  layout: (
    footerName,
    selectedDate,
    printing,
    colorTheme,
    logo,
    footerType,
  ) => {
    const [y, m] = selectedDate.split("-").map(Number);
    const data = new Date(y, m - 1, 1);
    const dias = gerarDiasDoMes(y, m - 1);

    if (!printing) {
      return (
        <div className="max-w-[210mm] mx-auto p-12 text-center flex flex-col justify-between min-h-[250mm]">
          <div className="my-auto">
            <MdCalendarToday className="mx-auto text-gray-300 w-10 h-10 mb-3" />
            <p className="text-md font-light text-gray-700">
              Agenda Mensal:{" "}
              <span className="font-semibold capitalize">
                {data.toLocaleDateString("pt-BR", {
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Contém {dias.length} páginas formatadas para impressão consecutiva
              (Tema: <span className="uppercase font-bold">{colorTheme}</span>).
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="print-container">
        {dias.map((dia, i) => (
          <div key={i} className="page-break">
            <DiaCompleto
              data={dia}
              footerName={footerName}
              colorTheme={colorTheme}
              logo={logo}
              footerType={footerType}
            />
          </div>
        ))}
      </div>
    );
  },
};
