// src/components/layouts/BabyBookLayout.jsx
//
// Páginas do template "Diário de Bebê": boas-vindas, marcos importantes,
// curva de crescimento mês a mês, e páginas de álbum (foto + legenda).

import EditableField from "../EditableField";
import Logo from "../Logo";
import { PageShell, PageHeader, useVisual } from "./NotebookShared";

// ─────────────────────────────────────────────────────────────────────────
// BOAS-VINDAS
// ─────────────────────────────────────────────────────────────────────────
export function BabyBoasVindasPage({ logo, ...rest }) {
  const { primaryColor, secondaryColor, tema } = useVisual(
    rest.colorTheme,
    rest.customColors,
    rest.fontFamily,
  );
  return (
    <PageShell {...rest}>
      <div className="flex-1 flex flex-col items-center justify-center text-center gap-6 px-8">
        <Logo src={logo} />
        <EditableField
          fieldKey="baby-nome"
          className={`text-3xl font-bold text-center min-w-[80mm] ${tema.headingFont}`}
          placeholder="Nome do bebê"
          style={{ color: primaryColor }}
        />
        <div className="grid grid-cols-2 gap-4 w-full max-w-[110mm]">
          {[
            ["Data de nascimento", "data", "__/__/____"],
            ["Horário", "horario", "__:__"],
            ["Peso", "peso", "___ kg"],
            ["Altura", "altura", "___ cm"],
          ].map(([label, key, placeholder]) => (
            <div
              key={key}
              className="border rounded-sm p-2 text-center"
              style={{ borderColor: secondaryColor }}
            >
              <p className="text-[9px] uppercase tracking-widest text-gray-400 mb-1">
                {label}
              </p>
              <EditableField
                fieldKey={`baby-${key}`}
                className="text-sm text-center"
                placeholder={placeholder}
              />
            </div>
          ))}
        </div>
        <div
          className="w-full max-w-[110mm] border rounded-sm p-3"
          style={{ borderColor: secondaryColor }}
        >
          <p className="text-[9px] uppercase tracking-widest text-gray-400 mb-1">
            Pais / Responsáveis
          </p>
          <EditableField fieldKey="baby-pais" className="text-sm min-h-[6mm]" />
        </div>
      </div>
    </PageShell>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// MARCOS IMPORTANTES
// ─────────────────────────────────────────────────────────────────────────
const MARCOS_PADRAO = [
  "Primeiro sorriso",
  "Primeira noite dormindo a noite toda",
  "Primeiro dente",
  "Primeira palavra",
  "Primeiro engatinhar",
  "Primeiros passos",
  "Primeiro dia na creche/escola",
  "Primeiro aniversário",
];

export function BabyMarcosPage({ logo, ...rest }) {
  const { primaryColor, secondaryColor, tema } = useVisual(
    rest.colorTheme,
    rest.customColors,
    rest.fontFamily,
  );
  return (
    <PageShell {...rest}>
      <PageHeader
        logo={logo}
        title="Marcos"
        subtitle="Momentos especiais"
        primaryColor={primaryColor}
        tema={tema}
      />
      <div className="flex-1 flex flex-col gap-0.5 pt-1">
        {MARCOS_PADRAO.map((marco, i) => (
          <div
            key={i}
            className="grid grid-cols-[1fr_28mm_1fr] gap-3 items-center py-2.5 border-b border-dotted border-gray-200"
          >
            <span className="text-xs font-medium text-gray-700">{marco}</span>
            <EditableField
              fieldKey={`baby-marco-${i}-data`}
              className="text-xs text-center border-b border-dashed"
              style={{ borderColor: secondaryColor }}
              placeholder="__/__/____"
            />
            <EditableField
              fieldKey={`baby-marco-${i}-obs`}
              className="text-xs text-gray-500"
              placeholder="observação"
            />
          </div>
        ))}
      </div>
    </PageShell>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// CURVA DE CRESCIMENTO (mês a mês)
// ─────────────────────────────────────────────────────────────────────────
export function BabyCrescimentoPage({ numMeses = 12, logo, ...rest }) {
  const { primaryColor, secondaryColor, tema } = useVisual(
    rest.colorTheme,
    rest.customColors,
    rest.fontFamily,
  );
  return (
    <PageShell {...rest}>
      <PageHeader
        logo={logo}
        title="Curva de Crescimento"
        subtitle="Peso e altura mês a mês"
        primaryColor={primaryColor}
        tema={tema}
      />
      <div
        className="grid grid-cols-[16mm_1fr_1fr_1fr] gap-2 pb-1.5 mb-1 border-b-2 text-[9px] font-bold uppercase tracking-widest text-gray-500"
        style={{ borderBottomColor: secondaryColor }}
      >
        <span>Mês</span>
        <span>Peso</span>
        <span>Altura</span>
        <span>Observações</span>
      </div>
      {Array.from({ length: numMeses }).map((_, i) => (
        <div
          key={i}
          className="grid grid-cols-[16mm_1fr_1fr_1fr] gap-2 py-2 border-b border-dotted border-gray-200 last:border-0"
        >
          <span className="text-xs font-semibold text-gray-500">{i + 1}º mês</span>
          <EditableField fieldKey={`baby-cresc-${i}-peso`} className="text-xs" placeholder="___ kg" />
          <EditableField fieldKey={`baby-cresc-${i}-altura`} className="text-xs" placeholder="___ cm" />
          <EditableField fieldKey={`baby-cresc-${i}-obs`} className="text-xs" />
        </div>
      ))}
    </PageShell>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// ÁLBUM DE MOMENTOS (foto + legenda, em grade)
// ─────────────────────────────────────────────────────────────────────────
export function BabyAlbumPage({ pageIndex, totalPaginas, logo, ...rest }) {
  const { primaryColor, secondaryColor, tema } = useVisual(
    rest.colorTheme,
    rest.customColors,
    rest.fontFamily,
  );
  return (
    <PageShell {...rest}>
      <PageHeader
        logo={logo}
        title="Álbum de Momentos"
        subtitle={`Página ${pageIndex + 1} de ${totalPaginas}`}
        primaryColor={primaryColor}
        tema={tema}
      />
      <div className="flex-1 grid grid-cols-2 grid-rows-2 gap-4 min-h-0">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-1.5 min-h-0">
            <div
              className="flex-1 border-2 border-dashed rounded-sm flex items-center justify-center text-[10px] uppercase tracking-widest text-gray-300"
              style={{ borderColor: secondaryColor }}
            >
              cole aqui uma foto
            </div>
            <EditableField
              fieldKey={`baby-album-${pageIndex}-${i}-legenda`}
              className="text-xs text-center"
              placeholder="legenda"
            />
          </div>
        ))}
      </div>
    </PageShell>
  );
}