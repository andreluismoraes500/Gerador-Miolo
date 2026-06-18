import SaudeLayout from "../components/layouts/SaudeLayout";

export default {
  nome: "Registro de Saúde",
  layout: (props) => {
    const conteudo = <SaudeLayout {...props} />;
    if (!props.printing) return conteudo;
    return (
      <div className="print-container">
        <div className="page-break">{conteudo}</div>
      </div>
    );
  },
};
