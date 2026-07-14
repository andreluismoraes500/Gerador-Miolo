// src/components/layouts/CaligrafiaLayout.jsx
//
// Conjunto de páginas que compõem o template "Guia de Caligrafia Infantil":
//   1. Capa                 → título lúdico + nome do(a) aluno(a)
//   2. Letra do dia (x26)   → uma página inteira por letra (A a Z), com
//      ilustração + palavrinha-exemplo, traçado bem grande para colorir por
//      cima e um mini-joguinho de "circule a letra"
//   3. Número do dia (x11)  → uma página por número (0 a 10), com objetos
//      para contar, traçado grande e linhas de prática
//   4. Palavra Personalizada → nome do(a) aluno(a) ou palavra-modelo do(a)
//      professor(a), repetida esmaecida para treinar
//   5. Frases                → frases curtas e positivas para praticar
//   6. Lettering              → cabeçalhos com guia diagonal, para quem já
//      quer ir além do traçado básico
//
// Todas compartilham o mesmo "casco" (PageShell), no mesmo espírito dos
// demais templates do app.

import Footer from "../Footer";
import Logo from "../Logo";
import Watermark from "../Watermark";
import Background from "../Background";
import EditableField from "../EditableField";
import { TEMAS } from "../../themes";
import { useAgendaData } from "../../context/AgendaDataContext";

// ─────────────────────────────────────────────────────────────────────────
// Paleta lúdica — usada nos cartões ilustrados de cada letra/número,
// independente do tema de cor escolhido pelo usuário (que continua
// comandando cabeçalho, rodapé e linhas de traçado, para manter a
// identidade visual do restante da agenda/caderno).
// ─────────────────────────────────────────────────────────────────────────

const PALETA_INFANTIL = [
  { bg: "#fff1f2", ink: "#e11d48" }, // rosa
  { bg: "#fff7ed", ink: "#ea580c" }, // laranja
  { bg: "#fefce8", ink: "#ca8a04" }, // amarelo
  { bg: "#f0fdf4", ink: "#16a34a" }, // verde
  { bg: "#eff6ff", ink: "#2563eb" }, // azul
  { bg: "#f5f3ff", ink: "#7c3aed" }, // roxo
];

// ─────────────────────────────────────────────────────────────────────────
// Dados dos exercícios
// ─────────────────────────────────────────────────────────────────────────

const LETRAS_BASE = [
  { letra: "A", palavra: "Abelha", emoji: "🐝" },
  { letra: "B", palavra: "Bola", emoji: "⚽" },
  { letra: "C", palavra: "Casa", emoji: "🏠" },
  { letra: "D", palavra: "Dado", emoji: "🎲" },
  { letra: "E", palavra: "Elefante", emoji: "🐘" },
  { letra: "F", palavra: "Foca", emoji: "🦭" },
  { letra: "G", palavra: "Girafa", emoji: "🦒" },
  { letra: "H", palavra: "Hipopótamo", emoji: "🦛" },
  { letra: "I", palavra: "Ilha", emoji: "🏝️" },
  { letra: "J", palavra: "Jacaré", emoji: "🐊" },
  { letra: "K", palavra: "Kiwi", emoji: "🥝" },
  { letra: "L", palavra: "Leão", emoji: "🦁" },
  { letra: "M", palavra: "Macaco", emoji: "🐒" },
  { letra: "N", palavra: "Navio", emoji: "🚢" },
  { letra: "O", palavra: "Ovo", emoji: "🥚" },
  { letra: "P", palavra: "Pato", emoji: "🦆" },
  { letra: "Q", palavra: "Queijo", emoji: "🧀" },
  { letra: "R", palavra: "Rato", emoji: "🐭" },
  { letra: "S", palavra: "Sol", emoji: "☀️" },
  { letra: "T", palavra: "Tartaruga", emoji: "🐢" },
  { letra: "U", palavra: "Uva", emoji: "🍇" },
  { letra: "V", palavra: "Vaca", emoji: "🐄" },
  { letra: "W", palavra: "Web", emoji: "🕸️" },
  { letra: "X", palavra: "Xícara", emoji: "☕" },
  { letra: "Y", palavra: "Yo-yo", emoji: "🪀" },
  { letra: "Z", palavra: "Zebra", emoji: "🦓" },
];

const ALFABETO = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

// Gerador pseudo-aleatório determinístico (mesma letra = mesmo joguinho
// sempre, em qualquer render/exportação — nada de conteúdo "piscando").
function mulberry32(seed) {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildActivityRow(letraAlvo, seed, total = 14, ocorrencias = 4) {
  const rand = mulberry32(seed);
  const posicoes = new Set();
  while (posicoes.size < ocorrencias) {
    posicoes.add(Math.floor(rand() * total));
  }
  const out = [];
  for (let i = 0; i < total; i++) {
    if (posicoes.has(i)) {
      out.push(letraAlvo);
      continue;
    }
    let c;
    do {
      c = ALFABETO[Math.floor(rand() * ALFABETO.length)];
    } while (c === letraAlvo);
    out.push(rand() > 0.5 ? c : c.toLowerCase());
  }
  return out;
}

export const LETRAS_CALIGRAFIA = LETRAS_BASE.map((item, index) => ({
  ...item,
  index,
  paleta: PALETA_INFANTIL[index % PALETA_INFANTIL.length],
  atividade: buildActivityRow(item.letra, index + 1),
}));

const EMOJIS_CONTAGEM = ["⭐", "🍎", "🐝", "🌸", "🦋", "🍓"];
const EXTENSO = [
  "Zero",
  "Um",
  "Dois",
  "Três",
  "Quatro",
  "Cinco",
  "Seis",
  "Sete",
  "Oito",
  "Nove",
  "Dez",
];

export const NUMEROS_CALIGRAFIA = Array.from({ length: 11 }).map(
  (_, numero) => ({
    numero,
    extenso: EXTENSO[numero],
    emoji: EMOJIS_CONTAGEM[numero % EMOJIS_CONTAGEM.length],
    paleta: PALETA_INFANTIL[(numero + 3) % PALETA_INFANTIL.length],
  }),
);

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

const FONTE_INFANTIL = "'Fredoka', 'Baloo 2', sans-serif";

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
      />
    </div>
  );
}

function PageHeader({
  logo,
  titulo,
  subtitulo,
  primaryColor,
  pageIndex,
  totalPaginas,
}) {
  return (
    <div
      className="flex items-center justify-between border-b-2 pb-3 mb-3 shrink-0"
      style={{ borderColor: primaryColor }}
    >
      <div className="flex items-center gap-3.5">
        <Logo src={logo} />
        <div className="space-y-0.5">
          <h2
            className="text-lg font-bold uppercase tracking-widest"
            style={{ color: primaryColor, fontFamily: FONTE_INFANTIL }}
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
        <span
          className="text-[11px] font-bold shrink-0 rounded-full px-2.5 py-1"
          style={{ color: "#fff", backgroundColor: primaryColor }}
        >
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
function GuideRow({
  children,
  primaryColor,
  secondaryColor,
  rowHeight = "16mm",
}) {
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
      <div className="absolute inset-0 flex items-end overflow-hidden pointer-events-none select-none pb-px">
        {children}
      </div>
    </div>
  );
}

function TraceText({
  children,
  primaryColor,
  size = "9mm",
  tracking = "5mm",
  font = "'Dancing Script', cursive",
}) {
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

function Doodle({ x, y, size, color, shape }) {
  const style = {
    position: "absolute",
    left: x,
    top: y,
    width: size,
    height: size,
    color,
  };
  if (shape === "star") {
    return (
      <span
        style={{ ...style, fontSize: size, lineHeight: 1 }}
        className="select-none"
      >
        ⭐
      </span>
    );
  }
  return (
    <span
      style={{
        ...style,
        borderRadius: "9999px",
        backgroundColor: color,
        opacity: 0.55,
      }}
    />
  );
}

export function CaligrafiaCapaPage(rest) {
  const { primaryColor, secondaryColor } = useVisual(
    rest.colorTheme,
    rest.customColors,
    rest.fontFamily,
  );

  return (
    <PageShell {...rest}>
      <div className="flex-1 flex flex-col items-center justify-center text-center px-10 relative overflow-hidden">
        {/* arco colorido no topo, estilo arco-íris suave */}
        <div
          className="absolute left-1/2 -translate-x-1/2 -top-24 w-[160mm] h-[160mm] rounded-full"
          style={{
            background: `conic-gradient(${PALETA_INFANTIL.map((p) => p.ink).join(", ")}, ${PALETA_INFANTIL[0].ink})`,
            opacity: 0.1,
          }}
        />

        <Doodle
          x="12%"
          y="18%"
          size="14mm"
          color={PALETA_INFANTIL[0].ink}
          shape="star"
        />
        <Doodle
          x="80%"
          y="14%"
          size="10mm"
          color={PALETA_INFANTIL[3].ink}
          shape="star"
        />
        <Doodle
          x="20%"
          y="72%"
          size="9mm"
          color={PALETA_INFANTIL[4].ink}
          shape="star"
        />
        <Doodle
          x="85%"
          y="70%"
          size="12mm"
          color={PALETA_INFANTIL[1].ink}
          shape="star"
        />
        <Doodle
          x="10%"
          y="45%"
          size="7mm"
          color={PALETA_INFANTIL[2].bg}
          shape="dot"
        />
        <Doodle
          x="88%"
          y="45%"
          size="9mm"
          color={PALETA_INFANTIL[5].bg}
          shape="dot"
        />

        <div className="relative z-10">
          {rest.logo && <Logo src={rest.logo} className="h-16 mb-8 mx-auto" />}

          <p className="text-xs uppercase tracking-[0.35em] text-gray-400 mb-3">
            Vamos aprender a escrever brincando!
          </p>

          <h1
            className="text-4xl font-bold mb-2"
            style={{
              color: primaryColor,
              fontFamily: FONTE_INFANTIL,
              fontSize: "22mm",
            }}
          >
            Meu Caderno de Caligrafia
          </h1>

          <p
            className="text-sm text-gray-500 mb-6"
            style={{ fontFamily: FONTE_INFANTIL }}
          >
            Letrinhas, números e muita diversão de A a Z ✨
          </p>

          <div className="w-56 mx-auto mb-2">
            <span className="text-[10px] uppercase tracking-widest text-gray-400">
              Nome do(a) aluno(a)
            </span>
            <EditableField
              fieldKey="caligrafia-nome-aluno"
              className="w-full min-h-8 border-b-2 text-center text-sm py-1"
              style={{ borderColor: primaryColor, fontFamily: FONTE_INFANTIL }}
              placeholder=""
            />
          </div>

          <p className="text-xs text-gray-500 mt-8 max-w-xs mx-auto leading-relaxed">
            Trace as letrinhas esmaecidas com atenção ao formato e depois
            continue sozinho(a) até o final da linha.
          </p>
        </div>
      </div>
    </PageShell>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// 2. LETRA DO DIA — uma página inteira por letra (A–Z)
// ─────────────────────────────────────────────────────────────────────────

export function CaligrafiaLetraPage({ item, ...rest }) {
  const { primaryColor, secondaryColor } = useVisual(
    rest.colorTheme,
    rest.customColors,
    rest.fontFamily,
  );
  const { letra, palavra, emoji, paleta, atividade, index } = item;
  const minuscula = letra.toLowerCase();

  return (
    <PageShell {...rest}>
      <PageHeader
        logo={rest.logo}
        titulo={`Letra ${letra} ${minuscula}`}
        subtitulo="Alfabeto ilustrado"
        primaryColor={primaryColor}
        pageIndex={index}
        totalPaginas={LETRAS_CALIGRAFIA.length}
      />

      {/* Cartão ilustrado */}
      <div
        className="flex items-center gap-4 rounded-3xl px-5 py-3 mb-3 shrink-0"
        style={{
          backgroundColor: paleta.bg,
          border: `2px dashed ${paleta.ink}66`,
        }}
      >
        <div
          className="flex items-center justify-center rounded-full shrink-0"
          style={{
            width: "20mm",
            height: "20mm",
            backgroundColor: `${paleta.ink}22`,
            fontSize: "12mm",
          }}
        >
          {emoji}
        </div>
        <p
          className="text-xl font-bold"
          style={{ color: paleta.ink, fontFamily: FONTE_INFANTIL }}
        >
          {letra} de {palavra}
        </p>
      </div>

      {/* Traçado grande — maiúscula e minúscula */}
      <div className="flex flex-col gap-2 shrink-0 mb-1">
        <GuideRow
          primaryColor={primaryColor}
          secondaryColor={secondaryColor}
          rowHeight="30mm"
        >
          <TraceText
            primaryColor={paleta.ink}
            size="24mm"
            tracking="8mm"
            font={FONTE_INFANTIL}
          >
            {`${letra}  ${letra}  ${letra}`}
          </TraceText>
        </GuideRow>
        <GuideRow
          primaryColor={primaryColor}
          secondaryColor={secondaryColor}
          rowHeight="24mm"
        >
          <TraceText
            primaryColor={paleta.ink}
            size="18mm"
            tracking="6mm"
            font={FONTE_INFANTIL}
          >
            {`${minuscula}  ${minuscula}  ${minuscula}  ${minuscula}`}
          </TraceText>
        </GuideRow>
      </div>

      {/* Linhas de prática */}
      <div className="flex flex-col gap-1.5 min-h-0 mb-2">
        {[0, 1, 2].map((i) => (
          <GuideRow
            key={i}
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
            rowHeight="14mm"
          >
            <TraceText primaryColor={primaryColor} size="8mm" tracking="4mm">
              {Array(6).fill(`${letra} ${minuscula}`).join("   ")}
            </TraceText>
          </GuideRow>
        ))}
      </div>

      {/* Mini-atividade: circule a letra */}
      <div
        className="rounded-2xl px-4 py-2.5 shrink-0"
        style={{
          backgroundColor: `${paleta.ink}0d`,
          border: `1.5px solid ${paleta.ink}33`,
        }}
      >
        <p
          className="text-[10px] uppercase tracking-widest font-bold mb-1.5"
          style={{ color: paleta.ink }}
        >
          Jogo rápido: circule todas as letrinhas "{letra}"
        </p>
        <div className="flex flex-wrap gap-2">
          {atividade.map((c, i) => (
            <span
              key={i}
              className="flex items-center justify-center rounded-full border border-gray-300 text-sm font-semibold text-gray-600 bg-white"
              style={{
                width: "9mm",
                height: "9mm",
                fontFamily: FONTE_INFANTIL,
              }}
            >
              {c}
            </span>
          ))}
        </div>
      </div>
    </PageShell>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// 3. NÚMERO DO DIA — uma página por número (0–10)
// ─────────────────────────────────────────────────────────────────────────

export function CaligrafiaNumeroPage({ item, ...rest }) {
  const { primaryColor, secondaryColor } = useVisual(
    rest.colorTheme,
    rest.customColors,
    rest.fontFamily,
  );
  const { numero, extenso, emoji, paleta, index } = item;

  return (
    <PageShell {...rest}>
      <PageHeader
        logo={rest.logo}
        titulo={`Número ${numero}`}
        subtitulo="Vamos contar!"
        primaryColor={primaryColor}
        pageIndex={index}
        totalPaginas={NUMEROS_CALIGRAFIA.length}
      />

      {/* Cartão de contagem */}
      <div
        className="rounded-3xl px-5 py-3 mb-3 shrink-0"
        style={{
          backgroundColor: paleta.bg,
          border: `2px dashed ${paleta.ink}66`,
        }}
      >
        <p
          className="text-lg font-bold mb-2"
          style={{ color: paleta.ink, fontFamily: FONTE_INFANTIL }}
        >
          {numero} — {extenso}
        </p>
        <div className="flex flex-wrap gap-1.5 min-h-[10mm] items-center">
          {numero === 0 ? (
            <span
              className="text-xs text-gray-400 italic"
              style={{ fontFamily: FONTE_INFANTIL }}
            >
              nenhum {emoji} por aqui... conte até zero! 😉
            </span>
          ) : (
            Array.from({ length: numero }).map((_, i) => (
              <span key={i} style={{ fontSize: "9mm" }}>
                {emoji}
              </span>
            ))
          )}
        </div>
      </div>

      {/* Traçado grande do número */}
      <div className="flex flex-col gap-2 shrink-0 mb-1">
        <GuideRow
          primaryColor={primaryColor}
          secondaryColor={secondaryColor}
          rowHeight="34mm"
        >
          <TraceText
            primaryColor={paleta.ink}
            size="28mm"
            tracking="10mm"
            font={FONTE_INFANTIL}
          >
            {`${numero}  ${numero}  ${numero}`}
          </TraceText>
        </GuideRow>
      </div>

      {/* Linhas de prática */}
      <div className="flex flex-col gap-1.5 min-h-0">
        {[0, 1, 2, 3].map((i) => (
          <GuideRow
            key={i}
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
            rowHeight="14mm"
          >
            <TraceText primaryColor={primaryColor} size="8mm" tracking="4mm">
              {Array(8).fill(numero).join("   ")}
            </TraceText>
          </GuideRow>
        ))}
      </div>
    </PageShell>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// 4. PALAVRA PERSONALIZADA — nome próprio / ficha do professor
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
          style={{
            borderColor: primaryColor,
            fontFamily: "'Dancing Script', cursive",
          }}
          placeholder="Escreva aqui"
        />
      </div>

      <div className="flex-1 flex flex-col gap-1.5 min-h-0">
        {Array.from({ length: numLinhas }).map((_, i) => (
          <GuideRow
            key={i}
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
          >
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
// 5. FRASES
// ─────────────────────────────────────────────────────────────────────────

export function CaligrafiaFrasesPage({
  frases,
  pageIndex = 0,
  totalPaginas = 1,
  ...rest
}) {
  const { primaryColor, secondaryColor } = useVisual(
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
        pageIndex={pageIndex}
        totalPaginas={totalPaginas}
      />
      <div className="flex-1 flex flex-col gap-4 min-h-0 pt-1">
        {frases.map((frase, i) => (
          <div key={i} className="flex flex-col gap-1.5">
            <GuideRow
              primaryColor={primaryColor}
              secondaryColor={secondaryColor}
              rowHeight="17mm"
            >
              <TraceText
                primaryColor={primaryColor}
                size="7mm"
                tracking="0.5mm"
              >
                {frase}
              </TraceText>
            </GuideRow>
            <GuideRow
              primaryColor={primaryColor}
              secondaryColor={secondaryColor}
              rowHeight="15mm"
            >
              {null}
            </GuideRow>
          </div>
        ))}
      </div>
    </PageShell>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// 6. LETTERING — cabeçalhos estilo bullet journal, com guia diagonal
// ─────────────────────────────────────────────────────────────────────────

export function CaligrafiaLetteringPage({ palavras, ...rest }) {
  const { primaryColor, secondaryColor } = useVisual(
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
              style={{
                borderColor: primaryColor,
                opacity: 0.85,
                bottom: "6mm",
              }}
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
