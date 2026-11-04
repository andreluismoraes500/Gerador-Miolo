// src/templates/diarioFloral.jsx
//
// Template "Agenda Floral" — 1 dia por página, folha pautada livre,
// cantos com ilustração floral e versículo no rodapé.

import DiarioFloralLayout from "../components/layouts/DiarioFloralLayout";

export default {
  nome: "Agenda Floral",
  layout: (props) => {
    const { selectedDate, ...rest } = props;
    const [y, m, d] = selectedDate.split("-").map(Number);
    const data = new Date(y, m - 1, d);

    const conteudo = <DiarioFloralLayout data={data} {...rest} />;

    if (!props.printing) return conteudo;
    return (
      <div className="print-container">
        <div className="page-break">{conteudo}</div>
      </div>
    );
  },
};
