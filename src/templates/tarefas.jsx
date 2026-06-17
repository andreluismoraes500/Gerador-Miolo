import TarefasLayout from "../components/layouts/TarefasLayout";

export default {
  nome: "Lista de Tarefas",
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
      <TarefasLayout
        footerName={footerName}
        colorTheme={colorTheme}
        logo={logo}
        footerType={footerType}
        businessType={businessType}
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
