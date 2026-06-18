import DadosPessoaisLayout from "../components/layouts/DadosPessoaisLayout";

export default {
  nome: "Dados Pessoais",
  layout: (props) => {
    const conteudo = <DadosPessoaisLayout {...props} />;
    if (!props.printing) return conteudo;
    return (
      <div className="print-container">
        <div className="page-break">{conteudo}</div>
      </div>
    );
  },
};
