import DiaCompleto from "../components/layouts/DiaCompleto";

export default {
  nome: "Diário",
  layout: (
    footerName,
    selectedDate,
    printing,
    colorTheme,
    logo,
    footerType,
  ) => {
    const [y, m, d] = selectedDate.split("-").map(Number);
    const data = new Date(y, m - 1, d);

    const conteudo = (
      <DiaCompleto
        data={data}
        footerName={footerName}
        colorTheme={colorTheme}
        logo={logo}
        footerType={footerType}
      />
    );

    if (!printing) return conteudo;

    return (
      <div className="print-container">
        <div className="page-break">{conteudo}</div>
      </div>
    );
  },
};
