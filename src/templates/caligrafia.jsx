// src/templates/caligrafia.jsx
//
// Guia de Caligrafia: capa, alfabeto maiúsculo, alfabeto minúsculo, números,
// palavra personalizada (nome do aluno / ficha do professor), frases e
// lettering. Conteúdo original — não depende de geração de PDF externa,
// só reaproveita o mesmo pipeline de impressão dos demais templates.

import {
  CaligrafiaCapaPage,
  CaligrafiaLetrasPage,
  CaligrafiaPersonalizadaPage,
  CaligrafiaFrasesPage,
  CaligrafiaLetteringPage,
  ALFABETO_MAIUSCULO,
  ALFABETO_MINUSCULO,
  NUMEROS,
  LINHAS_POR_PAGINA,
  FRASES_CALIGRAFIA,
  LETTERING_PALAVRAS,
} from "../components/layouts/CaligrafiaLayout";

function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

const PAGINAS_MAIUSCULO = chunk(ALFABETO_MAIUSCULO, LINHAS_POR_PAGINA);
const PAGINAS_MINUSCULO = chunk(ALFABETO_MINUSCULO, LINHAS_POR_PAGINA);
const PAGINAS_FRASES = chunk(FRASES_CALIGRAFIA, 3);

export default {
  nome: "Guia de Caligrafia",
  layout: (props) => {
    const { printing, ...rest } = props;

    // Na pré-visualização mostramos só a capa — o caderno completo (todas
    // as folhas de traçado) só é montado na hora de imprimir/exportar,
    // seguindo o mesmo padrão do Caderno Universitário.
    if (!printing) {
      return <CaligrafiaCapaPage {...rest} />;
    }

    return (
      <div className="print-container">
        <div className="page-break">
          <CaligrafiaCapaPage {...rest} />
        </div>

        {PAGINAS_MAIUSCULO.map((itens, i) => (
          <div key={`maiusculo-${i}`} className="page-break">
            <CaligrafiaLetrasPage
              itens={itens}
              titulo="Alfabeto Maiúsculo"
              subtitulo="Traçado guiado"
              pageIndex={i}
              totalPaginas={PAGINAS_MAIUSCULO.length}
              {...rest}
            />
          </div>
        ))}

        {PAGINAS_MINUSCULO.map((itens, i) => (
          <div key={`minusculo-${i}`} className="page-break">
            <CaligrafiaLetrasPage
              itens={itens}
              titulo="Alfabeto Minúsculo"
              subtitulo="Traçado guiado"
              pageIndex={i}
              totalPaginas={PAGINAS_MINUSCULO.length}
              {...rest}
            />
          </div>
        ))}

        <div className="page-break">
          <CaligrafiaLetrasPage
            itens={NUMEROS}
            titulo="Números"
            subtitulo="Traçado guiado"
            pageIndex={0}
            totalPaginas={1}
            {...rest}
          />
        </div>

        <div className="page-break">
          <CaligrafiaPersonalizadaPage {...rest} />
        </div>

        {PAGINAS_FRASES.map((frases, i) => (
          <div key={`frases-${i}`} className="page-break">
            <CaligrafiaFrasesPage
              frases={frases}
              pageIndex={i}
              totalPaginas={PAGINAS_FRASES.length}
              {...rest}
            />
          </div>
        ))}

        <div className="page-break">
          <CaligrafiaLetteringPage palavras={LETTERING_PALAVRAS} {...rest} />
        </div>
      </div>
    );
  },
};
