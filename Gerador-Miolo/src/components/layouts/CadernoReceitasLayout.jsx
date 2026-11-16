// src/components/layouts/CadernoReceitasLayout.jsx
//
// Páginas do template "Caderno de Receitas Culinárias":
//   1. Sumário        → lista de receitas com número de página
//   2. Divisória de Categoria (Entradas, Pratos Principais, Sobremesas...)
//   3. Folha de Receita → ingredientes + modo de preparo + tempo/porções

import EditableField from "../EditableField";
import Logo from "../Logo";
import { PageShell, PageHeader, DividerPage, useVisual } from "./NotebookShared";

export const PALETA_CATEGORIAS = [
  "#DC2626", // Entradas
  "#EA580C", // Pratos Principais
  "#DB2777", // Sobremesas
  "#0891B2", // Bebidas
  "#65A30D",
  "#7C3AED",
];

// ─────────────────────────────────────────────────────────────────────────
// SUMÁRIO
// ─────────────────────────────────────────────────────────────────────────
export function ReceitasSumarioPage({ numReceitas, logo, ...rest }) {
  const { primaryColor, tema } = useVisual(
    rest.colorTheme,
    rest.customColors,
    rest.fontFamily,
  );
  return (
    <PageShell {...rest}>
      <PageHeader
        logo={logo}
        title="Sumário"
        subtitle="Caderno de Receitas"
        primaryColor={primaryColor}
        tema={tema}
      />
      <div className="flex-1 flex flex-col gap-0.5 pt-1">
        {Array.from({ length: numReceitas }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-3 py-2.5 border-b border-dotted border-gray-300"
          >
            <span className="text-xs font-bold w-6 text-right shrink-0 text-gray-400">
              {i + 1}.
            </span>
            <EditableField
              fieldKey={`receita-sumario-nome-${i}`}
              className="flex-1 text-sm font-medium"
            />
            <span className="text-[9px] uppercase tracking-wide text-gray-400 shrink-0">
              pág.
            </span>
            <EditableField
              fieldKey={`receita-sumario-pagina-${i}`}
              className="w-12 text-xs text-center border-b border-dashed border-gray-300 shrink-0"
            />
          </div>
        ))}
      </div>
    </PageShell>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// DIVISÓRIA DE CATEGORIA
// ─────────────────────────────────────────────────────────────────────────
export function ReceitasDivisoriaPage({ index, defaultTitle, logo, ...rest }) {
  const cor = PALETA_CATEGORIAS[index % PALETA_CATEGORIAS.length];
  return (
    <DividerPage
      index={index}
      cor={cor}
      fieldKey={`receita-categoria-${index}`}
      defaultTitle={defaultTitle}
      subtitle="Categoria"
      logo={logo}
      {...rest}
    />
  );
}

// ─────────────────────────────────────────────────────────────────────────
// FOLHA DE RECEITA
// ─────────────────────────────────────────────────────────────────────────
export function ReceitaFichaPage({ categoriaIndex, receitaIndex, logo, ...rest }) {
  const { primaryColor, secondaryColor, tema } = useVisual(
    rest.colorTheme,
    rest.customColors,
    rest.fontFamily,
  );
  const cor = PALETA_CATEGORIAS[categoriaIndex % PALETA_CATEGORIAS.length];
  const fk = `receita-${categoriaIndex}-${receitaIndex}`;

  return (
    <PageShell {...rest}>
      <div
        className="border-b-2 pb-3 mb-4 flex items-start justify-between gap-3 shrink-0"
        style={{ borderBottomColor: primaryColor }}
      >
        <div className="flex items-center gap-3 min-w-0">
          <Logo src={logo} />
          <EditableField
            fieldKey={`${fk}-titulo`}
            className={`text-xl font-bold ${tema.headingFont}`}
            placeholder="Nome da receita"
            style={{ color: primaryColor }}
          />
        </div>
        <span
          className="w-2.5 h-2.5 rounded-full shrink-0 mt-2"
          style={{ backgroundColor: cor }}
        />
      </div>

      {/* Tempo / porções / dificuldade */}
      <div className="grid grid-cols-3 gap-3 mb-4 shrink-0">
        {[
          ["Tempo de preparo", "tempo", "__ min"],
          ["Rendimento", "porcoes", "__ porções"],
          ["Dificuldade", "dificuldade", "Fácil / Médio / Difícil"],
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
              fieldKey={`${fk}-${key}`}
              className="text-xs font-medium text-center"
              placeholder={placeholder}
            />
          </div>
        ))}
      </div>

      <div className="flex-1 grid grid-cols-[1fr_1.4fr] gap-4 min-h-0">
        {/* Ingredientes */}
        <div className="flex flex-col min-h-0">
          <h3
            className="text-[10px] font-bold uppercase tracking-widest mb-2 border-b pb-1.5"
            style={{ color: cor, borderColor: secondaryColor }}
          >
            Ingredientes
          </h3>
          <div className="flex-1 flex flex-col">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-2 py-1.5 border-b border-dotted border-gray-200"
              >
                <span
                  className="w-2 h-2 border shrink-0"
                  style={{ borderColor: secondaryColor }}
                />
                <EditableField
                  fieldKey={`${fk}-ingrediente-${i}`}
                  className="flex-1 text-xs"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Modo de preparo */}
        <div className="flex flex-col min-h-0">
          <h3
            className="text-[10px] font-bold uppercase tracking-widest mb-2 border-b pb-1.5"
            style={{ color: cor, borderColor: secondaryColor }}
          >
            Modo de preparo
          </h3>
          <div className="flex-1 flex flex-col">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex items-start gap-2 py-1.5">
                <span
                  className="text-[10px] font-bold w-4 text-right shrink-0"
                  style={{ color: cor }}
                >
                  {i + 1}.
                </span>
                <EditableField
                  fieldKey={`${fk}-passo-${i}`}
                  className="flex-1 text-xs leading-relaxed border-b border-dotted border-gray-200 min-h-[3.4em]"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageShell>
  );
}
