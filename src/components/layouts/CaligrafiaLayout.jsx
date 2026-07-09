// src/components/layouts/CaligrafiaLayout.jsx
//
// Conjunto de páginas que compõem o template "Guia de Caligrafia":
//   1. Capa                → título + nome do aluno(a)
//   2. Alfabeto Maiúsculo  → A–Z, divididas em páginas (pauta + traçado guiado)
//   3. Alfabeto Minúsculo  → a–z, mesma lógica
//   4. Números             → 0–9
//   5. Palavra Personalizada → o professor (ou o próprio usuário) digita uma
//      palavra/frase-modelo, que é repetida esmaecida em várias linhas para
//      o aluno treinar por cima — serve tanto para "fichas de aluno" quanto
//      para treinar o próprio nome.
//   6. Frases              → frases curtas para treinar caligrafia cursiva
//   7. Lettering           → guia com linha-base + traçado diagonal (55°),
//      pensado para bullet journal / lettering de cabeçalhos
//
// Todas compartilham o mesmo "casco" (PageShell), no mesmo espírito do
// CadernoUniversitarioLayout.

import Footer from "../Footer";
import Logo from "../Logo";
import Watermark from "../Watermark";
import Background from "../Background";
import EditableField from "../EditableField";
import { TEMAS } from "../../themes";
import { useAgendaData } from "../../context/AgendaDataContext";

// ─────────────────────────────────────────────────────────────────────────
// Dados dos exercícios
// ─────────────────────────────────────────────────────────────────────────

export const ALFABETO_MAIUSCULO = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  .split("")
  .map((l) => ({ key: l, display: `${l} ${l.toLowerCase()}` }));

export const ALFABETO_MINUSCULO = "abcdefghijklmnopqrstuvwxyz"
  .split("")
  .map((l) => ({ key: l, display: `${l} ${l}` }));

export const NUMEROS = "0123456789"
  .split("")
  .map((n) => ({ key: n, display: `${n} ${n}` }));

export const LINHAS_POR_PAGINA = 11;

export const FRASES_CALIGRAFIA = [
  "Acredite no seu potencial",
  "Cada dia é uma nova chance",
  "Organização gera liberdade",
  "Pequenos passos, grandes conquistas",
  "Foco, calma e persistência",
  "Hoje é um bom dia para recomeçar",
];

export const LETTERING_PALAVRAS = [
  "Bom dia",
  "Segunda-feira",
  "Metas da semana",
  "Gratidão",
  "Foco total",
  "Você consegue",
];

// ─────────────────────────────────────────────────────────────────────────
// Utilitários visuais
// ─────────────────────────────────────────────────────────────────────────

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

function PageHeader({ logo, titulo, subtitulo, primaryColor, tema, pageIndex, totalPaginas }) {
  return (
    <div
      className="flex items-center justify-between border-b-2 pb-3 mb-3 shrink-0"
      style={{ borderColor: primaryColor }}
    >
      <div className="flex items-center gap-3.5">
        <Logo src={logo} />
        <div className="space-y-0.5">
          <h2
            className={`text-lg font-bold uppercase tracking-widest ${tema.headingFont || ""}`}
            style={{ color: primaryColor }}
          >
            {titulo}
          </h2>
          {subtitulo && (
            <p className="text-[10px] uppercase tracking-wide text-gray-400 font-semibold">
              {subtitulo}
            </p>
          )}
        </div>
      </div>
      {totalPaginas > 1 && (
        <span className="text-[10px] text-gray-400 shrink-0">
          {pageIndex + 1}/{totalPaginas}
        </span>
      )}
    </div>
  );
}

// Uma "pauta" de caligrafia: linha superior fina, linha central tracejada
// (altura-x) e linha de base mais forte — o padrão clássico de folha
// pedagógica. `children` é o texto-modelo esmaecido que fica apoiado na
// linha de base, pronto para o aluno traçar por cima e continuar na
// sequência.
function GuideRow({ children, primaryColor, secondaryColor, rowHeight = "16mm" }) {
  return (
    <div className="relative shrink-0" style={{ height: rowHeight }}>
      <div
        className="absolute left-0 right-0 top-0 border-t"
        style={{ borderColor: secondaryColor, opacity: 0.55 }}
      />
      <div
        className="absolute left-0 right-0 top-1/2 border-t border-dashed"
        style={{ borderColor: secondaryColor, opacity: 0.55 }}
      />
      <div
        className="absolute left-0 right-0 bottom-0 border-t-2"
        style={{ borderColor: primaryColor, opacity: 0.85 }}
      />
      <div className="absolute inset-0 flex items-end overflow-hidden pointer-events-none select-none pb-[1px]">
        {children}
      </div>
    </div>
  );
}

function TraceText({ children, primaryColor, size = "9mm", tracking = "5mm", font = "'Dancing Script', cursive" }) {
  return (
    <span
      className="whitespace-nowrap"
      style={{
        fontFamily: font,
        fontSize: size,
        letterSpacing: tracking,
        color: primaryColor,
        opacity: 0.35,
      }}
    >
      {children}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// 1. CAPA
// ─────────────────────────────────────────────────────────────────────────

export function CaligrafiaCapaPage(rest) {
  const { primaryColor, secondaryColor, tema } = useVisual(
    rest.colorTheme,
    rest.customColors,
    rest.fontFamily,
  );

  return (
    <PageShell {...rest}>
      <div className="flex-1 flex flex-col items-center justify-center text-center px-10 relative overflow-hidden">
        <span
          className="absolute inset-0 flex items-center justify-center text-[130mm] leading-none pointer-events-none select-none"
          style={{ fontFamily: "'Dancing Script', cursive", color: secondaryColor, opacity: 0.12 }}
        >
          Aa
        </span>

        <div className="relative z-10">
          {rest.logo && <Logo src={rest.logo} className="h-16 mb-8 mx-auto" />}

          <p
            className="text-xs uppercase tracking-[0.35em] text-gray-400 mb-3"
          >
            Guia de prática
          </p>

          <h1
            className={`text-4xl font-bold mb-6 ${tema.headingFont || ""}`}
            style={{ color: primaryColor, fontFamily: "'Dancing Script', cursive", fontSize: "20mm" }}
          >
            Caderno de Caligrafia
          </h1>

          <div className="w-56 mx-auto mb-2">
            <span className="text-[10px] uppercase tracking-widest text-gray-400">
              Nome do(a) aluno(a)
            </span>
            <EditableField
              fieldKey="caligrafia-nome-aluno"
              className="w-full min-h-8 border-b-2 text-center text-sm py-1"
              style={{ borderColor: primaryColor }}
              placeholder=""
            />
          </div>

          <p className="text-xs text-gray-500 mt-8 max-w-xs mx-auto leading-relaxed">
            Trace as letras esmaecidas com atenção ao formato e depois
            continue sozinho(a) até o final da linha.
          </p>
        </div>
      </div>
    </PageShell>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// 2/3/4. ALFABETO (maiúsculo, minúsculo) e NÚMEROS — mesmo componente
// ─────────────────────────────────────────────────────────────────────────

export function CaligrafiaLetrasPage({
  itens,
  titulo,
  subtitulo,
  pageIndex = 0,
  totalPaginas = 1,
  ...rest
}) {
  const { primaryColor, secondaryColor, tema } = useVisual(
    rest.colorTheme,
    rest.customColors,
    rest.fontFamily,
  );

  return (
    <PageShell {...rest}>
      <PageHeader
        logo={rest.logo}
        titulo={titulo}
        subtitulo={subtitulo}
        primaryColor={primaryColor}
        tema={tema}
        pageIndex={pageIndex}
        totalPaginas={totalPaginas}
      />
      <div className="flex-1 flex flex-col gap-1.5 min-h-0 pt-1">
        {itens.map((item) => (
          <GuideRow key={item.key} primaryColor={primaryColor} secondaryColor={secondaryColor}>
            <TraceText primaryColor={primaryColor}>
              {Array(6).fill(item.display).join("    ")}
            </TraceText>
          </GuideRow>
        ))}
      </div>
    </PageShell>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// 5. PALAVRA PERSONALIZADA — nome próprio / ficha do professor
// ─────────────────────────────────────────────────────────────────────────

export function CaligrafiaPersonalizadaPage({ numLinhas = 9, ...rest }) {
  const { primaryColor, secondaryColor, tema } = useVisual(
    rest.colorTheme,
    rest.customColors,
    rest.fontFamily,
  );
  const { getField } = useAgendaData();
  const palavra = getField("caligrafia-palavra-modelo") || "Escreva aqui";

  return (
    <PageShell {...rest}>
      <PageHeader
        logo={rest.logo}
        titulo="Palavra Personalizada"
        subtitulo="Defina uma palavra ou nome-modelo para treinar"
        primaryColor={primaryColor}
        tema={tema}
        pageIndex={0}
        totalPaginas={1}
      />

      <div className="mb-4 shrink-0">
        <span className="text-[10px] uppercase tracking-widest text-gray-400">
          Palavra ou frase-modelo (ex: nome do aluno)
        </span>
        <EditableField
          fieldKey="caligrafia-palavra-modelo"
          className="w-full min-h-9 border-b-2 text-lg py-1"
          style={{ borderColor: primaryColor, fontFamily: "'Dancing Script', cursive" }}
          placeholder="Escreva aqui"
        />
      </div>

      <div className="flex-1 flex flex-col gap-1.5 min-h-0">
        {Array.from({ length: numLinhas }).map((_, i) => (
          <GuideRow key={i} primaryColor={primaryColor} secondaryColor={secondaryColor}>
            <TraceText primaryColor={primaryColor} size="8mm" tracking="1mm">
              {Array(4).fill(palavra).join("   ")}
            </TraceText>
          </GuideRow>
        ))}
      </div>
    </PageShell>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// 6. FRASES
// ─────────────────────────────────────────────────────────────────────────

export function CaligrafiaFrasesPage({ frases, pageIndex = 0, totalPaginas = 1, ...rest }) {
  const { primaryColor, secondaryColor, tema } = useVisual(
    rest.colorTheme,
    rest.customColors,
    rest.fontFamily,
  );

  return (
    <PageShell {...rest}>
      <PageHeader
        logo={rest.logo}
        titulo="Frases para Praticar"
        subtitulo="Caligrafia cursiva"
        primaryColor={primaryColor}
        tema={tema}
        pageIndex={pageIndex}
        totalPaginas={totalPaginas}
      />
      <div className="flex-1 flex flex-col gap-4 min-h-0 pt-1">
        {frases.map((frase, i) => (
          <div key={i} className="flex flex-col gap-1.5">
            <GuideRow primaryColor={primaryColor} secondaryColor={secondaryColor} rowHeight="17mm">
              <TraceText primaryColor={primaryColor} size="7mm" tracking="0.5mm">
                {frase}
              </TraceText>
            </GuideRow>
            <GuideRow primaryColor={primaryColor} secondaryColor={secondaryColor} rowHeight="15mm">
              {null}
            </GuideRow>
          </div>
        ))}
      </div>
    </PageShell>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// 7. LETTERING — cabeçalhos estilo bullet journal, com guia diagonal
// ─────────────────────────────────────────────────────────────────────────

export function CaligrafiaLetteringPage({ palavras, ...rest }) {
  const { primaryColor, secondaryColor, tema } = useVisual(
    rest.colorTheme,
    rest.customColors,
    rest.fontFamily,
  );

  return (
    <PageShell {...rest}>
      <PageHeader
        logo={rest.logo}
        titulo="Lettering"
        subtitulo="Cabeçalhos para bullet journal e planners"
        primaryColor={primaryColor}
        tema={tema}
        pageIndex={0}
        totalPaginas={1}
      />
      <div className="flex-1 flex flex-col gap-5 min-h-0 pt-1">
        {palavras.map((palavra, i) => (
          <div
            key={i}
            className="relative shrink-0"
            style={{
              height: "26mm",
              backgroundImage: `repeating-linear-gradient(55deg, ${secondaryColor}33 0, ${secondaryColor}33 1px, transparent 1px, transparent 9mm)`,
            }}
          >
            <div
              className="absolute left-0 right-0 border-t-2"
              style={{ borderColor: primaryColor, opacity: 0.85, bottom: "6mm" }}
            />
            <div className="absolute inset-0 flex items-end pb-[7mm] overflow-hidden pointer-events-none select-none">
              <span
                className="whitespace-nowrap font-bold"
                style={{
                  fontFamily: "'Dancing Script', cursive",
                  fontSize: "16mm",
                  color: primaryColor,
                  opacity: 0.35,
                }}
              >
                {palavra}
              </span>
            </div>
          </div>
        ))}
      </div>
    </PageShell>
  );
}
