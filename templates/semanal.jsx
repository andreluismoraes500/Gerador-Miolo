import SemanalLayout from "../components/layouts/SemanalLayout";

export default {
  nome: "Semanal",
  layout: (props) => {
    const conteudo = <SemanalLayout {...props} />;
    if (!props.printing) return conteudo;
    return (
      <div className="print-container">
        <div className="page-break">{conteudo}</div>
      </div>
    );
  },
};
