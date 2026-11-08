import { useEffect } from "react";
import { cssTalonario, talonarioExtras } from "../../lib/configTalonario";

// Painel "Extras": mais linhas, só pautado e letras maiores — valem para todos os modelos.
export default function ExtrasPanel() {
  const c = talonarioExtras.useStore();

  useEffect(() => {
    const st = document.createElement("style");
    st.textContent = cssTalonario();
    document.head.appendChild(st);
    return () => st.remove();
  }, []);

  useEffect(() => {
    document.body.classList.add("tal-escala");
    document.body.style.setProperty("--tal-escala", String(c.escala / 100));
    document.body.classList.toggle("tal-so-pautado", c.soPautado);
    return () => {
      document.body.classList.remove("tal-escala", "tal-so-pautado");
      document.body.style.removeProperty("--tal-escala");
    };
  }, [c.escala, c.soPautado]);

  const num = "w-20 border border-[#d9dedc] rounded-lg px-2 py-1.5 text-sm text-center bg-white";
  return (
    <div className="rounded-xl border border-[#e3e8e6] bg-white p-4 flex flex-col gap-3 print:hidden">
      <h3 className="text-sm font-bold text-[#24344D]">Extras (todos os modelos)</h3>

      <label className="flex items-center justify-between gap-3 text-sm">
        Linhas extras para escrever
        <input type="number" min="0" max="40" className={num} value={c.linhasExtras} disabled={c.soPautado}
          onChange={(e) => talonarioExtras.set({ linhasExtras: Math.max(0, Math.min(40, Number(e.target.value) || 0)) })} />
      </label>

      <label className="flex items-center justify-between gap-3 text-sm">
        Só pautado (mantém o cabeçalho)
        <input type="checkbox" checked={c.soPautado} onChange={(e) => talonarioExtras.set({ soPautado: e.target.checked })} />
      </label>
      {c.soPautado && (
        <label className="flex items-center justify-between gap-3 text-sm">
          Linhas da pauta
          <input type="number" min="4" max="40" className={num} value={c.linhasPauta}
            onChange={(e) => talonarioExtras.set({ linhasPauta: Math.max(4, Math.min(40, Number(e.target.value) || 18)) })} />
        </label>
      )}

      <label className="flex flex-col gap-1 text-sm">
        <span className="flex justify-between">Tamanho das letras <b>{c.escala}%</b></span>
        <input type="range" min="100" max="170" step="5" value={c.escala} onChange={(e) => talonarioExtras.set({ escala: Number(e.target.value) })} />
      </label>
    </div>
  );
}
