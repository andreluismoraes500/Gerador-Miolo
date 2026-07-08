import ListaChamadaLayout from "../components/layouts/ListaChamadaLayout";

export default {
  nome: "Lista de Chamada",
  layout: (props) => {
    const conteudo = <ListaChamadaLayout {...props} />;
    if (!props.printing) return conteudo;
    return (
      <div className="print-container">
        <div className="page-break">{conteudo}</div>
      </div>
    );
  },
};
