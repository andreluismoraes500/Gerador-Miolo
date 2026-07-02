import PlannerMensalLayout from "../components/layouts/PlannerMensalLayout";

export default {
  nome: "Planner Mensal",
  layout: (props) => {
    const { selectedDate, printing, ...rest } = props;
    const [y, m] = selectedDate.split("-").map(Number);
    const ano = y;
    const mes = m - 1;

    const conteudo = <PlannerMensalLayout ano={ano} mes={mes} {...rest} />;

    if (!printing) return conteudo;
    return (
      <div className="print-container">
        <div className="page-break">{conteudo}</div>
      </div>
    );
  },
};
