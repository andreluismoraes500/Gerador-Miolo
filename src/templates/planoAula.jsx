import PlanoAulaLayout from "../components/layouts/PlanoAulaLayout";

export default {
  nome: "Plano de Aula",
  layout: (props) => {
    const conteudo = <PlanoAulaLayout {...props} />;
    if (!props.printing) return conteudo;
    return (
      <div className="print-container">
        <div className="page-break">{conteudo}</div>
      </div>
    );
  },
};
