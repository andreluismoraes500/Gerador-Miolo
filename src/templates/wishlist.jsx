import WishlistLayout from "../components/layouts/WishlistLayout";

export default {
  nome: "Wishlist de Metas",
  layout: (props) => {
    const conteudo = <WishlistLayout {...props} />;
    if (!props.printing) return conteudo;
    return (
      <div className="print-container">
        <div className="page-break">{conteudo}</div>
      </div>
    );
  },
};
