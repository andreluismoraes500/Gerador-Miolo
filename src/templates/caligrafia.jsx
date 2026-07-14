// src/templates/caligrafia.jsx
//
// Guia de Caligrafia Infantil: capa lúdica, uma página inteira para cada
// letra do alfabeto (A a Z, com ilustração + palavra-exemplo + joguinho),
// uma página para cada número (0 a 10, com objetos para contar), palavra
// personalizada (nome do aluno / ficha do professor), frases e lettering.
// Conteúdo original — não depende de geração de PDF externa, só reaproveita
// o mesmo pipeline de impressão dos demais templates.

import {
  CaligrafiaCapaPage,
  CaligrafiaLetraPage,
  CaligrafiaNumeroPage,
  CaligrafiaPersonalizadaPage,
  CaligrafiaFrasesPage,
  CaligrafiaLetteringPage,
  LETRAS_CALIGRAFIA,
  NUMEROS_CALIGRAFIA,
  FRASES_CALIGRAFIA,
  LETTERING_PALAVRAS,
} from "../components/layouts/CaligrafiaLayout";

function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

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

        {LETRAS_CALIGRAFIA.map((item) => (
          <div key={`letra-${item.letra}`} className="page-break">
            <CaligrafiaLetraPage item={item} {...rest} />
          </div>
        ))}

        {NUMEROS_CALIGRAFIA.map((item) => (
          <div key={`numero-${item.numero}`} className="page-break">
            <CaligrafiaNumeroPage item={item} {...rest} />
          </div>
        ))}

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
