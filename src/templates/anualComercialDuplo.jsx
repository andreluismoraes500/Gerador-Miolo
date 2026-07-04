// src/templates/anualComercialDuplo.jsx
//
// "Anual Comercial (2 dias por página)" — mesma ideia do Mensal Comercial
// (2 dias por página), mas para o ano inteiro. Gera ~183 páginas
// consecutivas (365/366 dias agrupados de 2 em 2).

import { MdCalendarToday } from "react-icons/md";
import DoisDiasComercial from "../components/layouts/DoisDiasComercial";
import {
  gerarDiasDoAno,
  getFeriado,
  getComemorativa,
} from "../utils/agendaUtils";

export default {
  nome: "Anual Comercial (2 dias por página)",
  layout: (props) => {
    const { selectedDate, printing, ...rest } = props;
    const [y] = selectedDate.split("-").map(Number);
    const dias = gerarDiasDoAno(y);

    // Agrupa os dias em pares (folhas de 2 dias cada)
    const folhas = [];
    for (let i = 0; i < dias.length; i += 2) folhas.push(dias[i]);

    let totalDias = dias.length;
    let feriados = 0;
    let comemorativas = 0;
    let uteis = 0;
    dias.forEach((d) => {
      if (getFeriado(d)) feriados++;
      if (getComemorativa(d)) comemorativas++;
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
              Miolo de Agenda Anual Comercial (2 dias/página) — Ano {y}
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Contém {folhas.length} páginas consecutivas otimizadas para
              PDF/Impressora (Tema:{" "}
              <span className="uppercase font-bold">{props.colorTheme}</span>
              ). Sem grade de horário fixa e sem colunas de pagamento.
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
        {folhas.map((dia, i) => (
          <div key={i} className="page-break">
            <DoisDiasComercial data={dia} {...rest} />
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
