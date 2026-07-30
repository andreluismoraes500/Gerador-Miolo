// src/templates/cadernoIdiomas.jsx
import { Fragment } from "react";
import {
  IdiomasSumarioPage,
  IdiomasDivisoriaPage,
  IdiomasVocabularioPage,
} from "../components/layouts/CadernoIdiomasLayout";

const NUM_LICOES = 10;
const PAGINAS_POR_LICAO = 3;

export default {
  nome: "Caderno de Idiomas",
  layout: (props) => {
    const { printing, ...rest } = props;

    if (!printing) {
      return <IdiomasSumarioPage numLicoes={NUM_LICOES} {...rest} />;
    }

    return (
      <div className="print-container">
        <div className="page-break">
          <IdiomasSumarioPage numLicoes={NUM_LICOES} {...rest} />
        </div>
        {Array.from({ length: NUM_LICOES }).map((_, licaoIndex) => (
          <Fragment key={`licao-${licaoIndex}`}>
            <div className="page-break">
              <IdiomasDivisoriaPage index={licaoIndex} {...rest} />
            </div>
            {Array.from({ length: PAGINAS_POR_LICAO }).map((_, pageIndex) => (
              <div key={`vocab-${licaoIndex}-${pageIndex}`} className="page-break">
                <IdiomasVocabularioPage
                  licaoIndex={licaoIndex}
                  pageIndex={pageIndex}
                  totalPaginas={PAGINAS_POR_LICAO}
                  {...rest}
                />
              </div>
            ))}
          </Fragment>
        ))}
      </div>
    );
  },
};
