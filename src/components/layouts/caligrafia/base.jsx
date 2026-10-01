// src/components/layouts/caligrafia/base.jsx
//
// Peças comuns às páginas de caligrafia: pauta em SVG (com traçado
// pontilhado), cabeçalho colorido, caixa de dados do aluno e seções
// numeradas. Reaproveita o PageShell / tema do CaligrafiaLayout original.

import {
  PageShell,
  useVisual,
  FONTE_INFANTIL,
  PALETA_INFANTIL,
} from "../CaligrafiaLayout";

export { PageShell, useVisual, FONTE_INFANTIL, PALETA_INFANTIL };

// Playwrite BR = caligrafia escolar brasileira (Google Fonts). As métricas
// abaixo foram medidas na própria fonte (unidades de em):
//   altura-x = 0,50 · ascendente/maiúscula ≈ 1,15 · descendente ≈ 0,65
export const FONTE_CURSIVA = "'Playwrite BR', 'Dancing Script', cursive";
export const METRICAS_CURSIVA = { topo: 1.15, meio: 0.5, desc: 0.65 };

// Fredoka: dígitos gordinhos e arredondados — ótimos para traçar.
export const METRICAS_DIGITO = { topo: 0.7, meio: 0.35, desc: 0.05 };

// Largura útil da página A4 (210 − 22 − 12 de margens espelhadas).
export const LARGURA = 176;

// Largura de avanço (em) de cada glifo da Playwrite BR — para calcular
// quantas letras cabem por linha sem precisar medir no navegador.
export const ADV = {
  A: 1.2, B: 1.126, C: 0.949, D: 1.244, E: 0.854, F: 1.141, G: 1.145,
  H: 1.268, I: 0.649, J: 0.733, K: 1.091, L: 0.951, M: 1.612, N: 1.201,
  O: 1.138, P: 0.965, Q: 1.272, R: 1.15, S: 1.094, T: 0.884, U: 1.183,
  V: 1.143, W: 1.592, X: 1.179, Y: 1.144, Z: 0.949,
  a: 0.622, b: 0.614, c: 0.522, d: 0.628, e: 0.444, f: 0.438, g: 0.623,
  h: 0.676, i: 0.3, j: 0.316, k: 0.564, l: 0.394, m: 0.989, n: 0.671,
  o: 0.589, p: 0.635, q: 0.647, r: 0.568, s: 0.55, t: 0.388, u: 0.646,
  v: 0.604, w: 0.888, x: 0.665, y: 0.665, z: 0.465,
};

export function larguraTexto(texto, fs) {
  let em = 0;
  for (const c of texto) em += c === " " ? 0.3 : (ADV[c] ?? 0.6);
  return em * fs;
}

// Cores fixas (independentes do tema) — o tema só manda no cabeçalho/rodapé.
const AZUL_ESCURO = "#1e3a8a";
const COR_SECAO = [
  PALETA_INFANTIL[4].ink, // azul
  PALETA_INFANTIL[3].ink, // verde
  PALETA_INFANTIL[1].ink, // laranja
  PALETA_INFANTIL[5].ink, // roxo
  PALETA_INFANTIL[0].ink, // rosa
];

// ─────────────────────────────────────────────────────────────────────────
// PAUTA
// ─────────────────────────────────────────────────────────────────────────

// modo: "pontos" | "tracejado" | "solido" | "fantasma"
function Glifo({ t, x, y, fs, modo, cor, fonte, peso }) {
  const base = {
    x,
    y,
    textAnchor: "middle",
    fontFamily: fonte,
    fontSize: fs,
    fontWeight: peso,
  };
  if (modo === "solido")
    return (
      <text {...base} fill={cor}>
        {t}
      </text>
    );
  if (modo === "fantasma")
    return (
      <text {...base} fill="#cbd5e1">
        {t}
      </text>
    );
  const tubo = modo === "tracejado" ? "#eef2f7" : "#e2e6ee";
  const escala = Math.min(1, fs / 12.5);
  const larguraTubo = Math.max(0.6, (modo === "tracejado" ? 1.6 : 1.3) * escala);
  return (
    <g>
      <text
        {...base}
        fill={tubo}
        stroke={tubo}
        strokeWidth={larguraTubo}
        strokeLinejoin="round"
      >
        {t}
      </text>
      {modo === "tracejado" ? (
        <text
          {...base}
          fill="none"
          stroke="#374151"
          strokeWidth="0.18"
          strokeDasharray="0.8 0.6"
        >
          {t}
        </text>
      ) : (
        <text
          {...base}
          fill="none"
          stroke="#111827"
          strokeWidth="0.32"
          strokeDasharray="0 0.75"
          strokeLinecap="round"
        >
          {t}
        </text>
      )}
    </g>
  );
}

// Uma linha de pauta (topo fino · meio tracejado · base forte) com glifos.
//   itens: [{ t: "A", x: 12, modo: "pontos", fs?: 11 }]
export function Pauta({
  itens = [],
  h = 22,
  fs = 11,
  metricas = METRICAS_CURSIVA,
  fonte = FONTE_CURSIVA,
  peso,
  cor = "#111827",
  corLinha = "#93c5fd",
  corBase = "#3b82f6",
  largura = LARGURA,
  margemTopo = 1.5,
}) {
  const base = margemTopo + metricas.topo * fs;
  const yTopo = base - metricas.topo * fs;
  const yMeio = base - metricas.meio * fs;
  return (
    <svg
      viewBox={`0 0 ${largura} ${h}`}
      style={{ width: "100%", display: "block", flexShrink: 0 }}
    >
      <line x1="0" x2={largura} y1={yTopo} y2={yTopo} stroke={corLinha} strokeWidth="0.25" />
      <line
        x1="0"
        x2={largura}
        y1={yMeio}
        y2={yMeio}
        stroke={corLinha}
        strokeWidth="0.25"
        strokeDasharray="1.2 1"
      />
      <line x1="0" x2={largura} y1={base} y2={base} stroke={corBase} strokeWidth="0.3" />
      {itens.map((it, i) => (
        <Glifo
          key={i}
          t={it.t}
          x={it.x}
          y={base}
          fs={it.fs ?? fs}
          modo={it.modo}
          cor={cor}
          fonte={fonte}
          peso={peso}
        />
      ))}
    </svg>
  );
}

// Distribui `n` itens igualmente na largura (centro de cada "casa").
export function distribuir(textos, modo, largura = LARGURA) {
  const n = textos.length;
  return textos.map((t, i) => ({ t, x: (largura / n) * (i + 0.5), modo }));
}

// ─────────────────────────────────────────────────────────────────────────
// CABEÇALHO / DADOS / SEÇÕES
// ─────────────────────────────────────────────────────────────────────────

export function TituloColorido({ texto, tamanho = "10.5mm", inicio = 0 }) {
  let k = inicio;
  return (
    <h1
      className="font-bold leading-none whitespace-nowrap"
      style={{ fontFamily: FONTE_INFANTIL, fontSize: tamanho }}
    >
      {[...texto].map((c, i) =>
        c === " " ? (
          <span key={i}>{"\u00A0"}</span>
        ) : (
          <span key={i} style={{ color: PALETA_INFANTIL[k++ % 6].ink }}>
            {c}
          </span>
        ),
      )}
    </h1>
  );
}

function Campo({ rotulo, peso = 1, cor }) {
  return (
    <div className="flex items-end gap-1.5" style={{ flex: peso }}>
      <span className="text-[10px] font-bold shrink-0" style={{ color: cor }}>
        {rotulo}:
      </span>
      <span className="flex-1 border-b" style={{ borderColor: "#64748b", height: "4mm" }} />
    </div>
  );
}

export function CaixaDados({ cor = AZUL_ESCURO }) {
  return (
    <div
      className="rounded-2xl border-2 px-4 py-2 shrink-0 flex flex-col gap-1.5"
      style={{ borderColor: "#93c5fd", fontFamily: FONTE_INFANTIL }}
    >
      <div className="flex gap-6">
        <Campo rotulo="Nome" peso={3} cor={cor} />
        <Campo rotulo="Data" peso={1.3} cor={cor} />
      </div>
      <div className="flex gap-6">
        <Campo rotulo="Professor" peso={3} cor={cor} />
        <Campo rotulo="Turma" peso={1.3} cor={cor} />
      </div>
    </div>
  );
}

// Cabeçalho padrão das folhas de atividade.
export function Cabecalho({ titulo, selo, faixa, logo, primaryColor, dados = true }) {
  return (
    <div className="shrink-0 mb-2.5 flex flex-col gap-2">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {logo ? <img src={logo} alt="" className="h-8 w-auto object-contain" /> : null}
          <TituloColorido texto={titulo} />
        </div>
        {selo && (
          <span
            className="text-[10px] font-bold rounded-full px-3 py-1 shrink-0"
            style={{ backgroundColor: primaryColor, color: "#fff", fontFamily: FONTE_INFANTIL }}
          >
            {selo}
          </span>
        )}
      </div>
      {faixa && (
        <div className="flex justify-center">
          <span
            className="px-8 py-1 rounded-md text-[13px] font-bold"
            style={{
              backgroundColor: "#dbeafe",
              border: "1.5px dashed #93c5fd",
              color: AZUL_ESCURO,
              fontFamily: FONTE_INFANTIL,
            }}
          >
            {faixa}
          </span>
        </div>
      )}
      {dados && <CaixaDados />}
    </div>
  );
}

export function Secao({ n, children, cor, dica }) {
  const c = cor || COR_SECAO[(n - 1) % COR_SECAO.length];
  return (
    <div className="flex items-center gap-2 shrink-0 mt-1.5 mb-1" style={{ fontFamily: FONTE_INFANTIL }}>
      <span
        className="flex items-center justify-center rounded-full text-white text-[11px] font-bold shrink-0"
        style={{ width: "5.5mm", height: "5.5mm", backgroundColor: c }}
      >
        {n}
      </span>
      <span className="text-[11px] font-bold" style={{ color: AZUL_ESCURO }}>
        {children}
      </span>
      {dica && <span className="text-[9px] text-gray-400 ml-auto">{dica}</span>}
    </div>
  );
}

// Faixa-pílula "PARTE 2 — ..." usada nas folhas de número.
export function Pilula({ children, cor = "#ec4899" }) {
  return (
    <span
      className="inline-block rounded-full px-4 py-0.5 text-[10px] font-bold text-white"
      style={{ backgroundColor: cor, fontFamily: FONTE_INFANTIL }}
    >
      {children}
    </span>
  );
}

export function Dica({ children, cor = "#f59e0b" }) {
  return (
    <div
      className="shrink-0 rounded-xl px-3 py-1.5 text-[9px] text-gray-600 mt-auto"
      style={{ border: `1.5px dashed ${cor}`, fontFamily: FONTE_INFANTIL }}
    >
      ⭐ {children}
    </div>
  );
}
