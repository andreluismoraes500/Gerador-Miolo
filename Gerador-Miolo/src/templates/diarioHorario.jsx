import DiarioHorario from "../components/layouts/DiarioHorario";

export default {
  nome: "Diário Hora a Hora",
  layout: (props) => {
    const { selectedDate, ...rest } = props;
    const [y, m, d] = selectedDate.split("-").map(Number);
    const data = new Date(y, m - 1, d);

    const conteudo = <DiarioHorario data={data} {...rest} />;

    if (!props.printing) return conteudo;
    return (
      <div className="print-container">
        <div className="page-break">{conteudo}</div>
      </div>
    );
  },
};
