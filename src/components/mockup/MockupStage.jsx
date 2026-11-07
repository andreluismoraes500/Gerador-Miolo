// src/components/mockup/MockupStage.jsx
//
// Cena do mockup em SVG puro (1200×1000). Como tudo é vetorial + imagens em
// data-URL, o MockupPage consegue serializar este <svg> e exportá-lo em PNG
// ou SVG sem nenhuma dependência extra.

import { forwardRef } from "react";
import {
  Binding,
  MockupDefs,
  TIPOS_ANELADOS,
  caminhoArredondado,
} from "./bindings";

export const STAGE_W = 1200;
export const STAGE_H = 1000;

export const CENAS = {
  creme: { nome: "Creme", a: "#f6f0e2", b: "#e8dcc2" },
  cinza: { nome: "Cinza", a: "#eceef1", b: "#cfd4db" },
  grafite: { nome: "Grafite", a: "#3a3f48", b: "#1d2025" },
  azul: { nome: "Azul", a: "#dfe9f5", b: "#b7cbe6" },
  rosa: { nome: "Rosa", a: "#fbe9ec", b: "#f1c6cf" },
  madeira: { nome: "Madeira", a: "#b98a5a", b: "#8a5f37", madeira: true },
  branco: { nome: "Branco", a: "#ffffff", b: "#f1f1f1" },
};

export function Cena({ cena }) {
  const c = CENAS[cena] || CENAS.creme;
  return (
    <g>
      <defs>
        <radialGradient id="mk-cena" cx="50%" cy="38%" r="75%">
          <stop offset="0" stopColor={c.a} />
          <stop offset="1" stopColor={c.b} />
        </radialGradient>
      </defs>
      <rect width={STAGE_W} height={STAGE_H} fill="url(#mk-cena)" />
      {c.madeira &&
        Array.from({ length: 26 }).map((_, i) => (
          <path
            key={i}
            d={`M0 ${i * 40 + 8} C300 ${i * 40 - 6} 700 ${i * 40 + 22} ${STAGE_W} ${i * 40 + 4}`}
            stroke="#5a3a1c"
            strokeOpacity={i % 3 === 0 ? 0.22 : 0.1}
            strokeWidth={i % 4 === 0 ? 2.4 : 1.2}
            fill="none"
          />
        ))}
      <rect width={STAGE_W} height={STAGE_H} filter="url(#mk-grao)" />
    </g>
  );
}

// Linhas de caderno (placeholder quando não há imagem de miolo).
function Pautado({ x, y, w, h, cor = "#b9c4d6" }) {
  const n = Math.floor((h - 100) / 30);
  return (
    <g>
      {Array.from({ length: n }).map((_, i) => (
        <line
          key={i}
          x1={x + 34}
          x2={x + w - 34}
          y1={y + 80 + i * 30}
          y2={y + 80 + i * 30}
          stroke={cor}
          strokeWidth="1.2"
        />
      ))}
    </g>
  );
}

function Pagina({ x, y, w, h, src, rl, rr, id, lado }) {
  const d = caminhoArredondado(x, y, w, h, rl, rr);
  return (
    <g>
      <clipPath id={id}>
        <path d={d} />
      </clipPath>
      <path d={d} fill={lado === "esq" ? "url(#mk-papel-esq)" : "url(#mk-papel)"} />
      {src ? (
        <image
          href={src}
          x={x}
          y={y}
          width={w}
          height={h}
          preserveAspectRatio="xMidYMid slice"
          clipPath={`url(#${id})`}
        />
      ) : (
        <g clipPath={`url(#${id})`}>
          <Pautado x={x} y={y} w={w} h={h} />
        </g>
      )}
    </g>
  );
}

// Espessura (páginas empilhadas) à direita e embaixo.
function Espessura({ x, y, w, h, camadas, rr }) {
  return (
    <g>
      {Array.from({ length: camadas }).map((_, i) => {
        const k = camadas - i;
        return (
          <path
            key={i}
            d={caminhoArredondado(x + k * 1.6, y + k * 1.6, w, h, 2, rr)}
            fill={i % 2 ? "#ece6d8" : "#fbf8f0"}
            stroke="#cfc6b0"
            strokeWidth="0.6"
          />
        );
      })}
    </g>
  );
}

const MockupStage = forwardRef(function MockupStage(
  { tipo, metal, cena, view, capaSrc, miolosrc, corCapa = "#1e293b", brilho = true },
  ref,
) {
  const anelado = TIPOS_ANELADOS.includes(tipo);
  const bloco = tipo === "bloco";

  // ---------- CAPA FECHADA ----------
  const cw = 540;
  const ch = 764;
  const cx0 = (STAGE_W - cw) / 2;
  const cy0 = (STAGE_H - ch) / 2;
  const rrCapa = tipo === "brochura" || tipo === "costura" ? 12 : 8;

  const renderFechada = () => (
    <g>
      {/* sombra projetada */}
      <path
        d={caminhoArredondado(cx0 + 16, cy0 + 26, cw, ch, 8, 10)}
        fill="#000"
        opacity="0.38"
        filter="url(#mk-sombra)"
      />
      <Espessura x={cx0} y={cy0} w={cw} h={ch} camadas={bloco ? 6 : 3} rr={rrCapa} />
      <clipPath id="mk-clip-capa">
        <path d={caminhoArredondado(cx0, cy0, cw, ch, 6, rrCapa)} />
      </clipPath>
      <path d={caminhoArredondado(cx0, cy0, cw, ch, 6, rrCapa)} fill={corCapa} />
      {capaSrc && (
        <image
          href={capaSrc}
          x={cx0}
          y={cy0}
          width={cw}
          height={ch}
          preserveAspectRatio="xMidYMid slice"
          clipPath="url(#mk-clip-capa)"
        />
      )}
      {brilho && (
        <path
          d={caminhoArredondado(cx0, cy0, cw, ch, 6, rrCapa)}
          fill="url(#mk-brilho)"
        />
      )}
      {bloco ? (
        <g>
          <rect x={cx0} y={cy0} width={cw} height="46" fill="#000" opacity="0.14" clipPath="url(#mk-clip-capa)" />
          <rect x={cx0} y={cy0} width={cw} height="46" fill="#fff" opacity="0.1" clipPath="url(#mk-clip-capa)" />
          <line x1={cx0} x2={cx0 + cw} y1={cy0 + 46} y2={cy0 + 46} stroke="#000" strokeOpacity="0.3" strokeDasharray="3 5" />
        </g>
      ) : (
        <Binding
          tipo={tipo}
          cx={tipo === "grampo" ? cx0 + 12 : cx0}
          y0={cy0}
          y1={cy0 + ch}
          metal={metal}
        />
      )}
    </g>
  );

  // ---------- ABERTA ----------
  const pw = 500;
  const ph = 707;
  const gx = STAGE_W / 2;
  const py = (STAGE_H - ph) / 2;

  const renderAberta = () => {
    if (bloco) {
      const bx = (STAGE_W - pw) / 2;
      return (
        <g>
          <path d={caminhoArredondado(bx + 14, py + 24, pw, ph, 4, 6)} fill="#000" opacity="0.35" filter="url(#mk-sombra)" />
          <Espessura x={bx} y={py} w={pw} h={ph} camadas={8} rr={4} />
          <Pagina x={bx} y={py} w={pw} h={ph} src={miolosrc} rl={3} rr={4} id="mk-p-bloco" lado="dir" />
          <rect x={bx} y={py} width={pw} height="40" fill="#000" opacity="0.12" />
          <line x1={bx} x2={bx + pw} y1={py + 40} y2={py + 40} stroke="#000" strokeOpacity="0.28" strokeDasharray="3 5" />
        </g>
      );
    }
    return (
      <g>
        <path d={caminhoArredondado(gx - pw + 10, py + 24, pw * 2, ph, 6, 6)} fill="#000" opacity="0.34" filter="url(#mk-sombra)" />
        <Espessura x={gx} y={py} w={pw} h={ph} camadas={4} rr={4} />
        <Pagina x={gx - pw} y={py} w={pw} h={ph} src={null} rl={4} rr={2} id="mk-p-esq" lado="esq" />
        <Pagina x={gx} y={py} w={pw} h={ph} src={miolosrc} rl={2} rr={4} id="mk-p-dir" lado="dir" />
        <rect x={gx - 46} y={py} width="92" height={ph} fill="url(#mk-gutter)" />
        <Binding tipo={tipo} cx={gx} y0={py} y1={py + ph} metal={metal} aberto />
      </g>
    );
  };

  return (
    <svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox={`0 0 ${STAGE_W} ${STAGE_H}`}
      width="100%"
      style={{ display: "block", height: "auto" }}
    >
      <MockupDefs />
      <Cena cena={cena} />
      {view === "aberta" ? renderAberta() : renderFechada()}
    </svg>
  );
});

export default MockupStage;
