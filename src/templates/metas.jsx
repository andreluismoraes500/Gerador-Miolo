import MetasLayout from "../components/layouts/MetasLayout";

export default {
  nome: "Mapa de Metas",
  layout: (props) => {
    const conteudo = <MetasLayout {...props} />;
    if (!props.printing) return conteudo;
    return (
      <div className="print-container">
        <div className="page-break">{conteudo}</div>
      </div>
    );
  },
};
