import ComprasLayout from "../components/layouts/ComprasLayout";

export default {
  nome: "Lista de Compras",
  layout: (props) => {
    const conteudo = <ComprasLayout {...props} />;
    if (!props.printing) return conteudo;
    return (
      <div className="print-container">
        <div className="page-break">{conteudo}</div>
      </div>
    );
  },
};
