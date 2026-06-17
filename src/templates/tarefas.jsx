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
  ) => {
    const conteudo = (
      <TarefasLayout
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
