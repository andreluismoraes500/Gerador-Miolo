import GratidaoLayout from "../components/layouts/GratidaoLayout";

export default {
  nome: "Diário de Gratidão",
  layout: (props) => {
    const conteudo = <GratidaoLayout {...props} />;
    if (!props.printing) return conteudo;
    return (
      <div className="print-container">
        <div className="page-break">{conteudo}</div>
      </div>
    );
  },
};
