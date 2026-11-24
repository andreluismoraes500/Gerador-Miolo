import { Children, Fragment, cloneElement, isValidElement, useState } from "react";
// Fluxo em etapas: barra de passos numerados, uma etapa visível por vez e botões Voltar/Próximo.
export function Passos({ etapa, setEtapa, passos }) {
  return (
    <nav aria-label="Etapas" className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(auto-fit, minmax(${passos.length > 5 ? 62 : 70}px, 1fr))` }}>
      {passos.map((nome, i) => {
        const ativo = i === etapa;
        const feito = i < etapa;
        return (
          <button key={i} type="button" onClick={() => setEtapa(i)} aria-current={ativo ? "step" : undefined}
            className={`flex flex-col items-center gap-1 rounded-xl border px-1 py-2 text-[11px] font-semibold leading-tight ${ativo ? "bg-[#24344D] text-white border-[#24344D]" : feito ? "bg-[#E9E2D0] text-[#24344D] border-[#D8CBA8]" : "bg-white text-[#6B6458] border-[#D8CBA8]"}`}>
            <span className={`w-6 h-6 rounded-full grid place-items-center text-xs font-bold ${ativo ? "bg-[#E0A800] text-[#24344D]" : feito ? "bg-[#24344D] text-white" : "bg-[#E9E2D0] text-[#24344D]"}`}>{feito ? "✓" : i + 1}</span>
            {nome}
          </button>
        );
      })}
    </nav>
  );
}

export default function Etapa({ n, atual, titulo, dica, children }) {
  if (n !== atual) return null;
  return (
    <section className="bg-[#FBF8F1] border-2 border-[#24344D] rounded-2xl px-4 py-4 flex flex-col gap-3">
      <div>
        <h2 className="font-bold text-lg text-[#24344D]">{titulo}</h2>
        {dica && <p className="text-xs text-[#6B6458] mt-0.5">{dica}</p>}
      </div>
      {children}
    </section>
  );
}

export function NavEtapas({ etapa, setEtapa, total }) {
  const ir = (n) => { setEtapa(n); try { window.scrollTo({ top: 0, behavior: "smooth" }); } catch { /* sem scroll */ } };
  return (
    <div className="flex gap-2">
      <button type="button" disabled={etapa === 0} onClick={() => ir(etapa - 1)} className="flex-1 px-4 py-3 rounded-xl border border-[#D8CBA8] bg-white text-sm font-bold text-[#24344D] disabled:opacity-40">← Voltar</button>
      {etapa < total - 1 && <button type="button" onClick={() => ir(etapa + 1)} className="flex-[2] px-4 py-3 rounded-xl bg-[#24344D] text-white text-sm font-bold">Próximo →</button>}
    </div>
  );
}

// Envolve os painéis de uma coluna e mostra um de cada vez, em sequência (com Voltar/Próximo).

function achatar(filhos) {
  const lista = [];
  Children.forEach(filhos, (f) => {
    if (!isValidElement(f)) return;
    if (f.type === Fragment) lista.push(...achatar(f.props.children));
    else lista.push(f);
  });
  return lista;
}
const rotuloCurto = (t) => {
  const s = typeof t === "string" ? t.replace(/^[^\p{L}\p{N}]+/u, "").replace(/\s*[:(].*$/, "").trim() : "";
  const w = s.split(/\s+/);
  return (w[0].length >= 4 ? w[0] : w.slice(0, 2).join(" ")) || "Etapa";
};

export function Fluxo({ children, cls = "" }) {
  const [etapa, setEtapa] = useState(0);
  const passos = [];
  achatar(children).forEach((el) => {
    if (el.props && el.props.titulo !== undefined) passos.push({ el, extra: [] });
    else if (passos.length) passos[passos.length - 1].extra.push(el);
    else passos.push({ el: null, extra: [el] });
  });
  if (passos.length <= 1) return <div className={cls}>{children}</div>;
  const atual = Math.min(etapa, passos.length - 1);
  const { el, extra } = passos[atual];
  const nomes = passos.map((x, i) => (x.el ? rotuloCurto(x.el.props.titulo) : `Passo ${i + 1}`));
  const ultimo = atual === passos.length - 1;
  return (
    <div className={cls}>
      <Passos etapa={atual} setEtapa={setEtapa} passos={nomes} />
      {el && cloneElement(el, { fixo: true, titulo: <>{atual + 1}. {el.props.titulo}</> })}
      {extra.map((x, i) => <Fragment key={i}>{x}</Fragment>)}
      {ultimo && <p className="text-xs text-center text-[#6B6458]">Pronto! Confira a prévia e use o botão <b>Imprimir</b> da barra de baixo.</p>}
      <NavEtapas etapa={atual} setEtapa={setEtapa} total={passos.length} />
    </div>
  );
}
