// src/templates/noivas.jsx
//
// Planner de Noivas: capa, contagem regressiva + dados do casal, orçamento,
// checklist por prazo, lista de convidados, fornecedores, padrinhos e
// madrinhas, cronograma do grande dia e um espaço de inspiração/notas.

import {
  NoivasCapaPage,
  NoivasContagemPage,
  NoivasOrcamentoPage,
  NoivasChecklistPage,
  NoivasConvidadosPage,
  NoivasFornecedoresPage,
  NoivasPadrinhosPage,
  NoivasCronogramaPage,
  NoivasInspiracaoPage,
  CHECKLIST_NOIVAS,
} from "../components/layouts/NoivasLayout";

const TOTAL_PAGINAS_CONVIDADOS = 3;

export default {
  nome: "Planner de Noivas",
  layout: (props) => {
    const { printing, ...rest } = props;

    if (!printing) {
      return <NoivasCapaPage {...rest} />;
    }

    return (
      <div className="print-container">
        <div className="page-break">
          <NoivasCapaPage {...rest} />
        </div>

        <div className="page-break">
          <NoivasContagemPage {...rest} />
        </div>

        <div className="page-break">
          <NoivasOrcamentoPage {...rest} />
        </div>

        {CHECKLIST_NOIVAS.map((grupo, i) => (
          <div key={grupo.prazo} className="page-break">
            <NoivasChecklistPage
              grupo={grupo}
              pageIndex={i}
              totalPaginas={CHECKLIST_NOIVAS.length}
              {...rest}
            />
          </div>
        ))}

        {Array.from({ length: TOTAL_PAGINAS_CONVIDADOS }).map((_, i) => (
          <div key={`convidados-${i}`} className="page-break">
            <NoivasConvidadosPage
              pageIndex={i}
              totalPaginas={TOTAL_PAGINAS_CONVIDADOS}
              {...rest}
            />
          </div>
        ))}

        <div className="page-break">
          <NoivasFornecedoresPage {...rest} />
        </div>

        <div className="page-break">
          <NoivasPadrinhosPage {...rest} />
        </div>

        <div className="page-break">
          <NoivasCronogramaPage {...rest} />
        </div>

        <div className="page-break">
          <NoivasInspiracaoPage {...rest} />
        </div>
      </div>
    );
  },
};
