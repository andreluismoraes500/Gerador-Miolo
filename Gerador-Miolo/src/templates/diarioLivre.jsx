// src/templates/diarioLivre.jsx
//
// Template "Diário Livre" — agenda convencional sem colunas de pagamento.
// Registra um dia por página, com horários + espaço para notas.

import DiarioLivre from "../components/layouts/DiarioLivre";

export default {
  nome: "Diário Livre",
  layout: (props) => {
    const { selectedDate, ...rest } = props;
    const [y, m, d] = selectedDate.split("-").map(Number);
    const data = new Date(y, m - 1, d);

    const conteudo = <DiarioLivre data={data} {...rest} />;

    if (!props.printing) return conteudo;
    return (
      <div className="print-container">
        <div className="page-break">{conteudo}</div>
      </div>
    );
  },
};
