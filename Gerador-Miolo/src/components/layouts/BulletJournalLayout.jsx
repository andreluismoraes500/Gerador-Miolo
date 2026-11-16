// src/components/layouts/BulletJournalLayout.jsx
//
// Páginas do template "Bullet Journal": índice de coleções, legenda de
// símbolos (o "key" clássico do método) e folhas pontilhadas em branco, sem
// nenhuma estrutura fixa — o usuário desenha o próprio sistema.

import EditableField from "../EditableField";
import { PageShell, PageHeader, DottedPage, useVisual } from "./NotebookShared";

// ─────────────────────────────────────────────────────────────────────────
// ÍNDICE (lista de coleções/páginas, como no método Bullet Journal original)
// ─────────────────────────────────────────────────────────────────────────
export function BulletIndicePage({ numLinhas, logo, ...rest }) {
  const { primaryColor, tema } = useVisual(
    rest.colorTheme,
    rest.customColors,
    rest.fontFamily,
  );
  return (
    <PageShell {...rest}>
      <PageHeader
        logo={logo}
        title="Índice"
        subtitle="Bullet Journal"
        primaryColor={primaryColor}
        tema={tema}
      />
      <div className="flex-1 flex flex-col gap-0.5 pt-1">
        {Array.from({ length: numLinhas }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-3 py-2 border-b border-dotted border-gray-300"
          >
            <EditableField
              fieldKey={`bullet-indice-colecao-${i}`}
              className="flex-1 text-sm"
              placeholder="Coleção / assunto"
            />
            <span className="text-[9px] uppercase tracking-wide text-gray-400 shrink-0">
              pág.
            </span>
            <EditableField
              fieldKey={`bullet-indice-pagina-${i}`}
              className="w-12 text-xs text-center border-b border-dashed border-gray-300 shrink-0"
            />
          </div>
        ))}
      </div>
    </PageShell>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// LEGENDA (chave de símbolos: tarefa, evento, nota, prioridade...)
// ─────────────────────────────────────────────────────────────────────────
const SIMBOLOS_PADRAO = ["•", "○", "—", "★", "!"];

export function BulletLegendaPage({ logo, ...rest }) {
  const { primaryColor, secondaryColor, tema } = useVisual(
    rest.colorTheme,
    rest.customColors,
    rest.fontFamily,
  );
  return (
    <PageShell {...rest}>
      <PageHeader
        logo={logo}
        title="Legenda"
        subtitle="Chave de símbolos"
        primaryColor={primaryColor}
        tema={tema}
      />
      <div className="flex-1 flex flex-col gap-1 pt-1 max-w-[110mm]">
        {SIMBOLOS_PADRAO.map((simbolo, i) => (
          <div
            key={i}
            className="flex items-center gap-4 py-2.5 border-b border-dotted border-gray-200"
          >
            <span
              className="w-6 text-lg text-center shrink-0"
              style={{ color: primaryColor }}
            >
              {simbolo}
            </span>
            <EditableField
              fieldKey={`bullet-legenda-significado-${i}`}
              className="flex-1 text-sm"
              placeholder="significado"
            />
          </div>
        ))}
        <div
          className="mt-5 border rounded-sm p-3"
          style={{ borderColor: secondaryColor }}
        >
          <p className="text-[9px] uppercase tracking-widest text-gray-400 mb-1">
            Notas rápidas sobre o método
          </p>
          <EditableField
            fieldKey="bullet-legenda-notas"
            className="text-xs leading-relaxed min-h-[16mm]"
          />
        </div>
      </div>
    </PageShell>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// FOLHA PONTILHADA (em branco — o coração do bullet journal)
// ─────────────────────────────────────────────────────────────────────────
export function BulletPontilhadaPage({ pageIndex, totalPaginas, ...rest }) {
  return (
    <DottedPage
      title={`Página ${pageIndex + 1}`}
      pageIndex={pageIndex}
      totalPaginas={totalPaginas}
      {...rest}
    />
  );
}
