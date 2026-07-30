// src/components/layouts/CadernoConcursosLayout.jsx
import EditableField from "../EditableField";
import { PageShell, PageHeader, DividerPage, LinedPage, useVisual } from "./NotebookShared";

export const PALETA_MATERIAS = [
  "#1D4ED8", "#B91C1C", "#047857", "#B45309",
  "#7E22CE", "#0E7490", "#BE185D", "#4D7C0F",
];

function materiaFieldKey(index) {
  return `concursos-materia-${index}`;
}

export function ConcursosSumarioPage({ numMaterias, logo, ...rest }) {
  const { primaryColor, tema } = useVisual(rest.colorTheme, rest.customColors, rest.fontFamily);
  return (
    <PageShell {...rest}>
      <PageHeader logo={logo} title="Sumário" subtitle="Caderno de Concursos / ENEM" primaryColor={primaryColor} tema={tema} />
      <div className="flex-1 flex flex-col gap-0.5 pt-1">
        {Array.from({ length: numMaterias }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 py-2.5 border-b border-dotted border-gray-300">
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: PALETA_MATERIAS[i % PALETA_MATERIAS.length] }} />
            <EditableField fieldKey={materiaFieldKey(i)} className="flex-1 text-sm font-medium" placeholder="Matéria" />
            <span className="text-[9px] uppercase tracking-wide text-gray-400 shrink-0">pág.</span>
            <EditableField fieldKey={`concursos-sumario-pagina-${i}`} className="w-12 text-xs text-center border-b border-dashed border-gray-300 shrink-0" />
          </div>
        ))}
      </div>
    </PageShell>
  );
}

export function ConcursosDivisoriaPage({ index, logo, ...rest }) {
  return (
    <DividerPage
      index={index}
      cor={PALETA_MATERIAS[index % PALETA_MATERIAS.length]}
      fieldKey={materiaFieldKey(index)}
      defaultTitle={`Matéria ${index + 1}`}
      subtitle="Matéria"
      logo={logo}
      {...rest}
    />
  );
}

export function ConcursosPautadaPage({ materiaIndex, pageIndex, totalPaginas, ...rest }) {
  return (
    <LinedPage
      title={`Matéria ${materiaIndex + 1}`}
      fieldPrefix={`concursos-${materiaIndex}-pauta-${pageIndex}`}
      pageIndex={pageIndex}
      totalPaginas={totalPaginas}
      numLinhas={24}
      cor={PALETA_MATERIAS[materiaIndex % PALETA_MATERIAS.length]}
      {...rest}
    />
  );
}

export function ConcursosErrosPage({ materiaIndex, logo, ...rest }) {
  const { secondaryColor } = useVisual(rest.colorTheme, rest.customColors, rest.fontFamily);
  const cor = PALETA_MATERIAS[materiaIndex % PALETA_MATERIAS.length];
  const fk = `concursos-${materiaIndex}-erros`;
  return (
    <PageShell {...rest}>
      <div className="flex items-center justify-between border-b pb-2 mb-3 shrink-0" style={{ borderColor: secondaryColor }}>
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: cor }} />
          <span className="text-xs font-bold uppercase tracking-widest text-gray-700 truncate">Revisão de questões erradas</span>
        </div>
      </div>
      <div
        className="grid grid-cols-[1fr_1.2fr_20mm] gap-2 pb-1.5 mb-1 border-b-2 text-[9px] font-bold uppercase tracking-widest text-gray-500"
        style={{ borderBottomColor: secondaryColor }}
      >
        <span>Questão / tema</span>
        <span>Motivo do erro</span>
        <span>Revisar em</span>
      </div>
      {Array.from({ length: 16 }).map((_, i) => (
        <div key={i} className="grid grid-cols-[1fr_1.2fr_20mm] gap-2 py-2 border-b border-dotted border-gray-200 last:border-0">
          <EditableField fieldKey={`${fk}-questao-${i}`} className="text-xs" />
          <EditableField fieldKey={`${fk}-motivo-${i}`} className="text-xs" />
          <EditableField fieldKey={`${fk}-data-${i}`} className="text-xs" placeholder="__/__" />
        </div>
      ))}
    </PageShell>
  );
}
