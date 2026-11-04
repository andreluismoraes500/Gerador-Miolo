// src/templates/partituras.jsx
//
// Caderno de Partituras: capa + pauta em branco, pronta para composição.
// A primeira página de pauta reserva espaço para título/compositor(a)/tom;
// as demais são pauta "pura", maximizando o espaço de escrita.

import {
  PartiturasCapaPage,
  PartiturasPautaPage,
} from "../components/layouts/PartiturasLayout";

const TOTAL_PAGINAS_PAUTA = 16;

export default {
  nome: "Caderno de Partituras",
  layout: (props) => {
    const { printing, ...rest } = props;

    if (!printing) {
      return <PartiturasCapaPage {...rest} />;
    }

    return (
      <div className="print-container">
        <div className="page-break">
          <PartiturasCapaPage {...rest} />
        </div>

        {Array.from({ length: TOTAL_PAGINAS_PAUTA }).map((_, i) => (
          <div key={`pauta-${i}`} className="page-break">
            <PartiturasPautaPage
              pageIndex={i}
              totalPaginas={TOTAL_PAGINAS_PAUTA}
              comCampos={i === 0}
              numSistemas={i === 0 ? 9 : 10}
              {...rest}
            />
          </div>
        ))}
      </div>
    );
  },
};
