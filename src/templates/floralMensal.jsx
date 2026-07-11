// src/templates/floralMensal.jsx
//
// "Agenda Floral" (mensal) — mesma página floral de 1 dia por folha da
// diarioFloral.jsx, só que gera automaticamente todos os dias do mês
// selecionado, um atrás do outro (igual ao espírito do mensalCompleto.jsx,
// mas usando o layout com cantos florais em vez do DiaCompleto).

import DiarioFloralLayout from "../components/layouts/DiarioFloralLayout";
import { MdLocalFlorist } from "react-icons/md";
import { gerarDiasDoMes } from "../utils/agendaUtils";

export default {
  nome: "Agenda Floral (mensal)",
  layout: (props) => {
    const { selectedDate, printing, ...rest } = props;
    const [y, m] = selectedDate.split("-").map(Number);
    const dias = gerarDiasDoMes(y, m - 1);
    const dataRef = new Date(y, m - 1, 1);

    if (!printing) {
      return (
        <div className="max-w-[210mm] mx-auto p-12 text-center flex flex-col justify-between min-h-[250mm]">
          <div className="my-auto">
            <MdLocalFlorist className="mx-auto text-pink-300 w-10 h-10 mb-3" />
            <p className="text-md font-light text-gray-700">
              Agenda Floral (mensal):{" "}
              <span className="font-semibold capitalize">
                {dataRef.toLocaleDateString("pt-BR", {
                  month: "long",
                  year: "numeric",
                })}
              </span>
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
