import FinancasLayout from "../components/layouts/FinancasLayout";

export default {
  nome: "Planejamento Financeiro",
  layout: (props) => {
    const conteudo = <FinancasLayout {...props} />;
    if (!props.printing) return conteudo;
    return (
      <div className="print-container">
        <div className="page-break">{conteudo}</div>
      </div>
    );
  },
};
