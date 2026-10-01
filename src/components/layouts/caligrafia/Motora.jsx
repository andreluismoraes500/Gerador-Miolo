// src/components/layouts/caligrafia/Motora.jsx
//
// Coordenação motora fina — pré-escrita: retas, curvas, ondas, caminhos,
// espirais, formas geométricas e labirintos. Tudo gerado por código (SVG),
// com linhas pontilhadas para cobrir.

import {
  PageShell,
  useVisual,
  Cabecalho,
  Secao,
  Dica,
  FONTE_INFANTIL,
  PALETA_INFANTIL,
} from "./base";
import {
  Tracejado,
  caminhos,
  FormaSvg,
  FormaTraco,
  Forma,
  Labirinto,
} from "./graficos";

const COR = PALETA_INFANTIL.map((p) => p.ink);
const W = 176;

function Pagina({ faixa, dica, children, ...rest }) {
  const { primaryColor } = useVisual(rest.colorTheme, rest.customColors, rest.fontFamily);
  return (
    <PageShell {...rest}>
      <Cabecalho
        titulo="Coordenação Motora"
        faixa={faixa}
        selo="TRAÇADOS"
        logo={rest.logo}
        primaryColor={primaryColor}
      />
      {children}
      {dica && (
        <div className="mt-auto pt-2">
          <Dica>{dica}</Dica>
        </div>
      )}
    </PageShell>
  );
}

const Svg = ({ h, children, pct = 100 }) => (
  <svg viewBox={`0 0 ${W} ${h}`} style={{ width: `${pct}%`, display: "block", margin: "0 auto" }} className="shrink-0">
    {children}
  </svg>
);

// ─────────────────────────────────────────────────────────────────────────
// 1. RETAS
// ─────────────────────────────────────────────────────────────────────────

export function MotoraRetasPage(rest) {
  const pares = [
    ["estrela", "nuvem"],
    ["flor", "coracao"],
    ["lua", "bola"],
  ];
  return (
    <Pagina faixa="Linhas retas" {...rest}>
      <Secao n={1}>Cubra os traçados: linhas retas.</Secao>
      <Svg h={196} pct={86}>
        {/* horizontais */}
        {pares.map(([a, b], i) => (
          <g key={i}>
            <FormaSvg tipo={a} x={0} y={i * 18} s={13} />
            <FormaSvg tipo={b} x={W - 13} y={i * 18} s={13} />
            <Tracejado d={caminhos.reta(18, W - 18, i * 18 + 6.5)} marcas corMarca={COR[i * 2]} />
          </g>
        ))}
        {/* verticais */}
        {COR.map((c, i) => {
          const x = 14 + i * 29.5;
          return (
            <g key={i}>
              <Tracejado d={`M${x} 64 L${x} 92`} inicio={[x, 64]} fim={[x, 92]} corMarca={c} />
            </g>
          );
        })}
        {/* diagonais "/" */}
        {[0, 1, 2, 3, 4].map((i) => {
          const x = 14 + i * 33;
          return <Tracejado key={i} d={`M${x} 124 L${x + 24} 100`} inicio={[x, 124]} fim={[x + 24, 100]} corMarca={COR[i]} />;
        })}
        {/* diagonais "\\" */}
        {[0, 1, 2, 3, 4].map((i) => {
          const x = 14 + i * 33;
          return <Tracejado key={i} d={`M${x} 134 L${x + 24} 158`} inicio={[x, 134]} fim={[x + 24, 158]} corMarca={COR[(i + 2) % 6]} />;
        })}
        {/* curtas */}
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const x = 4 + i * 29;
          return <Tracejado key={i} d={caminhos.reta(x, x + 22, 172)} inicio={[x, 172]} fim={[x + 22, 172]} corMarca={COR[i]} />;
        })}
        {[0, 1, 2].map((i) => {
          const x = 4 + i * 59;
          return <Tracejado key={i} d={caminhos.reta(x, x + 50, 188)} inicio={[x, 188]} fim={[x + 50, 188]} corMarca={COR[(i + 3) % 6]} />;
        })}
      </Svg>
    </Pagina>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// 2. CURVAS
// ─────────────────────────────────────────────────────────────────────────

export function MotoraCurvasPage(rest) {
  const linhas = [
    { d: caminhos.arcos(10, 158, 12, 9, 5), y: 0, fim: "estrela" },
    { d: caminhos.arcos(10, 158, 10, -9, 6), y: 24, fim: "coracao" },
    { d: caminhos.onda(10, 158, 12, 5, 3.5), y: 48, fim: "flor" },
    { d: caminhos.arcos(10, 158, 12, 9, 8), y: 72, fim: "bola" },
    { d: caminhos.arcos(10, 158, 12, 11, 10), y: 96, fim: "gota" },
    { d: caminhos.arcos(10, 158, 12, 5, 11), y: 120, fim: "nuvem" },
    { d: caminhos.lacos(10, 158, 5, 6, 6), y: 144, fim: "quadrado" },
    { d: caminhos.lacos(10, 158, 6, 4.5, 9), y: 168, fim: "triangulo" },
  ];
  return (
    <Pagina faixa="Linhas curvas" {...rest}>
      <Secao n={2}>Cubra os traçados: linhas curvas.</Secao>
      <Svg h={192} pct={84}>
        {linhas.map((l, i) => (
          <g key={i} transform={`translate(0 ${l.y})`}>
            <line x1="0" x2={W} y1="22.5" y2="22.5" stroke="#bfdbfe" strokeWidth="0.3" />
            <Tracejado d={l.d} marcas corMarca={COR[i % 6]} />
            <FormaSvg tipo={l.fim} x={W - 14} y={4} s={13} />
          </g>
        ))}
      </Svg>
    </Pagina>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// 3. ONDAS
// ─────────────────────────────────────────────────────────────────────────

export function MotoraOndasPage(rest) {
  const cfg = [
    [4, 5, "lua"], [3, 8, "estrela"], [5, 4, "gota"], [2.5, 12, "flor"],
    [4.5, 5, "bola"], [2.5, 9, "coracao"], [5, 4, "nuvem"],
  ];
  return (
    <Pagina faixa="Ondas" dica="Comece pelo ponto e siga a onda até o final, sem tirar o lápis do papel." {...rest}>
      <Secao n={3}>Cubra os traçados: ondas.</Secao>
      <div className="rounded-3xl p-2 shrink-0" style={{ border: "2px solid #93c5fd" }}>
        <Svg h={182}>
          {cfg.map(([amp, ciclos, tipo], i) => (
            <g key={i} transform={`translate(0 ${i * 26})`}>
              <FormaSvg tipo={tipo} x={0} y={6} s={14} />
              <Tracejado d={caminhos.onda(20, W - 8, 13, amp, ciclos)} inicio={[20, 13]} fim={[W - 8, 13]} corMarca={COR[i % 6]} />
            </g>
          ))}
        </Svg>
      </div>
    </Pagina>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// 4. CAMINHOS PONTILHADOS
// ─────────────────────────────────────────────────────────────────────────

export function MotoraCaminhosPage(rest) {
  const linhas = [
    { d: caminhos.onda(22, W - 22, 16, 7, 3.5), a: "flor", b: "estrela" },
    { d: caminhos.arcos(22, W - 22, 26, 18, 5), a: "bola", b: "nuvem" },
    { d: caminhos.zigzag(22, W - 22, 16, 9, 10), a: "lua", b: "coracao" },
    { d: caminhos.degraus(22, W - 22, 16, 7, 8), a: "quadrado", b: "triangulo" },
    { d: caminhos.lacos(22, W - 22, 8, 7, 6), a: "gota", b: "flor" },
  ];
  return (
    <Pagina faixa="Caminhos pontilhados" dica="Estimule a criança a seguir os caminhos com atenção e calma." {...rest}>
      <Secao n={4}>Cubra os traçados: caminhos pontilhados.</Secao>
      <Svg h={180}>
        {linhas.map((l, i) => (
          <g key={i} transform={`translate(0 ${i * 36})`}>
            <FormaSvg tipo={l.a} x={0} y={8} s={16} />
            <FormaSvg tipo={l.b} x={W - 16} y={8} s={16} />
            <Tracejado d={l.d} marcas corMarca={COR[i % 6]} />
          </g>
        ))}
      </Svg>
    </Pagina>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// 5. ESPIRAIS
// ─────────────────────────────────────────────────────────────────────────

export function MotoraEspiraisPage(rest) {
  const tipos = ["estrela", "gota", "flor"];
  return (
    <Pagina faixa="Espirais" dica="Parabéns! Cada espiral treina o movimento circular que a escrita vai pedir." {...rest}>
      <Secao n={5}>Cubra cada espiral, começando pelo ponto.</Secao>
      <Svg h={60}>
        {[0, 1, 2].map((i) => {
          const cx = 30 + i * 58;
          return (
            <Tracejado
              key={i}
              d={caminhos.espiral(cx, 30, 27, 3.2)}
              inicio={[cx - 27, 30]}
              corMarca={COR[i * 2 % 6]}
            />
          );
        })}
      </Svg>
      <Secao n={6}>Cubra as espirais menores.</Secao>
      <Svg h={36}>
        {[0, 1, 2, 3, 4].map((i) => {
          const cx = 18 + i * 35;
          return (
            <Tracejado
              key={i}
              d={caminhos.espiral(cx, 18, 15, 2.6)}
              inicio={[cx - 15, 18]}
              corMarca={COR[(i + 3) % 6]}
            />
          );
        })}
      </Svg>
      <Secao n={7}>Cubra o caminho espiral até chegar ao centro de cada desenho.</Secao>
      <Svg h={62}>
        {tipos.map((t, i) => {
          const cx = 30 + i * 58;
          return (
            <g key={i}>
              <Tracejado
                d={caminhos.espiral(cx, 31, 28, 2.6, 260, 10)}
                inicio={[cx - 28, 31]}
                corMarca={COR[(i * 2 + 1) % 6]}
              />
              <FormaSvg tipo={t} x={cx - 7} y={24} s={14} />
            </g>
          );
        })}
      </Svg>
    </Pagina>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// 6. FORMAS GEOMÉTRICAS
// ─────────────────────────────────────────────────────────────────────────

const NOMES_FORMAS = [
  ["circulo", "Círculo"],
  ["quadrado", "Quadrado"],
  ["triangulo", "Triângulo"],
  ["retangulo", "Retângulo"],
  ["coracao", "Coração"],
  ["estrela", "Estrela"],
];

export function MotoraFormasPage(rest) {
  const pintar = [
    "coracao", "circulo", "quadrado", "estrela", "triangulo", "retangulo",
    "circulo", "triangulo", "coracao", "quadrado", "estrela", "circulo", "retangulo",
  ];
  return (
    <Pagina faixa="Formas geométricas" dica="Aprender formas é construir o mundo com muita criatividade!" {...rest}>
      <Secao n={1}>Cubra os tracejados das formas geométricas.</Secao>
      <Svg h={36}>
        {NOMES_FORMAS.map(([t, nome], i) => {
          const x = i * 29.5 + 2;
          return (
            <g key={t}>
              <FormaTraco tipo={t} x={x} y={0} s={25} />
              <text x={x + 12.5} y={33} fontSize="3.6" textAnchor="middle" fontWeight="700" fill={COR[i % 6]} fontFamily={FONTE_INFANTIL}>
                {nome.toUpperCase()}
              </text>
            </g>
          );
        })}
      </Svg>

      <Secao n={2}>Quantas formas há em cada grupo?</Secao>
      <div className="flex flex-col gap-1.5 shrink-0">
        {[
          ["circulo", "quadrado", "circulo", "quadrado", "circulo"],
          ["triangulo", "triangulo", "triangulo", "coracao", "triangulo"],
          ["estrela", "estrela", "estrela", "estrela", "quadrado"],
        ].map((grupo, i) => (
          <div key={i} className="flex items-center gap-2 rounded-xl px-3 py-1" style={{ border: `1.5px solid ${COR[(i * 2 + 4) % 6]}` }}>
            <div className="flex gap-1.5 flex-1">
              {grupo.map((t, k) => (
                <Forma key={k} tipo={t} size="9mm" modo="cheia" />
              ))}
            </div>
            <span className="text-[9px] font-bold" style={{ color: COR[(i * 2 + 4) % 6], fontFamily: FONTE_INFANTIL }}>
              Quantas?
            </span>
            <span className="rounded-lg" style={{ width: "10mm", height: "10mm", border: "1.5px dashed #6b7280" }} />
          </div>
        ))}
      </div>

      <Secao n={3}>Pinte as formas indicadas.</Secao>
      <div className="flex items-center gap-4 text-[9px] mb-1 shrink-0" style={{ fontFamily: FONTE_INFANTIL }}>
        <span><b style={{ color: "#16a34a" }}>●</b> círculos de verde</span>
        <span><b style={{ color: "#ec4899" }}>■</b> quadrados de rosa</span>
        <span><b style={{ color: "#eab308" }}>▲</b> triângulos de amarelo</span>
      </div>
      <div className="flex flex-wrap items-center justify-around gap-2 rounded-2xl px-3 py-2 shrink-0" style={{ border: "2px solid #374151" }}>
        {pintar.map((t, i) => (
          <Forma key={i} tipo={t} size="12mm" />
        ))}
      </div>

      <Secao n={4}>Desenhe uma forma de cada tipo nos espaços abaixo.</Secao>
      <div className="grid grid-cols-6 gap-2 shrink-0">
        {NOMES_FORMAS.map(([t, nome], i) => (
          <div key={t} className="rounded-xl flex flex-col items-center justify-start pt-1" style={{ border: `1.5px dashed ${COR[i % 6]}`, height: "26mm" }}>
            <span className="text-[8px] font-bold" style={{ color: COR[i % 6], fontFamily: FONTE_INFANTIL }}>{nome}</span>
          </div>
        ))}
      </div>
    </Pagina>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// 7. LABIRINTOS
// ─────────────────────────────────────────────────────────────────────────

export function MotoraLabirintosPage(rest) {
  const itens = [
    ["estrela", "nuvem", "#2563eb", 7],
    ["flor", "coracao", "#16a34a", 19],
    ["lua", "bola", "#ea580c", 31],
  ];
  return (
    <Pagina faixa="Labirintos simples" dica="Ajude cada personagem a chegar ao seu destino — use o dedo antes do lápis!" {...rest}>
      <Secao n={8}>Ajude cada personagem a chegar ao seu destino.</Secao>
      <div className="flex flex-col gap-4 shrink-0 pt-1">
        {itens.map(([a, b, cor, seed], i) => (
          <div key={i} className="flex items-center gap-2">
            <Forma tipo={a} size="16mm" modo="cheia" />
            <span style={{ color: cor, fontSize: "5mm" }}>➜</span>
            <div className="flex-1 min-w-0">
              <Labirinto cols={12} linhas={4} seed={seed} celula={10} cor={cor} />
            </div>
            <span style={{ color: cor, fontSize: "5mm" }}>➜</span>
            <Forma tipo={b} size="16mm" modo="cheia" />
          </div>
        ))}
      </div>
      <div className="mt-3 rounded-2xl px-3 py-2 shrink-0" style={{ border: "2px dashed #ec4899" }}>
        <p className="text-[9px] font-bold mb-1" style={{ color: "#ec4899", fontFamily: FONTE_INFANTIL }}>
          Treine seu traçado! Siga o caminho pontilhado com o lápis.
        </p>
        <Svg h={20}>
          <FormaSvg tipo="estrela" x={0} y={3} s={14} />
          <FormaSvg tipo="nuvem" x={W - 16} y={3} s={14} />
          <Tracejado d={caminhos.onda(20, W - 22, 10, 6, 4)} inicio={[20, 10]} fim={[W - 22, 10]} />
        </Svg>
      </div>
    </Pagina>
  );
}
