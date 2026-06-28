import RefeicoesLayout from "../components/layouts/RefeicoesLayout";

export default {
  nome: "Agenda de Refeições",
  layout: (props) => {
    const conteudo = <RefeicoesLayout {...props} />;
    if (!props.printing) return conteudo;
    return (
      <div className="print-container">
        <div className="page-break">{conteudo}</div>
      </div>
    );
  },
};
