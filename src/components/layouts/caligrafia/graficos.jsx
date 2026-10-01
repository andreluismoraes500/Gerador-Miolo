// src/components/layouts/caligrafia/graficos.jsx
//
// Biblioteca de gráficos 100% originais (SVG gerado por código) usada pelas
// páginas de caligrafia: formas para contar, desenhos para colorir, caminhos
// pontilhados (retas, ondas, espirais...), labirintos e ligue-os-pontos.
// Nada aqui depende de imagens externas — tudo imprime nítido em qualquer
// resolução.

export const TINTA = "#1f2937";

// ─────────────────────────────────────────────────────────────────────────
// Utilitários
// ─────────────────────────────────────────────────────────────────────────

export function rng(seed) {
  let a = seed | 0;
  return function () {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function embaralhar(lista, seed) {
  const r = rng(seed);
  const a = [...lista];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const f = (n) => Number(n.toFixed(2));
const poli = (pts) => pts.map(([x, y], i) => `${i ? "L" : "M"}${f(x)} ${f(y)}`).join(" ");

function estrelaPts(cx, cy, R, r, pontas = 5) {
  const pts = [];
  for (let i = 0; i < pontas * 2; i++) {
    const ang = (Math.PI * i) / pontas - Math.PI / 2;
    const raio = i % 2 === 0 ? R : r;
    pts.push([cx + raio * Math.cos(ang), cy + raio * Math.sin(ang)]);
  }
  return pts;
}

// ─────────────────────────────────────────────────────────────────────────
// FORMAS (viewBox 24x24) — para "pinte N elementos" e "conte os objetos"
// ─────────────────────────────────────────────────────────────────────────

export const TIPOS_FORMA = [
  "estrela",
  "coracao",
  "bola",
  "flor",
  "nuvem",
  "lua",
  "gota",
  "triangulo",
  "quadrado",
];

const COR_FORMA = {
  estrela: "#fde047",
  coracao: "#f472b6",
  bola: "#60a5fa",
  circulo: "#38bdf8",
  retangulo: "#a78bfa",
  flor: "#c084fc",
  nuvem: "#93c5fd",
  lua: "#fcd34d",
  gota: "#38bdf8",
  triangulo: "#fb923c",
  quadrado: "#4ade80",
};

function corpoForma(tipo) {
  switch (tipo) {
    case "estrela":
      return <path d={poli(estrelaPts(12, 12.6, 10.4, 4.3)) + "Z"} />;
    case "coracao":
      return (
        <path d="M12 21C4.5 15 2.3 11.3 2.3 8c0-3 2.3-5 4.9-5 1.9 0 3.6 1 4.8 2.9C13.2 4 14.9 3 16.8 3c2.6 0 4.9 2 4.9 5 0 3.3-2.2 7-9.7 13Z" />
      );
    case "circulo":
      return <circle cx="12" cy="12" r="9.5" />;
    case "bola":
      return (
        <>
          <circle cx="12" cy="12" r="9.5" />
          <path d="M3.5 9.5c5 1 12 1 17 0M6 19c3-4 9-4 12 0" />
        </>
      );
    case "flor":
      return (
        <>
          {[0, 1, 2, 3, 4].map((i) => {
            const a = (i * 72 - 90) * (Math.PI / 180);
            return (
              <circle
                key={i}
                cx={f(12 + 6.3 * Math.cos(a))}
                cy={f(12 + 6.3 * Math.sin(a))}
                r="4.4"
              />
            );
          })}
          <circle cx="12" cy="12" r="3.4" />
        </>
      );
    case "nuvem":
      return (
        <path d="M6.5 19C2.8 19 1.8 13.5 5.5 12.5 5.4 8.3 10 6 13 8.7c1.3-3.3 7.3-2.8 7.6 1.9 3.3.7 3.3 8.4-1.3 8.4Z" />
      );
    case "lua":
      return (
        <path d="M16.5 2.5C9.5 2.8 4.5 8 4.5 14c0 4.8 3.8 8 8.5 8 2.3 0 4.4-.8 6-2.2-6.5-.6-9.8-7.3-6.5-12.6.9-1.4 2.2-2.7 3.5-4.7Z" />
      );
    case "gota":
      return (
        <path d="M12 2.5S5 10.5 5 15c0 4 3.1 6.5 7 6.5s7-2.5 7-6.5c0-4.5-7-12.5-7-12.5Z" />
      );
    case "triangulo":
      return <path d="M12 3 22 20H2Z" />;
    case "retangulo":
      return <rect x="1.5" y="6" width="21" height="12" rx="1.5" />;
    case "quadrado":
    default:
      return <rect x="3.5" y="3.5" width="17" height="17" rx="2.5" />;
  }
}

// `cor` = "contorno" (para pintar) | "cheia" (colorida, para contar)
export function Forma({ tipo, size = "9mm", modo = "contorno", style, emLinha = false }) {
  const cheia = modo === "cheia";
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      style={{ display: emLinha ? "inline-block" : "block", flexShrink: 0, ...style }}
    >
      <g
        fill={cheia ? COR_FORMA[tipo] : "#fff"}
        stroke={cheia ? "#00000033" : TINTA}
        strokeWidth={cheia ? 0.8 : 1.1}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {corpoForma(tipo)}
      </g>
    </svg>
  );
}

// Mesma forma, mas para ser usada DENTRO de um <svg> maior (x, y, s em unidades do viewBox).
export function FormaSvg({ tipo, x, y, s = 10, modo = "cheia" }) {
  const cheia = modo === "cheia";
  return (
    <svg x={x} y={y} width={s} height={s} viewBox="0 0 24 24" overflow="visible">
      <g
        fill={cheia ? COR_FORMA[tipo] : "#fff"}
        stroke={cheia ? "#00000033" : TINTA}
        strokeWidth={cheia ? 0.8 : 1.1}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {corpoForma(tipo)}
      </g>
    </svg>
  );
}

// Contorno tracejado de uma forma (para a criança cobrir).
export function FormaTraco({ tipo, x, y, s = 20 }) {
  return (
    <svg x={x} y={y} width={s} height={s} viewBox="0 0 24 24" overflow="visible">
      <g
        fill="none"
        stroke={TINTA}
        strokeWidth="0.7"
        strokeDasharray="1.4 1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {corpoForma(tipo)}
      </g>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// DESENHOS PARA COLORIR (viewBox 60x50)
// ─────────────────────────────────────────────────────────────────────────

function Cara({ x, y, s = 1 }) {
  return (
    <g strokeWidth="0.8">
      <circle cx={x - 3 * s} cy={y - 1 * s} r={0.8 * s} fill={TINTA} stroke="none" />
      <circle cx={x + 3 * s} cy={y - 1 * s} r={0.8 * s} fill={TINTA} stroke="none" />
      <path d={`M${x - 2 * s} ${y + 2 * s}q${2 * s} ${2 * s} ${4 * s} 0`} fill="none" />
    </g>
  );
}

const DESENHOS = [
  {
    nome: "sol",
    el: (
      <>
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (i * 30 * Math.PI) / 180;
          return (
            <line
              key={i}
              x1={f(30 + 15 * Math.cos(a))}
              y1={f(25 + 15 * Math.sin(a))}
              x2={f(30 + 21 * Math.cos(a))}
              y2={f(25 + 21 * Math.sin(a))}
            />
          );
        })}
        <circle cx="30" cy="25" r="11" />
        <Cara x={30} y={26} s={1.4} />
      </>
    ),
  },
  {
    nome: "casa",
    el: (
      <>
        <rect x="38" y="9" width="6" height="12" />
        <rect x="14" y="24" width="32" height="22" />
        <polygon points="9,25 30,7 51,25" />
        <rect x="26" y="33" width="8" height="13" rx="1.5" />
        <rect x="17.5" y="28" width="6" height="6" />
        <rect x="36.5" y="28" width="6" height="6" />
      </>
    ),
  },
  {
    nome: "peixe",
    el: (
      <>
        <polygon points="41,25 54,14 54,36" />
        <ellipse cx="26" cy="25" rx="16" ry="11" />
        <path d="M22 14q6-8 13 0" />
        <circle cx="18" cy="22" r="1.6" fill={TINTA} />
        <path d="M12.5 28q3 3 6 0" />
        <circle cx="8" cy="12" r="2.2" />
        <circle cx="13" cy="7" r="1.4" />
      </>
    ),
  },
  {
    nome: "balao",
    el: (
      <>
        <ellipse cx="30" cy="20" rx="13" ry="16" />
        <polygon points="27,36 33,36 30,40" />
        <path d="M30 40q-4 3 0 5t0 4" />
        <path d="M22 13q2-5 7-6" />
        <Cara x={30} y={22} s={1.3} />
      </>
    ),
  },
  {
    nome: "arvore",
    el: (
      <>
        <rect x="26" y="30" width="8" height="18" />
        <path d="M20 32A8 8 0 0 1 16 18 10 10 0 0 1 30 7a10 10 0 0 1 14 11A8 8 0 0 1 40 32Z" />
        <Cara x={30} y={20} s={1.3} />
      </>
    ),
  },
  {
    nome: "barco",
    el: (
      <>
        <line x1="30" y1="9" x2="30" y2="32" />
        <path d="M32 10 49 29H32Z" />
        <path d="M28 15 14 29H28Z" />
        <path d="M9 32h42l-7 11H16Z" />
        <path d="M5 47q4-3 8 0t8 0 8 0 8 0 8 0 8 0" fill="none" />
      </>
    ),
  },
  {
    nome: "flor",
    el: (
      <>
        <path d="M30 26V48" />
        <path d="M30 40q-10-2-12-10 10 0 12 10Z" />
        <path d="M30 37q9-1 11-8-9 0-11 8Z" />
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const a = (i * 60 - 90) * (Math.PI / 180);
          return (
            <circle
              key={i}
              cx={f(30 + 9.5 * Math.cos(a))}
              cy={f(16 + 9.5 * Math.sin(a))}
              r="5.5"
            />
          );
        })}
        <circle cx="30" cy="16" r="6" />
        <Cara x={30} y={16} s={1.1} />
      </>
    ),
  },
  {
    nome: "foguete",
    el: (
      <>
        <path d="M24 30 15 41l9-2Z" />
        <path d="M36 30 45 41l-9-2Z" />
        <path d="M27 38 30 48 33 38Z" />
        <path d="M30 3C41 11 41 28 37 38H23C19 28 19 11 30 3Z" />
        <circle cx="30" cy="20" r="5" />
      </>
    ),
  },
  {
    nome: "arco-iris",
    el: (
      <>
        <path d="M7 40A23 23 0 0 1 53 40" fill="none" />
        <path d="M13 40A17 17 0 0 1 47 40" fill="none" />
        <path d="M19 40A11 11 0 0 1 41 40" fill="none" />
        <path d="M3 45a5 5 0 0 1 2-9 7 7 0 0 1 13 1 5 5 0 0 1 2 8Z" />
        <path d="M40 45a5 5 0 0 1 2-9 7 7 0 0 1 13 1 5 5 0 0 1 2 8Z" />
      </>
    ),
  },
  {
    nome: "sorvete",
    el: (
      <>
        <path d="M21 24h18L30 46Z" />
        <path d="M24.5 30 34 30M27 36 33 36" fill="none" />
        <circle cx="30" cy="17" r="9.5" />
        <circle cx="30" cy="6" r="2.2" />
        <Cara x={30} y={18} s={1.2} />
      </>
    ),
  },
];

export const TOTAL_DESENHOS = DESENHOS.length;

export function Desenho({ indice, altura = "30mm" }) {
  const d = DESENHOS[((indice % DESENHOS.length) + DESENHOS.length) % DESENHOS.length];
  return (
    <svg viewBox="0 0 60 50" style={{ height: altura, width: "auto", display: "block" }}>
      <g
        fill="#fff"
        stroke={TINTA}
        strokeWidth="0.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {d.el}
      </g>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// GERADORES DE CAMINHOS (retornam o atributo `d` de um <path>)
// ─────────────────────────────────────────────────────────────────────────

export const caminhos = {
  reta: (x0, x1, y) => `M${f(x0)} ${f(y)} L${f(x1)} ${f(y)}`,

  zigzag: (x0, x1, yc, amp, n) => {
    const pts = [];
    for (let i = 0; i <= n; i++) {
      pts.push([x0 + ((x1 - x0) * i) / n, yc + (i % 2 ? amp : -amp)]);
    }
    return poli(pts);
  },

  onda: (x0, x1, yc, amp, ciclos, passos = 160) => {
    const pts = [];
    for (let i = 0; i <= passos; i++) {
      const t = i / passos;
      pts.push([x0 + (x1 - x0) * t, yc - amp * Math.sin(t * ciclos * 2 * Math.PI)]);
    }
    return poli(pts);
  },

  arcos: (x0, x1, yc, amp, n, passos = 24) => {
    const L = (x1 - x0) / n;
    let d = "";
    for (let k = 0; k < n; k++) {
      const pts = [];
      for (let i = 0; i <= passos; i++) {
        const t = i / passos;
        pts.push([x0 + L * (k + t), yc - amp * Math.sin(t * Math.PI)]);
      }
      d += poli(pts) + " ";
    }
    return d.trim();
  },

  degraus: (x0, x1, yc, amp, n) => {
    const L = (x1 - x0) / n;
    const pts = [[x0, yc + amp]];
    for (let k = 0; k < n; k++) {
      const xa = x0 + L * k;
      const alto = k % 2 === 0;
      pts.push([xa, alto ? yc - amp : yc + amp]);
      pts.push([xa + L, alto ? yc - amp : yc + amp]);
    }
    return poli(pts);
  },

  lacos: (x0, x1, yc, r, n, passos = 240) => {
    const a = (x1 - x0 - 2 * r) / (2 * Math.PI * n);
    const b = r;
    const pts = [];
    for (let i = 0; i <= passos; i++) {
      const t = (i / passos) * 2 * Math.PI * n;
      pts.push([x0 + r + a * t - b * Math.sin(t), yc - b * Math.cos(t) + b]);
    }
    return poli(pts);
  },

  espiral: (cx, cy, rMax, voltas = 3, passos = 260, rMin = 1.5) => {
    const pts = [];
    for (let i = 0; i <= passos; i++) {
      const t = i / passos;
      const ang = t * voltas * 2 * Math.PI;
      const r = rMin + (rMax - rMin) * (1 - t);
      pts.push([cx + r * Math.cos(ang + Math.PI), cy + r * Math.sin(ang + Math.PI)]);
    }
    return poli(pts);
  },
};

// Extremidades de um caminho gerado por `caminhos.*` (primeiro M e último ponto).
function extremidades(d) {
  const pts = [...d.matchAll(/[ML]\s*(-?[\d.]+)\s+(-?[\d.]+)/g)].map((m) => [Number(m[1]), Number(m[2])]);
  return { ini: pts[0], fim: pts[pts.length - 1] };
}

// Linha pontilhada/tracejada "para cobrir". `marcas` desenha as bolinhas de
// início/fim automaticamente; `inicio`/`fim` permitem posições manuais.
export function Tracejado({ d, marcas = false, inicio, fim, cor = TINTA, corMarca = "#16a34a", espessura = 0.5 }) {
  const ext = marcas ? extremidades(d) : {};
  const i = inicio ?? ext.ini;
  const e = fim ?? ext.fim;
  return (
    <g>
      <path
        d={d}
        fill="none"
        stroke={cor}
        strokeWidth={espessura}
        strokeDasharray="1.7 1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {i && <circle cx={i[0]} cy={i[1]} r="1.6" fill={corMarca} />}
      {e && <circle cx={e[0]} cy={e[1]} r="1.6" fill={corMarca} />}
    </g>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// LABIRINTO (perfeito: sempre tem exatamente um caminho da entrada à saída)
// ─────────────────────────────────────────────────────────────────────────

export function gerarLabirinto(cols, linhas, seed) {
  const r = rng(seed);
  const aberto = Array.from({ length: linhas }, () =>
    Array.from({ length: cols }, () => ({ N: false, S: false, E: false, W: false })),
  );
  const visitado = Array.from({ length: linhas }, () => Array(cols).fill(false));
  const pilha = [[0, 0]];
  visitado[0][0] = true;
  const DIRS = [
    ["N", 0, -1, "S"],
    ["S", 0, 1, "N"],
    ["E", 1, 0, "W"],
    ["W", -1, 0, "E"],
  ];
  while (pilha.length) {
    const [cx, cy] = pilha[pilha.length - 1];
    const vizinhos = DIRS.filter(([, dx, dy]) => {
      const nx = cx + dx;
      const ny = cy + dy;
      return nx >= 0 && ny >= 0 && nx < cols && ny < linhas && !visitado[ny][nx];
    });
    if (!vizinhos.length) {
      pilha.pop();
      continue;
    }
    const [dir, dx, dy, oposto] = vizinhos[Math.floor(r() * vizinhos.length)];
    aberto[cy][cx][dir] = true;
    aberto[cy + dy][cx + dx][oposto] = true;
    visitado[cy + dy][cx + dx] = true;
    pilha.push([cx + dx, cy + dy]);
  }
  return aberto;
}

export function Labirinto({ cols = 12, linhas = 4, seed = 1, celula = 10, cor = "#2563eb" }) {
  const g = gerarLabirinto(cols, linhas, seed);
  const segs = [];
  for (let y = 0; y < linhas; y++) {
    for (let x = 0; x < cols; x++) {
      const x0 = x * celula;
      const y0 = y * celula;
      const c = g[y][x];
      if (!c.N && y === 0) segs.push([x0, y0, x0 + celula, y0]);
      if (!c.S) segs.push([x0, y0 + celula, x0 + celula, y0 + celula]);
      // entrada (lado esquerdo da 1ª linha) e saída (lado direito da última) ficam abertas
      if (!c.W && !(x === 0 && y === 0)) segs.push([x0, y0, x0, y0 + celula]);
      if (!c.E && !(x === cols - 1 && y === linhas - 1))
        segs.push([x0 + celula, y0, x0 + celula, y0 + celula]);
    }
  }
  // remove paredes internas duplicadas (mesma aresta vista por duas células)
  const vistos = new Set();
  const unicos = segs.filter((s) => {
    const k = s.join(",");
    if (vistos.has(k)) return false;
    vistos.add(k);
    return true;
  });
  const W = cols * celula;
  const H = linhas * celula;
  return (
    <svg viewBox={`-1 -1 ${W + 2} ${H + 2}`} style={{ width: "100%", display: "block" }}>
      <g stroke={cor} strokeWidth="1.1" strokeLinecap="round" fill="none">
        {unicos.map((s, i) => (
          <line key={i} x1={s[0]} y1={s[1]} x2={s[2]} y2={s[3]} />
        ))}
      </g>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// LIGUE OS PONTOS (10 pontos cada; fechar o último no primeiro forma a figura)
// ─────────────────────────────────────────────────────────────────────────

export const FIGURAS_PONTOS = [
  { nome: "Estrela", pts: estrelaPts(40, 32, 27, 11.5).map(([x, y]) => [f(x), f(y)]) },
  {
    nome: "Casa",
    pts: [
      [40, 5], [66, 27], [66, 55], [52, 55], [52, 40],
      [28, 40], [28, 55], [14, 55], [14, 27], [27, 16],
    ],
  },
  {
    nome: "Balão",
    pts: Array.from({ length: 10 }).map((_, i) => {
      const a = ((i * 36 - 90) * Math.PI) / 180;
      return [f(40 + 23 * Math.cos(a)), f(28 + 25 * Math.sin(a))];
    }),
  },
  {
    nome: "Foguete",
    pts: [
      [40, 4], [47, 14], [52, 24], [52, 42], [64, 56],
      [52, 52], [28, 52], [16, 56], [28, 42], [28, 24],
    ],
  },
];

export function LiguePontos({ pts }) {
  const cx = pts.reduce((s, p) => s + p[0], 0) / pts.length;
  const cy = pts.reduce((s, p) => s + p[1], 0) / pts.length;
  return (
    <svg viewBox="0 0 80 64" style={{ width: "100%", display: "block" }}>
      {pts.map(([x, y], i) => {
        const dx = x - cx;
        const dy = y - cy;
        const len = Math.hypot(dx, dy) || 1;
        const tx = x + (dx / len) * 4.5;
        const ty = y + (dy / len) * 4.5 + 1.3;
        return (
          <g key={i}>
            <circle cx={x} cy={y} r="1.1" fill={TINTA} />
            <text
              x={tx}
              y={ty}
              fontSize="4.2"
              textAnchor="middle"
              fontWeight="600"
              fontFamily="'Fredoka', 'Baloo 2', sans-serif"
              fill={TINTA}
            >
              {i + 1}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
