// src/templates/anualLivre.jsx
//
// Template "Anual (agenda comercial)" — mesma estrutura do Anual (completo),
// mas usando o layout DiarioLivre (sem colunas de pagamento Dinheiro/Cartão/Pix).
// Ideal para quem quer uma agenda comercial tradicional, sem controle financeiro.

import DiarioLivre from "../components/layouts/DiarioLivre";
import { MdCalendarToday } from "react-icons/md";
import { gerarDiasDoAno } from "../utils/agendaUtils";

export default {
  nome: "Anual (agenda comercial)",
  layout: (props) => {
    const { selectedDate, printing, ...rest } = props;
    const [y] = selectedDate.split("-").map(Number);
    const dias = gerarDiasDoAno(y);

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
              . Sem colunas de pagamento (Dinheiro/Cartão/Pix).
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="print-container">
        {dias.map((dia, i) => (
          <div key={i} className="page-break">
            <DiarioLivre data={dia} {...rest} />
          </div>
        ))}
      </div>
    );
  },
};
