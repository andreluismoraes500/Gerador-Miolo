// src/components/MiniCalendario.jsx
//
// Mini calendário do mês, para o canto superior esquerdo das páginas do
// Diário Comercial (1 dia/página e 2 dias/página). Marca o dia em foco
// com um selo sólido — estilo comercial/profissional, sem enfeites.

import { getFeriado, getComemorativa } from "../utils/agendaUtils";

const DIAS_SEMANA = ["D", "S", "T", "Q", "Q", "S", "S"];

function gerarSemanas(ano, mes) {
  const primeiroDiaSemana = new Date(ano, mes, 1).getDay();
  const totalDias = new Date(ano, mes + 1, 0).getDate();
  const semanas = [];
  let semanaAtual = Array(7).fill(null);
  let cursor = primeiroDiaSemana;
  for (let d = 1; d <= totalDias; d++) {
    semanaAtual[cursor] = d;
    cursor++;
    if (cursor === 7) {
      semanas.push(semanaAtual);
      semanaAtual = Array(7).fill(null);
      cursor = 0;
    }
  }
  if (semanaAtual.some((v) => v !== null)) semanas.push(semanaAtual);
  return semanas;
}

export default function MiniCalendario({
  data,
  diaSecundario, // opcional: um segundo dia a destacar (folha de 2 dias/página)
  primaryColor = "#000000",
  secondaryColor = "#cbd5e1",
  compact = false,
}) {
  const ano = data.getFullYear();
  const mes = data.getMonth();
  const semanas = gerarSemanas(ano, mes);
  const diaFoco = data.getDate();
  const diaFoco2 =
    diaSecundario && diaSecundario.getMonth() === mes
      ? diaSecundario.getDate()
      : null;

  const cellSize = compact ? "h-[9px] w-[9px] text-[6px]" : "h-[11px] w-[11px] text-[7px]";
  const boxWidth = compact ? "w-[27mm]" : "w-[32mm]";

  return (
    <div
      className={`shrink-0 select-none rounded-sm border ${boxWidth} ${
        compact ? "p-1" : "p-1.5"
      }`}
      style={{ borderColor: secondaryColor }}
    >
      <div
        className={`grid grid-cols-7 gap-y-[1px] ${
          compact ? "gap-x-0" : "gap-x-[1px]"
        }`}
      >
        {DIAS_SEMANA.map((d, i) => (
          <span
            key={i}
            className={`flex items-center justify-center font-bold ${cellSize}`}
            style={{ color: secondaryColor, opacity: 0.9 }}
          >
            {d}
          </span>
        ))}

        {semanas.map((semana, si) =>
          semana.map((dia, di) => {
            if (!dia) return <span key={`${si}-${di}`} className={cellSize} />;

            const emFoco = dia === diaFoco || dia === diaFoco2;
            const dataCell = new Date(ano, mes, dia);
            const ehFeriado = !!getFeriado(dataCell);
            const ehComemorativa = !ehFeriado && !!getComemorativa(dataCell);

            let estilo = { color: "#374151" };
            let classe = `flex items-center justify-center leading-none ${cellSize}`;

            if (emFoco) {
              classe += " font-bold rounded-[1px]";
              estilo = { backgroundColor: primaryColor, color: "#ffffff" };
            } else if (ehFeriado) {
              classe += " font-bold";
              estilo = { color: "#b91c1c" };
            } else if (ehComemorativa) {
              classe += " font-semibold";
              estilo = { color: "#b45309" };
            }

            return (
              <span key={`${si}-${di}`} className={classe} style={estilo}>
                {dia}
              </span>
            );
          })
        )}
      </div>
    </div>
  );
}
