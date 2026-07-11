// src/templates/floralAnual.jsx
//
// "Agenda Floral" (anual) — igual à floralMensal.jsx, mas gera o ano
// inteiro. Também aceita `apenasMes` (0-11), no mesmo espírito de
// anualCompleto.jsx, para poder ser intercalada com um planner mensal
// caso a Montagem precise disso no futuro.

import DiarioFloralLayout from "../components/layouts/DiarioFloralLayout";
import { MdLocalFlorist } from "react-icons/md";
import { gerarDiasDoAno } from "../utils/agendaUtils";

export default {
  nome: "Agenda Floral (anual)",
  layout: (props) => {
    const { selectedDate, printing, apenasMes, ...rest } = props;
    const [y] = selectedDate.split("-").map(Number);
    const diasDoAno = gerarDiasDoAno(y);
    const dias =
      apenasMes == null
        ? diasDoAno
        : diasDoAno.filter((d) => d.getMonth() === apenasMes);

    if (!printing) {
      return (
        <div className="max-w-[210mm] mx-auto p-12 text-center flex flex-col justify-between min-h-[250mm]">
          <div className="my-auto">
            <MdLocalFlorist className="mx-auto text-pink-300 w-10 h-10 mb-3" />
            <p className="text-md font-light text-gray-700">
              Miolo de Agenda Floral Anual — Ano {y}
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
            <DiarioFloralLayout data={dia} {...rest} />
          </div>
        ))}
      </div>
    );
  },
};
