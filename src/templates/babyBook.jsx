// src/templates/babyBook.jsx
//
// Diário de Bebê / Baby Book: boas-vindas, marcos importantes, curva de
// crescimento (mês a mês) e páginas de álbum (foto + legenda).
import {
  BabyBoasVindasPage,
  BabyMarcosPage,
  BabyCrescimentoPage,
  BabyAlbumPage,
} from "../components/layouts/BabyBookLayout";

const NUM_MESES_CRESCIMENTO = 12;
const NUM_PAGINAS_ALBUM = 6;

export default {
  nome: "Diário de Bebê",
  layout: (props) => {
    const { printing, ...rest } = props;

    if (!printing) {
      return <BabyBoasVindasPage {...rest} />;
    }

    return (
      <div className="print-container">
        <div className="page-break">
          <BabyBoasVindasPage {...rest} />
        </div>
        <div className="page-break">
          <BabyMarcosPage {...rest} />
        </div>
        <div className="page-break">
          <BabyCrescimentoPage numMeses={NUM_MESES_CRESCIMENTO} {...rest} />
        </div>
        {Array.from({ length: NUM_PAGINAS_ALBUM }).map((_, pageIndex) => (
          <div key={`album-${pageIndex}`} className="page-break">
            <BabyAlbumPage
              pageIndex={pageIndex}
              totalPaginas={NUM_PAGINAS_ALBUM}
              {...rest}
            />
          </div>
        ))}
      </div>
    );
  },
};
