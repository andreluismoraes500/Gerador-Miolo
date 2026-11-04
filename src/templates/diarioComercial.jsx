// src/templates/diarioComercial.jsx
//
// "Diário Comercial" — 1 dia por página, SEM grade de horário fixa.
// Lista numerada de compromissos em branco.

import DiaComercial from "../components/layouts/DiaComercial";

export default {
  nome: "Diário Comercial (sem horário)",
  layout: (props) => {
    const { selectedDate, ...rest } = props;
    const [y, m, d] = selectedDate.split("-").map(Number);
    const data = new Date(y, m - 1, d);

    const conteudo = <DiaComercial data={data} {...rest} />;

    if (!props.printing) return conteudo;
    return (
      <div className="print-container">
        <div className="page-break">{conteudo}</div>
      </div>
    );
  },
};
