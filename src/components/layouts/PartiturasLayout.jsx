// src/components/layouts/PartiturasLayout.jsx
//
// Caderno de Partituras — pauta em branco para o público musical:
//   1. Capa            → título + nome do(a) músico/compositor(a)
//   2. Pauta (várias)  → sistemas de pentagrama em branco, com claves de sol
//      desenhadas via fonte 'Noto Music' (cobre o bloco Unicode de símbolos
//      musicais — renderiza de forma consistente em qualquer navegador,
//      sem depender de fontes do sistema), prontos para compor à mão.
//      A primeira página de pauta reserva espaço para título/compositor(a).

import Footer from "../Footer";
import Logo from "../Logo";
import Watermark from "../Watermark";
import Background from "../Background";
import EditableField from "../EditableField";

const FONTE_TITULO = "'Cormorant Garamond', serif";
const FONTE_MUSICAL = "'Noto Music', serif";

function useVisual(customColors = {}) {
  return {
    primaryColor: customColors.primary || "#1f2937",
    bgColor: customColors.background || "#ffffff",
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
  const { bgColor } = useVisual(customColors);
  return (
    <div
      className="printable-page bg-white text-gray-900 flex flex-col justify-between box-border select-none border-0 shadow-none rounded-none"
      style={{ backgroundColor: bgColor, fontFamily }}
    >
      {backgroundSrc && <Background src={backgroundSrc} opacity={backgroundOpacity} />}
      {watermarkSrc && <Watermark src={watermarkSrc} opacity={watermarkOpacity} />}
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

function CampoLabel({ label, fieldKey, className = "", placeholder = "" }) {
  return (
    <div className={className}>
      <span className="text-[9px] uppercase tracking-widest text-gray-400">{label}</span>
      <EditableField
        fieldKey={fieldKey}
        className="w-full min-h-6 border-b border-gray-300 text-sm py-0.5"
        placeholder={placeholder}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// 1. CAPA
// ─────────────────────────────────────────────────────────────────────────

export function PartiturasCapaPage(rest) {
  const { primaryColor } = useVisual(rest.customColors);

  return (
    <PageShell {...rest}>
      <div className="flex-1 flex flex-col items-center justify-center text-center px-10 relative overflow-hidden">
        <span
          className="absolute top-10 left-10 select-none pointer-events-none"
          style={{ fontFamily: FONTE_MUSICAL, fontSize: "26mm", color: primaryColor, opacity: 0.08 }}
        >
          𝄞
        </span>
        <span
          className="absolute bottom-10 right-10 select-none pointer-events-none"
          style={{ fontFamily: FONTE_MUSICAL, fontSize: "22mm", color: primaryColor, opacity: 0.08 }}
        >
          𝄢
        </span>

        <div className="relative z-10">
          {rest.logo && <Logo src={rest.logo} className="h-14 mb-6 mx-auto" />}

          <span
            className="block select-none mb-2"
            style={{ fontFamily: FONTE_MUSICAL, fontSize: "18mm", color: primaryColor }}
          >
            𝄞
          </span>

          <p className="text-xs uppercase tracking-[0.35em] text-gray-400 mb-3">
            Manuscrito musical
          </p>

          <h1
            className="text-4xl font-semibold mb-8"
            style={{ color: primaryColor, fontFamily: FONTE_TITULO, fontSize: "18mm" }}
          >
            Caderno de Partituras
          </h1>

          <div className="w-64 mx-auto mb-4">
            <span className="text-[10px] uppercase tracking-widest text-gray-400">
              Nome do(a) músico(a) / compositor(a)
            </span>
            <EditableField
              fieldKey="partituras-nome"
              className="w-full min-h-8 border-b-2 text-center text-sm py-1"
              style={{ borderColor: primaryColor }}
            />
          </div>

          <div className="w-64 mx-auto">
            <span className="text-[10px] uppercase tracking-widest text-gray-400">
              Instrumento
            </span>
            <EditableField
              fieldKey="partituras-instrumento"
              className="w-full min-h-8 border-b text-center text-sm py-1"
              style={{ borderColor: primaryColor }}
            />
          </div>

          <p className="text-xs text-gray-500 mt-8 max-w-xs mx-auto leading-relaxed">
            Pauta em branco pronta para suas composições, arranjos e estudos.
          </p>
        </div>
      </div>
    </PageShell>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// 2. PAUTA — sistema de pentagrama em branco
// ─────────────────────────────────────────────────────────────────────────

function StaffSystem({ primaryColor, height = "22mm", clef = "𝄞" }) {
  const linhas = [0, 25, 50, 75, 100];
  return (
    <div className="relative w-full shrink-0" style={{ height }}>
      <div
        className="absolute left-0 right-0"
        style={{ top: "50%", transform: "translateY(-50%)", height: "9mm" }}
      >
        {linhas.map((pct) => (
          <div
            key={pct}
            className="absolute left-0 right-0 border-t"
            style={{ top: `${pct}%`, borderColor: primaryColor, opacity: 0.75 }}
          />
        ))}
      </div>

      <span
        className="absolute select-none pointer-events-none"
        style={{
          left: "1mm",
          top: "50%",
          transform: "translateY(-56%)",
          fontFamily: FONTE_MUSICAL,
          fontSize: "16mm",
          lineHeight: 1,
          color: primaryColor,
        }}
      >
        {clef}
      </span>

      {/* barra de compasso inicial, logo após a clave */}
      <div
        className="absolute"
        style={{
          left: "15mm",
          top: "50%",
          transform: "translateY(-50%)",
          width: "1px",
          height: "9mm",
          backgroundColor: primaryColor,
          opacity: 0.75,
        }}
      />

      {/* barra de compasso final */}
      <div
        className="absolute"
        style={{
          right: 0,
          top: "50%",
          transform: "translateY(-50%)",
          width: "1.5px",
          height: "9mm",
          backgroundColor: primaryColor,
          opacity: 0.75,
        }}
      />
    </div>
  );
}

export function PartiturasPautaPage({
  pageIndex = 0,
  totalPaginas = 1,
  numSistemas = 10,
  comCampos = false,
  clef = "𝄞",
  ...rest
}) {
  const { primaryColor } = useVisual(rest.customColors);

  return (
    <PageShell {...rest}>
      <div className="flex items-center justify-between mb-3 shrink-0">
        <div className="flex items-center gap-2">
          <Logo src={rest.logo} />
          <span className="text-[10px] uppercase tracking-widest text-gray-400">
            Caderno de Partituras
          </span>
        </div>
        <span className="text-[10px] text-gray-400">
          {pageIndex + 1}/{totalPaginas}
        </span>
      </div>

      {comCampos && (
        <div className="grid grid-cols-4 gap-4 mb-4 shrink-0">
          <CampoLabel label="Título" fieldKey="partituras-titulo" className="col-span-2" />
          <CampoLabel label="Compositor(a)" fieldKey="partituras-compositor" />
          <CampoLabel label="Tom / Andamento" fieldKey="partituras-tom" />
        </div>
      )}

      <div className="flex-1 flex flex-col justify-between min-h-0">
        {Array.from({ length: numSistemas }).map((_, i) => (
          <StaffSystem key={i} primaryColor={primaryColor} clef={clef} />
        ))}
      </div>
    </PageShell>
  );
}
