// Gerador de calendários: parede, pôster anual, mesa triangular, ímã/bolso e planner de mesa.
import { useMemo, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { MdDeleteOutline, MdPrint, MdUploadFile } from "react-icons/md";
import { calendarioCfg, dimensoes, encaixar, ESTILOS_GRADE, MODELOS_CAL, montarPaginasCal, PALETAS_CAL } from "../lib/calendario";
import { FONTES, PAPEIS } from "../lib/cartaoVisita";
import { MESES_PT } from "../lib/configAgendaAnual";
import { lerImagem } from "../lib/lerImagem";
import { Capa, Mini, MesParede, PainelMesa, PlannerMes, Poster } from "../components/calendario/CalPaginas";

const MM = 3.7795;
const entrada = "w-full rounded-lg border border-[#D8CBA8] bg-white px-2 py-1.5 text-sm";
const Campo = ({ rotulo, children }) => (<div className="flex flex-col gap-1 text-xs text-[#24344D]"><span className="font-semibold">{rotulo}</span>{children}</div>);
const Painel = ({ titulo, children }) => (<section className="bg-[#FBF8F1] border border-[#D8CBA8] rounded-2xl p-4 flex flex-col gap-3"><h2 className="font-bold text-[#24344D]">{titulo}</h2>{children}</section>);

const AJ0 = { modo: "preencher", zoom: 1, x: 0, y: 0 };
function Pagina({ pg, cfg, d, fotos, aj }) {
  const de = (...chaves) => { const k = chaves.find((c) => fotos[c]); return k === undefined ? null : { src: fotos[k], ...AJ0, ...(aj[k] || {}) }; };
  const foto = (i) => de(i, "unica");
  if (pg.tipo === "capa") return <Capa cfg={cfg} w={d.w} h={d.h} foto={de("capa", "unica", 0)} ano={cfg.ano} />;
  if (pg.tipo === "poster") return <Poster cfg={cfg} w={d.w} h={d.h} foto={de("unica", 0)} />;
  if (pg.tipo === "mini") return <Mini cfg={cfg} w={d.w} h={d.h} foto={de("unica", 0)} />;
  if (pg.tipo === "planner") return <PlannerMes ano={cfg.ano} mes={pg.mes} cfg={cfg} w={d.w} h={d.h} foto={foto(pg.mes)} />;
  if (cfg.modelo === "mesa") return <PainelMesa ano={cfg.ano} mes={pg.mes} cfg={cfg} w={d.w} h={d.h} foto={foto(pg.mes)} />;
  return <MesParede ano={cfg.ano} mes={pg.mes} cfg={cfg} w={d.w} h={d.h} foto={foto(pg.mes)} />;
}

export default function CalendarioPage() {
  const cfg = calendarioCfg.useStore();
  const set = (p) => calendarioCfg.set(p);
  const [fotos, setFotos] = useState({});
  const [aj, setAj] = useState({});
  const [ajKey, setAjKey] = useState("");
  const [sel, setSel] = useState(0);
  const inp = useRef(null);
  const alvo = useRef("unica");
  const [multi, setMulti] = useState(false);

  const mod = MODELOS_CAL[cfg.modelo];
  const d = useMemo(() => dimensoes(cfg), [cfg]);
  const agrupa = cfg.modelo === "mesa" || cfg.modelo === "mini";
  const paginas = useMemo(() => montarPaginasCal(cfg), [cfg]);
  // mesa: painéis n-up na folha; mini: n cópias por folha
  const [qtd, setQtd] = useState(1);
  const N = useMemo(() => (agrupa ? encaixar(cfg.papel, d.w, d.h, cfg.margem, cfg.espaco) : null), [agrupa, cfg.papel, cfg.margem, cfg.espaco, d]);
  const folhas = useMemo(() => {
    if (!agrupa) return paginas.map((p) => [p]);
    if (!N?.porFolha) return [];
    const itens = cfg.modelo === "mini" ? Array.from({ length: qtd }, () => paginas[0]) : paginas;
    const f = [];
    for (let i = 0; i < itens.length; i += N.porFolha) f.push(itens.slice(i, i + N.porFolha));
    return f;
  }, [agrupa, N, paginas, qtd, cfg.modelo]);
  const W = agrupa ? N?.W || 210 : d.w, H = agrupa ? N?.H || 297 : d.h;
  const fp = Math.min(sel, Math.max(folhas.length - 1, 0));

  const enviar = async (files, chave) => {
    for (const [k, f] of files.entries()) {
      try {
        const src = await lerImagem(f, 1800);
        setFotos((o) => ({ ...o, [chave === "meses" ? k : chave]: src }));
      } catch { toast.error(`Não foi possível ler ${f.name}`); }
    }
  };
  const abrir = (chave) => { alvo.current = chave; setMulti(chave === "meses"); setTimeout(() => inp.current?.click(), 0); };
  const imprimir = () => { if (!folhas.length) { toast.error("O calendário não cabe nessa folha."); return; } window.print(); };

  const renderFolha = (fl, i) => (
    <div key={i} className="cal-folha" style={{ position: "relative", width: `${W}mm`, height: `${H}mm`, background: "#fff", overflow: "hidden" }}>
      {agrupa
        ? fl.map((pg, k) => N.pos[k] && (
          <div key={k} style={{ position: "absolute", left: `${N.pos[k].x}mm`, top: `${N.pos[k].y}mm`, outline: cfg.marcas ? "0.1mm dashed #999" : "none" }}>
            <Pagina pg={pg} cfg={cfg} d={d} fotos={fotos} aj={aj} />
          </div>))
        : <Pagina pg={fl[0]} cfg={cfg} d={d} fotos={fotos} aj={aj} />}
    </div>
  );
  const escala = Math.min(1, 620 / (W * MM));
  const rotulo = (i) => { const p = folhas[i]?.[0]; return agrupa ? `Folha ${i + 1}` : p?.tipo === "capa" ? "Capa" : p?.mes != null ? MESES_PT[p.mes] : "Folha 1"; };

  return (
    <div className="cal-raiz mx-auto max-w-7xl px-4 py-6">
      <style>{`
        .cal-print { display: none; }
        @media print {
          @page { size: ${W}mm ${H}mm; margin: 0; }
          html, body { width: ${W}mm !important; height: auto !important; }
          .cal-raiz { padding: 0 !important; margin: 0 !important; max-width: none !important; }
          .cal-tela { display: none !important; }
          .cal-print { display: block !important; }
          .cal-print .cal-folha { break-after: page; page-break-after: always; }
          .cal-print .cal-folha:last-child { break-after: auto; page-break-after: auto; }
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        }
      `}</style>
      <input ref={inp} type="file" accept="image/*" multiple={multi} hidden onChange={(e) => { enviar([...e.target.files], alvo.current); e.target.value = ""; }} />

      <div className="cal-tela grid gap-5 lg:grid-cols-[380px_minmax(0,1fr)]">
        <div className="flex flex-col gap-4 min-w-0">
          <Painel titulo="📅 Modelo de calendário">
            <div className="flex flex-col gap-2">
              {Object.entries(MODELOS_CAL).map(([k, m]) => (
                <button key={k} type="button" onClick={() => { set({ modelo: k, tam: m.tam }); setSel(0); }} className={`text-left rounded-xl border p-2.5 ${cfg.modelo === k ? "border-[#8B1D2C] bg-white ring-1 ring-[#8B1D2C]" : "border-[#D8CBA8] bg-white"}`}>
                  <div className="text-sm font-bold text-[#24344D]">{m.nome}</div><div className="text-[11px] text-[#8B6A1F]">{m.desc}</div>
                </button>))}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Campo rotulo="Ano"><input type="number" min={1900} max={2200} className={entrada} value={cfg.ano} onChange={(e) => set({ ano: Math.min(2200, Math.max(1900, Number(e.target.value) || cfg.ano)) })} /></Campo>
              <Campo rotulo="Semana começa em"><select className={entrada} value={cfg.semanaComeca} onChange={(e) => set({ semanaComeca: Number(e.target.value) })}><option value={0}>Domingo</option><option value={1}>Segunda</option></select></Campo>
              <Campo rotulo="Tamanho"><select className={entrada} value={cfg.tam} onChange={(e) => set({ tam: e.target.value })}>{Object.entries(mod.tamanhos).map(([k, v]) => <option key={k} value={k}>{v[0]}</option>)}</select></Campo>
              {["parede", "poster"].includes(cfg.modelo) && <Campo rotulo="Posição"><select className={entrada} value={cfg.orientacao} onChange={(e) => set({ orientacao: e.target.value })}><option value="retrato">Em pé</option><option value="paisagem">Deitado</option></select></Campo>}
            </div>
          </Painel>

          <Painel titulo="🎨 Estilo">
            <div className="flex flex-wrap gap-2">{PALETAS_CAL.map((p) => <button key={p.cor} type="button" title={p.nome} aria-label={p.nome} onClick={() => set({ cor: p.cor })} style={{ background: p.cor }} className={`w-8 h-8 rounded-full border-2 ${cfg.cor === p.cor ? "border-[#24344D]" : "border-white"} shadow`} />)}
              <input type="color" value={cfg.cor} onChange={(e) => set({ cor: e.target.value })} className="w-8 h-8 rounded-full" aria-label="Cor personalizada" /></div>
            <div className="grid grid-cols-2 gap-3">
              <Campo rotulo="Grade"><select className={entrada} value={cfg.estilo} onChange={(e) => set({ estilo: e.target.value })}>{Object.entries(ESTILOS_GRADE).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></Campo>
              <Campo rotulo="Fonte do título"><select className={entrada} value={cfg.fonteTitulo} onChange={(e) => set({ fonteTitulo: e.target.value })}>{FONTES.map(([v, n]) => <option key={v} value={v}>{n}</option>)}</select></Campo>
              <Campo rotulo="Título"><input className={entrada} value={cfg.titulo} onChange={(e) => set({ titulo: e.target.value })} /></Campo>
              <Campo rotulo="Subtítulo (capa)"><input className={entrada} value={cfg.subtitulo} onChange={(e) => set({ subtitulo: e.target.value })} /></Campo>
              <Campo rotulo={`Área da foto: ${cfg.fotoPct}%`}><input type="range" min={0} max={70} value={cfg.fotoPct} onChange={(e) => set({ fotoPct: Number(e.target.value) })} /></Campo>
            </div>
            <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs">
              {cfg.modelo === "parede" || cfg.modelo === "planner" ? <label className="flex gap-2 items-center"><input type="checkbox" checked={cfg.capa} onChange={(e) => set({ capa: e.target.checked })} />Capa</label> : null}
              {cfg.modelo === "parede" && <label className="flex gap-2 items-center"><input type="checkbox" checked={cfg.listaFeriados} onChange={(e) => set({ listaFeriados: e.target.checked })} />Lista de feriados</label>}
              {cfg.modelo === "parede" && <label className="flex gap-2 items-center"><input type="checkbox" checked={cfg.notas} onChange={(e) => set({ notas: e.target.checked })} />Notas</label>}
              <label className="flex gap-2 items-center"><input type="checkbox" checked={cfg.nomesNaGrade} onChange={(e) => set({ nomesNaGrade: e.target.checked })} />Nome dos feriados na grade</label>
              <label className="flex gap-2 items-center"><input type="checkbox" checked={cfg.semanaNumero} onChange={(e) => set({ semanaNumero: e.target.checked })} />Nº da semana</label>
            </div>
          </Painel>

          <Painel titulo="🖼️ Imagens">
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => abrir("unica")} className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-[#24344D] text-white text-xs font-semibold"><MdUploadFile size={16} /> Uma imagem para tudo</button>
              {["parede", "mesa", "planner"].includes(cfg.modelo) && <button type="button" onClick={() => abrir("meses")} className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-[#24344D] text-white text-xs font-semibold"><MdUploadFile size={16} /> Uma por mês (selecione até 12)</button>}
              {cfg.capa && cfg.modelo === "parede" && <button type="button" onClick={() => abrir("capa")} className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-[#24344D] text-white text-xs font-semibold"><MdUploadFile size={16} /> Capa</button>}
              {Object.keys(fotos).length > 0 && <button type="button" onClick={() => { setFotos({}); setAj({}); }} className="inline-flex items-center gap-1 px-3 py-2 rounded-xl border border-[#D8CBA8] text-xs"><MdDeleteOutline size={16} /> Limpar</button>}
            </div>
            {Object.keys(fotos).length > 0 && (() => {
              const k = fotos[ajKey] ? ajKey : Object.keys(fotos)[0];
              const a = { ...AJ0, ...(aj[k] || {}) };
              const mudar = (p) => setAj((o) => ({ ...o, [k]: { ...AJ0, ...(o[k] || {}), ...p } }));
              const nome = (c) => (c === "unica" ? "Imagem única" : c === "capa" ? "Capa" : MESES_PT[c] || c);
              return (
                <div className="flex flex-col gap-2 border border-[#E8DFC8] rounded-xl bg-white p-2.5 text-xs text-[#24344D]">
                  <b>Ajustar enquadramento da foto</b>
                  <select className={entrada} value={k} onChange={(e) => setAjKey(e.target.value)}>{Object.keys(fotos).map((c) => <option key={c} value={c}>{nome(c)}</option>)}</select>
                  <select className={entrada} value={a.modo} onChange={(e) => mudar({ modo: e.target.value })}><option value="preencher">Preencher (corta o excesso)</option><option value="inteira">Imagem inteira (sem cortar)</option></select>
                  <label className="grid grid-cols-[52px_1fr] items-center gap-1">Zoom<input type="range" min={1} max={3} step={0.02} value={a.zoom} onChange={(e) => mudar({ zoom: Number(e.target.value) })} /></label>
                  <label className="grid grid-cols-[52px_1fr] items-center gap-1">Horiz.<input type="range" min={-100} max={100} value={a.x} onChange={(e) => mudar({ x: Number(e.target.value) })} /></label>
                  <label className="grid grid-cols-[52px_1fr] items-center gap-1">Vert.<input type="range" min={-100} max={100} value={a.y} onChange={(e) => mudar({ y: Number(e.target.value) })} /></label>
                  <button type="button" className="self-start underline font-semibold" onClick={() => setAj(Object.fromEntries(Object.keys(fotos).map((c) => [c, a])))}>Aplicar a todas as fotos</button>
                </div>
              );
            })()}
            <p className="text-[11px] text-[#8B6A1F]">Sem imagem, a arte usa degradê com a cor escolhida. Os meses seguem a ordem dos arquivos selecionados (janeiro → dezembro).</p>
          </Painel>
        </div>

        <div className="flex flex-col gap-4 min-w-0">
          {agrupa && (
            <Painel titulo="🧩 Folha de impressão">
              <div className="grid gap-3 sm:grid-cols-3">
                <Campo rotulo="Papel"><select className={entrada} value={cfg.papel} onChange={(e) => set({ papel: e.target.value })}>{Object.entries(PAPEIS).map(([k, v]) => <option key={k} value={k}>{v.nome}</option>)}</select></Campo>
                <Campo rotulo="Margem (mm)"><input type="number" min={0} className={entrada} value={cfg.margem} onChange={(e) => set({ margem: Math.max(0, Number(e.target.value) || 0) })} /></Campo>
                <Campo rotulo="Espaço (mm)"><input type="number" min={0} className={entrada} value={cfg.espaco} onChange={(e) => set({ espaco: Math.max(0, Number(e.target.value) || 0) })} /></Campo>
                {cfg.modelo === "mini" && <Campo rotulo="Quantidade de calendários"><input type="number" min={1} max={5000} className={entrada} value={qtd} onChange={(e) => setQtd(Math.max(1, Number(e.target.value) || 1))} /></Campo>}
                <label className="flex gap-2 items-center text-xs mt-5"><input type="checkbox" checked={cfg.marcas} onChange={(e) => set({ marcas: e.target.checked })} />Guias de corte</label>
              </div>
              <div className="text-xs text-[#24344D]">{N?.porFolha ? <><b>{N.porFolha} por folha</b> ({N.cols} × {N.rows}) → <b>{folhas.length}</b> {folhas.length === 1 ? "folha" : "folhas"}. {cfg.modelo === "mesa" && "Dobre cada painel ao meio/em prisma conforme o suporte."}</> : <span className="text-red-700">Não cabe nessa folha.</span>}</div>
            </Painel>
          )}
          <button type="button" onClick={imprimir} className="self-start inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#8B1D2C] text-white font-bold hover:opacity-90"><MdPrint size={20} /> Imprimir / salvar em PDF ({folhas.length} {folhas.length === 1 ? "página" : "páginas"})</button>
          <Painel titulo="👀 Pré-visualização">
            {folhas.length > 0 ? (
              <>
                <select className="self-start rounded-lg border border-[#D8CBA8] bg-white px-2 py-1 text-xs" value={fp} onChange={(e) => setSel(Number(e.target.value))}>
                  {folhas.map((_, i) => <option key={i} value={i}>{rotulo(i)} ({i + 1}/{folhas.length})</option>)}
                </select>
                <div className="overflow-auto rounded-lg bg-[#ddd] p-3"><div style={{ zoom: escala, width: "fit-content", boxShadow: "0 4px 16px #0004" }}>{renderFolha(folhas[fp], fp)}</div></div>
              </>
            ) : <p className="text-sm text-red-700">Nada a mostrar.</p>}
          </Painel>
        </div>
      </div>
      <div className="cal-print">{folhas.map((f, i) => renderFolha(f, i))}</div>
    </div>
  );
}
