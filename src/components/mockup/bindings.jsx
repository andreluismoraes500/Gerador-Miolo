// src/components/mockup/bindings.jsx
//
// Peças em SVG puro das encadernações usadas no Mockup. Tudo vetorial:
// sem imagens externas, então o download em PNG/SVG sai nítido.

export const TIPOS_ENCADERNACAO = [
  { id: "wireo", nome: "Wire-o", desc: "Argola dupla de metal, abre 360°" },
  { id: "espiral", nome: "Espiral", desc: "Espiral contínua, clássica de caderno" },
  { id: "argolas", nome: "Fichário", desc: "Argolas com placa, páginas removíveis" },
  { id: "brochura", nome: "Brochura", desc: "Lombada colada, acabamento de livro" },
  { id: "costura", nome: "Costura", desc: "Lombada costurada, premium" },
  { id: "grampo", nome: "Grampo canoa", desc: "Dois grampos na dobra, ideal p/ poucas folhas" },
  { id: "bloco", nome: "Bloco colado", desc: "Colado no topo, folhas destacáveis" },
];

export const METAIS = {
  prata: { nome: "Prata", base: "#8f98a3", luz: "#f4f6f8" },
  dourado: { nome: "Dourado", base: "#b8933d", luz: "#f6e3a6" },
  preto: { nome: "Preto", base: "#262a31", luz: "#6b7280" },
  rose: { nome: "Rosé", base: "#c98b88", luz: "#fbe0dc" },
  branco: { nome: "Branco", base: "#d3d8df", luz: "#ffffff" },
};

export const TIPOS_ANELADOS = ["wireo", "espiral", "argolas"];

export function caminhoArredondado(x, y, w, h, rl, rr) {
  return `M${x + rl} ${y} H${x + w - rr} Q${x + w} ${y} ${x + w} ${y + rr} V${y + h - rr} Q${x + w} ${y + h} ${x + w - rr} ${y + h} H${x + rl} Q${x} ${y + h} ${x} ${y + h - rl} V${y + rl} Q${x} ${y} ${x + rl} ${y} Z`;
}

// Binding vertical (lado esquerdo da capa ou centro do miolo aberto).
//   cx: posição x do eixo da encadernação · y0..y1: extensão vertical
export function Binding({ tipo, cx, y0, y1, metal, aberto = false }) {
  const m = METAIS[metal] || METAIS.prata;
  const altura = y1 - y0;

  if (tipo === "wireo" || tipo === "espiral") {
    const passo = tipo === "wireo" ? 26 : 24;
    const n = Math.floor((altura - 24) / passo);
    const inicio = y0 + (altura - (n - 1) * passo) / 2;
    return (
      <g>
        {Array.from({ length: n }).map((_, i) => {
          const y = inicio + i * passo;
          return (
            <g key={i}>
              <ellipse cx={cx + (aberto ? -9 : 9)} cy={y} rx="4.5" ry="3.6" fill="#000" opacity="0.38" />
              {aberto && <ellipse cx={cx + 9} cy={y} rx="4.5" ry="3.6" fill="#000" opacity="0.38" />}
              {tipo === "wireo" ? (
                <>
                  <ellipse cx={cx} cy={y} rx="17" ry="5.6" fill="none" stroke={m.base} strokeWidth="3.6" />
                  <ellipse cx={cx} cy={y - 1} rx="16" ry="4.6" fill="none" stroke={m.luz} strokeWidth="1" opacity="0.85" />
                </>
              ) : (
                <>
                  <path d={`M${cx - 18} ${y + 6} C${cx - 7} ${y - 10} ${cx + 7} ${y - 10} ${cx + 18} ${y + 1}`} fill="none" stroke={m.base} strokeWidth="4.2" strokeLinecap="round" />
                  <path d={`M${cx - 17} ${y + 4} C${cx - 7} ${y - 9} ${cx + 7} ${y - 9} ${cx + 17} ${y}`} fill="none" stroke={m.luz} strokeWidth="1.1" strokeLinecap="round" opacity="0.85" />
                </>
              )}
            </g>
          );
        })}
      </g>
    );
  }

  if (tipo === "argolas") {
    const ys = [y0 + altura * 0.17, y0 + altura * 0.5, y0 + altura * 0.83];
    return (
      <g>
        <rect x={cx - 7} y={y0 + 16} width="14" height={altura - 32} rx="5" fill={m.base} />
        <rect x={cx - 4} y={y0 + 18} width="3" height={altura - 36} rx="1.5" fill={m.luz} opacity="0.75" />
        {ys.map((y, i) => (
          <g key={i}>
            <path d={`M${cx - 6} ${y - 24} C${cx - 44} ${y - 24} ${cx - 44} ${y + 24} ${cx - 6} ${y + 24}`} fill="none" stroke={m.base} strokeWidth="6.5" strokeLinecap="round" />
            <path d={`M${cx - 6} ${y - 24} C${cx - 41} ${y - 24} ${cx - 41} ${y + 24} ${cx - 6} ${y + 24}`} fill="none" stroke={m.luz} strokeWidth="1.4" strokeLinecap="round" opacity="0.8" />
            {aberto && (
              <path d={`M${cx + 6} ${y - 24} C${cx + 44} ${y - 24} ${cx + 44} ${y + 24} ${cx + 6} ${y + 24}`} fill="none" stroke={m.base} strokeWidth="6.5" strokeLinecap="round" />
            )}
            <circle cx={cx} cy={y} r="6" fill={m.base} />
            <circle cx={cx - 1.5} cy={y - 1.5} r="2" fill={m.luz} />
          </g>
        ))}
      </g>
    );
  }

  if (tipo === "grampo") {
    const ys = [y0 + altura * 0.24, y0 + altura * 0.76];
    return (
      <g>
        {ys.map((y, i) => (
          <g key={i}>
            <rect x={cx - 11} y={y - 1.5} width="22" height="3.2" rx="1.2" fill={m.base} />
            <rect x={cx - 11} y={y - 1.5} width="22" height="1.2" rx="0.6" fill={m.luz} opacity="0.8" />
            <rect x={cx - 11} y={y - 5} width="2.4" height="8" rx="1" fill={m.base} />
            <rect x={cx + 8.6} y={y - 5} width="2.4" height="8" rx="1" fill={m.base} />
          </g>
        ))}
      </g>
    );
  }

  // brochura / costura
  if (aberto) {
    return (
      <g>
        <rect x={cx - 34} y={y0} width="68" height={altura} fill="url(#mk-gutter)" />
        {tipo === "costura" &&
          Array.from({ length: Math.floor(altura / 30) }).map((_, i) => (
            <line key={i} x1={cx} x2={cx} y1={y0 + 12 + i * 30} y2={y0 + 24 + i * 30} stroke={m.luz} strokeWidth="1.8" strokeLinecap="round" opacity="0.9" />
          ))}
      </g>
    );
  }
  return (
    <g>
      <rect x={cx} y={y0} width="28" height={altura} fill="url(#mk-spine)" />
      <line x1={cx + 28} x2={cx + 28} y1={y0} y2={y1} stroke="#000" strokeOpacity="0.28" strokeWidth="1.4" />
      <line x1={cx + 30} x2={cx + 30} y1={y0} y2={y1} stroke="#fff" strokeOpacity="0.3" strokeWidth="1" />
      {tipo === "costura" &&
        Array.from({ length: Math.floor(altura / 26) }).map((_, i) => (
          <line key={i} x1={cx + 4} x2={cx + 24} y1={y0 + 18 + i * 26} y2={y0 + 18 + i * 26} stroke={m.luz} strokeWidth="2" strokeLinecap="round" opacity="0.9" />
        ))}
    </g>
  );
}

// Definições compartilhadas (gradientes/filtros) usadas pelas peças acima.
export function MockupDefs() {
  return (
    <defs>
      <linearGradient id="mk-spine" x1="0" x2="1" y1="0" y2="0">
        <stop offset="0" stopColor="#000" stopOpacity="0.32" />
        <stop offset="0.55" stopColor="#000" stopOpacity="0.1" />
        <stop offset="1" stopColor="#fff" stopOpacity="0.12" />
      </linearGradient>
      <linearGradient id="mk-gutter" x1="0" x2="1" y1="0" y2="0">
        <stop offset="0" stopColor="#000" stopOpacity="0" />
        <stop offset="0.5" stopColor="#000" stopOpacity="0.26" />
        <stop offset="1" stopColor="#000" stopOpacity="0" />
      </linearGradient>
      <linearGradient id="mk-brilho" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0" stopColor="#fff" stopOpacity="0.2" />
        <stop offset="0.45" stopColor="#fff" stopOpacity="0" />
        <stop offset="1" stopColor="#000" stopOpacity="0.16" />
      </linearGradient>
      <linearGradient id="mk-papel" x1="0" x2="1" y1="0" y2="0">
        <stop offset="0" stopColor="#f3efe6" />
        <stop offset="0.1" stopColor="#fffdf8" />
        <stop offset="1" stopColor="#fffdf8" />
      </linearGradient>
      <linearGradient id="mk-papel-esq" x1="1" x2="0" y1="0" y2="0">
        <stop offset="0" stopColor="#f0ebe0" />
        <stop offset="0.12" stopColor="#fffdf8" />
        <stop offset="1" stopColor="#fffdf8" />
      </linearGradient>
      <filter id="mk-sombra" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="14" />
      </filter>
      <filter id="mk-sombra-leve" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="4" />
      </filter>
      <filter id="mk-grao" x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="4" />
        <feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.09 0" />
      </filter>
    </defs>
  );
}
