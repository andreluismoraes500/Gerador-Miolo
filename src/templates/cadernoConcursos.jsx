// src/templates/cadernoConcursos.jsx
import { Fragment } from "react";
import {
  ConcursosSumarioPage,
  ConcursosDivisoriaPage,
  ConcursosPautadaPage,
  ConcursosErrosPage,
} from "../components/layouts/CadernoConcursosLayout";

const NUM_MATERIAS = 8;
const PAGINAS_PAUTADAS_POR_MATERIA = 6;

export default {
  nome: "Caderno de Concursos / ENEM",
  layout: (props) => {
    const { printing, ...rest } = props;

    if (!printing) {
      return <ConcursosSumarioPage numMaterias={NUM_MATERIAS} {...rest} />;
    }

    return (
      <div className="print-container">
        <div className="page-break">
          <ConcursosSumarioPage numMaterias={NUM_MATERIAS} {...rest} />
        </div>
        {Array.from({ length: NUM_MATERIAS }).map((_, materiaIndex) => (
          <Fragment key={`materia-${materiaIndex}`}>
            <div className="page-break">
              <ConcursosDivisoriaPage index={materiaIndex} {...rest} />
            </div>
            {Array.from({ length: PAGINAS_PAUTADAS_POR_MATERIA }).map((_, pageIndex) => (
              <div key={`pauta-${materiaIndex}-${pageIndex}`} className="page-break">
                <ConcursosPautadaPage
                  materiaIndex={materiaIndex}
                  pageIndex={pageIndex}
                  totalPaginas={PAGINAS_PAUTADAS_POR_MATERIA}
                  {...rest}
                />
              </div>
            ))}
            <div className="page-break">
              <ConcursosErrosPage materiaIndex={materiaIndex} {...rest} />
            </div>
          </Fragment>
        ))}
      </div>
    );
  },
};
