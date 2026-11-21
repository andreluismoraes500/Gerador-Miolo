// Grade de modelos com miniatura (substitui listas e selects): cada opção mostra um desenho do resultado.
import { CAMINHO_FORMA } from "../../lib/capas";
import { geometria, MODELOS_EMB, paramsPadrao } from "../../lib/embalagens";

export default function GradeModelos({ itens, valor, onChange, colunas = 3, aspecto = "aspect-[4/3]" }) {
  return (
    <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${colunas}, minmax(0, 1fr))` }} role="radiogroup">
      {itens.map((it) => {
        const ativo = it.id === valor;
        return (
          <button key={it.id} type="button" role="radio" aria-checked={ativo} onClick={() => onChange(it.id)} title={it.rotulo}
            className={`rounded-xl border p-1.5 flex flex-col items-center gap-1 bg-white text-center transition ${ativo ? "border-[#8B1D2C] ring-2 ring-[#8B1D2C]/60" : "border-[#D8CBA8] hover:border-[#B8933D]"}`}>
            <div className={`w-full ${aspecto} grid place-items-center overflow-hidden rounded-lg bg-[#F6F1E7]`}>{it.miniatura}</div>
            <span className="text-[11px] font-semibold text-[#24344D] leading-tight">{it.rotulo}</span>
          </button>
        );
      })}
    </div>
  );
}

// Miniatura do molde de uma embalagem (corte cheio, dobra tracejada).
export function MiniEmbalagem({ modelo, cor = "#d6567a" }) {
  const g = geometria(modelo, paramsPadrao(modelo));
  return (
    <svg viewBox={`0 0 ${g.w} ${g.h}`} className="w-full h-full p-1.5" preserveAspectRatio="xMidYMid meet" aria-hidden>
      {g.pecas.map((p, i) => <polygon key={i} points={p.pts.map((q) => q.join(",")).join(" ")} fill={p.tipo === "aba" ? "#ffffff" : cor} fillOpacity={p.tipo === "aba" ? 1 : 0.35} />)}
      <path d={g.dobra} fill="none" stroke="#24344D" strokeWidth={Math.max(g.w, g.h) / 90} strokeDasharray={`${g.w / 40} ${g.w / 55}`} />
      <path d={g.corte} fill="none" stroke="#24344D" strokeWidth={Math.max(g.w, g.h) / 60} strokeLinejoin="round" />
    </svg>
  );
}
export const ITENS_EMB = (cor) => Object.entries(MODELOS_EMB).map(([id, m]) => ({ id, rotulo: m.nome, miniatura: <MiniEmbalagem modelo={id} cor={cor} /> }));

// Miniatura da forma de fundo do texto.
export function MiniForma({ forma }) {
  const cor = "#24344D";
  const c = CAMINHO_FORMA[forma];
  let corpo;
  if (forma === "nenhum") corpo = <rect x="8" y="22" width="84" height="36" fill="none" stroke="#9a917f" strokeDasharray="4 3" strokeWidth="2" rx="3" />;
  else if (forma === "retangulo") corpo = <rect x="6" y="20" width="88" height="40" fill={cor} />;
  else if (forma === "arredondado") corpo = <rect x="6" y="20" width="88" height="40" rx="12" fill={cor} />;
  else if (forma === "pilula") corpo = <rect x="6" y="22" width="88" height="36" rx="18" fill={cor} />;
  else if (forma === "oval") corpo = <ellipse cx="50" cy="40" rx="44" ry="22" fill={cor} />;
  else if (c?.d) corpo = <path d={c.d} fill={cor} transform="translate(0 -4) scale(1 .9)" />;
  else if (c?.pol) corpo = <polygon points={c.pol} fill={cor} transform="translate(0 -4) scale(1 .9)" />;
  return <svg viewBox="0 0 100 80" className="w-full h-full p-1" aria-hidden>{corpo}<rect x="26" y="37" width="48" height="5" rx="2.5" fill="#fff" opacity={forma === "nenhum" ? 0 : 0.9} /></svg>;
}

// Miniatura de uma paleta do encarte.
export function MiniPaleta({ p }) {
  return (
    <svg viewBox="0 0 100 75" className="w-full h-full" aria-hidden>
      <rect width="100" height="75" fill={p.fundo} />
      <rect y="8" width="100" height="12" fill={p.faixa} />
      <rect x="22" y="26" width="56" height="6" rx="3" fill={p.titulo} />
      {[0, 1, 2].map((i) => (<g key={i}><rect x={8 + i * 30} y="38" width="26" height="22" rx="3" fill="#ffffff" opacity=".9" /><rect x={11 + i * 30} y="52" width="20" height="6" rx="3" fill={p.pill} /><circle cx={21 + i * 30} cy="45" r="4" fill={p.preco} /></g>))}
      <rect y="66" width="100" height="9" fill={p.rodape} />
    </svg>
  );
}

// Miniaturas dos modelos de calendário (desenho esquemático de cada formato).
function Grade({ x, y, w, h, c = 7, l = 5, cor = "#24344D" }) {
  const pts = [];
  for (let i = 0; i < c; i += 1) for (let j = 0; j < l; j += 1) pts.push(<rect key={`${i}-${j}`} x={x + (w / c) * i + 0.4} y={y + (h / l) * j + 0.4} width={w / c - 0.8} height={h / l - 0.8} fill={cor} opacity={j === 0 ? 0.9 : 0.35} rx="0.4" />);
  return <>{pts}</>;
}
export function MiniCalendario({ id, cor = "#c0643a" }) {
  let corpo;
  if (id === "parede") corpo = <><rect x="30" y="4" width="40" height="67" fill="#fff" stroke="#24344D" strokeWidth="1" /><rect x="33" y="7" width="34" height="28" fill={cor} opacity=".55" /><Grade x={33} y={40} w={34} h={26} /></>;
  else if (id === "poster") corpo = <><rect x="22" y="4" width="56" height="67" fill="#fff" stroke="#24344D" strokeWidth="1" />{[0, 1, 2].map((i) => [0, 1, 2, 3].map((j) => <Grade key={`${i}${j}`} x={25 + i * 17.5} y={8 + j * 15.5} w={14} h={12} c={7} l={4} />))}</>;
  else if (id === "mesa") corpo = <><polygon points="10,60 50,60 62,22 22,22" fill="#fff" stroke="#24344D" strokeWidth="1" /><polygon points="50,60 90,60 78,22 62,22" fill="#f3ecdc" stroke="#24344D" strokeWidth="1" /><rect x="26" y="26" width="30" height="12" fill={cor} opacity=".55" transform="skewX(-17) translate(11 0)" /><Grade x={20} y={42} w={32} h={14} /></>;
  else if (id === "cabecalho") corpo = <><rect x="8" y="10" width="84" height="22" fill={cor} opacity=".6" stroke="#24344D" strokeWidth="1" /><rect x="8" y="38" width="84" height="30" fill="#fff" stroke="#24344D" strokeWidth="1" /><Grade x={12} y={42} w={76} h={22} c={14} l={4} /></>;
  else if (id === "minis") corpo = <>{[0, 1, 2, 3].map((i) => [0, 1, 2].map((j) => <g key={`${i}${j}`}><rect x={6 + i * 23} y={6 + j * 22} width="20" height="19" fill="#fff" stroke="#24344D" strokeWidth=".8" rx="1.5" /><Grade x={8 + i * 23} y={12 + j * 22} w={16} h={11} c={7} l={4} /></g>))}</>;
  else corpo = <><rect x="20" y="4" width="60" height="67" fill="#fff" stroke="#24344D" strokeWidth="1" />{[0, 1, 2, 3, 4, 5].map((i) => <line key={i} x1="25" x2="75" y1={14 + i * 8} y2={14 + i * 8} stroke="#24344D" opacity=".4" />)}<Grade x={25} y={56} w={50} h={10} c={14} l={3} /></>;
  return <svg viewBox="0 0 100 75" className="w-full h-full" aria-hidden>{corpo}</svg>;
}
