// src/components/layouts/caligrafia/Numeros.jsx
//
// Números e traçados (0 a 10):
//   Parte 1 · uma folha por número: cubra, escreva sozinho, conte e pinte,
//             treino de traçados e desenhos para colorir
//   Parte 2 · quantidade: pinte, ligue, circule, cubra e escreva
//   Parte 3 · sequências, antes e depois, ordem crescente, ligue os pontos
//   Final   · certificado de conclusão
// Conteúdo e ilustrações originais, geradas por código.

import {
  PageShell,
  useVisual,
  Pauta,
  Cabecalho,
  Secao,
  Dica,
  distribuir,
  FONTE_INFANTIL,
  PALETA_INFANTIL,
  METRICAS_DIGITO,
} from "./base";
import {
  Forma,
  Desenho,
  TIPOS_FORMA,
  TOTAL_DESENHOS,
  Tracejado,
  caminhos,
  embaralhar,
  LiguePontos,
  FIGURAS_PONTOS,
} from "./graficos";

export const EXTENSO = [
  "Zero", "Um", "Dois", "Três", "Quatro", "Cinco",
  "Seis", "Sete", "Oito", "Nove", "Dez",
];
export const NUMEROS_TRACADOS = Array.from({ length: 11 }, (_, n) => n);

const C_ROSA = PALETA_INFANTIL[0].ink;
const C_LARANJA = PALETA_INFANTIL[1].ink;
const C_VERDE = PALETA_INFANTIL[3].ink;
const C_AZUL = PALETA_INFANTIL[4].ink;
const C_ROXO = PALETA_INFANTIL[5].ink;

const VERDE = "#65a30d";
const AZUL = "#1e3a8a";

const plural = (n) => (n === 1 ? "elemento" : "elementos");

// Pauta de dígitos (Fredoka) — `n` dígitos por linha
function PautaDigitos({ texto, modo = "pontos", qtd, h = 14.5, fs = 16 }) {
  const q = qtd ?? (texto.length > 1 ? 4 : 7);
  return (
    <Pauta
      h={h}
      fs={fs}
      fonte={FONTE_INFANTIL}
      peso={600}
      metricas={METRICAS_DIGITO}
      itens={distribuir(Array(q).fill(texto), modo)}
    />
  );
}

function PautaEmBranco({ h = 14.5, fs = 16 }) {
  return <Pauta h={h} fs={fs} fonte={FONTE_INFANTIL} metricas={METRICAS_DIGITO} itens={[]} />;
}

function Medalhao({ numero, cor = VERDE }) {
  return (
    <div
      className="flex items-center justify-center rounded-full shrink-0 text-white font-bold"
      style={{
        width: "27mm",
        height: "27mm",
        backgroundColor: cor,
        border: "1.2mm dashed #ffffffcc",
        boxShadow: `0 0 0 1mm ${cor}`,
        fontFamily: FONTE_INFANTIL,
        fontSize: String(numero).length > 1 ? "14mm" : "17mm",
        lineHeight: 1,
      }}
    >
      {numero}
    </div>
  );
}

function Balao({ children }) {
  return (
    <div
      className="rounded-xl px-3 py-1.5 text-[9.5px] font-semibold uppercase leading-snug"
      style={{ border: `1.5px solid ${VERDE}`, color: "#374151", fontFamily: FONTE_INFANTIL, maxWidth: "52mm" }}
    >
      {children}
    </div>
  );
}

function CaixaFormas({ tipos, size = "10mm" }) {
  return (
    <div
      className="flex flex-wrap items-center justify-around gap-x-1 gap-y-1 rounded-2xl px-3 py-2 shrink-0"
      style={{ border: "2px solid #374151" }}
    >
      {tipos.map((t, i) => (
        <Forma key={i} tipo={t} size={size} />
      ))}
    </div>
  );
}

function GrupoCheio({ qtd, tipo, size = "6.5mm" }) {
  return (
    <div style={{ whiteSpace: "nowrap", lineHeight: 0, minHeight: size }}>
      {Array.from({ length: qtd }).map((_, i) => (
        <Forma key={i} tipo={tipo} size={size} modo="cheia" emLinha style={{ marginRight: "0.8mm" }} />
      ))}
    </div>
  );
}

function TresDesenhos({ numero, altura = "28mm" }) {
  return (
    <div className="flex items-end justify-around shrink-0">
      {[0, 1, 2].map((i) => (
        <Desenho key={i} indice={(numero * 3 + i) % TOTAL_DESENHOS} altura={altura} />
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// PARTE 1 — uma folha por número
// ─────────────────────────────────────────────────────────────────────────

export function NumeroTracadoPage({ numero, ...rest }) {
  const { primaryColor } = useVisual(rest.colorTheme, rest.customColors, rest.fontFamily);
  const texto = String(numero);
  const totalFormas = Math.min(10, Math.max(6, numero + 3));
  const tipos = Array.from({ length: totalFormas }, (_, i) => TIPOS_FORMA[(i + numero) % TIPOS_FORMA.length]);

  return (
    <PageShell {...rest}>
      <Cabecalho titulo="Números e Traçados" selo="PARTE 1" logo={rest.logo} primaryColor={primaryColor} />

      {/* topo: medalhão + extenso + quantos tem */}
      <div className="flex items-center gap-4 shrink-0 mb-1">
        <Medalhao numero={numero} />
        <div className="flex flex-col gap-1.5">
          <span className="font-bold leading-none" style={{ color: VERDE, fontFamily: FONTE_INFANTIL, fontSize: "11mm" }}>
            {EXTENSO[numero].toUpperCase()}
          </span>
          <Balao>Cubra o número tracejado com atenção e depois escreva sozinho.</Balao>
        </div>
        <div
          className="ml-auto rounded-2xl px-3 py-2 flex flex-col items-center gap-1"
          style={{ border: `2px dashed ${VERDE}`, minWidth: "50mm", minHeight: "24mm" }}
        >
          <span className="text-[9px] font-bold uppercase" style={{ color: VERDE, fontFamily: FONTE_INFANTIL }}>
            Quantos tem?
          </span>
          {numero === 0 ? (
            <span className="text-[9px] text-gray-400 italic pt-2" style={{ fontFamily: FONTE_INFANTIL }}>
              nenhum por aqui!
            </span>
          ) : (
            <GrupoCheio qtd={numero} tipo="estrela" size="6.5mm" />
          )}
        </div>
      </div>

      <Secao n={1}>Cubra o número.</Secao>
      <PautaDigitos texto={texto} />

      <Secao n={2}>Agora, escreva o número {numero} sozinho.</Secao>
      <div className="flex flex-col gap-1 shrink-0">
        <PautaEmBranco />
        <PautaEmBranco />
      </div>

      <Secao n={3}>
        Vamos contar? Pinte {numero} {plural(numero)}.
      </Secao>
      <CaixaFormas tipos={tipos} />

      <Secao n={4}>Vamos treinar? Cubra os traçados.</Secao>
      <svg viewBox="0 0 176 32" style={{ width: "100%", display: "block" }} className="shrink-0">
        <Tracejado d={caminhos.zigzag(8, 168, 6, 3.5, 24)} inicio={[3, 6]} fim={[173, 6]} />
        <Tracejado d={caminhos.onda(8, 168, 17, 3.2, 8)} inicio={[3, 17]} fim={[173, 17]} />
        <Tracejado d={caminhos.degraus(8, 168, 27, 3, 16)} inicio={[3, 27]} fim={[173, 27]} />
      </svg>

      <Secao n={5}>Pinte os desenhos.</Secao>
      <TresDesenhos numero={numero} />
    </PageShell>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// PARTE 2 — quantidade
// ─────────────────────────────────────────────────────────────────────────

function opcoesQtd(n, k, seed) {
  const candidatos = [n + 1, n - 1, n + 2, n - 2, n + 3, n - 3].filter((v) => v >= 0 && v <= 10);
  const escolhidas = [n, ...candidatos.slice(0, k - 1)];
  return embaralhar(escolhidas, seed);
}

export function NumeroQuantidadePage({ numero, ...rest }) {
  const { primaryColor } = useVisual(rest.colorTheme, rest.customColors, rest.fontFamily);
  const texto = String(numero);
  const totalPinte = Math.min(10, Math.max(5, numero + 3));
  const tiposPinte = Array.from({ length: totalPinte }, (_, i) => TIPOS_FORMA[(i + numero + 2) % TIPOS_FORMA.length]);
  const opLigue = opcoesQtd(numero, 4, numero + 11);
  const opCircule = opcoesQtd(numero, 3, numero + 37);

  return (
    <PageShell {...rest}>
      <Cabecalho titulo="Números e Traçados" selo="PARTE 2" logo={rest.logo} primaryColor={primaryColor} />

      <div className="flex items-center gap-4 shrink-0 mb-1">
        <Medalhao numero={numero} cor="#2563eb" />
        <span className="font-bold leading-none" style={{ color: "#2563eb", fontFamily: FONTE_INFANTIL, fontSize: "11mm" }}>
          {EXTENSO[numero].toUpperCase()}
        </span>
        <div className="ml-2">
          <Balao>
            O número {numero} representa {numero === 0 ? "a ausência de quantidade" : `${EXTENSO[numero].toLowerCase()} ${plural(numero)}`}.
          </Balao>
        </div>
      </div>

      <div className="flex gap-4 shrink-0 items-start">
        {/* coluna esquerda */}
        <div className="flex-1 flex flex-col min-w-0">
          <Secao n={1}>Pinte a quantidade.</Secao>
          <p className="text-[9px] text-gray-500 mb-1">
            {numero === 0 ? "Não pinte nenhum elemento." : `Pinte ${numero} ${plural(numero)}.`}
          </p>
          <CaixaFormas tipos={tiposPinte} size="8mm" />

          <Secao n={3}>Circule a quantidade correta.</Secao>
          <p className="text-[9px] text-gray-500 mb-1">
            Circule o conjunto que tem {numero} {plural(numero)}.
          </p>
          <div className="flex flex-col gap-1.5">
            {opCircule.map((q, i) => (
              <div
                key={i}
                className="rounded-xl px-2 py-1 flex items-center"
                style={{ border: `1.5px solid ${PALETA_INFANTIL[(i + 1) % 6].ink}`, minHeight: "12mm" }}
              >
                <GrupoCheio qtd={q} tipo={TIPOS_FORMA[(i * 2 + numero) % TIPOS_FORMA.length]} size="6mm" />
              </div>
            ))}
          </div>
        </div>

        {/* coluna direita */}
        <div className="flex-1 flex flex-col min-w-0">
          <Secao n={2}>Ligue o número à quantidade.</Secao>
          <p className="text-[9px] text-gray-500 mb-1">
            Ligue o número {numero} ao conjunto que tem {numero} {plural(numero)}.
          </p>
          <div className="flex items-center gap-2">
            <div
              className="flex items-center justify-center rounded-xl font-bold shrink-0"
              style={{
                width: "15mm",
                height: "22mm",
                border: "2px dashed #2563eb",
                color: VERDE,
                fontFamily: FONTE_INFANTIL,
                fontSize: "11mm",
              }}
            >
              {numero}
            </div>
            <div className="flex flex-col gap-1.5 flex-1 min-w-0">
              {opLigue.map((q, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <span className="rounded-full shrink-0" style={{ width: "2.2mm", height: "2.2mm", backgroundColor: "#2563eb" }} />
                  <div
                    className="rounded-xl px-2 py-1 flex-1 flex items-center"
                    style={{ border: `1.5px solid ${PALETA_INFANTIL[(i + 3) % 6].ink}`, minHeight: "11mm" }}
                  >
                    <GrupoCheio qtd={q} tipo={TIPOS_FORMA[(i * 3 + numero + 1) % TIPOS_FORMA.length]} size="5mm" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Secao n={4}>Cubra e escreva o número.</Secao>
      <div className="flex flex-col gap-1 shrink-0">
        <PautaDigitos texto={texto} qtd={texto.length > 1 ? 5 : 9} />
        <PautaEmBranco />
      </div>

      <Secao n={5}>Pinte os desenhos.</Secao>
      <TresDesenhos numero={numero + 4} altura="24mm" />

    </PageShell>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// PARTE 3 — sequência numérica
// ─────────────────────────────────────────────────────────────────────────

function Casa({ valor, cor, tamanho = "13mm", aberta = false, fundo = "#fff", redonda = false }) {
  const vazia = valor === null || valor === undefined;
  return (
    <div
      className="flex items-center justify-center font-bold shrink-0"
      style={{
        width: tamanho,
        height: tamanho,
        borderRadius: redonda ? "9999px" : "3mm",
        border: `${vazia ? "1.5px dashed" : "2px solid"} ${cor}`,
        backgroundColor: fundo,
        color: cor,
        fontFamily: FONTE_INFANTIL,
        fontSize: "6.5mm",
        opacity: aberta ? 0.85 : 1,
      }}
    >
      {vazia ? "" : valor}
    </div>
  );
}

function LinhaSequencia({ de, ate, ocultos, cor, titulo }) {
  const valores = Array.from({ length: ate - de + 1 }, (_, i) => de + i);
  return (
    <div className="shrink-0 rounded-2xl px-3 py-2" style={{ border: `2px solid ${cor}55` }}>
      <p className="text-[9px] font-bold mb-1.5" style={{ color: cor, fontFamily: FONTE_INFANTIL }}>
        {titulo ?? `Complete a sequência de ${de} a ${ate}.`}
      </p>
      <div className="flex items-center justify-between gap-1">
        {valores.map((v, i) => (
          <Casa key={v} valor={ocultos.includes(i) ? null : v} cor={cor} tamanho="12.5mm" />
        ))}
      </div>
    </div>
  );
}

function Trem({ inicio, fim, ocultos, cores }) {
  const valores = Array.from({ length: fim - inicio + 1 }, (_, i) => inicio + i);
  const roda = (extra) => (
    <span className="absolute rounded-full" style={{ width: "3mm", height: "3mm", bottom: 0, backgroundColor: "#374151", ...extra }} />
  );
  return (
    <div className="flex items-end gap-1.5 shrink-0">
      <div className="relative shrink-0" style={{ width: "19mm", paddingBottom: "2.2mm" }}>
        <div className="rounded-lg" style={{ width: "19mm", height: "15mm", backgroundColor: "#2563eb" }}>
          <span className="absolute rounded-sm" style={{ left: "10mm", top: "-3mm", width: "4mm", height: "5mm", backgroundColor: "#1d4ed8" }} />
          <span className="absolute rounded-md" style={{ left: "2.5mm", top: "3mm", width: "6mm", height: "6mm", backgroundColor: "#dbeafe" }} />
        </div>
        {roda({ left: "3mm" })}
        {roda({ right: "3mm" })}
      </div>
      {valores.map((v, i) => (
        <div key={v} className="relative shrink-0" style={{ width: "19mm", paddingBottom: "2.2mm" }}>
          <div
            className="flex items-center justify-center rounded-lg"
            style={{ width: "19mm", height: "15mm", backgroundColor: cores[i % cores.length] }}
          >
            <Casa valor={ocultos.includes(i) ? null : v} cor={AZUL} tamanho="11mm" />
          </div>
          {roda({ left: "3mm" })}
          {roda({ right: "3mm" })}
        </div>
      ))}
    </div>
  );
}

export function SequenciaPage(rest) {
  const { primaryColor } = useVisual(rest.colorTheme, rest.customColors, rest.fontFamily);
  const C = PALETA_INFANTIL;
  const vagoes = [C[1].ink, "#facc15", "#4ade80", "#a78bfa", "#f472b6"];
  return (
    <PageShell {...rest}>
      <Cabecalho titulo="Números e Traçados" selo="PARTE 3" logo={rest.logo} primaryColor={primaryColor} />
      <Secao n={1}>Complete os números que faltam.</Secao>
      <div className="flex flex-col gap-2 shrink-0">
        <LinhaSequencia de={0} ate={10} ocultos={[1, 3, 5, 6, 8, 10]} cor={C[0].ink} />
        <LinhaSequencia de={10} ate={20} ocultos={[1, 3, 5, 6, 8, 10]} cor={C[3].ink} />
        <div className="rounded-2xl px-3 py-2 flex flex-col gap-2" style={{ border: `2px solid ${C[4].ink}55` }}>
          <p className="text-[9px] font-bold" style={{ color: C[4].ink, fontFamily: FONTE_INFANTIL }}>
            Complete os números que faltam nos trenzinhos.
          </p>
          <Trem inicio={1} fim={5} ocultos={[1, 3]} cores={vagoes} />
          <Trem inicio={6} fim={10} ocultos={[1, 3]} cores={vagoes.slice().reverse()} />
        </div>
        <LinhaSequencia de={20} ate={30} ocultos={[2, 4, 5, 7, 9]} cor={C[1].ink} />
        <LinhaSequencia de={30} ate={40} ocultos={[1, 2, 4, 6, 8, 10]} cor={C[5].ink} />
        <LinhaSequencia de={40} ate={50} ocultos={[1, 3, 4, 6, 7, 9]} cor={C[4].ink} />
      </div>
      <div className="mt-auto pt-2">
        <Dica>Cada número é especial! Complete com atenção.</Dica>
      </div>
    </PageShell>
  );
}

// Antes e depois ---------------------------------------------------------

function CartaoAntesDepois({ n, i }) {
  const cores = [C_ROSA, C_VERDE, C_LARANJA, C_AZUL, C_ROXO];
  const cor = cores[i % cores.length];
  const forma = ["9999px", "3mm", "9999px"][i % 3];
  return (
    <div
      className="flex items-center justify-between rounded-2xl px-2 shrink-0"
      style={{ border: `2px solid ${cor}`, height: "17mm" }}
    >
      <span className="text-[8px] font-bold rounded-full text-white flex items-center justify-center" style={{ width: "4.5mm", height: "4.5mm", backgroundColor: cor, alignSelf: "flex-start", marginTop: "1mm" }}>
        {i + 1}
      </span>
      <Casa valor={null} cor="#6b7280" tamanho="9mm" />
      <span style={{ color: cor }}>—</span>
      <Casa valor={n} cor={cor} tamanho="10mm" redonda={forma === "9999px"} />
      <span style={{ color: cor }}>—</span>
      <Casa valor={null} cor="#6b7280" tamanho="9mm" />
    </div>
  );
}

export function AntesDepoisPage(rest) {
  const { primaryColor } = useVisual(rest.colorTheme, rest.customColors, rest.fontFamily);
  const numeros = Array.from({ length: 21 }, (_, i) => i + 1);
  return (
    <PageShell {...rest}>
      <Cabecalho titulo="Números e Traçados" faixa="Antes e Depois" selo="PARTE 3" logo={rest.logo} primaryColor={primaryColor} />
      <Secao n={2}>Escreva o número que vem antes e depois.</Secao>
      <p className="text-[9px] text-gray-500 mb-1.5 shrink-0">
        Para cada número, escreva o que vem antes (à esquerda) e o que vem depois (à direita).
      </p>
      <div className="grid grid-cols-3 gap-2 shrink-0">
        {numeros.map((n, i) => (
          <CartaoAntesDepois key={n} n={n} i={i} />
        ))}
      </div>
      <div className="mt-auto pt-2">
        <Dica>Cada número tem um vizinho antes e um depois!</Dica>
      </div>
    </PageShell>
  );
}

// Ordem crescente --------------------------------------------------------

function ExercicioOrdem({ titulo, valores, cor, seed, formato = "caixa" }) {
  const embaralhados = embaralhar(valores, seed);
  const tamanho = valores.length > 6 ? "11mm" : "13mm";
  return (
    <div className="shrink-0 rounded-2xl px-3 py-2 flex flex-col gap-1.5" style={{ border: `2px solid ${cor}66` }}>
      <p className="text-[9px] font-bold" style={{ color: cor, fontFamily: FONTE_INFANTIL }}>{titulo}</p>
      <div className="flex items-center justify-around">
        {embaralhados.map((v) => (
          <Casa key={v} valor={v} cor={cor} tamanho={tamanho} redonda={formato === "redonda"} />
        ))}
      </div>
      <div className="flex items-center justify-around">
        {valores.map((v, i) => (
          <Casa key={i} valor={null} cor={cor} tamanho={tamanho} redonda={formato === "redonda"} />
        ))}
      </div>
    </div>
  );
}

const faixa = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);

export function OrdemCrescentePage(rest) {
  const { primaryColor } = useVisual(rest.colorTheme, rest.customColors, rest.fontFamily);
  return (
    <PageShell {...rest}>
      <Cabecalho titulo="Números e Traçados" faixa="Ordem Crescente" selo="PARTE 3" logo={rest.logo} primaryColor={primaryColor} />
      <Secao n={3}>Escreva os números em ordem crescente (do menor para o maior).</Secao>
      <div className="flex flex-col gap-2.5 shrink-0">
        <ExercicioOrdem titulo="De 1 a 5" valores={faixa(1, 5)} cor={C_ROSA} seed={3} />
        <ExercicioOrdem titulo="De 1 a 10" valores={faixa(1, 10)} cor={C_VERDE} seed={8} formato="redonda" />
        <ExercicioOrdem titulo="De 5 a 10" valores={faixa(5, 10)} cor={C_AZUL} seed={5} />
        <ExercicioOrdem titulo="De 10 a 15" valores={faixa(10, 15)} cor={C_LARANJA} seed={12} />
        <ExercicioOrdem titulo="Desafio especial: de 11 a 20" valores={faixa(11, 20)} cor={C_ROXO} seed={21} formato="redonda" />
      </div>
      <div className="mt-auto pt-2">
        <Dica>Dica para a família: estimule a criança a contar em voz alta antes de escrever os números.</Dica>
      </div>
    </PageShell>
  );
}

// Ligue os pontos --------------------------------------------------------

export function LiguePontosPage(rest) {
  const { primaryColor } = useVisual(rest.colorTheme, rest.customColors, rest.fontFamily);
  const cores = [C_VERDE, C_LARANJA, C_ROSA, C_AZUL];
  return (
    <PageShell {...rest}>
      <Cabecalho titulo="Números e Traçados" faixa="Ligue os pontos de 1 a 10" selo="PARTE 3" logo={rest.logo} primaryColor={primaryColor} />
      <Secao n={4}>Ligue os pontos na ordem dos números e descubra os desenhos!</Secao>
      <div className="grid grid-cols-2 gap-3 shrink-0">
        {FIGURAS_PONTOS.map((fig, i) => (
          <div key={fig.nome} className="rounded-2xl p-2" style={{ border: `2px dashed ${cores[i]}` }}>
            <span className="inline-block text-white text-[10px] font-bold rounded-full px-3 py-0.5 mb-1" style={{ backgroundColor: cores[i], fontFamily: FONTE_INFANTIL }}>
              {i + 1}. {fig.nome.toUpperCase()}
            </span>
            <LiguePontos pts={fig.pts} />
          </div>
        ))}
      </div>
      <div className="mt-auto pt-2">
        <Dica>Concentre-se, conte e conecte os pontos na ordem certa!</Dica>
      </div>
    </PageShell>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// CERTIFICADO
// ─────────────────────────────────────────────────────────────────────────

export function CertificadoPage({ titulo = "Caderno de Caligrafia", ...rest }) {
  const { primaryColor } = useVisual(rest.colorTheme, rest.customColors, rest.fontFamily);
  const linha = (rotulo) => (
    <div className="flex items-end gap-2 mb-4">
      <span className="text-[11px] font-bold shrink-0" style={{ color: AZUL, fontFamily: FONTE_INFANTIL }}>{rotulo}</span>
      <span className="flex-1 border-b-2" style={{ borderColor: "#3b82f6", height: "6mm" }} />
    </div>
  );
  return (
    <PageShell {...rest}>
      <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
        <p className="text-[11px] tracking-[0.3em] uppercase text-gray-400 mb-2" style={{ fontFamily: FONTE_INFANTIL }}>
          Certificado de conclusão
        </p>
        <h1 className="font-bold leading-none mb-6" style={{ fontFamily: FONTE_INFANTIL, fontSize: "24mm" }}>
          {[..."PARABÉNS!"].map((c, i) => (
            <span key={i} style={{ color: PALETA_INFANTIL[i % 6].ink }}>{c}</span>
          ))}
        </h1>
        <svg viewBox="0 0 60 70" style={{ width: "46mm" }} className="mb-5">
          <path d="M18 40 10 66l10-5 6 7 7-24Z" fill="#3b82f6" />
          <path d="M42 40 50 66l-10-5-6 7-7-24Z" fill="#60a5fa" />
          <circle cx="30" cy="27" r="22" fill="#facc15" stroke="#eab308" strokeWidth="2" />
          <circle cx="30" cy="27" r="16.500" fill="#fde047" />
          <path
            d="M30 15l3.600 7.400 8.100 1.200-5.900 5.700 1.400 8.100L30 33.500l-7.200 3.800 1.400-8.100-5.900-5.700 8.100-1.200Z"
            fill="#3b82f6"
          />
        </svg>
        <p className="text-base font-bold mb-8" style={{ color: AZUL, fontFamily: FONTE_INFANTIL }}>
          Você concluiu o {titulo}!
        </p>
        <div className="w-full max-w-[140mm] text-left rounded-3xl px-6 pt-5 pb-1" style={{ border: "2px dashed #3b82f6" }}>
          {linha("Nome da criança:")}
          {linha("Data:")}
          {linha("Assinatura do responsável ou professor:")}
        </div>
        <p className="mt-6 text-sm font-bold" style={{ color: "#16a34a", fontFamily: FONTE_INFANTIL }}>
          Continue praticando e aprendendo todos os dias! 💚
        </p>
      </div>
    </PageShell>
  );
}
