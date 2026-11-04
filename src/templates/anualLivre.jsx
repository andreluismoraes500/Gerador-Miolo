// src/templates/anualLivre.jsx
//
// Template "Anual (agenda comercial)" — mesma estrutura do Anual (completo),
// mas usando o layout DiaComercial (sem grade de horário fixa, sem colunas de
// pagamento Dinheiro/Cartão/Pix) — igual ao Diário Comercial, só que para o
// ano inteiro.

import DiaComercial from "../components/layouts/DiaComercial";
import { MdCalendarToday } from "react-icons/md";
import { gerarDiasDoAno } from "../utils/agendaUtils";

export default {
  nome: "Anual (agenda comercial)",
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
        <div className="max-w-[210mm] mx-auto p-12 text-center">
          <div>
            <MdCalendarToday className="mx-auto text-gray-300 w-10 h-10 mb-3" />
            <p className="text-md font-light text-gray-700">
              Miolo de Agenda Anual (comercial) — Ano {y}
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Tema:{" "}
              <span className="uppercase font-bold">{props.colorTheme}</span>
              . Sem horário fixo e sem colunas de pagamento (Dinheiro/Cartão/Pix).
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="print-container">
        {dias.map((dia, i) => (
          <div key={i} className="page-break">
            <DiaComercial data={dia} {...rest} />
          </div>
        ))}
      </div>
    );
  },
};
