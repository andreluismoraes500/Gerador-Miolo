// src/components/layouts/NotebookShared.jsx
//
// Peças de layout compartilhadas por todos os "cadernos temáticos"
// (Receitas, Idiomas, Bullet Journal, Concursos, Baby Book, Financeiro...),
// seguindo o mesmo padrão visual do Caderno Universitário
// (`CadernoUniversitarioLayout.jsx`), mas fatoradas aqui pra não repetir o
// casco de página (PageShell) e os tipos de folha genéricos em cada arquivo.

import Footer from "../Footer";
import Logo from "../Logo";
import Watermark from "../Watermark";
import Background from "../Background";
import EditableField from "../EditableField";
import { TEMAS } from "../../themes";

export function useVisual(colorTheme, customColors = {}, fontFamily) {
  const tema = TEMAS[colorTheme] || TEMAS.classico;
  return {
    tema,
    bgColor: customColors.background || "#ffffff",
    primaryColor: customColors.primary || tema.text || "#000000",
    secondaryColor: customColors.secondary || tema.border || "#cbd5e1",
    fontFamily,
  };
}

export function PageShell({
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
  footerHidden = false,
}) {
  const bgColor = customColors.background || "#ffffff";
  return (
    <div
      className="printable-page bg-white text-gray-900 flex flex-col justify-between box-border select-none border-0 shadow-none rounded-none"
      style={{ backgroundColor: bgColor, fontFamily }}
    >
      {backgroundSrc && (
        <Background src={backgroundSrc} opacity={backgroundOpacity} />
      )}
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
        hidden={footerHidden}
      />
    </div>
  );
}

// Cabeçalho padrão (logo + título + subtítulo + slot opcional à direita),
// usado no topo da maioria das páginas dos cadernos.
export function PageHeader({
  logo,
  title,
  subtitle,
  right,
  primaryColor,
  tema,
}) {
  return (
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
            {title}
          </h2>
          {subtitle && (
            <p className="text-[10px] uppercase tracking-wide text-gray-400 font-semibold">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {right}
    </div>
  );
}

// Página de divisória genérica (capa de seção): número grande opcional,
// título editável, subtítulo fixo e faixa colorida no topo.
export function DividerPage({
  index,
  cor,
  fieldKey,
  defaultTitle,
  subtitle,
  logo,
  extraFields,
  ...rest
}) {
  const { primaryColor, tema } = useVisual(
    rest.colorTheme,
    rest.customColors,
    rest.fontFamily,
  );
  const corFaixa = cor || primaryColor;

  return (
    <PageShell {...rest}>
      <div className="flex-1 flex items-center justify-center relative overflow-hidden min-h-0">
        <div
          className="absolute top-0 left-0 w-full h-[42%]"
          style={{ backgroundColor: corFaixa, opacity: 0.1 }}
        />
        <div
          className="absolute top-0 left-0 w-full h-2.5"
          style={{ backgroundColor: corFaixa }}
        />
        <div className="relative z-10 flex flex-col items-center gap-5 text-center px-8">
          <Logo src={logo} />
          {index != null && (
            <span
              className="text-[100px] font-black leading-none"
              style={{ color: corFaixa, opacity: 0.85 }}
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
          {extraFields}
        </div>
      </div>
    </PageShell>
  );
}

// Folha pautada genérica: cabeçalho + N linhas editáveis.
export function LinedPage({
  title,
  subtitle,
  fieldPrefix,
  pageIndex,
  totalPaginas,
  numLinhas = 26,
  logo,
  cor,
  headerRight,
  ...rest
}) {
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
        <div className="flex items-center gap-2 min-w-0">
          {cor && (
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: cor }}
            />
          )}
          <span className="text-xs font-bold uppercase tracking-widest text-gray-700 truncate">
            {title}
          </span>
        </div>
        <div className="flex items-center gap-4 text-[10px] text-gray-400 shrink-0">
          {headerRight}
          {totalPaginas != null && (
            <span>
              {pageIndex + 1}/{totalPaginas}
            </span>
          )}
        </div>
      </div>
      <div className="flex-1 relative min-h-0">
        <div className="h-full flex flex-col">
          {Array.from({ length: numLinhas }).map((_, i) => (
            <div
              key={i}
              className="flex-1 border-b"
              style={{ borderColor: "#c7dcf5" }}
            >
              <EditableField
                fieldKey={`${fieldPrefix}-linha-${i}`}
                className="w-full h-full text-sm px-1"
              />
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  );
}

// Folha quadriculada genérica.
export function GridPage({ title, pageIndex, totalPaginas, ...rest }) {
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
          {title}
        </span>
        {totalPaginas != null && (
          <span className="text-[10px] text-gray-400">
            {pageIndex + 1}/{totalPaginas}
          </span>
        )}
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

// Folha pontilhada genérica (grid de pontos, base do Bullet Journal — sem
// nenhuma estrutura fixa, só um espaço em branco pro usuário desenhar o
// próprio sistema).
export function DottedPage({ title, pageIndex, totalPaginas, ...rest }) {
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
          {title}
        </span>
        {totalPaginas != null && (
          <span className="text-[10px] text-gray-400">
            {pageIndex + 1}/{totalPaginas}
          </span>
        )}
      </div>
      <div
        className="flex-1 min-h-0"
        style={{
          backgroundImage: "radial-gradient(#c7c2b8 0.6px, transparent 0.6px)",
          backgroundSize: "5mm 5mm",
        }}
      />
    </PageShell>
  );
}
