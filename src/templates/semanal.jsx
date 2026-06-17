import SemanalLayout from "../components/layouts/SemanalLayout";

export default {
  nome: "Semanal",
  layout: (
    footerName,
    selectedDate,
    printing,
    colorTheme,
    logo,
    footerType,
    businessType,
  ) => {
    const conteudo = (
      <SemanalLayout
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
