import PetLayout from "../components/layouts/PetLayout";

export default {
  nome: "Pet",
  layout: (props) => {
    const conteudo = <PetLayout {...props} />;
    if (!props.printing) return conteudo;
    return (
      <div className="print-container">
        <div className="page-break">{conteudo}</div>
      </div>
    );
  },
};
