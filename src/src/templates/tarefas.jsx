import TarefasLayout from "../components/layouts/TarefasLayout";

export default {
  nome: "Lista de Tarefas",
  layout: (props) => {
    const conteudo = <TarefasLayout {...props} />;
    if (!props.printing) return conteudo;
    return (
      <div className="print-container">
        <div className="page-break">{conteudo}</div>
      </div>
    );
  },
};
