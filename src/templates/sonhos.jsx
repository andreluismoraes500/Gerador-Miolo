import SonhosLayout from "../components/layouts/SonhosLayout";

export default {
  nome: "Diário de Sonhos",
  layout: (props) => {
    const conteudo = <SonhosLayout {...props} />;
    if (!props.printing) return conteudo;
    return (
      <div className="print-container">
        <div className="page-break">{conteudo}</div>
      </div>
    );
  },
};
