import CalendarioLayout from "../components/layouts/CalendarioLayout";

export default {
  nome: "Calendários",
  layout: (
    footerName,
    selectedDate,
    printing,
    colorTheme,
    logo,
    footerType,
  ) => {
    const anoBase = parseInt(selectedDate.split("-")[0], 10);
    const anos = [anoBase, anoBase + 1, anoBase + 2];

    const conteudo = (
      <CalendarioLayout
        ano={anoBase}
        footerName={footerName}
        colorTheme={colorTheme}
        logo={logo}
        footerType={footerType}
      />
    );

    if (!printing) return conteudo;

    return (
      <div className="print-container">
        {anos.map((ano) => (
          <div key={ano} className="page-break">
            <CalendarioLayout
              ano={ano}
              footerName={footerName}
              colorTheme={colorTheme}
              logo={logo}
              footerType={footerType}
            />
          </div>
        ))}
      </div>
    );
  },
};
