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
