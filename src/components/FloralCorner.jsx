// src/components/FloralCorner.jsx
//
// Ilustração floral vetorial (estilo aquarela) para decorar cantos de página.
// Não depende de nenhuma imagem externa — é 100% SVG, então funciona em
// tela, impressão e exportação para PDF sem perda de qualidade.
//
// Uso:
//   <FloralCorner position="top-left" />
//   <FloralCorner position="bottom-right" size={150} />
//
// Para trocar as cores (ex: rosa, verde, terracota) passe a prop `palette`.

const DEFAULT_PALETTE = {
  petalDark: "#5b8fa8",
  petalMid: "#8fb9cf",
  petalLight: "#c9e2ec",
  petalHighlight: "#eef6f9",
  leafDark: "#5c7a5a",
  leafMid: "#87a884",
  leafLight: "#c3d8bd",
};

function Blossom({ cx, cy, scale = 1, palette, rotate = 0 }) {
  return (
    <g transform={`translate(${cx} ${cy}) rotate(${rotate}) scale(${scale})`}>
      {/* pétalas externas — sobrepostas para efeito aquarela */}
      <path
        d="M0,-22 C10,-20 16,-10 14,0 C16,10 10,20 0,22 C-10,20 -16,10 -14,0 C-16,-10 -10,-20 0,-22 Z"
        fill={palette.petalMid}
        opacity="0.85"
      />
      <path
        d="M0,-22 C10,-20 16,-10 14,0 C16,10 10,20 0,22 C-10,20 -16,10 -14,0 C-16,-10 -10,-20 0,-22 Z"
        fill={palette.petalDark}
        opacity="0.35"
        transform="rotate(45)"
      />
      <path
        d="M0,-22 C10,-20 16,-10 14,0 C16,10 10,20 0,22 C-10,20 -16,10 -14,0 C-16,-10 -10,-20 0,-22 Z"
        fill={palette.petalDark}
        opacity="0.3"
        transform="rotate(90)"
      />
      {/* miolo */}
      <circle r="6" fill={palette.petalHighlight} opacity="0.9" />
      <circle r="3" fill={palette.leafDark} opacity="0.55" />
    </g>
  );
}

function Bud({ cx, cy, scale = 1, palette, rotate = 0 }) {
  return (
    <g transform={`translate(${cx} ${cy}) rotate(${rotate}) scale(${scale})`}>
      <path
        d="M0,-12 C7,-10 9,-3 6,4 C4,9 -4,9 -6,4 C-9,-3 -7,-10 0,-12 Z"
        fill={palette.petalLight}
        opacity="0.9"
      />
      <path
        d="M0,-12 C7,-10 9,-3 6,4 C4,9 -4,9 -6,4 C-9,-3 -7,-10 0,-12 Z"
        fill={palette.petalMid}
        opacity="0.4"
      />
    </g>
  );
}

function Leaf({ cx, cy, scale = 1, rotate = 0, palette }) {
  return (
    <g transform={`translate(${cx} ${cy}) rotate(${rotate}) scale(${scale})`}>
      <path
        d="M0,0 C14,-4 26,-2 34,8 C24,10 12,10 0,0 Z"
        fill={palette.leafMid}
        opacity="0.85"
      />
      <path
        d="M0,0 C10,-1 22,1 34,8"
        fill="none"
        stroke={palette.leafDark}
        strokeWidth="0.8"
        opacity="0.5"
      />
    </g>
  );
}

export default function FloralCorner({
  position = "top-left",
  size = 190,
  palette = DEFAULT_PALETTE,
  className = "",
  style = {},
}) {
  // Cada canto é montado "nascendo" a partir do vértice da página.
  // Para os outros 3 cantos, espelhamos/giramos o mesmo grupo de arte.
  const rotation =
    position === "top-left"
      ? 0
      : position === "top-right"
      ? 90
      : position === "bottom-right"
      ? 180
      : 270; // bottom-left

  const placement = {
    "top-left": { top: 0, left: 0 },
    "top-right": { top: 0, right: 0 },
    "bottom-right": { bottom: 0, right: 0 },
    "bottom-left": { bottom: 0, left: 0 },
  }[position];

  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      className={`pointer-events-none select-none absolute z-0 ${className}`}
      style={{ ...placement, ...style }}
      aria-hidden="true"
    >
      <g transform={`rotate(${rotation} 100 100)`} filter="url(#floral-soft)">
        {/* folhagem de base */}
        <Leaf cx={6} cy={70} rotate={-20} scale={1.15} palette={palette} />
        <Leaf cx={0} cy={30} rotate={10} scale={0.95} palette={palette} />
        <Leaf cx={30} cy={4} rotate={70} scale={1.05} palette={palette} />
        <Leaf cx={55} cy={0} rotate={95} scale={0.85} palette={palette} />

        {/* flores principais, maiores perto do canto */}
        <Blossom cx={18} cy={22} scale={1.5} rotate={12} palette={palette} />
        <Blossom cx={50} cy={12} scale={1.05} rotate={-18} palette={palette} />
        <Blossom cx={8} cy={55} scale={0.9} rotate={30} palette={palette} />

        {/* botões menores, espalhados para fora */}
        <Bud cx={72} cy={30} scale={1} rotate={-10} palette={palette} />
        <Bud cx={38} cy={48} scale={0.8} rotate={40} palette={palette} />
        <Bud cx={80} cy={8} scale={0.7} rotate={-40} palette={palette} />
      </g>

      <defs>
        <filter id="floral-soft" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="0.35" />
        </filter>
      </defs>
    </svg>
  );
}
