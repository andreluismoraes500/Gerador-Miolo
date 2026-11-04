import DiaCompleto from "../components/layouts/DiaCompleto";
import { MdCalendarToday } from "react-icons/md";
import { gerarDiasDoAno } from "../utils/agendaUtils";

export default {
  nome: "Anual (completo)",
  layout: (props) => {
    const { selectedDate, printing, apenasMes, ...rest } = props;
    const [y] = selectedDate.split("-").map(Number);
    const diasDoAno = gerarDiasDoAno(y);
    // `apenasMes` (0-11) é usado pela Montagem para extrair só os dias de um
    // mês específico, permitindo intercalar com o Planner Mensal.
    const dias =
      apenasMes == null ? diasDoAno : diasDoAno.filter((d) => d.getMonth() === apenasMes);

    if (!printing) {
      return (
        <div className="max-w-[210mm] mx-auto p-12 text-center flex flex-col justify-between min-h-[250mm]">
          <div className="my-auto">
            <MdCalendarToday className="mx-auto text-gray-300 w-10 h-10 mb-3" />
            <p className="text-md font-light text-gray-700">
              Miolo de Agenda Anual Completo — Ano {y}
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Tema:{" "}
              <span className="uppercase font-bold">{props.colorTheme}</span>
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="print-container">
        {dias.map((dia, i) => (
          <div key={i} className="page-break">
            <DiaCompleto data={dia} {...rest} />
          </div>
        ))}
      </div>
    );
  },
};
