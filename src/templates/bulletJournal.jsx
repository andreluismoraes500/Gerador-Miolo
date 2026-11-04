// src/templates/bulletJournal.jsx
//
// Bullet Journal / Caderno Pontilhado: índice + legenda de símbolos + N
// folhas pontilhadas em branco. Ajuste NUM_PAGINAS_PONTILHADAS para mudar o
// tamanho do caderno.
import {
  BulletIndicePage,
  BulletLegendaPage,
  BulletPontilhadaPage,
} from "../components/layouts/BulletJournalLayout";

const NUM_LINHAS_INDICE = 30;
const NUM_PAGINAS_PONTILHADAS = 60;

export default {
  nome: "Bullet Journal / Caderno Pontilhado",
  layout: (props) => {
    const { printing, ...rest } = props;

    if (!printing) {
      return <BulletIndicePage numLinhas={NUM_LINHAS_INDICE} {...rest} />;
    }

    return (
      <div className="print-container">
        <div className="page-break">
          <BulletIndicePage numLinhas={NUM_LINHAS_INDICE} {...rest} />
        </div>
        <div className="page-break">
          <BulletLegendaPage {...rest} />
        </div>
        {Array.from({ length: NUM_PAGINAS_PONTILHADAS }).map((_, pageIndex) => (
          <div key={`pontilhada-${pageIndex}`} className="page-break">
            <BulletPontilhadaPage
              pageIndex={pageIndex}
              totalPaginas={NUM_PAGINAS_PONTILHADAS}
              {...rest}
            />
          </div>
        ))}
      </div>
    );
  },
};
