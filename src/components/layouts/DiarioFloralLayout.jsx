// src/components/layouts/DiarioFloralLayout.jsx
//
// Página "Agenda Floral" — 1 dia por página, no estilo:
//   canto com ilustração floral aquarela  +  mês em fonte cursiva
//   selo quadrado dourado com o número do dia  +  folha pautada em branco
//   versículo bíblico centralizado no rodapé, entre aspas
//
// Diferente do DiarioLivre/DiaCompleto (que têm tabela de horários),
// esta página é deliberadamente livre: só linhas, para quem quer
// escrever sem estrutura de compromissos.

import { getFeriado, getComemorativa } from "../../utils/agendaUtils";
import { getVersiculoAleatorio } from "../../utils/versiculos";
import FloralCorner from "../FloralCorner";
import Watermark from "../Watermark";
import EditableField from "../EditableField";
import { TEMAS } from "../../themes";

const DIAS_SEMANA = [
  "Domingo",
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
];

const LINHAS_PAUTA = 17;

export default function DiarioFloralLayout({
  data,
  colorTheme = "floralAzul",
  customColors = {},
  fontFamily = "sans-serif",
  cursiveFont = "'Dancing Script', 'Brush Script MT', cursive",
  watermarkSrc,
  watermarkOpacity,
}) {
  const tema = TEMAS[colorTheme] || TEMAS.floralAzul || TEMAS.classico;
  const feriado = getFeriado ? getFeriado(data) : null;
  const comemorativa = getComemorativa ? getComemorativa(data) : null;

  const bgColor = customColors.background || "#ffffff";
  const primaryColor = customColors.primary || tema.colors?.primary || "#3a6a86";
  const badgeColor = customColors.badge || tema.colors?.badge || "#e3c184";
  const lineColor = customColors.secondary || tema.colors?.secondary || "#dfe7ea";

  const palette = tema.floralPalette || undefined;

  const diaKey = data.toISOString().split("T")[0];
  const versiculo = getVersiculoAleatorio();

  const mesNome = data.toLocaleDateString("pt-BR", { month: "long" });
  const diaSemana = DIAS_SEMANA[data.getDay()];
  const numeroDia = String(data.getDate()).padStart(2, "0");

  return (
    <div
      className="printable-page text-gray-900 flex flex-col justify-between box-border select-none border-0 shadow-none rounded-none relative overflow-hidden"
      style={{ backgroundColor: bgColor, fontFamily }}
    >
      {watermarkSrc && <Watermark src={watermarkSrc} opacity={watermarkOpacity} />}

      {/* Ilustrações florais nos cantos — atrás de todo o conteúdo */}
      <FloralCorner position="top-left" size={185} palette={palette} />
      <FloralCorner position="bottom-right" size={150} palette={palette} />

      <div className="relative z-10 flex flex-col flex-1 min-h-0 px-2 pt-2">
        {/* ── Cabeçalho ─────────────────────────────────────────── */}
        <div className="flex items-start justify-end gap-3 mb-6 print:mb-4 pl-24">
          <div className="flex flex-col items-end text-right pt-0.5">
            <span
              className="text-4xl leading-none capitalize"
              style={{ fontFamily: cursiveFont, color: primaryColor }}
            >
              {mesNome}
            </span>
            <span className="text-[10px] tracking-[0.2em] uppercase text-gray-400 mt-1">
              {diaSemana}
            </span>
            {feriado && (
              <span className="text-[9px] mt-1 text-black border border-black px-1.5 py-0.5 rounded-sm bg-gray-50">
                {feriado.nome}
              </span>
            )}
            {comemorativa && !feriado && (
              <span className="text-[9px] italic mt-1 text-gray-500">
                {comemorativa}
              </span>
            )}
          </div>

          {/* Selo do dia */}
          <div
            className="flex items-center justify-center rounded-md shadow-sm print:shadow-none shrink-0"
            style={{
              width: "3.1rem",
              height: "3.1rem",
              backgroundColor: badgeColor,
            }}
          >
            <span className="text-2xl font-semibold text-gray-800">{numeroDia}</span>
          </div>
        </div>

        {/* ── Folha pautada ─────────────────────────────────────── */}
        <div className="flex-1 min-h-0 flex flex-col">
          {Array.from({ length: LINHAS_PAUTA }).map((_, i) => (
            <div
              key={i}
              className="border-b flex-1"
              style={{ borderColor: lineColor }}
            >
              <EditableField
                fieldKey={`${diaKey}-linha-${i}`}
                className="w-full h-full px-1 pt-1.5 text-[12px] leading-tight"
                placeholder=""
              />
            </div>
          ))}
        </div>
      </div>

      {/* ── Rodapé — versículo entre aspas ────────────────────── */}
      <div className="relative z-10 w-full pt-3 pb-1 flex flex-col items-center text-center print:pt-2">
        <p
          className="text-[10px] italic leading-snug max-w-[78%]"
          style={{ fontFamily: "Georgia, serif", color: "#444" }}
        >
          &ldquo;{versiculo}&rdquo;
        </p>
      </div>
    </div>
  );
}
