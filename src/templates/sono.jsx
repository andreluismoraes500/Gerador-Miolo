import SonoLayout from "../components/layouts/SonoLayout";

export default {
  nome: "Sono & Bem-estar",
  layout: (props) => {
    const conteudo = <SonoLayout {...props} />;
    if (!props.printing) return conteudo;
    return (
      <div className="print-container">
        <div className="page-break">{conteudo}</div>
      </div>
    );
  },
};
