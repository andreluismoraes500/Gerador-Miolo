import { useState } from "react";
import { ChevronDown } from "lucide-react";

export function Secao({ titulo, children, aberto = true }) {
  const [a, setA] = useState(aberto);
  return (
    <section className="st-secao">
      <button className="st-secao__t" onClick={() => setA(!a)} aria-expanded={a}>
        <span>{titulo}</span><ChevronDown size={14} style={{ transform: a ? "none" : "rotate(-90deg)", transition: ".2s" }} />
      </button>
      {a && <div className="st-secao__c">{children}</div>}
    </section>
  );
}
export const Linha = ({ rotulo, children }) => (
  <label className="st-linha"><span>{rotulo}</span><div>{children}</div></label>
);
export function Slider({ rotulo, valor, min, max, passo = 1, onChange, un = "" }) {
  return (
    <label className="st-linha st-linha--slider">
      <span>{rotulo}</span>
      <input type="range" min={min} max={max} step={passo} value={valor} onChange={(e) => onChange(Number(e.target.value))} />
      <output>{Math.round(valor * 100) / 100}{un}</output>
    </label>
  );
}
export const Num = ({ rotulo, valor, onChange, min, max }) => (
  <label className="st-num"><span>{rotulo}</span>
    <input type="number" value={Math.round(valor)} min={min} max={max} onChange={(e) => onChange(Number(e.target.value) || 0)} />
  </label>
);
export const Cor = ({ valor, onChange, rotulo }) => (
  <Linha rotulo={rotulo}><input type="color" value={valor} onChange={(e) => onChange(e.target.value)} className="st-cor" /></Linha>
);
export function Seg({ valor, opcoes, onChange }) {
  return (
    <div className="st-seg" role="group">
      {opcoes.map(([v, n, tit]) => <button key={v} title={tit || n} className={valor === v ? "on" : ""} onClick={() => onChange(v)}>{n}</button>)}
    </div>
  );
}
export const Botao = ({ icone: I, children, ...p }) => (
  <button {...p} className={`st-btn ${p.className || ""}`}>{I && <I size={15} />}{children}</button>
);
export const Chip = ({ cor, on, onClick, titulo }) => (
  <button title={titulo} aria-label={titulo} className={`st-chip ${on ? "on" : ""}`} style={{ background: cor }} onClick={onClick} />
);
