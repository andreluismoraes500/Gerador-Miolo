// src/components/layouts/CadernoIdiomasLayout.jsx
import EditableField from "../EditableField";
import { PageShell, PageHeader, DividerPage, useVisual } from "./NotebookShared";

export const PALETA_LICOES = [
  "#2563EB", "#059669", "#DC2626", "#D97706",
  "#7C3AED", "#0891B2", "#DB2777", "#65A30D",
];

function licaoFieldKey(index) {
  return `idiomas-licao-${index}`;
}

export function IdiomasSumarioPage({ numLicoes, logo, ...rest }) {
  const { primaryColor, tema } = useVisual(rest.colorTheme, rest.customColors, rest.fontFamily);
  return (
    <PageShell {...rest}>
      <PageHeader logo={logo} title="Sumário" subtitle="Caderno de Idiomas" primaryColor={primaryColor} tema={tema} />
      <div className="flex-1 flex flex-col gap-0.5 pt-1">
        {Array.from({ length: numLicoes }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 py-2.5 border-b border-dotted border-gray-300">
            <span className="text-xs font-bold w-6 text-right shrink-0" style={{ color: PALETA_LICOES[i % PALETA_LICOES.length] }}>
              {i + 1}.
            </span>
            <EditableField fieldKey={licaoFieldKey(i)} className="flex-1 text-sm font-medium" placeholder="Lição / unidade" />
            <span className="text-[9px] uppercase tracking-wide text-gray-400 shrink-0">pág.</span>
            <EditableField fieldKey={`idiomas-sumario-pagina-${i}`} className="w-12 text-xs text-center border-b border-dashed border-gray-300 shrink-0" />
          </div>
        ))}
      </div>
    </PageShell>
  );
}

export function IdiomasDivisoriaPage({ index, logo, ...rest }) {
  return (
    <DividerPage
      index={index}
      cor={PALETA_LICOES[index % PALETA_LICOES.length]}
      fieldKey={licaoFieldKey(index)}
      defaultTitle={`Lição ${index + 1}`}
      subtitle="Novo vocabulário"
      logo={logo}
      {...rest}
    />
  );
}

export function IdiomasVocabularioPage({ licaoIndex, pageIndex, totalPaginas, numLinhas = 12, ...rest }) {
  const { secondaryColor } = useVisual(rest.colorTheme, rest.customColors, rest.fontFamily);
  const cor = PALETA_LICOES[licaoIndex % PALETA_LICOES.length];
  const fk = `idiomas-${licaoIndex}-vocab-${pageIndex}`;
  return (
    <PageShell {...rest}>
      <div className="flex items-center justify-between border-b pb-2 mb-3 shrink-0" style={{ borderColor: secondaryColor }}>
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: cor }} />
          <span className="text-xs font-bold uppercase tracking-widest text-gray-700 truncate">Vocabulário</span>
        </div>
        <span className="text-[10px] text-gray-400 shrink-0">{pageIndex + 1}/{totalPaginas}</span>
      </div>
      <div
        className="grid grid-cols-[1fr_1fr_1.4fr] gap-2 pb-1.5 mb-1 border-b-2 text-[9px] font-bold uppercase tracking-widest text-gray-500"
        style={{ borderBottomColor: secondaryColor }}
      >
        <span>Palavra</span>
        <span>Tradução</span>
        <span>Frase de exemplo</span>
      </div>
      {Array.from({ length: numLinhas }).map((_, i) => (
        <div key={i} className="grid grid-cols-[1fr_1fr_1.4fr] gap-2 py-2 border-b border-dotted border-gray-200 last:border-0">
          <EditableField fieldKey={`${fk}-palavra-${i}`} className="text-xs" />
          <EditableField fieldKey={`${fk}-traducao-${i}`} className="text-xs" />
          <EditableField fieldKey={`${fk}-frase-${i}`} className="text-xs" />
        </div>
      ))}
    </PageShell>
  );
}
