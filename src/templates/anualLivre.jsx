// src/templates/anualLivre.jsx
//
// Template "Anual (agenda comercial)" — mesma estrutura do Anual (completo),
// mas usando o layout DiarioLivre (sem colunas de pagamento Dinheiro/Cartão/Pix).
// Ideal para quem quer uma agenda comercial tradicional, sem controle financeiro.

import DiarioLivre from "../components/layouts/DiarioLivre";
import { MdCalendarToday } from "react-icons/md";
import {
  gerarDiasDoAno,
  getFeriado,
  getComemorativa,
} from "../utils/agendaUtils";

export default {
  nome: "Anual (agenda comercial)",
  layout: (props) => {
    const { selectedDate, printing, ...rest } = props;
    const [y] = selectedDate.split("-").map(Number);
    const dias = gerarDiasDoAno(y);

    let totalDias = dias.length;
    let feriados = 0;
    let comemorativas = 0;
    let uteis = 0;
    dias.forEach((d) => {
      const feriado = getFeriado(d);
      const comem = getComemorativa(d);
      if (feriado) feriados++;
      if (comem) comemorativas++;
      const diaSemana = d.getDay();
      if (diaSemana !== 0 && diaSemana !== 6) uteis++;
    });
    const stats = { totalDias, feriados, comemorativas, uteis };

    if (!printing) {
      return (
        <div className="max-w-[210mm] mx-auto p-12 text-center">
          <div>
            <MdCalendarToday className="mx-auto text-gray-300 w-10 h-10 mb-3" />
            <p className="text-md font-light text-gray-700">
              Miolo de Agenda Anual (comercial) — Ano {y}
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Contém {dias.length} páginas consecutivas otimizadas para
              PDF/Impressora (Tema:{" "}
              <span className="uppercase font-bold">{props.colorTheme}</span>
              ). Sem colunas de pagamento (Dinheiro/Cartão/Pix).
            </p>
            <div className="mt-4 text-left max-w-sm mx-auto text-xs text-gray-500 border-t border-gray-200 pt-3">
              <p>📊 Resumo do ano:</p>
              <ul className="list-disc list-inside">
                <li>Total de dias: {stats.totalDias}</li>
                <li>Dias úteis (seg-sex): {stats.uteis}</li>
                <li>Feriados: {stats.feriados}</li>
                <li>Datas comemorativas: {stats.comemorativas}</li>
              </ul>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="print-container">
        {dias.map((dia, i) => (
          <div key={i} className="page-break">
            <DiarioLivre data={dia} {...rest} />
          </div>
        ))}
        <div className="page-break">
          <div className="printable-page bg-white p-8 flex flex-col justify-center items-center">
            <h3 className="text-xl font-light mb-4">📊 Resumo do Ano</h3>
            <div className="text-sm space-y-1">
              <p>Total de dias: {stats.totalDias}</p>
              <p>Dias úteis: {stats.uteis}</p>
              <p>Feriados: {stats.feriados}</p>
              <p>Datas comemorativas: {stats.comemorativas}</p>
            </div>
            <p className="mt-4 text-xs text-gray-400">Gerado automaticamente</p>
          </div>
        </div>
      </div>
    );
  },
};
