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
  caminhoCantos,
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
  concreto: { nome: "Concreto", a: "#c9cbcd", b: "#9fa3a8" },
  verde: { nome: "Verde", a: "#e1ece1", b: "#b9d1bb" },
  bege: { nome: "Estúdio bege", a: "#efe3d0", b: "#d9c4a3" },
  marmore: { nome: "Mármore", a: "#f4f4f2", b: "#d9dadc", textura: "marmore" },
  escritorio: { nome: "Escritório", a: "#5a4636", b: "#2f241b", madeira: true, escuro: true },
  papelaria: { nome: "Papelaria", a: "#fdf6ee", b: "#ecd9c6", textura: "papelaria" },
  floral: { nome: "Floral", a: "#fcebee", b: "#f3c4cf", textura: "floral" },
  minimalista: { nome: "Minimalista", a: "#f7f7f5", b: "#e9e9e6" },
  premium: { nome: "Premium", a: "#2b2f3a", b: "#0f1116", escuro: true },
};

function clarear(hex, f) {
  const n = parseInt(hex.slice(1), 16);
  const ch = (v) => Math.round(v + (255 - v) * f).toString(16).padStart(2, "0");
  return `#${ch((n >> 16) & 255)}${ch((n >> 8) & 255)}${ch(n & 255)}`;
}

// Aceita um id de cenário ou uma cor personalizada (#rrggbb).
export function cenaDe(cena) {
  if (/^#[0-9a-f]{6}$/i.test(cena || "")) {
    const n = parseInt(cena.slice(1), 16);
    const lum = (0.299 * ((n >> 16) & 255) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255;
    return { nome: "Personalizada", a: clarear(cena, 0.28), b: cena, escuro: lum < 0.35 };
  }
  return CENAS[cena] || CENAS.creme;
}

export function Cena({ cena }) {
  const c = cenaDe(cena);
  const escuro = c.escuro || cena === "grafite";
  return (
    <g>
      <defs>
        <radialGradient id="mk-cena" cx="50%" cy="38%" r="75%">
          <stop offset="0" stopColor={c.a} />
          <stop offset="1" stopColor={c.b} />
        </radialGradient>
      </defs>
      <rect width={STAGE_W} height={STAGE_H} fill="url(#mk-cena)" />
      {c.madeira && (
        <>
          <rect width={STAGE_W} height={STAGE_H} filter="url(#mk-madeira-fx)" opacity="0.55" />
          {Array.from({ length: 9 }).map((_, i) => (
            <line key={i} x1="0" x2={STAGE_W} y1={i * 125 + 20} y2={i * 125 + 20} stroke="#2b1708" strokeOpacity="0.35" strokeWidth="2" />
          ))}
        </>
      )}
      <rect width={STAGE_W} height={STAGE_H} fill="url(#mk-janela)" opacity={escuro ? 0.35 : 0.9} />
      <rect width={STAGE_W} height={STAGE_H} fill="url(#mk-vinheta)" />
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

// Espessura (páginas empilhadas) em direção à borda externa e à base.
function Espessura({ x, y, w, h, camadas, rl, rr, dir = 1 }) {
  return (
    <g>
      {Array.from({ length: camadas }).map((_, i) => {
        const k = camadas - i;
        return (
          <path
            key={i}
            d={caminhoArredondado(x + dir * k * 1.6, y + k * 1.6, w, h, rl, rr)}
            fill={i % 2 ? "#ece6d8" : "#fbf8f0"}
            stroke="#cfc6b0"
            strokeWidth="0.6"
          />
        );
      })}
    </g>
  );
}

function Textura({ mat, d, id }) {
  if (mat === "couro")
    return (
      <g clipPath={`url(#${id})`}>
        <rect width={STAGE_W} height={STAGE_H} filter="url(#mk-couro)" opacity="0.8" />
      </g>
    );
  if (mat === "linho")
    return (
      <g clipPath={`url(#${id})`}>
        <rect width={STAGE_W} height={STAGE_H} fill="url(#mk-linho)" />
      </g>
    );
  return null;
}

const MockupStage = forwardRef(function MockupStage(
  {
    tipo, metal, cena, view, capaSrc, miolosrc, corCapa = "#1e293b", brilho = true,
    mat = "carton", disp = "esquerda", aneis = null, furo = "auto", cantos = false,
    elastico = false, corElastico = "#111111", elasticoLarg = 6, elasticoPos = 22,
    passante = false, corPassante = "#111111", fita = false, corFita = "#b3262e",
  },
  ref,
) {
  const bloco = tipo === "bloco";
  const PX = 3.65; // px por mm (A5 ≈ 148 mm ↔ 540 px)

  // ---------- CAPA FECHADA ----------
  const cw = 540;
  const ch = 764;
  const cx0 = (STAGE_W - cw) / 2;
  const cy0 = (STAGE_H - ch) / 2;
  const duro = tipo === "brochura" || tipo === "costura" || tipo === "argolas";
  const R = cantos ? 34 : duro ? 12 : 8;
  const r0 = 4;
  const raios =
    disp === "direita" ? [R, r0, r0, R] : disp === "topo" ? [r0, r0, R, R] : [r0, R, R, r0];
  const dCapa = caminhoCantos(cx0, cy0, cw, ch, raios);
  const rl = disp === "direita" ? R : r0;
  const rr = disp === "direita" ? r0 : R;

  // referencial local da encadernação (eixo em x=0, comprimento = len)
  const topo = disp === "topo";
  const len = topo ? cw : ch;
  const largura = topo ? ch : cw;
  const tf =
    disp === "direita"
      ? `translate(${cx0 + cw} ${cy0 + ch}) rotate(180)`
      : topo
        ? `translate(${cx0 + cw} ${cy0}) rotate(90)`
        : `translate(${cx0} ${cy0})`;

  const renderElastico = () => {
    if (!elastico || bloco) return null;
    const L = elasticoLarg * PX;
    const ex = largura - elasticoPos * PX - L / 2;
    const pz = len * 0.26;
    return (
      <g transform={tf}>
        <rect x={ex + 3} y={-6} width={L} height={len + 12} fill="#000" opacity="0.35" filter="url(#mk-sombra-leve)" />
        <rect x={ex} y={-4} width={L} height={len + 8} fill={corElastico} />
        {Array.from({ length: Math.floor(len / 5) }).map((_, i) => (
          <line key={i} x1={ex} x2={ex + L} y1={i * 5 + 2} y2={i * 5 + 2} stroke="#000" strokeOpacity="0.18" strokeWidth="0.8" />
        ))}
        <rect x={ex} y={-4} width={L} height={len + 8} fill="url(#mk-elast)" />
        {passante && (
          <g>
            <rect x={ex - 7} y={pz + 3} width={L + 14} height="30" rx="3" fill="#000" opacity="0.4" filter="url(#mk-sombra-leve)" />
            <rect x={ex - 6} y={pz} width={L + 12} height="28" rx="3" fill={corPassante} />
            <rect x={ex - 6} y={pz} width={L + 12} height="28" rx="3" fill="url(#mk-elast)" opacity="0.8" />
            <rect x={ex - 6} y={pz} width={L + 12} height="9" rx="3" fill="#fff" opacity="0.14" />
            <line x1={ex - 3} x2={ex - 3} y1={pz + 3} y2={pz + 25} stroke="#fff" strokeOpacity="0.4" strokeDasharray="2 3" />
            <line x1={ex + L + 3} x2={ex + L + 3} y1={pz + 3} y2={pz + 25} stroke="#fff" strokeOpacity="0.4" strokeDasharray="2 3" />
          </g>
        )}
      </g>
    );
  };

  const renderFita = () => {
    if (!fita || bloco) return null;
    const x = cx0 + cw * 0.58;
    const y = cy0 + ch - 4;
    return (
      <g>
        <path d={`M${x + 3} ${y + 3} h22 v92 l-11 -13 l-11 13 Z`} fill="#000" opacity="0.35" filter="url(#mk-sombra-leve)" />
        <path d={`M${x} ${y} h22 v92 l-11 -13 l-11 13 Z`} fill={corFita} />
        <path d={`M${x} ${y} h8 v88 l-8 9 Z`} fill="#fff" opacity="0.14" />
        <path d={`M${x + 22} ${y} h-5 v82 l5 11 Z`} fill="#000" opacity="0.18" />
      </g>
    );
  };

  const renderFechada = () => (
    <g>
      {/* sombras: longa e suave + contato */}
      <path d={caminhoCantos(cx0 + 22, cy0 + 34, cw, ch, raios)} fill="#000" opacity="0.34" filter="url(#mk-sombra)" />
      <path d={caminhoCantos(cx0 + 5, cy0 + 8, cw, ch, raios)} fill="#000" opacity="0.4" filter="url(#mk-sombra-leve)" />
      <Espessura x={cx0} y={cy0} w={cw} h={ch} camadas={bloco ? 6 : 3} rl={rl} rr={rr} dir={disp === "direita" ? -1 : 1} />
      <clipPath id="mk-clip-capa">
        <path d={dCapa} />
      </clipPath>
      <path d={dCapa} fill={corCapa} />
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
      <Textura mat={mat} id="mk-clip-capa" />
      {(brilho || mat === "brilho") && <path d={dCapa} fill="url(#mk-brilho)" opacity={mat === "brilho" ? 1.4 : 1} />}
      {/* bisel */}
      <path d={dCapa} fill="none" stroke="#fff" strokeOpacity="0.28" strokeWidth="1.4" />
      <path d={dCapa} fill="none" stroke="#000" strokeOpacity="0.22" strokeWidth="0.8" transform="translate(0.8 0.8)" clipPath="url(#mk-clip-capa)" />
      {bloco ? (
        <g>
          <rect x={cx0} y={cy0} width={cw} height="46" fill="#000" opacity="0.14" clipPath="url(#mk-clip-capa)" />
          <rect x={cx0} y={cy0} width={cw} height="46" fill="#fff" opacity="0.1" clipPath="url(#mk-clip-capa)" />
          <line x1={cx0} x2={cx0 + cw} y1={cy0 + 46} y2={cy0 + 46} stroke="#000" strokeOpacity="0.3" strokeDasharray="3 5" />
        </g>
      ) : (
        <>
          {renderElastico()}
          <g transform={tf}>
            <Binding tipo={tipo} len={len} metal={metal} n={aneis} furo={furo} />
          </g>
        </>
      )}
      {renderFita()}
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
          <Espessura x={bx} y={py} w={pw} h={ph} camadas={8} rl={4} rr={4} />
          <Pagina x={bx} y={py} w={pw} h={ph} src={miolosrc} rl={3} rr={4} id="mk-p-bloco" lado="dir" />
          <rect x={bx} y={py} width={pw} height="40" fill="#000" opacity="0.12" />
          <line x1={bx} x2={bx + pw} y1={py + 40} y2={py + 40} stroke="#000" strokeOpacity="0.28" strokeDasharray="3 5" />
        </g>
      );
    }
    return (
      <g>
        <path d={caminhoArredondado(gx - pw + 16, py + 34, pw * 2, ph, 6, 6)} fill="#000" opacity="0.34" filter="url(#mk-sombra)" />
        <path d={caminhoArredondado(gx - pw + 4, py + 8, pw * 2, ph, 6, 6)} fill="#000" opacity="0.36" filter="url(#mk-sombra-leve)" />
        <path d={caminhoArredondado(gx - pw - 10, py - 8, pw * 2 + 20, ph + 16, 8, 8)} fill={corCapa} />
                <Espessura x={gx} y={py} w={pw} h={ph} camadas={4} rl={2} rr={4} />
        <Pagina x={gx - pw} y={py} w={pw} h={ph} src={null} rl={4} rr={2} id="mk-p-esq" lado="esq" />
        <Pagina x={gx} y={py} w={pw} h={ph} src={miolosrc} rl={2} rr={4} id="mk-p-dir" lado="dir" />
        <rect x={gx - 46} y={py} width="92" height={ph} fill="url(#mk-gutter)" />
        <g transform={`translate(${gx} ${py})`}>
          <Binding tipo={tipo} len={ph} metal={metal} aberto n={aneis} furo={furo} />
        </g>
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
