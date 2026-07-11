// src/templates/semData.jsx
//
// "Agenda Sem Data (Permanente)" — folhas diárias sem vínculo com um
// ano/mês específico: a própria pessoa escreve o dia da semana, o número
// e o mês à mão (ou digitando, já que os campos também são editáveis na
// tela). Pensado para quem quer reaproveitar a agenda em qualquer época,
// sem precisar gerar tudo de novo a cada ano.
//
// Gera um bloco de páginas em branco (como um miolo de caderno) em vez de
// uma única folha, já que o uso típico é imprimir várias cópias para virar
// um caderno permanente.

import SemDataLayout from "../components/layouts/SemDataLayout";
import { MdEventBusy } from "react-icons/md";

const PAGINAS_PADRAO = 31; // um mês "genérico" de folhas em branco

export default {
  nome: "Agenda Sem Data (Permanente)",
  layout: (props) => {
    const { printing, ...rest } = props;

    if (!printing) {
      return (
        <div className="max-w-[210mm] mx-auto p-12 text-center flex flex-col justify-between min-h-[250mm]">
          <div className="my-auto">
            <MdEventBusy className="mx-auto text-gray-300 w-10 h-10 mb-3" />
            <p className="text-md font-light text-gray-700">
              Agenda <span className="font-semibold">Sem Data (Permanente)</span>
            </p>
            <p className="text-xs text-gray-400 mt-2 max-w-xs mx-auto">
              Cada folha tem o dia da semana, o mês e o número do dia em
              branco para você preencher — dá pra reimprimir e reaproveitar
              a qualquer época do ano.
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Tema:{" "}
              <span className="uppercase font-bold">{props.colorTheme}</span>
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="print-container">
        {Array.from({ length: PAGINAS_PADRAO }).map((_, i) => (
          <div key={i} className="page-break">
            <SemDataLayout instanceKey={String(i + 1)} {...rest} />
          </div>
        ))}
      </div>
    );
  },
};
