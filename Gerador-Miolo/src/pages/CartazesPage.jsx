// Cartazes de supermercado: modelos prontos, foto do produto, logo, cores e layout ajustáveis.
import { useMemo, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { MdContentCopy, MdDeleteOutline, MdAdd, MdPrint, MdUploadFile } from "react-icons/md";
import Cartaz from "../components/cartaz/Cartaz";
import { cartazCfg, FONTES_CZ, FORMATOS_CZ, itemNovo, LAYOUTS_CZ, MODELOS_CZ, PADROES_CZ } from "../lib/cartaz";
import { encaixar } from "../lib/calendario";
import { PAPEIS } from "../lib/cartaoVisita";
import { lerImagem } from "../lib/lerImagem";
import BotaoPadrao from "../components/BotaoPadrao";

const MM = 3.7795;
const entrada = "w-full rounded-lg border border-[#D8CBA8] bg-white px-2 py-1.5 text-sm";
const Campo = ({ rotulo, children }) => (<div className="flex flex-col gap-1 text-xs text-[#24344D]"><span className="font-semibold">{rotulo}</span>{children}</div>);
const Painel = ({ titulo, children, cls = "" }) => (<section className={`bg-[#FBF8F1] border border-[#D8CBA8] rounded-2xl p-4 flex flex-col gap-3 ${cls}`}><h2 className="font-bold text-[#24344D]">{titulo}</h2>{children}</section>);
const Cor = ({ rotulo, valor, onChange }) => (<label className="flex items-center gap-2 text-xs text-[#24344D]"><input type="color" value={valor} onChange={(e) => onChange(e.target.value)} className="h-7 w-10 rounded" />{rotulo}</label>);
const AMOSTRA = itemNovo({ nome: "ARROZ TIPO 1 5KG", de: "29,90", por: "24,99", unid: "un" });

export default function CartazesPage() {
  const cfg = cartazCfg.useStore();
  const set = (p) => cartazCfg.set(p);
  const [fotos, setFotos] = useState({});
  const [logo, setLogo] = useState(null);
  const [selId, setSelId] = useState(cfg.itens[0]?.id);
  const fotoInp = useRef(null), logoInp = useRef(null);

  const itens = cfg.itens;
  const item = itens.find((i) => i.id === selId) || itens[0];
  const setItem = (p) => set({ itens: itens.map((i) => (i.id === item.id ? { ...i, ...p } : i)) });
  const novo = () => { const n = itemNovo({ nome: "NOVO PRODUTO", por: "" }); set({ itens: [...itens, n] }); setSelId(n.id); };
  const duplicar = () => { const n = { ...item, id: itemNovo().id }; set({ itens: [...itens, n] }); setFotos((o) => (o[item.id] ? { ...o, [n.id]: o[item.id] } : o)); setSelId(n.id); };
  const remover = () => { if (itens.length < 2) { toast.error("Mantenha pelo menos um cartaz."); return; } const r = itens.filter((i) => i.id !== item.id); set({ itens: r }); setSelId(r[0].id); };
  const aplicarModelo = (m) => { const { id, nome, ...estilo } = m; void nome; set({ ...estilo, modelo: id }); };

  const [fw, fh] = useMemo(() => {
    const [, w, h] = FORMATOS_CZ[cfg.formato];
    return cfg.orient === "paisagem" ? [h, w] : [w, h];
  }, [cfg.formato, cfg.orient]);

  // folhas de impressão: cada cartaz × cópias, encaixados no papel escolhido
  const todos = useMemo(() => itens.flatMap((i) => Array.from({ length: Math.max(1, Number(i.copias) || 1) }, () => i)), [itens]);
  const P = PAPEIS[cfg.papel] || PAPEIS.a4;
  const igual = (fw === P.w && fh === P.h) || (fw === P.h && fh === P.w);
  const N = useMemo(() => encaixar(cfg.papel, fw, fh, igual ? 0 : cfg.margem, igual ? 0 : cfg.espaco), [cfg.papel, fw, fh, igual, cfg.margem, cfg.espaco]);
  const semMargem = useMemo(() => (igual ? 0 : encaixar(cfg.papel, fw, fh, 0, 0).porFolha), [cfg.papel, fw, fh, igual]);
  const folhas = useMemo(() => {
    if (!N.porFolha) return [];
    const f = [];
    for (let i = 0; i < todos.length; i += N.porFolha) f.push(todos.slice(i, i + N.porFolha));
    return f;
  }, [N, todos]);

  const enviarFoto = async (f) => { if (!f) return; try { const s = await lerImagem(f, 1400); setFotos((o) => ({ ...o, [item.id]: s })); } catch { toast.error("Não foi possível ler a imagem."); } };
  const enviarLogo = async (f) => { if (!f) return; try { setLogo(await lerImagem(f, 700)); } catch { toast.error("Não foi possível ler o logo."); } };
  const imprimir = () => { if (!folhas.length) { toast.error("O cartaz não cabe nesse papel."); return; } window.print(); };
  const escala = Math.min(1, 560 / (fw * MM), 640 / (fh * MM));

  const folha = (fl, i) => (
    <div key={i} className="cz-folha" style={{ position: "relative", width: `${N.W}mm`, height: `${N.H}mm`, background: "#fff", overflow: "hidden" }}>
      {fl.map((it, k) => N.pos[k] && (
        <div key={k} style={{ position: "absolute", left: `${N.pos[k].x}mm`, top: `${N.pos[k].y}mm`, outline: cfg.guias && !igual ? "0.1mm dashed #888" : "none" }}>
          <Cartaz cfg={cfg} item={it} foto={fotos[it.id]} logo={logo} w={fw} h={fh} />
        </div>))}
    </div>
  );

  return (
    <div className="cz-raiz mx-auto max-w-7xl px-4 py-6">
      <style>{`
        .cz-print { display: none; }
        @media print {
          @page { size: ${N.W}mm ${N.H}mm; margin: 0; }
          html, body { width: ${N.W}mm !important; height: auto !important; }
          .cz-raiz { padding: 0 !important; margin: 0 !important; max-width: none !important; }
          .cz-tela, .cz-ph { display: none !important; }
          .cz-print { display: block !important; }
          .cz-print .cz-folha { break-after: page; page-break-after: always; }
          .cz-print .cz-folha:last-child { break-after: auto; page-break-after: auto; }
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        }
      `}</style>
      <input ref={fotoInp} type="file" accept="image/*" hidden onChange={(e) => { enviarFoto(e.target.files[0]); e.target.value = ""; }} />
      <input ref={logoInp} type="file" accept="image/*" hidden onChange={(e) => { enviarLogo(e.target.files[0]); e.target.value = ""; }} />

      <div className="cz-tela grid gap-5 lg:grid-cols-[400px_minmax(0,1fr)]">
        <div className="flex flex-col gap-4 min-w-0">
          <Painel titulo="🎨 Modelos prontos">
            <div className="grid grid-cols-3 gap-2">
              {MODELOS_CZ.map((m) => (
                <button key={m.id} type="button" onClick={() => aplicarModelo(m)} className={`rounded-lg overflow-hidden border-2 text-left bg-white ${cfg.modelo === m.id ? "border-[#8B1D2C]" : "border-[#E8DFC8]"}`}>
                  <div style={{ zoom: 0.26, pointerEvents: "none" }}><Cartaz cfg={{ ...cfg, ...m, mostrarLogo: false, mercado: "SEU MERCADO" }} item={AMOSTRA} foto={null} logo={null} w={210} h={297} /></div>
                  <div className="px-1.5 py-1 text-[11px] font-semibold text-[#24344D] truncate">{m.nome}</div>
                </button>))}
            </div>
          </Painel>

          <Painel titulo="🛒 Cartazes">
            <div className="flex flex-wrap gap-1.5">
              {itens.map((i, k) => <button key={i.id} type="button" onClick={() => setSelId(i.id)} className={`px-2.5 py-1 rounded-lg text-xs border ${i.id === item.id ? "bg-[#24344D] text-white border-[#24344D]" : "bg-white border-[#D8CBA8]"}`}>{k + 1}. {i.nome.slice(0, 14)}</button>)}
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={novo} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#24344D] text-white text-xs font-semibold"><MdAdd size={15} /> Novo</button>
              <button type="button" onClick={duplicar} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#D8CBA8] text-xs"><MdContentCopy size={14} /> Duplicar</button>
              <button type="button" onClick={remover} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#D8CBA8] text-xs"><MdDeleteOutline size={15} /> Excluir</button>
            </div>
            <Campo rotulo="Nome do produto"><input className={entrada} value={item.nome} onChange={(e) => setItem({ nome: e.target.value })} /></Campo>
            <Campo rotulo="Descrição (opcional)"><input className={entrada} value={item.desc} onChange={(e) => setItem({ desc: e.target.value })} /></Campo>
            <div className="grid grid-cols-3 gap-3">
              <Campo rotulo="De R$ (opcional)"><input className={entrada} inputMode="decimal" value={item.de} onChange={(e) => setItem({ de: e.target.value })} /></Campo>
              <Campo rotulo="Por R$"><input className={entrada} inputMode="decimal" value={item.por} onChange={(e) => setItem({ por: e.target.value })} /></Campo>
              <Campo rotulo="Unidade"><input className={entrada} list="un-cz" value={item.unid} onChange={(e) => setItem({ unid: e.target.value })} /><datalist id="un-cz">{["kg", "un", "cada", "pacote", "100g", "litro", "dúzia", "bandeja", "caixa"].map((u) => <option key={u} value={u} />)}</datalist></Campo>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Campo rotulo="Selo (vazio = padrão do modelo)"><input className={entrada} value={item.selo} placeholder={cfg.seloPadrao} onChange={(e) => setItem({ selo: e.target.value })} /></Campo>
              <Campo rotulo="Cópias"><input type="number" min={1} max={500} className={entrada} value={item.copias} onChange={(e) => setItem({ copias: Math.max(1, Number(e.target.value) || 1) })} /></Campo>
            </div>
            <Campo rotulo="Observação (rodapé)"><input className={entrada} value={item.obs} onChange={(e) => setItem({ obs: e.target.value })} /></Campo>
            <div className="flex flex-wrap gap-2 items-center">
              <button type="button" onClick={() => fotoInp.current?.click()} className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-[#24344D] text-white text-xs font-semibold"><MdUploadFile size={16} /> Foto do produto</button>
              {fotos[item.id] && <button type="button" onClick={() => setFotos((o) => { const n = { ...o }; delete n[item.id]; return n; })} className="px-3 py-2 rounded-xl border border-[#D8CBA8] text-xs">Remover foto</button>}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Campo rotulo="Ajuste da foto"><select className={entrada} value={item.fotoModo} onChange={(e) => setItem({ fotoModo: e.target.value })}><option value="caber">Caber inteira</option><option value="preencher">Preencher o quadro</option></select></Campo>
              <Campo rotulo={`Zoom: ${item.fotoZoom}×`}><input type="range" min={0.2} max={2.5} step={0.05} value={item.fotoZoom} onChange={(e) => setItem({ fotoZoom: Number(e.target.value) })} /></Campo>
              <Campo rotulo="Foto ↔"><input type="range" min={-100} max={100} value={item.fotoX} onChange={(e) => setItem({ fotoX: Number(e.target.value) })} /></Campo>
              <Campo rotulo="Foto ↕"><input type="range" min={-100} max={100} value={item.fotoY} onChange={(e) => setItem({ fotoY: Number(e.target.value) })} /></Campo>
            </div>
          </Painel>

          <Painel titulo="🏪 Mercado">
            <Campo rotulo="Nome do mercado"><input className={entrada} value={cfg.mercado} onChange={(e) => set({ mercado: e.target.value })} /></Campo>
            <div className="flex flex-wrap gap-2 items-center">
              <button type="button" onClick={() => logoInp.current?.click()} className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-[#24344D] text-white text-xs font-semibold"><MdUploadFile size={16} /> Logo do mercado</button>
              {logo && <button type="button" onClick={() => setLogo(null)} className="px-3 py-2 rounded-xl border border-[#D8CBA8] text-xs">Remover</button>}
            </div>
            <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs">
              <label className="flex gap-2 items-center"><input type="checkbox" checked={cfg.mostrarLogo} onChange={(e) => set({ mostrarLogo: e.target.checked })} />Mostrar logo</label>
              <label className="flex gap-2 items-center"><input type="checkbox" checked={cfg.mostrarSelo} onChange={(e) => set({ mostrarSelo: e.target.checked })} />Mostrar selo</label>
              <label className="flex gap-2 items-center"><input type="checkbox" checked={cfg.borda} onChange={(e) => set({ borda: e.target.checked })} />Moldura</label>
            </div>
          </Painel>

          <Painel titulo="🎛️ Layout e cores">
            <div className="grid grid-cols-2 gap-3">
              <Campo rotulo="Layout"><select className={entrada} value={cfg.layout} onChange={(e) => set({ layout: e.target.value })}>{Object.entries(LAYOUTS_CZ).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></Campo>
              <Campo rotulo="Fundo"><select className={entrada} value={cfg.padrao} onChange={(e) => set({ padrao: e.target.value })}>{Object.entries(PADROES_CZ).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></Campo>
              <Campo rotulo="Fonte do nome"><select className={entrada} value={cfg.fonteNome} onChange={(e) => set({ fonteNome: e.target.value })}>{FONTES_CZ.map(([v, n]) => <option key={v} value={v}>{n}</option>)}</select></Campo>
              <Campo rotulo="Fonte do preço"><select className={entrada} value={cfg.fontePreco} onChange={(e) => set({ fontePreco: e.target.value })}>{FONTES_CZ.map(([v, n]) => <option key={v} value={v}>{n}</option>)}</select></Campo>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Cor rotulo="Fundo" valor={cfg.fundo} onChange={(v) => set({ fundo: v })} />
              <Cor rotulo="Textos" valor={cfg.texto} onChange={(v) => set({ texto: v })} />
              <Cor rotulo="Moldura" valor={cfg.destaque} onChange={(v) => set({ destaque: v })} />
              <Cor rotulo="Caixa do preço" valor={cfg.precoBg} onChange={(v) => set({ precoBg: v })} />
              <Cor rotulo="Números do preço" valor={cfg.precoTxt} onChange={(v) => set({ precoTxt: v })} />
              <Cor rotulo="Selo" valor={cfg.seloBg} onChange={(v) => set({ seloBg: v })} />
              <Cor rotulo="Texto do selo" valor={cfg.seloTxt} onChange={(v) => set({ seloTxt: v })} />
            </div>
          </Painel>
        </div>

        <div className="flex flex-col gap-4 min-w-0">
          <Painel titulo="📄 Papel e impressão">
            <BotaoPadrao onClick={() => { cartazCfg.resetar(["formato", "orient", "papel", "margem", "espaco", "guias"]); setItem({ fotoModo: "caber", fotoZoom: 1, fotoX: 0, fotoY: 0 }); toast.success("Medidas padrão restauradas"); }} />
            <div className="grid gap-3 sm:grid-cols-3">
              <Campo rotulo="Tamanho do cartaz"><select className={entrada} value={cfg.formato} onChange={(e) => set({ formato: e.target.value })}>{Object.entries(FORMATOS_CZ).map(([k, v]) => <option key={k} value={k}>{v[0]}</option>)}</select></Campo>
              <Campo rotulo="Posição"><select className={entrada} value={cfg.orient} onChange={(e) => set({ orient: e.target.value })}><option value="retrato">Em pé</option><option value="paisagem">Deitado</option></select></Campo>
              <Campo rotulo="Papel da impressora"><select className={entrada} value={cfg.papel} onChange={(e) => set({ papel: e.target.value })}>{Object.entries(PAPEIS).map(([k, v]) => <option key={k} value={k}>{v.nome}</option>)}</select></Campo>
              {!igual && <Campo rotulo="Margem (mm)"><input type="number" min={0} className={entrada} value={cfg.margem} onChange={(e) => set({ margem: Math.max(0, Number(e.target.value) || 0) })} /></Campo>}
              {!igual && <Campo rotulo="Espaço (mm)"><input type="number" min={0} className={entrada} value={cfg.espaco} onChange={(e) => set({ espaco: Math.max(0, Number(e.target.value) || 0) })} /></Campo>}
              {!igual && <label className="flex gap-2 items-center text-xs mt-5"><input type="checkbox" checked={cfg.guias} onChange={(e) => set({ guias: e.target.checked })} />Guias de corte</label>}
            </div>
            <div className="text-xs text-[#24344D]">{N.porFolha ? <><b>{todos.length}</b> {todos.length === 1 ? "cartaz" : "cartazes"} · <b>{N.porFolha} por folha</b> → <b>{folhas.length}</b> {folhas.length === 1 ? "folha" : "folhas"}.{semMargem > N.porFolha ? ` Dica: com margem e espaço 0, cabem ${semMargem} por folha.` : ""}</> : <span className="text-red-700">Esse cartaz não cabe nesse papel.</span>}</div>
            <button type="button" onClick={imprimir} className="self-start inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#8B1D2C] text-white font-bold hover:opacity-90"><MdPrint size={20} /> Imprimir / salvar em PDF</button>
          </Painel>
          <Painel titulo="👀 Pré-visualização" cls="pre-fixa">
            <div className="overflow-auto rounded-lg bg-[#ddd] p-3 flex justify-center"><div style={{ zoom: escala, width: "fit-content", boxShadow: "0 4px 16px #0004" }}><Cartaz cfg={cfg} item={item} foto={fotos[item.id]} logo={logo} w={fw} h={fh} /></div></div>
          </Painel>
        </div>
      </div>
      <div className="cz-print">{folhas.map((f, i) => folha(f, i))}</div>
    </div>
  );
}
