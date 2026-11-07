// src/components/mockup/BlocoStage.jsx
//
// Mockup de BLOCO (bloco de notas / talonário em bloco): pilha de folhas
// coladas num dos lados, base de papelão, fita de cola e, opcionalmente,
// uma folha destacada ao lado. Mesmo contrato do MockupStage: SVG puro.

import { forwardRef } from "react";
import { MockupDefs, caminhoArredondado } from "./bindings";
import { Cena, STAGE_W, STAGE_H } from "./MockupStage";

export const FORMATOS_BLOCO = {
  retrato: { nome: "Retrato", w: 520, h: 720 },
  paisagem: { nome: "Paisagem", w: 760, h: 520 },
  quadrado: { nome: "Quadrado", w: 600, h: 600 },
  a6: { nome: "Pequeno", w: 400, h: 560 },
};

export const PAPELAO = {
  kraft: "#b99366",
  branco: "#f1efe9",
  preto: "#2a2d33",
  azul: "#2f4a72",
};

const BlocoStage = forwardRef(function BlocoStage(
  {
    cena,
    formato = "retrato",
    lado = "topo", // topo | esquerda
    espessura = 3, // 1..6
    folhaSrc,
    papelao = "kraft",
    corCola = "#c0392b",
    destacando = false,
    brilho = true,
  },
  ref,
) {
  const f = FORMATOS_BLOCO[formato] || FORMATOS_BLOCO.retrato;
  const { w, h } = f;
  const t = 6 + espessura * 5;
  const deslocX = destacando ? -(w * 0.2) : 0;
  const x0 = (STAGE_W - w) / 2 + deslocX - t / 2;
  const y0 = (STAGE_H - h) / 2 - t / 2;
  const faixa = 38;
  const corPapelao = PAPELAO[papelao] || papelao;

  const camadas = Array.from({ length: t }).map((_, i) => t - i); // t..1
  const caminho = (dx, dy, rr = 3) => caminhoArredondado(x0 + dx, y0 + dy, w, h, 2, rr);

  const clipFrente = "mk-bl-frente";
  const clipSolta = "mk-bl-solta";

  const imagem = (id, ox = 0, oy = 0) =>
    folhaSrc ? (
      <image
        href={folhaSrc}
        x={x0 + ox}
        y={y0 + oy}
        width={w}
        height={h}
        preserveAspectRatio="xMidYMid slice"
        clipPath={`url(#${id})`}
      />
    ) : (
      <g clipPath={`url(#${id})`}>
        {Array.from({ length: Math.floor((h - 120) / 32) }).map((_, i) => (
          <line
            key={i}
            x1={x0 + ox + 40}
            x2={x0 + ox + w - 40}
            y1={y0 + oy + 100 + i * 32}
            y2={y0 + oy + 100 + i * 32}
            stroke="#b9c4d6"
            strokeWidth="1.3"
          />
        ))}
      </g>
    );

  // fita de cola
  const fita =
    lado === "topo"
      ? { x: x0, y: y0, width: w, height: faixa }
      : { x: x0, y: y0, width: faixa, height: h };

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

      {/* sombra do bloco */}
      <path d={caminho(t + 14, t + 26, 8)} fill="#000" opacity="0.38" filter="url(#mk-sombra)" />

      {/* base de papelão + pilha de folhas */}
      <path d={caminho(t + 4, t + 4, 5)} fill={corPapelao} />
      <path d={caminho(t + 4, t + 4, 5)} fill="#000" opacity="0.12" />
      {camadas.slice(1).map((k, i) => (
        <path
          key={i}
          d={caminho(k * 0.95, k * 0.95, 3)}
          fill={i % 2 ? "#ece6d8" : "#fffdf8"}
          stroke="#b8ad92"
          strokeWidth="0.7"
        />
      ))}

      {/* folha da frente */}
      <clipPath id={clipFrente}>
        <path d={caminho(0, 0, 3)} />
      </clipPath>
      <path d={caminho(0, 0, 3)} fill="#fffdf8" />
      {imagem(clipFrente)}
      {brilho && <path d={caminho(0, 0, 3)} fill="url(#mk-brilho)" opacity="0.7" />}

      {/* fita de cola + picote */}
      <g clipPath={`url(#${clipFrente})`}>
        <rect {...fita} fill={corCola} opacity="0.92" />
        <rect {...fita} fill="url(#mk-brilho)" />
        {lado === "topo" ? (
          <line x1={x0} x2={x0 + w} y1={y0 + faixa + 6} y2={y0 + faixa + 6} stroke="#000" strokeOpacity="0.28" strokeDasharray="2 5" />
        ) : (
          <line y1={y0} y2={y0 + h} x1={x0 + faixa + 6} x2={x0 + faixa + 6} stroke="#000" strokeOpacity="0.28" strokeDasharray="2 5" />
        )}
      </g>

      {/* folha destacada ao lado */}
      {destacando && (
        <g transform={`rotate(7 ${x0 + w + 130} ${y0 + h * 0.6})`}>
          <path d={caminhoArredondado(x0 + w * 0.82 + 12, y0 + 62 + 10, w, h, 2, 3)} fill="#000" opacity="0.3" filter="url(#mk-sombra-leve)" />
          <clipPath id={clipSolta}>
            <path d={caminhoArredondado(x0 + w * 0.82, y0 + 62, w, h, 2, 3)} />
          </clipPath>
          <path d={caminhoArredondado(x0 + w * 0.82, y0 + 62, w, h, 2, 3)} fill="#fffdf8" />
          {imagem(clipSolta, w * 0.82, 62)}
          {/* borda picotada de onde saiu */}
          {lado === "topo" ? (
            <path
              d={`M${x0 + w * 0.82} ${y0 + 62} ${Array.from({ length: Math.floor(w / 14) }).map((_, i) => `l7 -3 l7 3`).join(" ")}`}
              fill="none"
              stroke="#d3cab4"
              strokeWidth="1"
            />
          ) : null}
        </g>
      )}
    </svg>
  );
});

export default BlocoStage;
