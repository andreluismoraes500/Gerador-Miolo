import { horarioCfg } from "../lib/configHorario";
import { FORMATOS, LADOS, DICAS_LADOS, impressao } from "../lib/configImpressao";
import { TIPOS_PAUTA, partiturasCfg } from "../lib/configPartituras";

// Escolha de quais lados imprimir (para quem não tem impressora frente e verso).
export function LadosImpressao({ compacto = false }) {
  const { lados, formato, compensar } = impressao.useStore();
  const f = FORMATOS.find((x) => x.id === formato) || FORMATOS[0];
  const sel = "border border-[#D8CBA8] rounded-lg px-2.5 py-2 text-xs bg-[#FBF8F1] font-medium text-[#24344D] focus:outline-none focus:ring-2 focus:ring-[#B8933D]/40";
  return (
    <div className={compacto ? "flex gap-2" : "flex flex-col gap-1"}>
      <div className={compacto ? "contents" : "flex flex-wrap gap-2"}>
      <select value={formato} onChange={(e) => impressao.set({ formato: e.target.value })} aria-label="Formato do papel" title={f.dica || "Tamanho do papel e páginas por folha"} className={sel}>
        {FORMATOS.map((x) => (
          <option key={x.id} value={x.id}>{x.nome}</option>
        ))}
      </select>
      <select
        value={lados}
        onChange={(e) => impressao.set({ lados: e.target.value })}
        aria-label="Lados da folha"
        title={DICAS_LADOS[lados]}
        className={sel}
      >
        {LADOS.map((l) => (
          <option key={l.id} value={l.id}>{l.nome}</option>
        ))}
      </select>
      </div>
      {!compacto && f.id !== "a4" && (
        <label className="flex items-center gap-2 text-[11px] text-[#24344D]">
          <input type="checkbox" checked={compensar} onChange={(e) => impressao.set({ compensar: e.target.checked })} />
          Aumentar as letras ao reduzir a página (recomendado para leitura)
        </label>
      )}
      {!compacto && <p className="text-[11px] text-[#8B6A1F] max-w-md">{[f.dica, DICAS_LADOS[lados]].filter(Boolean).join(" ")}</p>}
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

export function HorarioOpcoes() {
  const c = horarioCfg.useStore();
  const num = (k, min, max) => (
    <input type="number" min={min} max={max} value={c[k]} onChange={(e) => horarioCfg.set({ [k]: Math.max(min, Math.min(max, +e.target.value || min)) })} className="w-16 border rounded px-2 py-1 text-xs" />
  );
  return (
    <div className="bg-[#FBF8F1] border border-[#D8CBA8] rounded-xl p-4 flex flex-wrap items-end gap-4 print:hidden text-xs text-[#24344D]">
      <b className="w-full text-sm">🕗 Diário Hora a Hora — ajustes</b>
      <label className="flex flex-col gap-1">Início (h){num("inicio", 0, 23)}</label>
      <label className="flex flex-col gap-1">Fim (h){num("fim", 0, 23)}</label>
      <label className="flex flex-col gap-1">Linhas por horário{num("linhas", 1, 4)}</label>
      <label className="flex items-center gap-1"><input type="checkbox" checked={c.meiaHora} onChange={(e) => horarioCfg.set({ meiaHora: e.target.checked })} />Incluir meia hora</label>
      <label className="flex flex-col gap-1">Calendário
        <select value={c.calendario} onChange={(e) => horarioCfg.set({ calendario: e.target.value })} className="border rounded px-2 py-1">
          <option value="grande">Grande</option><option value="pequeno">Pequeno</option><option value="nenhum">Sem calendário</option>
        </select>
      </label>
    </div>
  );
}
