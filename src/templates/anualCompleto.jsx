import DiaCompleto from "../components/layouts/DiaCompleto";
import { MdCalendarToday } from "react-icons/md";
import { gerarDiasDoAno } from "../utils/agendaUtils";

export default {
  nome: "Anual (completo)",
  layout: (
    footerName,
    selectedDate,
    printing,
    colorTheme,
    logo,
    footerType,
    businessType,
  ) => {
    const [y] = selectedDate.split("-").map(Number);
    const dias = gerarDiasDoAno(y);

    if (!printing) {
      return (
        <div className="max-w-[210mm] mx-auto p-12 text-center flex flex-col justify-between min-h-[250mm]">
          <div className="my-auto">
            <MdCalendarToday className="mx-auto text-gray-300 w-10 h-10 mb-3" />
            <p className="text-md font-light text-gray-700">
              Miolo de Agenda Anual Completo — Ano {y}
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Contém {dias.length} páginas consecutivas otimizadas para
              PDF/Impressora (Tema:{" "}
              <span className="uppercase font-bold">{colorTheme}</span>).
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
