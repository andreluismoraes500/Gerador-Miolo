import CalendarioLayout from "../components/layouts/CalendarioLayout";

export default {
  nome: "Calendários",
  layout: (props) => {
    const { selectedDate, printing, ...rest } = props;
    const anoBase = parseInt(selectedDate.split("-")[0], 10);
    const anos = [anoBase, anoBase + 1, anoBase + 2];

    const conteudo = (ano) => <CalendarioLayout ano={ano} {...rest} />;

    if (!printing) return conteudo(anoBase);

    return (
      <div className="print-container">
        {anos.map((ano) => (
          <div key={ano} className="page-break">
            {conteudo(ano)}
          </div>
        ))}
      </div>
    );
  },
};
