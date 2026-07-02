import HabitosLayout from "../components/layouts/HabitosLayout";

export default {
  nome: "Rastreador de Hábitos",
  layout: (props) => {
    const conteudo = <HabitosLayout {...props} />;
    if (!props.printing) return conteudo;
    return (
      <div className="print-container">
        <div className="page-break">{conteudo}</div>
      </div>
    );
  },
};
