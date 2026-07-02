// src/templates/capa.jsx

import CapaLayout from "../components/layouts/CapaLayout";

export default {
  nome: "Capa",
  layout: (props) => {
    const conteudo = <CapaLayout {...props} />;
    if (!props.printing) return conteudo;
    return (
      <div className="print-container">
        <div className="page-break">{conteudo}</div>
      </div>
    );
  },
};
