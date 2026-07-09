// src/components/layouts/CadernoUniversitarioLayout.jsx
//
// Conjunto de páginas que compõem o template "Caderno Universitário":
//   1. Sumário            → lista das matérias com número de página
//   2. Contatos Úteis     → colegas de turma e professores
//   3. Divisórias de Bimestre (x4) → notas, metas e datas importantes
//   4. Divisória + Folhas Pautadas (por matéria)
//   5. Divisória + Folhas Quadriculadas (exercícios/desenhos)
//
// Todas as páginas compartilham o mesmo "casco" (PageShell) e usam a mesma
// fieldKey (`caderno-materia-{i}`) para o nome de cada matéria, de forma que
// editar o nome em qualquer página (sumário, divisória ou bimestre) atualiza
// automaticamente as demais.

import Footer from "../Footer";
import Logo from "../Logo";
import Watermark from "../Watermark";
import Background from "../Background";
import EditableField from "../EditableField";
import { TEMAS } from "../../themes";
import { useAgendaData } from "../../context/AgendaDataContext";

// Paleta cíclica usada nas divisórias e nos detalhes de cada matéria — dá um
// ar colorido e organizado mesmo quando o tema escolhido é mais neutro.
const PALETA_DIVISORIAS = [
  "#DC2626",
  "#EA580C",
  "#D97706",
  "#65A30D",
  "#059669",
  "#0891B2",
  "#2563EB",
  "#7C3AED",
  "#C026D3",
  "#DB2777",
];

function useVisual(colorTheme, customColors = {}, fontFamily) {
  const tema = TEMAS[colorTheme] || TEMAS.classico;
  return {
    tema,
    bgColor: customColors.background || "#ffffff",
    primaryColor: customColors.primary || tema.text || "#000000",
    secondaryColor: customColors.secondary || tema.border || "#cbd5e1",
    fontFamily,
  };
}

function PageShell({
  children,
  fontFamily,
  watermarkSrc,
  watermarkOpacity,
  backgroundSrc,
  backgroundOpacity,
  footerName,
  footerType,
  colorTheme,
  customColors = {},
}) {
  const bgColor = customColors.background || "#ffffff";
  return (
    <div
      className="printable-page bg-white text-gray-900 flex flex-col justify-between box-border select-none border-0 shadow-none rounded-none"
      style={{ backgroundColor: bgColor, fontFamily }}
    >
      {backgroundSrc && <Background src={backgroundSrc} opacity={backgroundOpacity} />}
      {watermarkSrc && (
        <Watermark src={watermarkSrc} opacity={watermarkOpacity} />
      )}
      <div className="flex flex-col flex-1 min-h-0">{children}</div>
      <Footer
        name={footerName}
        type={footerType}
        colorTheme={colorTheme}
        customColors={customColors}
        fontFamily={fontFamily}
      />
    </div>
  );
}

function nomeMateriaFieldKey(index) {
  return `caderno-materia-${index}`;
}

// ─────────────────────────────────────────────────────────────────────────
// 1. SUMÁRIO
// ─────────────────────────────────────────────────────────────────────────
export function CadernoSumarioPage({ numMaterias, logo, ...rest }) {
  const { primaryColor, tema } = useVisual(
    rest.colorTheme,
    rest.customColors,
    rest.fontFamily,
  );

  return (
    <PageShell {...rest}>
      <div
        className="border-b-2 pb-3 flex items-end justify-between mb-6 w-full shrink-0"
        style={{ borderBottomColor: primaryColor }}
      >
        <div className="flex items-center gap-3.5">
          <Logo src={logo} />
          <div className="space-y-0.5">
            <h2
              className={`text-lg font-bold uppercase tracking-widest ${tema.headingFont}`}
              style={{ color: primaryColor }}
            >
              Sumário
            </h2>
            <p className="text-[10px] uppercase tracking-wide text-gray-400 font-semibold">
              Caderno Universitário
            </p>
          </div>
        </div>
        <div className="text-right text-[10px] text-gray-400 uppercase tracking-wide">
          <span>Ano / Semestre </span>
          <EditableField
            fieldKey="caderno-sumario-periodo"
            className="inline-block min-w-[25mm] border-b border-dashed border-gray-300 text-center text-xs text-gray-700 normal-case"
          />
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-0.5 pt-1">
        {Array.from({ length: numMaterias }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-3 py-2.5 border-b border-dotted border-gray-300"
          >
            <span
              className="text-xs font-bold w-6 text-right shrink-0"
              style={{ color: PALETA_DIVISORIAS[i % PALETA_DIVISORIAS.length] }}
            >
              {i + 1}.
            </span>
            <EditableField
              fieldKey={nomeMateriaFieldKey(i)}
              className="flex-1 text-sm font-medium"
              placeholder={``}
            />
            <span className="text-[9px] uppercase tracking-wide text-gray-400 shrink-0">
              pág.
            </span>
            <EditableField
              fieldKey={`caderno-sumario-pagina-${i}`}
              className="w-12 text-xs text-center border-b border-dashed border-gray-300 shrink-0"
              placeholder=""
            />
          </div>
        ))}
      </div>
    </PageShell>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// 2. CONTATOS ÚTEIS
// ─────────────────────────────────────────────────────────────────────────
const LINHAS_CONTATOS = 12;

export function CadernoContatosPage({ logo, ...rest }) {
  const { primaryColor, secondaryColor, tema } = useVisual(
    rest.colorTheme,
    rest.customColors,
    rest.fontFamily,
  );

  return (
    <PageShell {...rest}>
      <div
        className="border-b-2 pb-3 flex items-end justify-between mb-5 w-full shrink-0"
        style={{ borderBottomColor: primaryColor }}
      >
        <div className="flex items-center gap-3.5">
          <Logo src={logo} />
          <div className="space-y-0.5">
            <h2
              className={`text-lg font-bold uppercase tracking-widest ${tema.headingFont}`}
              style={{ color: primaryColor }}
            >
              Contatos Úteis
            </h2>
            <p className="text-[10px] uppercase tracking-wide text-gray-400 font-semibold">
              Colegas de turma e professores
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        <div
          className="grid grid-cols-[1fr_1fr_1.2fr] gap-2 pb-1.5 mb-1 border-b-2 text-[9px] font-bold uppercase tracking-widest text-gray-500"
          style={{ borderBottomColor: secondaryColor }}
        >
          <span>Nome</span>
          <span>Disciplina / Turma</span>
          <span>Contato</span>
        </div>
        {Array.from({ length: LINHAS_CONTATOS }).map((_, i) => (
          <div
            key={i}
            className="grid grid-cols-[1fr_1fr_1.2fr] gap-2 py-2.5 border-b border-dotted border-gray-200 last:border-0"
          >
            <EditableField
              fieldKey={`caderno-contato-nome-${i}`}
              className="text-xs"
            />
            <EditableField
              fieldKey={`caderno-contato-disciplina-${i}`}
              className="text-xs"
            />
            <EditableField
              fieldKey={`caderno-contato-info-${i}`}
              className="text-xs"
            />
          </div>
        ))}
      </div>
    </PageShell>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// 3. DIVISÓRIA DE BIMESTRE
// ─────────────────────────────────────────────────────────────────────────
export function CadernoBimestrePage({ numero, numMaterias, logo, ...rest }) {
  const { secondaryColor, tema } = useVisual(
    rest.colorTheme,
    rest.customColors,
    rest.fontFamily,
  );
  const cor = PALETA_DIVISORIAS[(numero - 1) % PALETA_DIVISORIAS.length];

  return (
    <PageShell {...rest}>
      <div
        className="border-b-2 pb-3 mb-4 flex items-end justify-between shrink-0"
        style={{ borderBottomColor: cor }}
      >
        <div className="flex items-center gap-3.5">
          <Logo src={logo} />
          <div className="space-y-0.5">
            <h2
              className={`text-lg font-bold uppercase tracking-widest ${tema.headingFont}`}
              style={{ color: cor }}
            >
              {numero}º Bimestre
            </h2>
            <p className="text-[10px] uppercase tracking-wide text-gray-400 font-semibold">
              Boletim e metas do período
            </p>
          </div>
        </div>
        <div className="text-right text-[10px] text-gray-400 uppercase tracking-wide">
          <span>Frequência </span>
          <EditableField
            fieldKey={`caderno-bimestre-${numero}-frequencia`}
            className="inline-block w-10 border-b border-dashed border-gray-300 text-center text-xs text-gray-700 normal-case"
          />
          <span> %</span>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-2 gap-5 min-h-0">
        <div
          className="border border-solid rounded-sm p-3 flex flex-col min-h-0"
          style={{ borderColor: secondaryColor }}
        >
          <h3
            className="text-[10px] font-bold uppercase tracking-widest mb-2 border-b pb-1.5 shrink-0"
            style={{ color: cor, borderColor: secondaryColor }}
          >
            Notas por disciplina
          </h3>
          <div className="flex-1 overflow-hidden">
            {Array.from({ length: numMaterias }).map((_, i) => (
              <div
                key={i}
                className="grid grid-cols-[1fr_18mm] gap-2 items-center py-1.5 border-b border-dotted border-gray-100 last:border-0"
              >
                <EditableField
                  fieldKey={nomeMateriaFieldKey(i)}
                  className="text-xs truncate"
                  placeholder={``}
                />
                <EditableField
                  fieldKey={`caderno-bimestre-${numero}-nota-${i}`}
                  className="text-xs text-center border-b border-dashed border-gray-300"
                  placeholder=""
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 min-h-0">
          <div
            className="border border-solid rounded-sm p-3 flex-1 min-h-0"
            style={{ borderColor: secondaryColor }}
          >
            <h3
              className="text-[10px] font-bold uppercase tracking-widest mb-2 border-b pb-1.5"
              style={{ color: cor, borderColor: secondaryColor }}
            >
              Metas do bimestre
            </h3>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-2 mb-2.5">
                <div
                  className="w-3.5 h-3.5 rounded border shrink-0"
                  style={{ borderColor: secondaryColor }}
                />
                <EditableField
                  fieldKey={`caderno-bimestre-${numero}-meta-${i}`}
                  className="flex-1 h-6 border-b border-dotted border-gray-300 text-xs"
                />
              </div>
            ))}
          </div>

          <div
            className="border border-solid rounded-sm p-3"
            style={{ borderColor: secondaryColor }}
          >
            <h3
              className="text-[10px] font-bold uppercase tracking-widest mb-2 border-b pb-1.5"
              style={{ color: cor, borderColor: secondaryColor }}
            >
              Datas importantes
            </h3>
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="grid grid-cols-[16mm_1fr] gap-2 items-center py-1 border-b border-dotted border-gray-100 last:border-0"
              >
                <EditableField
                  fieldKey={`caderno-bimestre-${numero}-data-${i}`}
                  className="text-xs text-center border-r pr-1"
                  style={{ borderColor: secondaryColor }}
                  placeholder="___/___"
                />
                <EditableField
                  fieldKey={`caderno-bimestre-${numero}-evento-${i}`}
                  className="text-xs"
                  placeholder=""
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageShell>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// 4. DIVISÓRIA (matéria ou seção genérica, ex: "Folhas Quadriculadas")
// ─────────────────────────────────────────────────────────────────────────
export function CadernoDivisoriaPage({
  index,
  subtitle,
  defaultTitle,
  logo,
  ...rest
}) {
  const { primaryColor, tema } = useVisual(
    rest.colorTheme,
    rest.customColors,
    rest.fontFamily,
  );
  const cor =
    index != null
      ? PALETA_DIVISORIAS[index % PALETA_DIVISORIAS.length]
      : primaryColor;
  const fieldKey =
    index != null
      ? nomeMateriaFieldKey(index)
      : "caderno-divisoria-extra-titulo";

  return (
    <PageShell {...rest}>
      <div className="flex-1 flex items-center justify-center relative overflow-hidden min-h-0">
        <div
          className="absolute top-0 left-0 w-full h-[42%]"
          style={{ backgroundColor: cor, opacity: 0.1 }}
        />
        <div
          className="absolute top-0 left-0 w-full h-2.5"
          style={{ backgroundColor: cor }}
        />

        <div className="relative z-10 flex flex-col items-center gap-5 text-center px-8">
          <Logo src={logo} />

          {index != null && (
            <span
              className="text-[100px] font-black leading-none"
              style={{ color: cor, opacity: 0.85 }}
            >
              {String(index + 1).padStart(2, "0")}
            </span>
          )}

          <EditableField
            fieldKey={fieldKey}
            className={`text-3xl font-bold uppercase tracking-widest text-center min-w-[80mm] ${tema.headingFont}`}
            placeholder={defaultTitle}
            style={{ color: primaryColor }}
          />

          {subtitle && (
            <p className="text-xs uppercase tracking-[0.3em] text-gray-400">
              {subtitle}
            </p>
          )}

          {index != null && (
            <div className="flex gap-8 mt-3 text-xs text-gray-500">
              <div className="flex flex-col items-center gap-1">
                <span className="uppercase tracking-widest text-[9px] text-gray-400">
                  Professor(a)
                </span>
                <EditableField
                  fieldKey={`${fieldKey}-professor`}
                  className="min-w-[45mm] text-center border-b border-dashed border-gray-300 text-sm"
                />
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="uppercase tracking-widest text-[9px] text-gray-400">
                  Ano / Semestre
                </span>
                <EditableField
                  fieldKey={`${fieldKey}-periodo`}
                  className="min-w-[35mm] text-center border-b border-dashed border-gray-300 text-sm"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </PageShell>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// 5. FOLHA PAUTADA
// ─────────────────────────────────────────────────────────────────────────
export function CadernoPautadaPage({
  materiaIndex,
  pageIndex,
  totalPaginas,
  numLinhas = 26,
  ...rest
}) {
  const { secondaryColor } = useVisual(
    rest.colorTheme,
    rest.customColors,
    rest.fontFamily,
  );
  const { getField } = useAgendaData();
  const cor = PALETA_DIVISORIAS[materiaIndex % PALETA_DIVISORIAS.length];
  const nomeMateria =
    getField(nomeMateriaFieldKey(materiaIndex)) ||
    `Disciplina ${String(materiaIndex + 1).padStart(2, "0")}`;

  return (
    <PageShell {...rest}>
      <div
        className="flex items-center justify-between border-b pb-2 mb-3 shrink-0"
        style={{ borderColor: secondaryColor }}
      >
        <div className="flex items-center gap-2 min-w-0">
          <span
            className="w-2.5 h-2.5 rounded-full shrink-0"
            style={{ backgroundColor: cor }}
          />
          <span className="text-xs font-bold uppercase tracking-widest text-gray-700 truncate">
            {nomeMateria}
          </span>
        </div>
        <div className="flex items-center gap-4 text-[10px] text-gray-400 shrink-0">
          <span className="flex items-center gap-1">
            Data
            <EditableField
              fieldKey={`caderno-materia-${materiaIndex}-pautada-${pageIndex}-data`}
              className="inline-block w-14 border-b border-dashed border-gray-300 text-gray-700"
            />
          </span>
          <span>
            {pageIndex + 1}/{totalPaginas}
          </span>
        </div>
      </div>

      {/* Corpo pautado, com margem estilo caderno universitário comum */}
      <div className="flex-1 relative min-h-0">
        <div
          className="absolute top-0 bottom-0"
          style={{ left: "13mm", width: "1px", backgroundColor: "#f3a6a6" }}
        />
        <div className="h-full flex flex-col" style={{ paddingLeft: "17mm" }}>
          {Array.from({ length: numLinhas }).map((_, i) => (
            <div
              key={i}
              className="flex-1 border-b"
              style={{ borderColor: "#c7dcf5" }}
            >
              <EditableField
                fieldKey={`caderno-materia-${materiaIndex}-pautada-${pageIndex}-linha-${i}`}
                className="w-full h-full text-sm px-1"
              />
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// 6. FOLHA QUADRICULADA
// ─────────────────────────────────────────────────────────────────────────
export function CadernoQuadriculadaPage({ pageIndex, totalPaginas, ...rest }) {
  const { secondaryColor } = useVisual(
    rest.colorTheme,
    rest.customColors,
    rest.fontFamily,
  );

  return (
    <PageShell {...rest}>
      <div
        className="flex items-center justify-between border-b pb-2 mb-3 shrink-0"
        style={{ borderColor: secondaryColor }}
      >
        <span className="text-xs font-bold uppercase tracking-widest text-gray-700">
          Folha Quadriculada
        </span>
        <span className="text-[10px] text-gray-400">
          {pageIndex + 1}/{totalPaginas}
        </span>
      </div>
      <div
        className="flex-1 min-h-0"
        style={{
          backgroundImage:
            "linear-gradient(to right, #d6d3d1 1px, transparent 1px), linear-gradient(to bottom, #d6d3d1 1px, transparent 1px)",
          backgroundSize: "6mm 6mm",
        }}
      />
    </PageShell>
  );
}
