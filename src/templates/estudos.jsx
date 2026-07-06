import EstudosLayout from "../components/layouts/EstudosLayout";

export default {
  nome: "Planner de Estudos",
  layout: (props) => {
    const conteudo = <EstudosLayout {...props} />;
    if (!props.printing) return conteudo;
    return (
      <div className="print-container">
        <div className="page-break">{conteudo}</div>
      </div>
    );
  },
};
