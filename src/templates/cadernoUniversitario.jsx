// src/templates/cadernoUniversitario.jsx
//
// Gera um "caderno universitário" completo pronto para impressão: sumário,
// contatos, divisórias de bimestre, uma divisória + folhas pautadas para
// cada matéria, e uma seção final de folhas quadriculadas.
//
// Ajuste as três constantes abaixo para mudar o "tamanho" do caderno.
import { Fragment } from "react";
import {
  CadernoSumarioPage,
  CadernoContatosPage,
  CadernoBimestrePage,
  CadernoDivisoriaPage,
  CadernoPautadaPage,
  CadernoQuadriculadaPage,
} from "../components/layouts/CadernoUniversitarioLayout";

const NUM_MATERIAS = 10;
const PAGINAS_POR_MATERIA = 20;
const NUM_BIMESTRES = 4;
const PAGINAS_QUADRICULADAS = 6;

export default {
  nome: "Caderno Universitário",
  layout: (props) => {
    const { printing, ...rest } = props;

    // Na pré-visualização (fora da impressão) mostramos só o Sumário, que já
    // é a página onde o usuário nomeia as matérias — o resto do caderno
    // (dezenas de páginas) só é montado de fato na hora de imprimir/exportar.
    if (!printing) {
      return <CadernoSumarioPage numMaterias={NUM_MATERIAS} {...rest} />;
    }

    return (
      <div className="print-container">
        <div className="page-break">
          <CadernoSumarioPage numMaterias={NUM_MATERIAS} {...rest} />
        </div>

        <div className="page-break">
          <CadernoContatosPage {...rest} />
        </div>

        {Array.from({ length: NUM_BIMESTRES }).map((_, i) => (
          <div key={`bimestre-${i}`} className="page-break">
            <CadernoBimestrePage
              numero={i + 1}
              numMaterias={NUM_MATERIAS}
              {...rest}
            />
          </div>
        ))}

        {Array.from({ length: NUM_MATERIAS }).map((_, materiaIndex) => (
          <Fragment key={`materia-${materiaIndex}`}>
            <div className="page-break">
              <CadernoDivisoriaPage
                index={materiaIndex}
                defaultTitle={`Disciplina ${String(materiaIndex + 1).padStart(2, "0")}`}
                {...rest}
              />
            </div>
            {Array.from({ length: PAGINAS_POR_MATERIA }).map((_, pageIndex) => (
              <div
                key={`pautada-${materiaIndex}-${pageIndex}`}
                className="page-break"
              >
                <CadernoPautadaPage
                  materiaIndex={materiaIndex}
                  pageIndex={pageIndex}
                  totalPaginas={PAGINAS_POR_MATERIA}
                  {...rest}
                />
              </div>
            ))}
          </Fragment>
        ))}

        <div className="page-break">
          <CadernoDivisoriaPage
            index={null}
            defaultTitle="Folhas Quadriculadas"
            subtitle="Exercícios, desenhos e gráficos"
            {...rest}
          />
        </div>
        {Array.from({ length: PAGINAS_QUADRICULADAS }).map((_, pageIndex) => (
          <div key={`quadriculada-${pageIndex}`} className="page-break">
            <CadernoQuadriculadaPage
              pageIndex={pageIndex}
              totalPaginas={PAGINAS_QUADRICULADAS}
              {...rest}
            />
          </div>
        ))}
      </div>
    );
  },
};
