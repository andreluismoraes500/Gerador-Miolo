// src/templates/caligrafia.jsx
//
// Guia de Caligrafia Infantil. Conteúdo (na ordem de impressão):
//
//   Capa
//   Alfabeto cursivo A–Z ............ 52 págs (maiúscula + minúscula, traçado pontilhado)
//   Números e traçados 0–10 ......... 11 págs (Parte 1: cubra, escreva, conte, pinte)
//   Quantidade 0–10 ................. 11 págs (Parte 2: pinte, ligue, circule)
//   Sequências, antes/depois,
//   ordem crescente, ligue pontos ... 4 págs  (Parte 3)
//   Coordenação motora .............. 7 págs  (retas, curvas, ondas, caminhos,
//                                               espirais, formas, labirintos)
//   Meu nome em cursiva ............. 1 pág   (palavra personalizada)
//   Frases para copiar .............. 2 págs
//   Lettering ....................... 1 pág
//   Certificado ..................... 1 pág
//
// Para montar um caderno menor, basta desligar seções em SECOES abaixo.
// Conteúdo e ilustrações originais — gerados por código, sem imagens externas.

import {
  CaligrafiaCapaPage,
  CaligrafiaLetraPage,
  CaligrafiaNumeroPage,
  CaligrafiaLetteringPage,
  LETRAS_CALIGRAFIA,
  NUMEROS_CALIGRAFIA,
  FRASES_CALIGRAFIA,
  LETTERING_PALAVRAS,
} from "../components/layouts/CaligrafiaLayout";
import {
  CaligrafiaAlfabetoCursivoPage,
  CaligrafiaPalavraCursivaPage,
  CaligrafiaFrasesCursivaPage,
  PAGINAS_ALFABETO_CURSIVO,
} from "../components/layouts/caligrafia/AlfabetoCursivo";
import {
  NumeroTracadoPage,
  NumeroQuantidadePage,
  SequenciaPage,
  AntesDepoisPage,
  OrdemCrescentePage,
  LiguePontosPage,
  CertificadoPage,
  NUMEROS_TRACADOS,
} from "../components/layouts/caligrafia/Numeros";
import {
  MotoraRetasPage,
  MotoraCurvasPage,
  MotoraOndasPage,
  MotoraCaminhosPage,
  MotoraEspiraisPage,
  MotoraFormasPage,
  MotoraLabirintosPage,
} from "../components/layouts/caligrafia/Motora";

// Liga/desliga seções do caderno.
const SECOES = {
  alfabetoCursivo: true,
  numerosTracados: true, // Parte 1
  numerosQuantidade: true, // Parte 2
  numerosSequencias: true, // Parte 3
  coordenacaoMotora: true,
  palavraPersonalizada: true,
  frases: true,
  lettering: true,
  certificado: true,
  // versões originais (emoji + letra de imprensa esmaecida), desligadas por padrão
  alfabetoIlustrado: false,
  numerosIlustrados: false,
};

function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

const PAGINAS_FRASES = chunk(FRASES_CALIGRAFIA, 3);

const PAGINAS_MOTORAS = [
  MotoraRetasPage,
  MotoraCurvasPage,
  MotoraOndasPage,
  MotoraCaminhosPage,
  MotoraEspiraisPage,
  MotoraFormasPage,
  MotoraLabirintosPage,
];

const PAGINAS_PARTE_3 = [SequenciaPage, AntesDepoisPage, OrdemCrescentePage, LiguePontosPage];

// Cada entrada vira uma <div className="page-break"> na impressão.
function montarPaginas(rest) {
  const paginas = [];
  const add = (key, el) => paginas.push({ key, el });

  add("capa", <CaligrafiaCapaPage {...rest} />);

  if (SECOES.alfabetoCursivo) {
    PAGINAS_ALFABETO_CURSIVO.forEach((item) =>
      add(
        `cursiva-${item.letra}-${item.maiuscula ? "M" : "m"}`,
        <CaligrafiaAlfabetoCursivoPage item={item} {...rest} />,
      ),
    );
  }

  if (SECOES.alfabetoIlustrado) {
    LETRAS_CALIGRAFIA.forEach((item) =>
      add(`letra-${item.letra}`, <CaligrafiaLetraPage item={item} {...rest} />),
    );
  }

  if (SECOES.numerosTracados) {
    NUMEROS_TRACADOS.forEach((n) =>
      add(`num1-${n}`, <NumeroTracadoPage numero={n} {...rest} />),
    );
  }

  if (SECOES.numerosQuantidade) {
    NUMEROS_TRACADOS.forEach((n) =>
      add(`num2-${n}`, <NumeroQuantidadePage numero={n} {...rest} />),
    );
  }

  if (SECOES.numerosSequencias) {
    PAGINAS_PARTE_3.forEach((Pagina, i) => add(`num3-${i}`, <Pagina {...rest} />));
  }

  if (SECOES.numerosIlustrados) {
    NUMEROS_CALIGRAFIA.forEach((item) =>
      add(`numero-${item.numero}`, <CaligrafiaNumeroPage item={item} {...rest} />),
    );
  }

  if (SECOES.coordenacaoMotora) {
    PAGINAS_MOTORAS.forEach((Pagina, i) => add(`motora-${i}`, <Pagina {...rest} />));
  }

  if (SECOES.palavraPersonalizada) {
    add("palavra", <CaligrafiaPalavraCursivaPage {...rest} />);
  }

  if (SECOES.frases) {
    PAGINAS_FRASES.forEach((frases, i) =>
      add(
        `frases-${i}`,
        <CaligrafiaFrasesCursivaPage
          frases={frases}
          pageIndex={i}
          totalPaginas={PAGINAS_FRASES.length}
          {...rest}
        />,
      ),
    );
  }

  if (SECOES.lettering) {
    add("lettering", <CaligrafiaLetteringPage palavras={LETTERING_PALAVRAS} {...rest} />);
  }

  if (SECOES.certificado) {
    add("certificado", <CertificadoPage {...rest} />);
  }

  return paginas;
}

export default {
  nome: "Guia de Caligrafia",
  layout: (props) => {
    const { printing, ...rest } = props;

    // Na pré-visualização mostramos só a capa — o caderno completo só é
    // montado na hora de imprimir/exportar (mesmo padrão do Caderno
    // Universitário).
    if (!printing) {
      return <CaligrafiaCapaPage {...rest} />;
    }

    return (
      <div className="print-container">
        {montarPaginas(rest).map(({ key, el }) => (
          <div key={key} className="page-break">
            {el}
          </div>
        ))}
      </div>
    );
  },
};
