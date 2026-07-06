import ViagemLayout from "../components/layouts/ViagemLayout";

export default {
  nome: "Planner de Viagem",
  layout: (props) => {
    const conteudo = <ViagemLayout {...props} />;
    if (!props.printing) return conteudo;
    return (
      <div className="print-container">
        <div className="page-break">{conteudo}</div>
      </div>
    );
  },
};
