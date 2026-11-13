// Gerador de calendários: parede, pôster anual, mesa triangular, ímã/bolso e planner de mesa.
import { useMemo, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { MdDeleteOutline, MdPrint, MdUploadFile } from "react-icons/md";
import { calendarioCfg, dimensoes, encaixar, ESTILOS_GRADE, MODELOS_CAL, montarPaginasCal, PALETAS_CAL } from "../lib/calendario";
import { FONTES, PAPEIS } from "../lib/cartaoVisita";
import { MESES_PT } from "../lib/configAgendaAnual";
import { lerImagem } from "../lib/lerImagem";
import BotaoPadrao from "../components/BotaoPadrao";
import { CabecalhoIma, Capa, Foto, MesParede, PainelMesa, PlannerMes, Poster } from "../components/calendario/CalPaginas";

const MM = 3.7795;
const entrada = "w-full rounded-lg border border-[#D8CBA8] bg-white px-2 py-1.5 text-sm";
const Campo = ({ rotulo, children }) => (<div className="flex flex-col gap-1 text-xs text-[#24344D]"><span className="font-semibold">{rotulo}</span>{children}</div>);
const Painel = ({ titulo, children, cls = "" }) => (<section className={`bg-[#FBF8F1] border border-[#D8CBA8] rounded-2xl p-4 flex flex-col gap-3 ${cls}`}><h2 className="font-bold text-[#24344D]">{titulo}</h2>{children}</section>);

const opPadrao = (cfg) => (cfg.modelo === "cabecalho" ? 100 : ((cfg.modelo === "poster" && (cfg.posterFundo || cfg.fotoPct === 0)) || (cfg.modelo !== "poster" && cfg.imagemFundo) ? 35 : 100));
const AJ0 = { modo: "inteira", zoom: 1, x: 0, y: 0, op: 100 };
// cor do canto da imagem: serve de fundo quando a imagem é reduzida (zoom < 1)
function corDoCanto(src) {
  return new Promise((ok) => {
    const im = new Image();
    im.onload = () => { try { const c = document.createElement("canvas"); c.width = c.height = 4; const x = c.getContext("2d"); x.drawImage(im, 0, 0, 4, 4); const [r, g, b, a] = x.getImageData(0, 0, 1, 1).data; ok(a < 40 ? "" : `rgb(${r},${g},${b})`); } catch { ok(""); } };
    im.onerror = () => ok("");
    im.src = src;
  });
}

function Pagina({ pg, cfg: cfg0, d, fotos, aj }) {
  const de = (...chaves) => { const k = chaves.find((c) => fotos[c]); return k === undefined ? null : { src: fotos[k], bg: fotos.__bg?.[k], ...AJ0, op: opPadrao(cfg0), ...(aj[k] || {}) }; };
  // "imagem ao fundo" nos modelos que não são o pôster: a foto cobre a folha e as áreas de foto somem
  const fundoFoto = cfg0.modelo !== "poster" && cfg0.imagemFundo && pg.tipo !== "capa" && pg.tipo !== "cabecalho" ? de(pg.mes, "unica") : null;
  const cfg = fundoFoto ? { ...cfg0, corPagina: "transparent", fotoPct: 0, semFotoArea: true } : cfg0;
  const foto = (i) => (fundoFoto ? null : de(i, "unica"));
  let pagina;
  if (pg.tipo === "capa") pagina = <Capa cfg={cfg} w={d.w} h={d.h} foto={de("capa", "unica", 0)} ano={cfg.ano} />;
  else if (pg.tipo === "poster") pagina = <Poster cfg={cfg} w={d.w} h={d.h} foto={de("unica", 0)} />;
  else if (pg.tipo === "cabecalho") pagina = <CabecalhoIma cfg={cfg} w={d.w} h={d.h} foto={de("unica", 0)} />;
  else if (pg.tipo === "planner") pagina = <PlannerMes ano={cfg.ano} mes={pg.mes} cfg={cfg} w={d.w} h={d.h} foto={foto(pg.mes)} />;
  else if (cfg.modelo === "mesa") pagina = <PainelMesa ano={cfg.ano} mes={pg.mes} cfg={cfg} w={d.w} h={d.h} foto={foto(pg.mes)} />;
  else pagina = <MesParede ano={cfg.ano} mes={pg.mes} cfg={cfg} w={d.w} h={d.h} foto={foto(pg.mes)} />;
  if (!fundoFoto) return pagina;
  return (
    <div style={{ position: "relative", width: `${d.w}mm`, height: `${d.h}mm`, background: cfg0.corPagina || "#fff", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0 }}><Foto foto={fundoFoto} cfg={{ ...cfg0, semFotoArea: false }} w={d.w} h={d.h} /></div>
      <div style={{ position: "relative" }}>{pagina}</div>
    </div>
  );
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
  const copias = cfg.modelo === "cabecalho";
  const agrupa = cfg.modelo === "mesa" || copias;
  const paginas = useMemo(() => montarPaginasCal(cfg), [cfg]);
  // mesa: painéis n-up na folha; cabeçalho: n cópias por folha
  const [qtd, setQtd] = useState(1);
  const N = useMemo(() => (agrupa ? encaixar(cfg.papel, d.w, d.h, cfg.margem, cfg.espaco) : null), [agrupa, cfg.papel, cfg.margem, cfg.espaco, d]);
  const folhas = useMemo(() => {
    if (!agrupa) return paginas.map((p) => [p]);
    if (!N?.porFolha) return [];
    const itens = copias ? Array.from({ length: qtd }, () => paginas[0]) : paginas;
    const f = [];
    for (let i = 0; i < itens.length; i += N.porFolha) f.push(itens.slice(i, i + N.porFolha));
    return f;
  }, [agrupa, N, paginas, qtd, copias]);
  const W = agrupa ? N?.W || 210 : d.w, H = agrupa ? N?.H || 297 : d.h;
  const fp = Math.min(sel, Math.max(folhas.length - 1, 0));

  const enviar = async (files, chave) => {
    for (const [k, f] of files.entries()) {
      try {
        const src = await lerImagem(f, 1800);
        const kk = chave === "meses" ? k : chave;
        const bg = await corDoCanto(src);
        setFotos((o) => ({ ...o, [kk]: src, __bg: { ...(o.__bg || {}), [kk]: bg } }));
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
          <BotaoPadrao onClick={() => { calendarioCfg.resetar(["persW", "persH", "fotoPct", "escala", "margemInt", "deslocX", "deslocY", "anoPos", "papel", "margem", "espaco", "marcas", "orientacao", "cabAltPct"]); set({ tam: mod.tam }); setAj({}); toast.success("Medidas padrão restauradas"); }} />
          <Painel titulo="📅 Modelo de calendário">
            <div className="flex flex-col gap-2">
              {Object.entries(MODELOS_CAL).map(([k, m]) => (
                <button key={k} type="button" onClick={() => { set({ modelo: k, tam: m.tam }); setSel(0); }} className={`text-left rounded-xl border p-2.5 ${cfg.modelo === k ? "border-[#8B1D2C] bg-white ring-1 ring-[#8B1D2C]" : "border-[#D8CBA8] bg-white"}`}>
                  <div className="text-sm font-bold text-[#24344D]">{m.nome}</div><div className="text-[11px] text-[#8B6A1F]">{m.desc}</div>
                </button>))}
            </div>
            <div className="grid grid-cols-2 gap-3">
              {cfg.modelo !== "cabecalho" && <Campo rotulo="Ano"><input type="number" min={1900} max={2200} className={entrada} value={cfg.ano} onChange={(e) => set({ ano: Math.min(2200, Math.max(1900, Number(e.target.value) || cfg.ano)) })} /></Campo>}
              {cfg.modelo !== "cabecalho" && <Campo rotulo="Semana começa em"><select className={entrada} value={cfg.semanaComeca} onChange={(e) => set({ semanaComeca: Number(e.target.value) })}><option value={0}>Domingo</option><option value={1}>Segunda</option></select></Campo>}
              <Campo rotulo="Tamanho"><select className={entrada} value={cfg.tam} onChange={(e) => set({ tam: e.target.value })}>{Object.entries(mod.tamanhos).map(([k, v]) => <option key={k} value={k}>{v[0]}</option>)}</select></Campo>
              {cfg.tam === "pers" && (copias) && <><Campo rotulo="Largura (mm)"><input type="number" min={20} max={400} className={entrada} value={cfg.persW} onChange={(e) => set({ persW: Number(e.target.value) || 20 })} /></Campo><Campo rotulo="Altura (mm)"><input type="number" min={20} max={400} className={entrada} value={cfg.persH} onChange={(e) => set({ persH: Number(e.target.value) || 20 })} /></Campo></>}
              {["parede", "poster"].includes(cfg.modelo) && <Campo rotulo="Posição"><select className={entrada} value={cfg.orientacao} onChange={(e) => set({ orientacao: e.target.value })}><option value="retrato">Em pé</option><option value="paisagem">Deitado</option></select></Campo>}
            </div>
          </Painel>

          {cfg.modelo === "cabecalho" && (
            <Painel titulo="🧲 Cabeçalho do ímã">
              <div className="grid grid-cols-2 gap-3">
                <Campo rotulo="Nome do negócio"><input className={entrada} value={cfg.cabNome} onChange={(e) => set({ cabNome: e.target.value })} /></Campo>
                <Campo rotulo="Linha (ex.: DELIVERY)"><input className={entrada} value={cfg.cabLinha} onChange={(e) => set({ cabLinha: e.target.value })} /></Campo>
                <Campo rotulo="Telefone / WhatsApp"><input className={entrada} value={cfg.cabFone} onChange={(e) => set({ cabFone: e.target.value })} /></Campo>
                <Campo rotulo="Fonte do nome"><select className={entrada} value={cfg.fonteTitulo} onChange={(e) => set({ fonteTitulo: e.target.value })}>{FONTES.map(([v, n]) => <option key={v} value={v}>{n}</option>)}</select></Campo>
                <Campo rotulo={`Altura do cabeçalho: ${cfg.cabAltPct}%`}><input type="range" min={30} max={90} value={cfg.cabAltPct} onChange={(e) => set({ cabAltPct: Number(e.target.value) })} /></Campo>
                <label className="flex gap-2 items-center text-xs mt-5"><input type="checkbox" checked={cfg.cabZap} onChange={(e) => set({ cabZap: e.target.checked })} />Ícone de WhatsApp</label>
              </div>
              <Campo rotulo="Cor do cabeçalho">
                <div className="flex flex-wrap gap-2">{PALETAS_CAL.map((p) => <button key={p.cor} type="button" title={p.nome} aria-label={p.nome} onClick={() => set({ corCab: p.cor })} style={{ background: p.cor }} className={`w-7 h-7 rounded-full border-2 ${cfg.corCab === p.cor ? "border-[#24344D]" : "border-white"} shadow`} />)}
                  <input type="color" value={cfg.corCab} onChange={(e) => set({ corCab: e.target.value })} className="w-7 h-7 rounded-full" aria-label="Cor personalizada do cabeçalho" /></div>
              </Campo>
              <div className="grid grid-cols-3 gap-3">
                <Campo rotulo="Textos"><input type="color" className="h-8 w-full" value={cfg.corCabTxt} onChange={(e) => set({ corCabTxt: e.target.value })} /></Campo>
                <Campo rotulo="Linha de detalhe"><input type="color" className="h-8 w-full" value={cfg.corDetalhe || "#d6213a"} onChange={(e) => set({ corDetalhe: e.target.value })} /></Campo>
                <Campo rotulo="Fundo (área do calendário)"><input type="color" className="h-8 w-full" value={cfg.corAreaCal} onChange={(e) => set({ corAreaCal: e.target.value })} /></Campo>
              </div>
              <label className="flex gap-2 items-center text-xs"><input type="checkbox" checked={cfg.guiaCal} onChange={(e) => set({ guiaCal: e.target.checked })} />Mostrar guia “cole o calendário aqui” (não sai na impressão)</label>
            </Painel>
          )}
          {cfg.modelo !== "cabecalho" && <Painel titulo="🎨 Estilo">
            <div className="flex flex-wrap gap-2">{PALETAS_CAL.map((p) => <button key={p.cor} type="button" title={p.nome} aria-label={p.nome} onClick={() => set({ cor: p.cor })} style={{ background: p.cor }} className={`w-8 h-8 rounded-full border-2 ${cfg.cor === p.cor ? "border-[#24344D]" : "border-white"} shadow`} />)}
              <input type="color" value={cfg.cor} onChange={(e) => set({ cor: e.target.value })} className="w-8 h-8 rounded-full" aria-label="Cor personalizada" /></div>
            <div className="grid grid-cols-2 gap-3">
              <Campo rotulo="Grade"><select className={entrada} value={cfg.estilo} onChange={(e) => set({ estilo: e.target.value })}>{Object.entries(ESTILOS_GRADE).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></Campo>
              <Campo rotulo="Fonte do título"><select className={entrada} value={cfg.fonteTitulo} onChange={(e) => set({ fonteTitulo: e.target.value })}>{FONTES.map(([v, n]) => <option key={v} value={v}>{n}</option>)}</select></Campo>
              <Campo rotulo="Título"><input className={entrada} value={cfg.titulo} onChange={(e) => set({ titulo: e.target.value })} /></Campo>
              <Campo rotulo="Subtítulo (capa)"><input className={entrada} value={cfg.subtitulo} onChange={(e) => set({ subtitulo: e.target.value })} /></Campo>
              <Campo rotulo={`Tamanho do texto: ${Math.round((cfg.escala ?? 1) * 100)}%`}><input type="range" min={60} max={140} value={Math.round((cfg.escala ?? 1) * 100)} onChange={(e) => set({ escala: Number(e.target.value) / 100 })} /></Campo>
              <Campo rotulo={`Margem interna: ${Math.round((cfg.margemInt ?? 1) * 100)}%`}><input type="range" min={30} max={200} value={Math.round((cfg.margemInt ?? 1) * 100)} onChange={(e) => set({ margemInt: Number(e.target.value) / 100 })} /></Campo>
              <Campo rotulo={`Mover calendário ↔: ${cfg.deslocX ?? 0} mm`}><input type="range" min={-30} max={30} value={cfg.deslocX ?? 0} onChange={(e) => set({ deslocX: Number(e.target.value) })} /></Campo>
              <Campo rotulo={`Mover calendário ↕: ${cfg.deslocY ?? 0} mm`}><input type="range" min={-30} max={30} value={cfg.deslocY ?? 0} onChange={(e) => set({ deslocY: Number(e.target.value) })} /></Campo>
              <Campo rotulo="Cor dos títulos (mês / ano)"><div className="flex gap-2 items-center"><input type="color" className="h-8 w-14" value={cfg.corTitulo || cfg.cor} onChange={(e) => set({ corTitulo: e.target.value })} /><button type="button" className="text-[11px] underline" onClick={() => set({ corTitulo: "" })}>usar destaque</button></div></Campo>
              <Campo rotulo="Cor dos números e textos"><input type="color" className="h-8 w-14" value={cfg.corTexto || "#2f3140"} onChange={(e) => set({ corTexto: e.target.value })} /></Campo>
              <Campo rotulo="Cor dos feriados"><input type="color" className="h-8 w-14" value={cfg.corFeriado || "#d6455d"} onChange={(e) => set({ corFeriado: e.target.value })} /></Campo>
              <Campo rotulo="Cor de fundo da página"><div className="flex gap-2 items-center"><input type="color" className="h-8 w-14" value={cfg.corPagina || "#ffffff"} onChange={(e) => set({ corPagina: e.target.value })} /><button type="button" className="text-[11px] underline" onClick={() => set({ corPagina: "" })}>branco</button></div></Campo>
              <Campo rotulo="Onde mostrar o ano"><select className={entrada} value={cfg.anoPos ?? "auto"} onChange={(e) => set({ anoPos: e.target.value })}><option value="auto">Automático (sempre visível)</option><option value="titulo">Ao lado do mês</option><option value="foto">Sobre a foto</option><option value="oculto">Ocultar</option></select></Campo>
              <Campo rotulo={`Área da foto: ${cfg.fotoPct}%`}><input type="range" min={0} max={70} value={cfg.fotoPct} onChange={(e) => set({ fotoPct: Number(e.target.value) })} /></Campo>
            </div>
            <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs">
              {cfg.modelo === "poster" ? <label className="flex gap-2 items-center"><input type="checkbox" checked={!!cfg.posterFundo || cfg.fotoPct === 0} onChange={(e) => (e.target.checked ? set({ posterFundo: true }) : set({ posterFundo: false, fotoPct: cfg.fotoPct || 30 }))} />Imagem ao fundo da folha inteira{cfg.posterFundo && !Object.keys(fotos).filter((c) => c !== "__bg").length ? " — envie uma imagem abaixo" : ""}</label> : <label className="flex gap-2 items-center"><input type="checkbox" checked={!!cfg.imagemFundo} onChange={(e) => set({ imagemFundo: e.target.checked })} />Imagem ao fundo da folha inteira{cfg.imagemFundo && !Object.keys(fotos).filter((c) => c !== "__bg").length ? " — envie uma imagem abaixo" : ""}</label>}
              {cfg.modelo === "parede" || cfg.modelo === "planner" ? <label className="flex gap-2 items-center"><input type="checkbox" checked={cfg.capa} onChange={(e) => set({ capa: e.target.checked })} />Capa</label> : null}
              {["parede", "poster", "mesa", "planner"].includes(cfg.modelo) && <label className="flex gap-2 items-center"><input type="checkbox" checked={cfg.listaFeriados} onChange={(e) => set({ listaFeriados: e.target.checked })} />Lista de feriados</label>}
              {cfg.modelo === "parede" && <label className="flex gap-2 items-center"><input type="checkbox" checked={cfg.notas} onChange={(e) => set({ notas: e.target.checked })} />Notas</label>}
              {["parede", "planner"].includes(cfg.modelo) && <label className="flex gap-2 items-center"><input type="checkbox" checked={cfg.nomesNaGrade} onChange={(e) => set({ nomesNaGrade: e.target.checked })} />Nome dos feriados na grade</label>}
              <label className="flex gap-2 items-center"><input type="checkbox" checked={cfg.semanaNumero} onChange={(e) => set({ semanaNumero: e.target.checked })} />Nº da semana</label>
            </div>
          </Painel>}

          <Painel titulo="🖼️ Imagens">
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => abrir("unica")} className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-[#24344D] text-white text-xs font-semibold"><MdUploadFile size={16} /> Uma imagem para tudo</button>
              {["parede", "mesa", "planner"].includes(cfg.modelo) && <button type="button" onClick={() => abrir("meses")} className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-[#24344D] text-white text-xs font-semibold"><MdUploadFile size={16} /> Uma por mês (selecione até 12)</button>}
              {cfg.capa && cfg.modelo === "parede" && <button type="button" onClick={() => abrir("capa")} className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-[#24344D] text-white text-xs font-semibold"><MdUploadFile size={16} /> Capa</button>}
              {Object.keys(fotos).filter((c) => c !== "__bg").length > 0 && <button type="button" onClick={() => { setFotos({}); setAj({}); }} className="inline-flex items-center gap-1 px-3 py-2 rounded-xl border border-[#D8CBA8] text-xs"><MdDeleteOutline size={16} /> Limpar</button>}
            </div>
            {Object.keys(fotos).filter((c) => c !== "__bg").length > 0 && (() => {
              const k = fotos[ajKey] ? ajKey : Object.keys(fotos).filter((c) => c !== "__bg")[0];
              const a = { ...AJ0, op: opPadrao(cfg), ...(aj[k] || {}) };
              const mudar = (p) => setAj((o) => ({ ...o, [k]: { ...AJ0, op: opPadrao(cfg), ...(o[k] || {}), ...p } }));
              const nome = (c) => (c === "unica" ? "Imagem única" : c === "capa" ? "Capa" : MESES_PT[c] || c);
              return (
                <div className="flex flex-col gap-2 border border-[#E8DFC8] rounded-xl bg-white p-2.5 text-xs text-[#24344D]">
                  <b>Ajustar enquadramento da foto</b>
                  <select className={entrada} value={k} onChange={(e) => setAjKey(e.target.value)}>{Object.keys(fotos).filter((c) => c !== "__bg").map((c) => <option key={c} value={c}>{nome(c)}</option>)}</select>
                  <select className={entrada} value={a.modo} onChange={(e) => mudar({ modo: e.target.value })}><option value="inteira">Automático — cabe inteira (recomendado)</option><option value="preencher">Preencher (corta o excesso)</option></select>
                  <label className="grid grid-cols-[52px_1fr] items-center gap-1">Opac. {a.op}%<input type="range" min={5} max={100} value={a.op} onChange={(e) => mudar({ op: Number(e.target.value) })} /></label>
                  <label className="grid grid-cols-[52px_1fr] items-center gap-1">Zoom {Math.round(a.zoom * 100)}%<input type="range" min={0.2} max={3} step={0.02} value={a.zoom} onChange={(e) => mudar({ zoom: Number(e.target.value) })} /></label>
                  <label className="grid grid-cols-[52px_1fr] items-center gap-1">Fundo<span className="flex gap-2 items-center"><input type="color" className="h-7 w-12" value={/^#/.test(a.bg || "") ? a.bg : "#000000"} onChange={(e) => mudar({ bg: e.target.value })} /><button type="button" className="underline" onClick={() => mudar({ bg: fotos.__bg?.[k] || "" })}>cor da imagem</button></span></label>
                  <label className="grid grid-cols-[52px_1fr] items-center gap-1">Horiz.<input type="range" min={-100} max={100} value={a.x} onChange={(e) => mudar({ x: Number(e.target.value) })} /></label>
                  <label className="grid grid-cols-[52px_1fr] items-center gap-1">Vert.<input type="range" min={-100} max={100} value={a.y} onChange={(e) => mudar({ y: Number(e.target.value) })} /></label>
                  <button type="button" className="self-start underline font-semibold" onClick={() => mudar({ ...AJ0, op: opPadrao(cfg) })}>↺ Restaurar enquadramento</button>
                  <button type="button" className="self-start underline font-semibold" onClick={() => setAj(Object.fromEntries(Object.keys(fotos).filter((c) => c !== "__bg").map((c) => [c, a])))}>Aplicar a todas as fotos</button>
                </div>
              );
            })()}
            <p className="text-[11px] text-[#8B6A1F]">{cfg.modelo === "cabecalho" ? "Envie o logo: ele aparece inteiro na faixa do meio do cabeçalho (use zoom para ajustar)." : "Sem imagem, a arte usa degradê com a cor escolhida. Os meses seguem a ordem dos arquivos selecionados (janeiro → dezembro)."}</p>
          </Painel>
        </div>

        <div className="flex flex-col gap-4 min-w-0">
          {agrupa && (
            <Painel titulo="🧩 Folha de impressão">
              <div className="grid gap-3 sm:grid-cols-3">
                <Campo rotulo="Papel"><select className={entrada} value={cfg.papel} onChange={(e) => set({ papel: e.target.value })}>{Object.entries(PAPEIS).map(([k, v]) => <option key={k} value={k}>{v.nome}</option>)}</select></Campo>
                <Campo rotulo="Margem (mm)"><input type="number" min={0} className={entrada} value={cfg.margem} onChange={(e) => set({ margem: Math.max(0, Number(e.target.value) || 0) })} /></Campo>
                <Campo rotulo="Espaço (mm)"><input type="number" min={0} className={entrada} value={cfg.espaco} onChange={(e) => set({ espaco: Math.max(0, Number(e.target.value) || 0) })} /></Campo>
                {copias && <Campo rotulo={"Quantidade de ímãs"}><input type="number" min={1} max={5000} className={entrada} value={qtd} onChange={(e) => setQtd(Math.max(1, Number(e.target.value) || 1))} /></Campo>}
                <label className="flex gap-2 items-center text-xs mt-5"><input type="checkbox" checked={cfg.marcas} onChange={(e) => set({ marcas: e.target.checked })} />Guias de corte</label>
              </div>
              <div className="text-xs text-[#24344D]">{N?.porFolha ? <><b>{N.porFolha} por folha</b> ({N.cols} × {N.rows}) → <b>{folhas.length}</b> {folhas.length === 1 ? "folha" : "folhas"}. {cfg.modelo === "mesa" && "Dobre cada painel ao meio/em prisma conforme o suporte."}</> : <span className="text-red-700">Não cabe nessa folha.</span>}</div>
            </Painel>
          )}
          <button type="button" onClick={imprimir} className="self-start inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#8B1D2C] text-white font-bold hover:opacity-90"><MdPrint size={20} /> Imprimir / salvar em PDF ({folhas.length} {folhas.length === 1 ? "página" : "páginas"})</button>
          <Painel titulo="👀 Pré-visualização" cls="pre-fixa">
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
