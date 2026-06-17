import DadosPessoaisLayout from "../components/layouts/DadosPessoaisLayout";

export default {
  nome: "Dados Pessoais",
  layout: (
    footerName,
    selectedDate,
    printing,
    colorTheme,
    logo,
    footerType,
  ) => {
    const conteudo = (
      <DadosPessoaisLayout
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
