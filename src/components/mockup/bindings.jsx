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
  { id: "discos", nome: "Agenda infinita", desc: "Discos em furos de cogumelo, reposicione as folhas" },
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

export const TIPOS_ANELADOS = ["wireo", "espiral", "argolas", "discos"];

export const FUROS = [
  { id: "auto", nome: "Automático" },
  { id: "quadrado", nome: "Quadrado" },
  { id: "redondo", nome: "Redondo" },
  { id: "oblongo", nome: "Oblongo" },
  { id: "cogumelo", nome: "Cogumelo" },
];

function clarearHex(hex, f) {
  const n = parseInt(hex.slice(1), 16);
  const ch = (v) => Math.round(v + (255 - v) * f).toString(16).padStart(2, "0");
  return `#${ch((n >> 16) & 255)}${ch((n >> 8) & 255)}${ch(n & 255)}`;
}

// Metal por id ou cor personalizada (#rrggbb).
export function metalDe(metal) {
  if (/^#[0-9a-f]{6}$/i.test(metal || "")) return { nome: "Personalizada", base: metal, luz: clarearHex(metal, 0.6) };
  return METAIS[metal] || METAIS.prata;
}

export function formaFuro(forma, tipo) {
  if (forma && forma !== "auto") return forma;
  if (tipo === "wireo") return "quadrado";
  if (tipo === "discos") return "cogumelo";
  return "redondo";
}

export function caminhoArredondado(x, y, w, h, rl, rr) {
  return caminhoCantos(x, y, w, h, [rl, rr, rr, rl]);
}

// raios: [topo-esq, topo-dir, base-dir, base-esq]
export function caminhoCantos(x, y, w, h, [a, b, c, d]) {
  return `M${x + a} ${y} H${x + w - b} Q${x + w} ${y} ${x + w} ${y + b} V${y + h - c} Q${x + w} ${y + h} ${x + w - c} ${y + h} H${x + d} Q${x} ${y + h} ${x} ${y + h - d} V${y + a} Q${x} ${y} ${x + a} ${y} Z`;
}

// Furo vazado (visto de cima). (x,y) = centro; haste do cogumelo aponta para -x (borda).
function Furo({ forma, x, y, esc = 1, espelho = false }) {
  const haste = Math.max(6, Math.abs(x) / esc);
  let d;
  if (forma === "quadrado") d = `M-4.6 -4.6 H4.6 V4.6 H-4.6 Z`;
  else if (forma === "oblongo") d = `M-3.4 -6.4 H3.4 V6.4 H-3.4 Z`;
  else if (forma === "cogumelo") {
    const R = 8.5, hs = 3.4, dx = Math.sqrt(R * R - hs * hs);
    d = `M${-haste} ${-hs} H${-dx} A${R} ${R} 0 1 1 ${-dx} ${hs} H${-haste} Z`;
  } else d = null;
  const t = `translate(${x} ${y}) scale(${espelho ? -esc : esc} ${esc})`;
  const rx = forma === "oblongo" ? 3.4 : forma === "quadrado" ? 1.2 : 0;
  return (
    <g transform={t}>
      {d ? (
        <>
          <path d={d} transform="translate(0 1)" fill="none" stroke="#fff" strokeOpacity="0.28" strokeWidth="1.2" />
          <path d={d} fill="#0f1114" strokeLinejoin="round" stroke="#0f1114" strokeWidth={rx ? 0 : 0} />
          <path d={d} fill="none" stroke="#000" strokeOpacity="0.6" strokeWidth="1" />
        </>
      ) : (
        <>
          <circle cy="1" r="5" fill="none" stroke="#fff" strokeOpacity="0.28" strokeWidth="1.2" />
          <circle r="5" fill="#0f1114" stroke="#000" strokeOpacity="0.6" />
        </>
      )}
    </g>
  );
}

function Tubo({ d, m, w = 3.8, luz = 1.1 }) {
  return (
    <>
      <path d={d} fill="none" stroke="#000" strokeOpacity="0.38" strokeWidth={w + 1.6} strokeLinecap="round" transform="translate(1.6 2.4)" filter="url(#mk-sombra-leve)" />
      <path d={d} fill="none" stroke="#000" strokeOpacity="0.45" strokeWidth={w + 1} strokeLinecap="round" />
      <path d={d} fill="none" stroke={m.base} strokeWidth={w} strokeLinecap="round" />
      <path d={d} fill="none" stroke={m.luz} strokeWidth={luz} strokeLinecap="round" opacity="0.9" transform="translate(0 -0.9)" />
    </>
  );
}

// Binding vertical no referencial local: eixo da encadernação em x=0,
// extensão y=0..len. Fechada: capa para x>0. Aberta: páginas dos dois lados.
export function Binding({ tipo, len, metal, aberto = false, n = null, furo = "auto" }) {
  const m = metalDe(metal);
  const forma = formaFuro(furo, tipo);

  if (tipo === "wireo" || tipo === "espiral" || tipo === "discos") {
    const auto = Math.floor((len - 60) / (tipo === "discos" ? 40 : 26)) + 1;
    const k = Math.max(2, Math.min(n || auto, Math.floor((len - 40) / 11)));
    const passo = (len - 60) / (k - 1);
    const ys = Array.from({ length: k }, (_, i) => 30 + i * passo);

    if (tipo === "discos") {
      const R = Math.min(14, passo * 0.46);
      const hx = R * 0.78;
      return (
        <g>
          {ys.map((y, i) => (
            <g key={i}>
              <Furo forma={forma} x={hx} y={y} esc={R / 11} />
              {aberto && <Furo forma={forma} x={-hx} y={y} esc={R / 11} espelho />}
            </g>
          ))}
          {ys.map((y, i) => (
            <g key={`d${i}`}>
              <circle cx={aberto ? 0 : hx} cy={y + 2.5} r={R} fill="#000" opacity="0.4" filter="url(#mk-sombra-leve)" />
              <circle cx={aberto ? 0 : hx} cy={y} r={R} fill={m.base} stroke="#000" strokeOpacity="0.45" />
              <circle cx={aberto ? 0 : hx} cy={y} r={R * 0.8} fill="none" stroke={m.luz} strokeOpacity="0.55" strokeWidth="1" />
              <circle cx={aberto ? 0 : hx} cy={y} r={R * 0.52} fill={m.base} stroke="#000" strokeOpacity="0.35" />
              <circle cx={aberto ? 0 : hx} cy={y} r={R * 0.3} fill="#000" opacity="0.25" />
              <path d={`M${(aberto ? 0 : hx) - R * 0.75} ${y - R * 0.25} A${R * 0.8} ${R * 0.8} 0 0 1 ${(aberto ? 0 : hx) + R * 0.1} ${y - R * 0.78}`} fill="none" stroke="#fff" strokeOpacity="0.7" strokeWidth="1.6" strokeLinecap="round" />
            </g>
          ))}
        </g>
      );
    }

    const hx = tipo === "wireo" ? 15 : 11;
    return (
      <g>
        {ys.map((y, i) => (
          <g key={`h${i}`}>
            <Furo forma={forma} x={hx} y={y} />
            {aberto && <Furo forma={forma} x={-hx} y={y} espelho />}
          </g>
        ))}
        {ys.map((y, i) =>
          tipo === "wireo" ? (
            <g key={i}>
              <Tubo d={`M-17 ${y} a17 5.6 0 1 0 34 0 a17 5.6 0 1 0 -34 0`} m={m} />
            </g>
          ) : (
            <g key={i}>
              <Tubo
                d={`M-18 ${y + 6} C-7 ${y - 10} 7 ${y - 10} 18 ${y + 1}`}
                m={m}
                w={4.2}
              />
            </g>
          ),
        )}
      </g>
    );
  }

  const altura = len;
  if (tipo === "argolas") {
    const ys = [altura * 0.17, altura * 0.5, altura * 0.83];
    return (
      <g>
        <rect x={-7} y={16} width="14" height={altura - 32} rx="5" fill={m.base} stroke="#000" strokeOpacity="0.35" />
        <rect x={-4} y={18} width="3" height={altura - 36} rx="1.5" fill={m.luz} opacity="0.75" />
        {ys.map((y, i) => (
          <g key={i}>
            <path d={`M-6 ${y - 24} C-44 ${y - 24} -44 ${y + 24} -6 ${y + 24}`} fill="none" stroke="#000" strokeOpacity="0.4" strokeWidth="8" strokeLinecap="round" />
            <path d={`M-6 ${y - 24} C-44 ${y - 24} -44 ${y + 24} -6 ${y + 24}`} fill="none" stroke={m.base} strokeWidth="6.5" strokeLinecap="round" />
            <path d={`M-6 ${y - 24} C-41 ${y - 24} -41 ${y + 24} -6 ${y + 24}`} fill="none" stroke={m.luz} strokeWidth="1.4" strokeLinecap="round" opacity="0.8" />
            {aberto && (
              <path d={`M6 ${y - 24} C44 ${y - 24} 44 ${y + 24} 6 ${y + 24}`} fill="none" stroke={m.base} strokeWidth="6.5" strokeLinecap="round" />
            )}
            <circle cx="0" cy={y} r="6" fill={m.base} stroke="#000" strokeOpacity="0.4" />
            <circle cx="-1.5" cy={y - 1.5} r="2" fill={m.luz} />
          </g>
        ))}
      </g>
    );
  }

  if (tipo === "grampo") {
    const ys = [altura * 0.24, altura * 0.76];
    return (
      <g transform="translate(12 0)">
        {ys.map((y, i) => (
          <g key={i}>
            <rect x={-11} y={y - 1.5} width="22" height="3.2" rx="1.2" fill={m.base} />
            <rect x={-11} y={y - 1.5} width="22" height="1.2" rx="0.6" fill={m.luz} opacity="0.8" />
            <rect x={-11} y={y - 5} width="2.4" height="8" rx="1" fill={m.base} />
            <rect x={8.6} y={y - 5} width="2.4" height="8" rx="1" fill={m.base} />
          </g>
        ))}
      </g>
    );
  }

  // brochura / costura
  if (aberto) {
    return (
      <g>
        <rect x={-34} y={0} width="68" height={altura} fill="url(#mk-gutter)" />
        {tipo === "costura" &&
          Array.from({ length: Math.floor(altura / 30) }).map((_, i) => (
            <line key={i} x1={0} x2={0} y1={12 + i * 30} y2={24 + i * 30} stroke={m.luz} strokeWidth="1.8" strokeLinecap="round" opacity="0.9" />
          ))}
      </g>
    );
  }
  return (
    <g>
      <rect x={0} y={0} width="28" height={altura} fill="url(#mk-spine)" />
      <line x1={28} x2={28} y1={0} y2={altura} stroke="#000" strokeOpacity="0.28" strokeWidth="1.4" />
      <line x1={30} x2={30} y1={0} y2={altura} stroke="#fff" strokeOpacity="0.3" strokeWidth="1" />
      {tipo === "costura" &&
        Array.from({ length: Math.floor(altura / 26) }).map((_, i) => (
          <line key={i} x1={4} x2={24} y1={18 + i * 26} y2={18 + i * 26} stroke={m.luz} strokeWidth="2" strokeLinecap="round" opacity="0.9" />
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
      <filter id="mk-couro" x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="3" seed="9" />
        <feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.34 -0.06" />
      </filter>
      <filter id="mk-madeira-fx" x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.004 0.2" numOctaves="4" seed="3" />
        <feColorMatrix values="0 0 0 0 0.24  0 0 0 0 0.13  0 0 0 0 0.05  0 0 0 0.9 -0.28" />
      </filter>
      <pattern id="mk-linho" width="4" height="4" patternUnits="userSpaceOnUse">
        <path d="M0 0H4M0 2H4" stroke="#000" strokeOpacity="0.1" strokeWidth="0.7" />
        <path d="M0 0V4M2 0V4" stroke="#fff" strokeOpacity="0.1" strokeWidth="0.7" />
      </pattern>
      <radialGradient id="mk-vinheta" cx="50%" cy="46%" r="75%">
        <stop offset="0.55" stopColor="#000" stopOpacity="0" />
        <stop offset="1" stopColor="#000" stopOpacity="0.32" />
      </radialGradient>
      <linearGradient id="mk-janela" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#fff" stopOpacity="0.38" />
        <stop offset="0.5" stopColor="#fff" stopOpacity="0" />
      </linearGradient>
      <linearGradient id="mk-elast" x1="0" x2="1" y1="0" y2="0">
        <stop offset="0" stopColor="#000" stopOpacity="0.35" />
        <stop offset="0.25" stopColor="#fff" stopOpacity="0.12" />
        <stop offset="0.75" stopColor="#000" stopOpacity="0.05" />
        <stop offset="1" stopColor="#000" stopOpacity="0.4" />
      </linearGradient>
      <filter id="mk-grao" x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="4" />
        <feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.09 0" />
      </filter>
    </defs>
  );
}
