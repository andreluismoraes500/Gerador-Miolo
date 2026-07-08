import BoletimLayout from "../components/layouts/BoletimLayout";

export default {
  nome: "Boletim Escolar",
  layout: (props) => {
    const conteudo = <BoletimLayout {...props} />;
    if (!props.printing) return conteudo;
    return (
      <div className="print-container">
        <div className="page-break">{conteudo}</div>
      </div>
    );
  },
};
