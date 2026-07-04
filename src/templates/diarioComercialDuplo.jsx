// src/templates/diarioComercialDuplo.jsx
//
// "Diário Comercial 2 em 1" — 2 dias por página, SEM grade de horário fixa.
// A data selecionada é o primeiro dia da folha; o segundo dia é o seguinte.

import DoisDiasComercial from "../components/layouts/DoisDiasComercial";

export default {
  nome: "Diário Comercial (2 dias por página)",
  layout: (props) => {
    const { selectedDate, ...rest } = props;
    const [y, m, d] = selectedDate.split("-").map(Number);
    const data = new Date(y, m - 1, d);

    const conteudo = <DoisDiasComercial data={data} {...rest} />;

    if (!props.printing) return conteudo;
    return (
      <div className="print-container">
        <div className="page-break">{conteudo}</div>
      </div>
    );
  },
};
