import { agendaAnualCfg, montarPaginasAnual, ESTILOS } from "../lib/configAgendaAnual";
import { devocionalCfg, montarPaginas, PALETAS, FONTES_TITULO } from "../lib/configDevocional";
import { horarioCfg } from "../lib/configHorario";
import { FORMATOS, LADOS, LADOS_WIRE, DICAS_LADOS, impressao } from "../lib/configImpressao";
import { TIPOS_PAUTA, partiturasCfg } from "../lib/configPartituras";
import OpcoesFonte from "./ui/OpcoesFonte";
import Faixa from "./ui/Faixa";
import { pautadoCfg, ESTILOS_PAUTA, CORES_PAUTA } from "../lib/configPautado";

// Escolha de quais lados imprimir (para quem não tem impressora frente e verso).
export function LadosImpressao({ compacto = false }) {
  const { lados, formato, compensar, wire, wireMm, wireLado, wireEspelhar } = impressao.useStore();
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
      {!f.livro && (
        <div className={`flex flex-wrap items-center gap-x-3 gap-y-1.5 ${compacto ? "" : "rounded-lg border border-[#D8CBA8] bg-[#FBF8F1] px-3 py-2"}`}>
          <label className="flex items-center gap-1.5 text-[11px] font-semibold text-[#24344D]">
            <input type="checkbox" checked={!!wire} onChange={(e) => impressao.set({ wire: e.target.checked })} />
            Margem para wire-o (espiral)
          </label>
          {wire && (
            <>
              <label className="flex items-center gap-1 text-[11px] text-[#24344D]">
                <input type="number" min={4} max={40} step={1} value={wireMm} onChange={(e) => impressao.set({ wireMm: Math.min(40, Math.max(0, Number(e.target.value) || 0)) })} aria-label="Largura da margem do wire-o em mm" className="w-14 rounded-md border border-[#D8CBA8] bg-white px-1.5 py-0.5 text-right text-xs font-semibold" /> mm
              </label>
              <select value={wireLado} onChange={(e) => impressao.set({ wireLado: e.target.value })} aria-label="Lado do wire-o" className={sel}>
                {LADOS_WIRE.map((l) => <option key={l.id} value={l.id}>{l.nome}</option>)}
              </select>
              {wireLado !== "topo" && (
                <label className="flex items-center gap-1.5 text-[11px] text-[#24344D]">
                  <input type="checkbox" checked={wireEspelhar !== false} onChange={(e) => impressao.set({ wireEspelhar: e.target.checked })} />
                  Inverter o lado no verso (frente e verso)
                </label>
              )}
            </>
          )}
        </div>
      )}
      {!compacto && wire && !f.livro && <p className="text-[11px] text-[#8B6A1F] max-w-md">Wire-o: a página é reduzida um pouco para deixar a faixa de {wireMm} mm livre para os furos. {wireLado === "topo" ? "Em cima: vire a folha pela borda de cima (como calendário)." : "Com “inverter o lado no verso”, a faixa fica no mesmo lado físico da folha nos dois lados (use virar pela borda LONGA)."}</p>}
      {!compacto && <p className="text-[11px] text-[#8B6A1F] max-w-md">{[f.dica, DICAS_LADOS[lados]].filter(Boolean).join(" ")}</p>}
    </div>
  );
}

// Caderno Pautado: espaçamento, estilo e cor das linhas.
export function PautadoOpcoes() {
  const c = pautadoCfg.useStore();
  const set = (o) => pautadoCfg.set(o);
  const sel = "border border-[#D8CBA8] rounded-lg px-2.5 py-2 text-xs bg-[#FBF8F1] font-medium text-[#24344D]";
  const chk = "flex items-center gap-2 text-xs text-[#24344D]";
  return (
    <div className="bg-[#FBF8F1] border border-[#D8CBA8] rounded-xl p-4 flex flex-col gap-3 print:hidden max-w-2xl">
      <div>
        <h3 className="text-sm font-bold text-[#24344D]">📏 Caderno pautado — só linhas</h3>
        <p className="text-[11px] text-[#8B6A1F]">Folhas com apenas as linhas de pauta. Ajuste o espaço entre elas, o estilo e a cor.</p>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {[[6, "Estreita 6 mm"], [7, "Caligrafia 7 mm"], [8, "Escolar 8 mm"], [10, "Larga 10 mm"], [12, "Extra larga 12 mm"]].map(([v, n]) => (
          <button key={v} type="button" onClick={() => set({ espac: v })} className={`px-2.5 py-1 rounded-full border text-[11px] font-semibold ${c.espac === v ? "bg-[#24344D] text-white border-[#24344D]" : "bg-white border-[#D8CBA8] text-[#24344D]"}`}>{n}</button>
        ))}
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <Faixa rotulo="Espaço entre as linhas" valor={c.espac} min={4} max={16} step={0.5} un="mm" onChange={(v) => set({ espac: v })} />
        <Faixa rotulo="Espessura da linha" valor={c.espessura} min={0.1} max={0.8} step={0.05} un="mm" onChange={(v) => set({ espessura: v })} />
        <Faixa rotulo="Folga antes da 1ª linha" valor={c.inicio} min={0} max={60} un="mm" onChange={(v) => set({ inicio: v })} />
        <Faixa rotulo="Número de folhas" valor={c.paginas} min={2} max={200} onChange={(v) => set({ paginas: Math.max(2, Math.min(200, Math.round(v))) })} />
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <select value={c.estilo} onChange={(e) => set({ estilo: e.target.value })} aria-label="Estilo da linha" className={sel}>
          {ESTILOS_PAUTA.map((x) => <option key={x.id} value={x.id}>{x.nome}</option>)}
        </select>
        <div className="flex items-center gap-1.5" role="radiogroup" aria-label="Cor da linha">
          {CORES_PAUTA.map((cor) => (
            <button key={cor} type="button" role="radio" aria-checked={c.cor === cor} aria-label={cor} onClick={() => set({ cor })} className={`w-6 h-6 rounded-full border ${c.cor === cor ? "ring-2 ring-[#8B1D2C]" : "border-[#D8CBA8]"}`} style={{ background: cor }} />
          ))}
          <input type="color" value={c.cor} onChange={(e) => set({ cor: e.target.value })} aria-label="Outra cor" className="w-7 h-7 p-0 border border-[#D8CBA8] rounded cursor-pointer bg-white" />
        </div>
      </div>
      <div className="flex flex-wrap gap-x-5 gap-y-1.5">
        <label className={chk}><input type="checkbox" checked={c.margemLinha} onChange={(e) => set({ margemLinha: e.target.checked })} />Linha de margem vertical</label>
        <label className={chk}><input type="checkbox" checked={c.cabecalho} onChange={(e) => set({ cabecalho: e.target.checked })} />Linhas de nome e data no topo</label>
        <label className={chk}><input type="checkbox" checked={c.numerar} onChange={(e) => set({ numerar: e.target.checked })} />Numerar as folhas</label>
      </div>
      {c.margemLinha && <Faixa rotulo="Posição da margem (da borda esquerda)" valor={c.margemX} min={8} max={60} un="mm" onChange={(v) => set({ margemX: v })} />}
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
      <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-[#24344D]">
        <label className="flex items-center gap-2"><input type="checkbox" checked={cfg.soLinhas} onChange={(e) => partiturasCfg.set({ soLinhas: e.target.checked })} />Só as linhas (sem claves, barras e notas)</label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={cfg.semCabecalho} onChange={(e) => partiturasCfg.set({ semCabecalho: e.target.checked })} />Sem cabeçalho</label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={cfg.notasDeco} onChange={(e) => partiturasCfg.set({ notasDeco: e.target.checked })} />Notas musicais decorativas</label>
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

export function DevocionalOpcoes() {
  const c = devocionalCfg.useStore();
  const total = montarPaginas(c).length;
  const num = (k, min, max, rotulo) => (
    <label className="flex flex-col gap-1">{rotulo}
      <input type="number" min={min} max={max} value={c[k]} onChange={(e) => devocionalCfg.set({ [k]: Math.max(min, Math.min(max, Number(e.target.value) || 0)) })} className="w-20 border rounded px-2 py-1 text-xs bg-white" />
    </label>
  );
  const chk = (k, rotulo) => (
    <label className="flex items-center gap-1"><input type="checkbox" checked={c[k]} onChange={(e) => devocionalCfg.set({ [k]: e.target.checked })} />{rotulo}</label>
  );
  return (
    <div className="bg-[#FBF8F1] border border-[#D8CBA8] rounded-xl p-4 flex flex-col gap-3 print:hidden text-xs text-[#24344D]">
      <div>
        <h3 className="text-sm font-bold">🙏 Diário Devocional — monte o seu</h3>
        <p className="text-[11px] text-[#8B6A1F]">
          {total} páginas no total{total % 4 === 0 ? ` = ${total / 4} folhas A4 (frente e verso) em A5, 2 por lado` : ""}. Para imprimir em A5, escolha o formato A5 (ou 2 por folha) acima.
        </p>
      </div>
      <div className="flex flex-wrap items-end gap-3">
        {num("ano", 2000, 2100, "Ano do calendário")}
        <label className="flex flex-col gap-1">Calendários
          <select value={c.anosCalendario} onChange={(e) => devocionalCfg.set({ anosCalendario: Number(e.target.value) })} className="border rounded px-2 py-1 bg-white">
            <option value={0}>Nenhum</option><option value={1}>Só o ano</option><option value={2}>Ano e o seguinte</option>
          </select>
        </label>
        <label className="flex flex-col gap-1">Cores
          <select value={c.paleta} onChange={(e) => devocionalCfg.set({ paleta: e.target.value })} className="border rounded px-2 py-1 bg-white">
            {Object.entries(PALETAS).map(([k, v]) => <option key={k} value={k}>{v.nome}</option>)}
          </select>
        </label>
        <label className="flex flex-col gap-1">Fonte dos títulos
          <select value={c.fonteTitulo} onChange={(e) => devocionalCfg.set({ fonteTitulo: e.target.value })} className="border rounded px-2 py-1 bg-white">
            <OpcoesFonte lista={FONTES_TITULO.map((f) => [f.v, f.n])} />
          </select>
        </label>
        <label className="flex flex-col gap-1">Bíblia
          <select value={c.tradicao} onChange={(e) => devocionalCfg.set({ tradicao: e.target.value })} className="border rounded px-2 py-1 bg-white">
            <option value="catolica">Católica (73 livros)</option><option value="protestante">Protestante (66 livros)</option>
          </select>
        </label>
      </div>
      <div className="flex flex-wrap items-end gap-3">
        {num("devocional", 0, 200, "Devocional diário")}
        {num("versiculos", 0, 60, "Versículos")}
        {num("gratidao", 0, 60, "Gratidão")}
        {num("jejum", 0, 60, "Jejum")}
        {num("oracao", 0, 60, "Pedidos de oração")}
        {num("anotacoesIni", 0, 20, "Anotações (início)")}
      </div>
      <div className="flex flex-wrap items-center gap-4">
        {chk("dadosPessoais", "Página de dados pessoais")}
        {chk("leitura", "Controle de leitura da Bíblia")}
        {chk("completar4", "Completar com anotações (múltiplo de 4 = caderno)")}
      </div>
      <div className="flex flex-wrap gap-3">
        <label className="flex flex-col gap-1 flex-1 min-w-48">Frase da capa
          <input value={c.frase} onChange={(e) => devocionalCfg.set({ frase: e.target.value })} className="border rounded px-2 py-1 bg-white" />
        </label>
      </div>
    </div>
  );
}

export function AgendaAnualOpcoes() {
  const c = agendaAnualCfg.useStore();
  const total = montarPaginasAnual(c).length;
  const sel = "border rounded px-2 py-1 bg-white";
  const num = (k, min, max, rotulo) => (
    <label className="flex flex-col gap-1">{rotulo}
      <input type="number" min={min} max={max} value={c[k]} onChange={(e) => agendaAnualCfg.set({ [k]: Math.max(min, Math.min(max, Number(e.target.value) || 0)) })} className="w-20 border rounded px-2 py-1 text-xs bg-white" />
    </label>
  );
  const chk = (k, rotulo) => (
    <label className="flex items-center gap-1"><input type="checkbox" checked={c[k]} onChange={(e) => agendaAnualCfg.set({ [k]: e.target.checked })} />{rotulo}</label>
  );
  const dia = c.estilo !== "planner";
  return (
    <div className="bg-[#FBF8F1] border border-[#D8CBA8] rounded-xl p-4 flex flex-col gap-3 print:hidden text-xs text-[#24344D]">
      <div>
        <h3 className="text-sm font-bold">📅 Agenda Anual Completa — {c.ano}</h3>
        <p className="text-[11px] text-[#8B6A1F]">{total} páginas. Dias da semana, semanas e feriados seguem o ano escolhido. Para A5, escolha o formato A5 acima.</p>
      </div>
      <div className="flex flex-wrap items-end gap-3">
        <label className="flex flex-col gap-1">Estilo
          <select value={c.estilo} className={sel} onChange={(e) => { const k = e.target.value; agendaAnualCfg.set({ estilo: k, cor: ESTILOS[k].cor, semanaComeca: ESTILOS[k].semana }); }}>
            {Object.entries(ESTILOS).map(([k, v]) => <option key={k} value={k}>{v.nome}</option>)}
          </select>
        </label>
        {num("ano", 2000, 2100, "Ano")}
        <label className="flex flex-col gap-1">Cor
          <input type="color" value={c.cor} onChange={(e) => agendaAnualCfg.set({ cor: e.target.value })} className="h-7 w-10 border rounded" />
        </label>
        <label className="flex flex-col gap-1">Fonte dos títulos
          <select value={c.fonteTitulo} onChange={(e) => agendaAnualCfg.set({ fonteTitulo: e.target.value })} className={sel}>
            <OpcoesFonte lista={FONTES_TITULO.map((f) => [f.v, f.n])} />
          </select>
        </label>
        <label className="flex flex-col gap-1">Semana começa
          <select value={c.semanaComeca} onChange={(e) => agendaAnualCfg.set({ semanaComeca: Number(e.target.value) })} className={sel}>
            <option value={0}>Domingo</option><option value={1}>Segunda</option>
          </select>
        </label>
        {dia && (
          <label className="flex flex-col gap-1">Dias por página
            <select value={c.diasPorPagina} onChange={(e) => agendaAnualCfg.set({ diasPorPagina: Number(e.target.value) })} className={sel}>
              <option value={1}>1 dia (1dpp)</option><option value={2}>2 dias (2dpp)</option>
            </select>
          </label>
        )}
        {dia && num("horaIni", 0, 12, "Hora inicial")}
        {dia && num("horaFim", 12, 23, "Hora final")}
      </div>
      <div className="flex flex-wrap items-end gap-6">
        <label className="flex flex-col gap-1 min-w-48">
          <span className="flex justify-between"><span>Tamanho das letras</span><b>{c.escalaTexto}%</b></span>
          <input type="range" min={70} max={160} step={5} value={c.escalaTexto} onChange={(e) => agendaAnualCfg.set({ escalaTexto: Number(e.target.value) })} />
        </label>
        <label className="flex flex-col gap-1 min-w-48">
          <span className="flex justify-between"><span>Tamanho dos calendários do ano</span><b>{c.escalaCal}%</b></span>
          <input type="range" min={80} max={130} step={5} value={c.escalaCal} onChange={(e) => agendaAnualCfg.set({ escalaCal: Number(e.target.value) })} />
        </label>
        <button type="button" onClick={() => agendaAnualCfg.set({ escalaTexto: 100, escalaCal: 115 })} className="text-xs text-[#8B6A1F] underline pb-1">↺ Restaurar</button>
      </div>
      <div className="flex flex-wrap items-center gap-4">
        {dia && chk("mesesContinuos", "Meses contínuos")}
        {dia && chk("anotacoesMes", "Anotações a cada mês")}
        {chk("dados", "Página de dados")}
        {chk("planejamentoAnual", "Planejamento anual")}
        {!dia && chk("extrasPlanner", "Páginas extras (roda da vida, logins…)")}
      </div>
      <div className="flex flex-wrap items-end gap-3">
        <label className="flex flex-col gap-1">Calendários
          <select value={c.calendarios} onChange={(e) => agendaAnualCfg.set({ calendarios: Number(e.target.value) })} className={sel}>
            <option value={0}>Nenhum</option><option value={1}>Só o ano</option><option value={2}>Ano e seguinte</option>
          </select>
        </label>
        {num("anotacoesIni", 0, 10, "Anotações (início)")}
        {num("anotacoesFim", 0, 10, "Anotações (fim)")}
        {c.estilo === "pop" && num("contatos", 0, 10, "Contatos")}
      </div>
    </div>
  );
}
