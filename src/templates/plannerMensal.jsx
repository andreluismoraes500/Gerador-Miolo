import PlannerMensalLayout from "../components/layouts/PlannerMensalLayout";
import { MdCalendarMonth } from "react-icons/md";

export default {
  nome: "Planner Mensal",
  layout: (
    footerName,
    selectedDate,
    printing,
    colorTheme,
    logo,
    footerType,
  ) => {
    const [y, m] = selectedDate.split("-").map(Number);
    const ano = y;
    const mes = m - 1; // 0-based

    const conteudo = (
      <PlannerMensalLayout
        ano={ano}
        mes={mes}
        footerName={footerName}
        colorTheme={colorTheme}
        logo={logo}
        footerType={footerType}
      />
    );

    if (!printing) {
      return (
        <div className="max-w-[210mm] mx-auto p-12 text-center flex flex-col justify-center min-h-[250mm]">
          <MdCalendarMonth className="mx-auto text-gray-300 w-16 h-16 mb-6" />
          <p className="text-2xl font-light text-gray-700">
            Planner Mensal •{" "}
            {new Date(ano, mes).toLocaleDateString("pt-BR", {
              month: "long",
              year: "numeric",
            })}
          </p>
          <p className="text-sm text-gray-400 mt-4">
            Visão mensal completa em 1 página (Calendário + Metas + Notas)
          </p>
        </div>
      );
    }

    return (
      <div className="print-container">
        <div className="page-break">{conteudo}</div>
      </div>
    );
  },
};
