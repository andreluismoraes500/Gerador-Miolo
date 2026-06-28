import ConteudoLayout from "../components/layouts/ConteudoLayout";

export default {
  nome: "Planner de Conteúdo",
  layout: (props) => {
    const conteudo = <ConteudoLayout {...props} />;
    if (!props.printing) return conteudo;
    return (
      <div className="print-container">
        <div className="page-break">{conteudo}</div>
      </div>
    );
  },
};
