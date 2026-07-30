// src/templates/cadernoInvestimentos.jsx
import {
  InvestPerfilPage,
  InvestCarteiraPage,
  InvestProventosPage,
  InvestMetasPage,
  InvestDiarioPage,
} from "../components/layouts/CadernoInvestimentosLayout";

const PAGINAS_DIARIO = 4;

export default {
  nome: "Caderno de Investimentos",
  layout: (props) => {
    const { printing, ...rest } = props;

    if (!printing) {
      return <InvestPerfilPage {...rest} />;
    }

    return (
      <div className="print-container">
        <div className="page-break"><InvestPerfilPage {...rest} /></div>
        <div className="page-break"><InvestMetasPage {...rest} /></div>
        <div className="page-break"><InvestCarteiraPage {...rest} /></div>
        <div className="page-break"><InvestProventosPage {...rest} /></div>
        {Array.from({ length: PAGINAS_DIARIO }).map((_, pageIndex) => (
          <div key={`diario-${pageIndex}`} className="page-break">
            <InvestDiarioPage pageIndex={pageIndex} totalPaginas={PAGINAS_DIARIO} {...rest} />
          </div>
        ))}
      </div>
    );
  },
};
