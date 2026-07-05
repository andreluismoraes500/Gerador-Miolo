// src/templates/mensalComercialDuplo.jsx
//
// "Mensal Comercial (2 dias por página)" — mesma ideia do Mensal (agenda
// comercial), mas empilhando 2 dias por folha e sem grade de horário fixa.
// Se o mês tiver número ímpar de dias, a última folha mostra só 1 dia
// (o segundo bloco fica em branco/omitido).

import { MdCalendarToday } from "react-icons/md";
import DoisDiasComercial from "../components/layouts/DoisDiasComercial";
import { gerarDiasDoMes } from "../utils/agendaUtils";

export default {
  nome: "Mensal Comercial (2 dias por página)",
  layout: (props) => {
    const { selectedDate, printing, ...rest } = props;
    const [y, m] = selectedDate.split("-").map(Number);
    const data = new Date(y, m - 1, 1);
    const dias = gerarDiasDoMes(y, m - 1);

    // Agrupa os dias em pares (folhas de 2 dias cada)
    const folhas = [];
    for (let i = 0; i < dias.length; i += 2) folhas.push(dias[i]);

    if (!printing) {
      return (
        <div className="max-w-[210mm] mx-auto p-12 text-center">
          <div>
            <MdCalendarToday className="mx-auto text-gray-300 w-10 h-10 mb-3" />
            <p className="text-md font-light text-gray-700">
              Agenda Mensal Comercial (2 dias/página):{" "}
              <span className="font-semibold capitalize">
                {data.toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}
              </span>
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Tema: <span className="uppercase font-bold">{props.colorTheme}</span>
              . Sem grade de horário fixa.
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="print-container">
        {folhas.map((dia, i) => (
          <div key={i} className="page-break">
            <DoisDiasComercial data={dia} {...rest} />
          </div>
        ))}
      </div>
    );
  },
};
