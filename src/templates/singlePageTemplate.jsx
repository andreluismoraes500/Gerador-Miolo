// Fábrica para templates de uma única página: envolve o layout em
// <div className="print-container"><div className="page-break"> ao imprimir.
export function singlePageTemplate(nome, Layout) {
  return {
    nome,
    layout: (props) => {
      const conteudo = <Layout {...props} />;
      if (!props.printing) return conteudo;
      return (
        <div className="print-container">
          <div className="page-break">{conteudo}</div>
        </div>
      );
    },
  };
}
