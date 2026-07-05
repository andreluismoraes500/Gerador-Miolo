// src/templates/mensalLivre.jsx
//
// Template "Mensal (agenda comercial)" — mesma estrutura do Mensal (completo),
// mas usando o layout DiarioLivre (sem colunas de pagamento Dinheiro/Cartão/Pix).
// Ideal para quem quer uma agenda comercial tradicional, sem controle financeiro.

import DiarioLivre from "../components/layouts/DiarioLivre";
import { MdCalendarToday } from "react-icons/md";
import { gerarDiasDoMes } from "../utils/agendaUtils";

export default {
  nome: "Mensal (agenda comercial)",
  layout: (props) => {
    const { selectedDate, printing, ...rest } = props;
    const [y, m] = selectedDate.split("-").map(Number);
    const data = new Date(y, m - 1, 1);
    const dias = gerarDiasDoMes(y, m - 1);

    if (!printing) {
      return (
        <div className="max-w-[210mm] mx-auto p-12 text-center">
          <div>
            <MdCalendarToday className="mx-auto text-gray-300 w-10 h-10 mb-3" />
            <p className="text-md font-light text-gray-700">
              Agenda Mensal (comercial):{" "}
              <span className="font-semibold capitalize">
                {data.toLocaleDateString("pt-BR", {
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Tema: <span className="uppercase font-bold">{props.colorTheme}</span>
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
