// Controle deslizante + caixa para DIGITAR o valor exato (mesmo comportamento em todas as telas).
export default function Faixa({ rotulo, valor, min, max, step = 1, un = "", onChange }) {
  const trava = (v) => Math.min(max, Math.max(min, v));
  return (
    <div className="flex flex-col gap-1 text-[11px] font-semibold text-[#6B6458]">
      <span className="flex justify-between items-center gap-2">
        <span>{rotulo}</span>
        <span className="inline-flex items-center gap-1 text-[#24344D]">
          <input type="number" min={min} max={max} step={step} value={Number.isFinite(valor) ? valor : ""} aria-label={rotulo}
            onChange={(e) => { const n = Number(e.target.value); if (e.target.value !== "" && Number.isFinite(n)) onChange(n); }}
            onBlur={(e) => { const n = Number(e.target.value); onChange(trava(e.target.value !== "" && Number.isFinite(n) ? n : (Number.isFinite(valor) ? valor : min))); }}
            className="w-16 rounded-md border border-[#D8CBA8] bg-white px-1.5 py-0.5 text-right text-xs font-semibold" />
          {un.trim()}
        </span>
      </span>
      <input type="range" min={min} max={max} step={step} value={trava(Number.isFinite(valor) ? valor : min)} onChange={(e) => onChange(Number(e.target.value))} aria-label={`${rotulo} (deslizar)`} />
    </div>
  );
}
