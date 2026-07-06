import LeituraLayout from "../components/layouts/LeituraLayout";

export default {
  nome: "Controle de Leitura",
  layout: (props) => {
    const conteudo = <LeituraLayout {...props} />;
    if (!props.printing) return conteudo;
    return (
      <div className="print-container">
        <div className="page-break">{conteudo}</div>
      </div>
    );
  },
};
