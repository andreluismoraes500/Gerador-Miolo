import { LADOS, DICAS_LADOS, impressao } from "../lib/configImpressao";
import { TIPOS_PAUTA, partiturasCfg } from "../lib/configPartituras";

// Escolha de quais lados imprimir (para quem não tem impressora frente e verso).
export function LadosImpressao({ compacto = false }) {
  const { lados } = impressao.useStore();
  return (
    <div className={compacto ? "flex flex-col" : "flex flex-col gap-1"}>
      <select
        value={lados}
        onChange={(e) => impressao.set({ lados: e.target.value })}
        aria-label="Lados da folha"
        title={DICAS_LADOS[lados]}
        className="border border-[#D8CBA8] rounded-lg px-2.5 py-2 text-xs bg-[#FBF8F1] font-medium text-[#24344D] focus:outline-none focus:ring-2 focus:ring-[#B8933D]/40"
      >
        {LADOS.map((l) => (
          <option key={l.id} value={l.id}>{l.nome}</option>
        ))}
      </select>
      {!compacto && <p className="text-[11px] text-[#8B6A1F] max-w-xs">{DICAS_LADOS[lados]}</p>}
    </div>
  );
}

// Tipos de pauta do Caderno de Partituras: um só ou vários misturados.
export function PartiturasOpcoes() {
  const cfg = partiturasCfg.useStore();
  const alternar = (id) => {
    const tem = cfg.tipos.includes(id);
    const tipos = tem ? cfg.tipos.filter((t) => t !== id) : [...cfg.tipos, id];
    partiturasCfg.set({ tipos: tipos.length ? tipos : [id] });
  };
  return (
    <div className="bg-[#FBF8F1] border border-[#D8CBA8] rounded-xl p-4 flex flex-col gap-3 print:hidden">
      <div>
        <h3 className="text-sm font-bold text-[#24344D]">🎼 Caderno de Partituras — tipos de pauta</h3>
        <p className="text-[11px] text-[#8B6A1F]">Marque um para um caderno só daquela pauta, ou vários para misturar.</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {TIPOS_PAUTA.map((t) => {
          const on = cfg.tipos.includes(t.id);
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => alternar(t.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${on ? "bg-[#24344D] text-[#F6F1E7] border-[#24344D]" : "bg-white text-[#6B6458] border-[#D8CBA8] hover:border-[#B8933D]"}`}
            >
              {on ? "✓ " : ""}{t.nome}
            </button>
          );
        })}
      </div>
      <div className="flex flex-wrap items-center gap-4 text-xs text-[#24344D]">
        {cfg.tipos.length > 1 && (
          <label className="flex items-center gap-2">
            Mistura:
            <select
              value={cfg.modo}
              onChange={(e) => partiturasCfg.set({ modo: e.target.value })}
              className="border border-[#D8CBA8] rounded-lg px-2 py-1 bg-white"
            >
              <option value="alternar">Alternar página a página</option>
              <option value="blocos">Em blocos (um tipo, depois outro)</option>
            </select>
          </label>
        )}
        <label className="flex items-center gap-2">
          Páginas de pauta:
          <input
            type="number"
            min="2"
            max="80"
            step="2"
            value={cfg.paginas}
            onChange={(e) => partiturasCfg.set({ paginas: Math.max(2, Math.min(80, Number(e.target.value) || 16)) })}
            className="w-16 border border-[#D8CBA8] rounded-lg px-2 py-1 bg-white text-center"
          />
        </label>
      </div>
    </div>
  );
}
