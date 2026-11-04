// src/templates/anualComercialDuplo.jsx
//
// "Anual Comercial (2 dias por página)" — mesma ideia do Mensal Comercial
// (2 dias por página), mas para o ano inteiro. Gera ~183 páginas
// consecutivas (365/366 dias agrupados de 2 em 2).

import { MdCalendarToday } from "react-icons/md";
import DoisDiasComercial from "../components/layouts/DoisDiasComercial";
import { gerarDiasDoAno } from "../utils/agendaUtils";

export default {
  nome: "Anual Comercial (2 dias por página)",
  layout: (props) => {
    const { selectedDate, printing, apenasMes, ...rest } = props;
    const [y] = selectedDate.split("-").map(Number);
    const dias = gerarDiasDoAno(y);

    // Agrupa os dias em pares (folhas de 2 dias cada), reiniciando a
    // contagem em cada mês — assim a numeração nunca "escorrega" de um
    // mês para o outro, e o último dia de um mês com número ímpar de
    // dias sempre cai sozinho na sua folha (o mês seguinte começa
    // sempre em folha nova, forçando a quebra de página no fim do mês).
    const todasFolhas = [];
    for (let m = 0; m < 12; m++) {
      const diasDoMes = dias.filter((d) => d.getMonth() === m);
      for (let i = 0; i < diasDoMes.length; i += 2) {
        todasFolhas.push(diasDoMes[i]);
      }
    }
    // `apenasMes` (0-11) é usado pela Montagem para extrair só as folhas de
    // um mês específico, permitindo intercalar com o Planner Mensal.
    const folhas =
      apenasMes == null
        ? todasFolhas
        : todasFolhas.filter((d) => d.getMonth() === apenasMes);

    if (!printing) {
      return (
        <div className="max-w-[210mm] mx-auto p-12 text-center">
          <div>
            <MdCalendarToday className="mx-auto text-gray-300 w-10 h-10 mb-3" />
            <p className="text-md font-light text-gray-700">
              Miolo de Agenda Anual Comercial (2 dias/página) — Ano {y}
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Tema:{" "}
              <span className="uppercase font-bold">{props.colorTheme}</span>
              . Sem grade de horário fixa e sem colunas de pagamento.
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
