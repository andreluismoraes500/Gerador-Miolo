// src/components/layouts/DiaComercialBloco.jsx
//
// Bloco de "um dia" da agenda comercial SEM grade de horário fixa.
// Em vez de imprimir horários (07:00, 07:30, ...), usa uma lista numerada
// de linhas em branco — igual ao que a maioria das agendas comerciais de
// papelaria faz quando oferece a versão "2 dias por página": sem hora
// impressa, o cliente escreve o compromisso na ordem em que ele surge.
//
// Este componente é usado de duas formas:
//   - "cheio"    → DiaComercial.jsx        (1 dia por página, mais linhas)
//   - "compacto" → DoisDiasComercial.jsx   (2 blocos empilhados numa página)

import { MdStarBorder, MdPushPin } from "react-icons/md";
import { FaCalendarDays } from "react-icons/fa6";
import { getFeriado, getComemorativa } from "../../utils/agendaUtils";
import EditableField from "../EditableField";
import Logo from "../Logo";
import MiniCalendario from "../MiniCalendario";

export default function DiaComercialBloco({
  data,
  diaSecundario, // opcional: outro dia da mesma folha, para destacar no mini calendário
  primaryColor = "#000000",
  secondaryColor = "#cbd5e1",
  compact = false,
  linhas, // opcional: força a quantidade de linhas
  logo,
  mostrarMiniCalendario = true,
  posicaoMiniCalendario = "esquerda", // "esquerda" | "direita"
}) {
  const feriado = getFeriado(data);
  const comemorativa = getComemorativa(data);
  const diaKey = data.toISOString().split("T")[0];

  // Quantidade de linhas: menos no modo compacto (2 dias/página),
  // mais no modo cheio (1 dia/página). Como as linhas usam flex-1, elas
  // sempre esticam para preencher 100% do espaço disponível — este número
  // só define quantas linhas cabem nesse espaço.
  const totalLinhas = linhas ?? (compact ? 14 : 28);

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Cabeçalho */}
      <div
        className={`border-b-2 flex items-end justify-between w-full shrink-0 ${
          compact ? "pb-1.5 mb-1.5" : "pb-3 mb-4 print:mb-2"
        }`}
        style={{ borderBottomColor: primaryColor }}
      >
        <div className={`flex items-center ${compact ? "gap-2" : "gap-2.5"}`}>
          {mostrarMiniCalendario && posicaoMiniCalendario === "esquerda" && (
            <MiniCalendario
              data={data}
              diaSecundario={diaSecundario}
              primaryColor={primaryColor}
              secondaryColor={secondaryColor}
              compact={compact}
            />
          )}
          {!compact && <Logo src={logo} />}
          <FaCalendarDays
            className={compact ? "w-3.5 h-3.5" : "w-5 h-5 mb-1"}
            style={{ color: primaryColor }}
          />
          <div className="space-y-0.5">
            <h2
              className={`capitalize ${compact ? "text-[13px] font-semibold" : ""}`}
              style={{ color: primaryColor }}
            >
              {data.toLocaleDateString("pt-BR", { weekday: "long" })}
            </h2>
            <p
              className={`uppercase tracking-wide text-gray-400 font-semibold ${
                compact ? "text-[9px]" : "text-[11px]"
              }`}
            >
              {data.toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-right">
          {mostrarMiniCalendario && posicaoMiniCalendario === "direita" && (
            <MiniCalendario
              data={data}
              diaSecundario={diaSecundario}
              primaryColor={primaryColor}
              secondaryColor={secondaryColor}
              compact={compact}
            />
          )}
          <div className="flex items-baseline gap-3">
            <div className="flex flex-col justify-end text-[8px] uppercase tracking-wider font-semibold text-gray-400 space-y-1 mb-0.5">
              {feriado && (
                <span className="text-black border border-black px-1.5 py-0.5 rounded-sm flex items-center gap-1 bg-gray-50">
                  <MdStarBorder className="w-3 h-3 text-amber-500" /> {feriado.nome}
                </span>
              )}
              {comemorativa && !feriado && (
                <span className="italic font-medium flex items-center justify-end gap-1 text-gray-500">
                  <MdPushPin className="w-2.5 h-2.5 text-gray-400" /> {comemorativa}
                </span>
              )}
            </div>
            <span
              className={`font-extralight tracking-tighter font-serif text-black leading-none ${
                compact ? "text-2xl min-w-[1.6rem]" : "text-5xl min-w-[2.8rem]"
              }`}
            >
              {String(data.getDate()).padStart(2, "0")}
            </span>
          </div>
        </div>
      </div>

      {/* Linhas em branco — sem cabeçalho, sem numeração, sem hora.
          flex-1 em cada linha faz com que elas se estiquem e preencham
          100% da altura disponível, sem sobrar espaço em branco. */}
      <div className="flex flex-col flex-1 min-h-0">
        {Array.from({ length: totalLinhas }).map((_, i) => (
          <div
            key={i}
            className="border-b border-solid flex-1 flex items-stretch"
            style={{ borderBottomColor: secondaryColor }}
          >
            <EditableField
              fieldKey={`${diaKey}-l${i}`}
              className="w-full h-full flex items-center text-[11px] px-1"
              placeholder=""
            />
          </div>
        ))}
      </div>
    </div>
  );
}
