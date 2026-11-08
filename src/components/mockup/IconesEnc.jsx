// Ícones esquemáticos (SVG) usados nos cartões de encadernação e de furação.
const ST = { fill: "none", stroke: "currentColor", strokeWidth: 2.2, strokeLinecap: "round", strokeLinejoin: "round" };

export function IconeEnc({ id }) {
  const capa = <rect x="22" y="6" width="34" height="38" rx="3" fill="currentColor" opacity="0.12" />;
  let corpo = null;
  const ys = [11, 19, 27, 35];
  if (id === "wireo")
    corpo = ys.map((y) => <rect key={y} x="14" y={y - 3} width="14" height="6" rx="1.5" {...ST} />);
  else if (id === "espiral")
    corpo = ys.map((y) => <path key={y} d={`M13 ${y + 3} C18 ${y - 5} 24 ${y - 5} 29 ${y}`} {...ST} />);
  else if (id === "discos")
    corpo = ys.map((y) => (
      <g key={y}>
        <path d={`M22 ${y - 2} H27 A4 4 0 1 1 27 ${y + 2} H22`} {...ST} strokeWidth="1.4" opacity="0.5" />
        <circle cx="25" cy={y} r="3.2" {...ST} />
      </g>
    ));
  else if (id === "argolas")
    corpo = [13, 25, 37].map((y) => <path key={y} d={`M24 ${y - 5} C10 ${y - 5} 10 ${y + 5} 24 ${y + 5}`} {...ST} />);
  else if (id === "brochura")
    corpo = <rect x="18" y="6" width="6" height="38" rx="2" fill="currentColor" opacity="0.45" />;
  else if (id === "costura")
    corpo = (
      <g>
        <rect x="18" y="6" width="6" height="38" rx="2" fill="currentColor" opacity="0.3" />
        {[12, 20, 28, 36].map((y) => <path key={y} d={`M19 ${y} H23`} {...ST} strokeWidth="1.6" />)}
      </g>
    );
  else if (id === "grampo")
    corpo = [14, 36].map((y) => <path key={y} d={`M18 ${y} H30 M19 ${y - 3} V${y + 1} M29 ${y - 3} V${y + 1}`} {...ST} strokeWidth="1.8" />);
  else if (id === "bloco")
    corpo = (
      <g>
        <rect x="22" y="6" width="34" height="7" fill="currentColor" opacity="0.5" />
        <path d="M26 20 H52 M26 27 H52 M26 34 H52" {...ST} strokeWidth="1.2" opacity="0.5" />
      </g>
    );
  return (
    <svg viewBox="0 0 64 50" width="54" height="42" aria-hidden="true">
      {capa}
      {corpo}
    </svg>
  );
}

export function IconeFuro({ id }) {
  let f;
  if (id === "quadrado") f = <rect x="14" y="14" width="14" height="14" rx="2" />;
  else if (id === "oblongo") f = <rect x="17" y="9" width="10" height="24" rx="5" />;
  else if (id === "cogumelo") f = <path d="M4 17 H17 A8.5 8.5 0 1 1 17 25 H4 Z" />;
  else if (id === "redondo") f = <circle cx="22" cy="21" r="8" />;
  else f = <text x="22" y="26" textAnchor="middle" fontSize="14" fontWeight="700" fill="currentColor" stroke="none">A</text>;
  return (
    <svg viewBox="0 0 44 42" width="40" height="38" aria-hidden="true" fill="currentColor" opacity="0.85">
      {f}
    </svg>
  );
}
