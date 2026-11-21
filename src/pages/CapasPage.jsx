// Capas: edição direta (arrastar textos), mala direta por CSV e molde de corte (frente e verso).
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { MdAdd, MdContentCopy, MdDeleteOutline, MdPrint, MdUploadFile, MdChevronLeft, MdChevronRight, MdRestartAlt } from "react-icons/md";
import { PainelStickers } from "../components/StickersEditor";
import CapaFolha from "../components/capas/CapaFolha";
import { stickersDados } from "../lib/stickers";
import { geom } from "../lib/capas";
import { aguardarImagens } from "../lib/configImpressao";
import { CORES_FUNDO_TEXTO, FORMAS_TEXTO, capasCfg, capasImgs, CAPA_CFG_PADRAO, FONTES_CAPA2, ITENS_PADRAO, itemImagem, itemTexto, lerCsv } from "../lib/capas";
import { limparCacheMedida } from "../lib/cartaz";
import { lerImagem } from "../lib/lerImagem";
import GradeModelos, { MiniForma } from "../components/ui/GradeModelos";
import Painel from "../components/ui/Painel";
import Faixa from "../components/ui/Faixa";
import BarraEditor, { useAbaMobile } from "../components/ui/BarraEditor";
import { useHistorico } from "../lib/historico";

const entrada = "w-full rounded-lg border border-[#D8CBA8] bg-white px-2 py-1.5 text-sm";
const Campo = ({ rotulo, children }) => (
  <label className="flex flex-col gap-1 text-xs text-[#24344D]"><span className="font-semibold">{rotulo}</span>{children}</label>
);
const Chip = ({ ativo, children, ...p }) => (
  <button type="button" {...p} className={`text-xs px-3 py-1.5 rounded-full border ${ativo ? "bg-[#24344D] text-white border-[#24344D]" : "bg-white text-[#24344D] border-[#D8CBA8]"}`}>{children}</button>
);

export default function CapasPage() {
  const c = capasCfg.useStore();
  const set = (o) => capasCfg.set(o);
  const abas = useAbaMobile();
  const hist = useHistorico(capasCfg);
  const [, forca] = useState(0);
  const [idx, setIdx] = useState(0);
  const [lado, setLado] = useState("frente");
  const [largPre, setLargPre] = useState(420);
  const colRef = useRef(null);
  const taRef = useRef(null);
  const txtRef = useRef(null);

  useEffect(() => {
    document.fonts?.ready?.then(() => { limparCacheMedida(); forca((n) => n + 1); });
    const ro = new ResizeObserver(() => colRef.current && setLargPre(Math.min(560, colRef.current.clientWidth)));
    if (colRef.current) ro.observe(colRef.current);
    return () => ro.disconnect();
  }, []);

  const csv = useMemo(() => lerCsv(c.csv), [c.csv]);
  const nomes = c.usarCsv && csv.rows.length ? csv.rows : [{ nome: "Nome Completo" }];
  const dados = nomes[Math.min(idx, nomes.length - 1)] || {};
  const sel = Math.min(c.sel, c.itens.length - 1);
  const item = c.itens[sel];
  const setItem = (o) => set({ itens: c.itens.map((x, i) => (i === sel ? { ...x, ...o } : x)) });
  const F = geom(c).F;
  const zoom = largPre / (F.w * 3.7795);
  const girar = (o) => { if (c.orient === o) return; const [mw, mh] = [Math.min(c.placaW, c.placaH), Math.max(c.placaW, c.placaH)]; set(o === "paisagem" ? { orient: o, placaW: mh, placaH: mw } : { orient: o, placaW: mw, placaH: mh }); };

  const imgPara = async (file, id) => {
    try { capasImgs[id] = await lerImagem(file); toast.success("Imagem carregada."); forca((n) => n + 1); if (id === "fundo") set({ fundoImg: true }); }
    catch { toast.error("Não foi possível ler a imagem."); }
  };
  const lerArquivoCsv = async (file) => {
    const txt = await file.text();
    const r = lerCsv(txt);
    if (!r.rows.length) { toast.error("O arquivo precisa ter o cabeçalho (ex.: nome) e uma pessoa por linha."); return; }
    set({ csv: txt, usarCsv: true }); setIdx(0);
    toast.success(`${r.rows.length} nome(s) carregado(s).`);
  };
  const inserirCampo = (k) => {
    if (!item || item.tipo !== "texto") { toast("Selecione um texto da capa para inserir o campo."); return; }
    setItem({ texto: `${item.texto}{${k}}` });
  };
  const novoTexto = () => { set({ itens: [...c.itens, itemTexto({ texto: "Novo texto", y: 85, tam: 20 })], sel: c.itens.length }); };
  const novaImagem = () => { set({ itens: [...c.itens, itemImagem()], sel: c.itens.length }); };
  const duplicar = () => { if (item) set({ itens: [...c.itens, { ...item, id: Math.random().toString(36).slice(2, 9), y: Math.min(95, item.y + 6) }], sel: c.itens.length }); };
  const remover = () => { if (!item) return; set({ itens: c.itens.filter((_, i) => i !== sel), sel: 0 }); };
  const restaurarItem = () => {
    if (!item) return;
    const base = item.tipo === "imagem" ? itemImagem() : itemTexto();
    setItem(item.tipo === "imagem" ? { x: base.x, y: base.y, w: base.w, opac: 100 } : { fonte: base.fonte, tam: base.tam, cor: base.cor, x: base.x, y: base.y, larg: base.larg, alinh: base.alinh, negrito: false, italico: false, caixaAlta: false, esp: 0, caber: false, quebra: true, fundoForma: "nenhum", fundoCor: "#ffffff", fundoOp: 100, fundoPad: 4, fundoBorda: 0 });
  };
  const restaurarCapa = () => {
    if (!window.confirm("Restaurar a capa ao padrão? Textos, fundo e stickers da capa voltam ao início (os nomes são mantidos).")) return;
    Object.keys(capasImgs).forEach((k) => { delete capasImgs[k]; });
    stickersDados.set({ itens: stickersDados.get().itens.filter((i) => i.pagina !== "capa") });
    set({ itens: ITENS_PADRAO(), sel: 0, fundo: "#ffffff", fundoImg: false, fundoModo: "cobrir", fundoOpac: 100, fundoZoom: 100, fundoX: 50, fundoY: 50 });
    forca((n) => n + 1);
    toast.success("Capa restaurada ao padrão.");
  };
  const restaurar = () => { set({ orient: "retrato", placaW: 160, placaH: 220, dobra: 17.5, molde: "linhas", corMolde: CAPA_CFG_PADRAO.corMolde, moldeFrente: true, verso: "molde" }); };

  const paginas = [];
  nomes.forEach((d, n) => {
    if (c.imprimir !== "versos") paginas.push({ n, d, lado: "frente" });
    if (c.verso !== "nenhum" && c.imprimir !== "frentes") paginas.push({ n, d, lado: "verso" });
  });
  // Saída A5 ×2: cada capa vira meia folha A4 (70,7%), duas por folha, sem borda; o verso casa pela borda escolhida.
  const a5 = c.saida === "a5x2";
  const S = a5 ? (F.w > F.h ? { w: 210, h: 297 } : { w: 297, h: 210 }) : F;
  const metade = F.w > F.h ? { w: 210, h: 148.5 } : { w: 148.5, h: 210 };
  const folhasA5 = [];
  if (a5) {
    const troca = c.virar === "curta";
    for (let i = 0; i < nomes.length; i += 2) {
      const par = [nomes[i], nomes[i + 1]];
      if (c.imprimir !== "versos") folhasA5.push([0, 1].map((k) => (par[k] ? { d: par[k], lado: "frente" } : null)));
      if (c.verso !== "nenhum" && c.imprimir !== "frentes") {
        const ordem = troca ? [1, 0] : [0, 1];
        folhasA5.push(ordem.map((k) => (par[k] ? { d: par[k], lado: "verso" } : null)));
      }
    }
  }
  const nFolhas = a5 ? folhasA5.length : paginas.length;
  const FolhaA5 = ({ cel }) => (
    <div style={{ position: "relative", width: `${S.w}mm`, height: `${S.h}mm`, background: "#fff", overflow: "hidden" }}>
      {cel.map((x, k) => (
        <div key={k} style={{ position: "absolute", left: F.w > F.h ? 0 : `${k * metade.w}mm`, top: F.w > F.h ? `${k * metade.h}mm` : 0, width: `${metade.w}mm`, height: `${metade.h}mm`, overflow: "hidden", background: "#fff" }}>
          {x && <div style={{ width: `${F.w}mm`, height: `${F.h}mm`, zoom: 0.70711 }}><CapaFolha c={c} dados={x.d} lado={x.lado} /></div>}
        </div>
      ))}
    </div>
  );
  const imprimir = async () => {
    if (!nFolhas) { toast.error("Nada para imprimir: escolha frentes ou versos."); return; }
    if (!paginas.length) { toast.error("Nada para imprimir: escolha frentes ou versos."); return; }
    try { await aguardarImagens(document.querySelector(".cp-print") || document); } catch { /* segue */ }
    window.print();
  };
  const modeloCsv = () => {
    const blob = new Blob(["nome\nMaria Souza\nJoão Pereira\n"], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "nomes-capas.csv"; a.click();
  };

  return (
    <div className="cp-raiz mx-auto max-w-7xl px-4 pt-6 pb-28">
      <style>{`
        .cp-print { display: none; }
        @media print {
          @page { size: ${S.w}mm ${S.h}mm; margin: 0; }
          html, body { width: ${S.w}mm !important; height: auto !important; }
          .cp-raiz { padding: 0 !important; margin: 0 !important; max-width: none !important; }
          html, body { background: #fff !important; }
          .cp-tela { display: none !important; }
          .cp-print { display: block !important; }
          .cp-print .cp-pag { page-break-after: always; break-after: page; height: ${S.h}mm; overflow: hidden; }
          .cp-print .cp-pag:last-child { page-break-after: auto; break-after: auto; }
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        }
      `}</style>

      <div className="cp-tela grid gap-5 lg:grid-cols-[420px_minmax(0,1fr)]">
        <BarraEditor tipo="capas" abas={abas} historico={hist} onImprimir={imprimir} rotuloImprimir={`Imprimir · ${nFolhas} folha${nFolhas === 1 ? "" : "s"}`} aoRestaurar={() => forca((n) => n + 1)} />
        <div className={`flex flex-col gap-4 min-w-0 ${abas.clsEditar}`}>
          <Painel titulo="👥 Nomes (mala direta)">
            <label className="flex items-center gap-2 text-sm text-[#24344D]"><input type="checkbox" checked={c.usarCsv} onChange={(e) => { set({ usarCsv: e.target.checked }); setIdx(0); }} /> Gerar uma capa para cada nome</label>
            {c.usarCsv && (
              <>
                <textarea ref={taRef} rows={6} className={`${entrada} font-mono text-xs`} value={c.csv} onChange={(e) => { set({ csv: e.target.value }); setIdx(0); }} placeholder={"Maria Souza\nJoão Pereira"} />
                <div className="flex flex-wrap gap-2">
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#D8CBA8] bg-white text-xs font-semibold cursor-pointer text-[#24344D]">
                    <MdUploadFile /> Enviar arquivo .csv
                    <input type="file" accept=".csv,.txt,text/csv" className="hidden" onChange={(e) => { if (e.target.files[0]) lerArquivoCsv(e.target.files[0]); e.target.value = ""; }} />
                  </label>
                  <button type="button" onClick={modeloCsv} className="text-xs text-[#8B6A1F] underline">Baixar modelo .csv</button>
                </div>
                <p className="text-[11px] text-[#6B6458]">Digite ou cole <b>um nome por linha</b>. Para ter mais campos (ex.: turma), use um CSV com cabeçalho: <b>nome;turma</b>.</p>
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] font-semibold text-[#6B6458]">Campos:</span>
                  {csv.cols.map((k) => <button key={k} type="button" onClick={() => inserirCampo(k)} className="text-[11px] px-2 py-0.5 rounded-full bg-[#E9E2D0] text-[#24344D] hover:bg-[#d9cfb3]">{`{${k}}`}</button>)}
                </div>
                <p className="text-xs font-bold text-[#24344D]">{csv.rows.length} capa(s)</p>
              </>
            )}
          </Painel>

          <Painel titulo="🧩 Elementos da capa">
            <p className="text-[11px] text-[#6B6458]">Arraste os textos direto na prévia (clique duas vezes para editar). Use <b>{"{nome}"}</b> onde o nome deve aparecer.</p>
            <div className="flex flex-wrap gap-1.5">
              {c.itens.map((it, i) => (
                <Chip key={it.id} ativo={i === sel} onClick={() => set({ sel: i })}>{it.tipo === "imagem" ? "🖼 Imagem" : (it.texto.replace(/\s+/g, " ").slice(0, 14) || "Texto")}</Chip>
              ))}
            </div>
            <div className="flex flex-wrap gap-2 items-center">
              <button type="button" onClick={novoTexto} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#24344D] text-white text-xs font-semibold"><MdAdd /> Texto</button>
              <button type="button" onClick={novaImagem} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#24344D] text-white text-xs font-semibold"><MdAdd /> Imagem / logo</button>
              <button type="button" onClick={restaurarCapa} className="inline-flex items-center gap-1 text-xs text-[#8B6A1F] underline ml-auto"><MdRestartAlt /> Restaurar capa padrão</button>
            </div>
            {item && item.tipo === "texto" && (
              <div className="flex flex-col gap-3 border-t border-[#E7DCC0] pt-3">
                <Campo rotulo="Texto (Enter = nova linha)"><textarea ref={txtRef} rows={3} className={entrada} value={item.texto} onChange={(e) => setItem({ texto: e.target.value })} /></Campo>
                <Campo rotulo="Fonte">
                  <select className={entrada} value={item.fonte} style={{ fontFamily: item.fonte }} onChange={(e) => setItem({ fonte: e.target.value })}>
                    {FONTES_CAPA2.map(([v, n]) => <option key={v} value={v} style={{ fontFamily: v }}>{n}</option>)}
                  </select>
                </Campo>
                <Faixa rotulo="Tamanho da letra" valor={item.tam} min={6} max={300} un=" pt" onChange={(v) => setItem({ tam: v })} />
                <div className="flex items-center gap-2 text-xs text-[#24344D]">
                  <span className="font-semibold">Digite o tamanho:</span>
                  <input type="number" min={4} max={600} value={item.tam} className="w-20 rounded-lg border border-[#D8CBA8] bg-white px-2 py-1 text-sm text-center" onChange={(e) => setItem({ tam: Math.max(4, Math.min(600, Number(e.target.value) || 4)) })} /> pt
                  <button type="button" className="px-2 py-1 rounded-lg border border-[#D8CBA8] bg-white" onClick={() => setItem({ tam: Math.max(4, item.tam - 2) })}>A−</button>
                  <button type="button" className="px-2 py-1 rounded-lg border border-[#D8CBA8] bg-white" onClick={() => setItem({ tam: Math.min(600, item.tam + 2) })}>A+</button>
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  {[["left", "Esq."], ["center", "Centro"], ["right", "Dir."]].map(([id, n]) => <Chip key={id} ativo={item.alinh === id} onClick={() => setItem({ alinh: id })}>{n}</Chip>)}
                  <Chip ativo={item.negrito} onClick={() => setItem({ negrito: !item.negrito })}><b>N</b></Chip>
                  <Chip ativo={item.italico} onClick={() => setItem({ italico: !item.italico })}><i>I</i></Chip>
                  <Chip ativo={item.caixaAlta} onClick={() => setItem({ caixaAlta: !item.caixaAlta })}>AA</Chip>
                  <input type="color" value={item.cor} onChange={(e) => setItem({ cor: e.target.value })} className="h-8 w-10 rounded" title="Cor" />
                </div>
                <label className="flex items-center gap-2 text-xs text-[#24344D]"><input type="checkbox" checked={item.caber} onChange={(e) => setItem({ caber: e.target.checked })} /> Ajustar para caber em 1 linha (nomes compridos)</label>
                {!item.caber && <label className="flex items-center gap-2 text-xs text-[#24344D]"><input type="checkbox" checked={item.quebra !== false} onChange={(e) => setItem({ quebra: e.target.checked })} /> Quebrar linha automaticamente na largura da caixa</label>}
                <div className="flex flex-col gap-2.5 rounded-xl border border-[#E7DCC0] bg-white/60 p-3">
                  <span className="text-xs font-bold text-[#24344D]">🏷️ Fundo do texto (forma)</span>
                  <GradeModelos itens={FORMAS_TEXTO.map(([id, n]) => ({ id, rotulo: n, miniatura: <MiniForma forma={id} /> }))} valor={item.fundoForma || "nenhum"} colunas={5} aspecto="aspect-[5/4]" onChange={(id) => setItem({ fundoForma: id })} />
                  {(item.fundoForma || "nenhum") !== "nenhum" && (
                    <>
                      <div className="flex flex-wrap items-center gap-2">
                        {CORES_FUNDO_TEXTO.map((cor) => <button key={cor} type="button" aria-label={`Cor ${cor}`} onClick={() => setItem({ fundoCor: cor })} style={{ background: cor }} className={`w-7 h-7 rounded-full border ${item.fundoCor === cor ? "ring-2 ring-offset-1 ring-[#24344D]" : "border-[#D8CBA8]"}`} />)}
                        <input type="color" value={item.fundoCor || "#ffffff"} onChange={(e) => setItem({ fundoCor: e.target.value })} className="h-7 w-9 rounded" title="Outra cor" />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <Faixa rotulo="Opacidade do fundo" valor={item.fundoOp ?? 100} min={10} max={100} un="%" onChange={(v) => setItem({ fundoOp: v })} />
                        <Faixa rotulo="Folga ao redor do texto" valor={item.fundoPad ?? 4} min={0} max={20} step={0.5} un=" mm" onChange={(v) => setItem({ fundoPad: v })} />
                        <Faixa rotulo="Borda" valor={item.fundoBorda || 0} min={0} max={3} step={0.1} un=" mm" onChange={(v) => setItem({ fundoBorda: v })} />
                        <label className="flex flex-col gap-1 text-[11px] font-semibold text-[#6B6458]">Cor da borda<input type="color" value={item.fundoBordaCor || "#24344D"} onChange={(e) => setItem({ fundoBordaCor: e.target.value })} className="h-7 w-full rounded" /></label>
                      </div>
                      <p className="text-[11px] text-[#6B6458]">O fundo acompanha a largura da caixa de texto: ajuste “Largura da caixa” para encolher ou esticar a forma.</p>
                    </>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Faixa rotulo="Largura da caixa" valor={item.larg} min={10} max={100} un="%" onChange={(v) => setItem({ larg: v })} />
                  <Faixa rotulo="Espaço entre letras" valor={item.esp} min={0} max={20} un=" pt" onChange={(v) => setItem({ esp: v })} />
                  <Faixa rotulo="Posição ← →" valor={item.x} min={0} max={100} step={0.5} un="%" onChange={(v) => setItem({ x: v })} />
                  <Faixa rotulo="Posição ↑ ↓" valor={item.y} min={0} max={100} step={0.5} un="%" onChange={(v) => setItem({ y: v })} />
                </div>
              </div>
            )}
            {item && item.tipo === "imagem" && (
              <div className="flex flex-col gap-3 border-t border-[#E7DCC0] pt-3">
                <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#D8CBA8] bg-white text-xs font-semibold cursor-pointer text-[#24344D] self-start">
                  <MdUploadFile /> {capasImgs[item.id] ? "Trocar imagem" : "Enviar imagem"}
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => { if (e.target.files[0]) imgPara(e.target.files[0], item.id); e.target.value = ""; }} />
                </label>
                <Faixa rotulo="Largura" valor={item.w} min={10} max={190} un=" mm" onChange={(v) => setItem({ w: v })} />
                <Faixa rotulo="Opacidade da imagem" valor={item.opac ?? 100} min={5} max={100} un="%" onChange={(v) => setItem({ opac: v })} />
                <div className="grid grid-cols-2 gap-3">
                  <Faixa rotulo="Posição ← →" valor={item.x} min={0} max={100} step={0.5} un="%" onChange={(v) => setItem({ x: v })} />
                  <Faixa rotulo="Posição ↑ ↓" valor={item.y} min={0} max={100} step={0.5} un="%" onChange={(v) => setItem({ y: v })} />
                </div>
              </div>
            )}
            {item && (
              <div className="flex gap-3 text-xs">
                <button type="button" onClick={restaurarItem} className="inline-flex items-center gap-1 text-[#8B6A1F]"><MdRestartAlt /> Restaurar este elemento</button>
                <button type="button" onClick={duplicar} className="inline-flex items-center gap-1 text-[#24344D]"><MdContentCopy /> Duplicar</button>
                <button type="button" onClick={remover} className="inline-flex items-center gap-1 text-[#8B2E3F]"><MdDeleteOutline /> Excluir</button>
              </div>
            )}
          </Painel>

          <PainelStickers prefixo="capa" />

          <Painel titulo="🎨 Fundo da capa" aberto={false}>
            <div className="flex flex-wrap items-center gap-3">
              <Campo rotulo="Cor"><input type="color" className="h-8 w-14 rounded" value={c.fundo} onChange={(e) => set({ fundo: e.target.value })} /></Campo>
              <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#D8CBA8] bg-white text-xs font-semibold cursor-pointer text-[#24344D] mt-4">
                <MdUploadFile /> Imagem de fundo
                <input type="file" accept="image/*" className="hidden" onChange={(e) => { if (e.target.files[0]) imgPara(e.target.files[0], "fundo"); e.target.value = ""; }} />
              </label>
              {c.fundoImg && <button type="button" className="text-xs text-[#8B2E3F] underline mt-4" onClick={() => { delete capasImgs.fundo; set({ fundoImg: false }); }}>Remover</button>}
            </div>
            {c.fundoImg && <Faixa rotulo="Opacidade do fundo" valor={c.fundoOpac ?? 100} min={5} max={100} un="%" onChange={(v) => set({ fundoOpac: v })} />}
            {c.fundoImg && <div className="flex gap-1.5"><Chip ativo={c.fundoModo === "cobrir"} onClick={() => set({ fundoModo: "cobrir" })}>Cobrir tudo</Chip><Chip ativo={c.fundoModo === "inteira"} onClick={() => set({ fundoModo: "inteira" })}>Caber inteira</Chip></div>}
            {c.fundoImg && (
              <div className="flex flex-col gap-2.5 rounded-xl border border-[#E7DCC0] bg-white/60 p-3">
                <span className="text-xs font-bold text-[#24344D]">🖼️ Tamanho e posição da imagem de fundo</span>
                <Faixa rotulo="Tamanho (zoom)" valor={c.fundoZoom ?? 100} min={50} max={400} un="%" onChange={(v) => set({ fundoZoom: v })} />
                <div className="grid grid-cols-2 gap-3">
                  <Faixa rotulo="Posição ← →" valor={c.fundoX ?? 50} min={0} max={100} un="%" onChange={(v) => set({ fundoX: v })} />
                  <Faixa rotulo="Posição ↑ ↓" valor={c.fundoY ?? 50} min={0} max={100} un="%" onChange={(v) => set({ fundoY: v })} />
                </div>
                <button type="button" className="self-start text-xs underline text-[#8B6A1F]" onClick={() => set({ fundoZoom: 100, fundoX: 50, fundoY: 50 })}>Centralizar e voltar a 100%</button>
              </div>
            )}
          </Painel>

          <Painel titulo="✂️ Molde de corte" aberto={false}>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => set({ molde: "nenhum", moldeFrente: false, cobrirFolha: true })} className="px-3 py-1.5 rounded-lg bg-[#24344D] text-white text-xs font-semibold">Tirar todas as marcações e imprimir a imagem inteira</button>
              <button type="button" onClick={() => set({ molde: "linhas", moldeFrente: true, cobrirFolha: false })} className="px-3 py-1.5 rounded-lg border border-[#D8CBA8] bg-white text-xs font-semibold text-[#24344D]">Voltar ao molde</button>
            </div>
            <label className="flex items-center gap-2 text-xs text-[#24344D]"><input type="checkbox" checked={!!c.cobrirFolha} onChange={(e) => set({ cobrirFolha: e.target.checked })} /> Imagem e fundo cobrem a folha inteira (sem recorte do octógono)</label>
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-semibold text-[#24344D] mr-1">Capa</span>
              <Chip ativo={c.orient !== "paisagem"} onClick={() => girar("retrato")}>Retrato (em pé)</Chip>
              <Chip ativo={c.orient === "paisagem"} onClick={() => girar("paisagem")}>Paisagem (deitada)</Chip>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <Chip ativo={c.molde === "linhas"} onClick={() => set({ molde: "linhas" })}>Linhas (octógono + placa)</Chip>
              <Chip ativo={c.molde === "marcas"} onClick={() => set({ molde: "marcas" })}>Só marcas de canto</Chip>
              <Chip ativo={c.molde === "nenhum"} onClick={() => set({ molde: "nenhum" })}>Sem molde</Chip>
            </div>
            <label className="flex items-center gap-2 text-xs text-[#24344D]"><input type="checkbox" checked={c.moldeFrente} onChange={(e) => set({ moldeFrente: e.target.checked })} /> Imprimir o molde também na frente (por cima da arte)</label>
            <Campo rotulo="Verso da folha">
              <select className={entrada} value={c.verso} onChange={(e) => set({ verso: e.target.value })}>
                <option value="molde">Só o molde (para cortar pelo verso)</option>
                <option value="fundo">Fundo da capa + molde</option>
                <option value="nenhum">Sem verso (só frente)</option>
              </select>
            </Campo>
            <Campo rotulo="Saída da impressão">
              <select className={entrada} value={c.saida || "a4"} onChange={(e) => set({ saida: e.target.value })}>
                <option value="a4">1 capa por folha A4 (como está)</option>
                <option value="a5x2">2 capas por folha A4, cada uma em tamanho A5 (impressora sem borda → corte ao meio)</option>
              </select>
            </Campo>
            {a5 && (
              <div className="flex flex-col gap-2">
                <Campo rotulo="Impressão frente e verso: virar a folha pela">
                  <select className={entrada} value={c.virar || "longa"} onChange={(e) => set({ virar: e.target.value })}>
                    <option value="longa">Borda longa (padrão da maioria das impressoras)</option>
                    <option value="curta">Borda curta</option>
                  </select>
                </Campo>
                <p className="text-[11px] text-[#6B6458]">Cada capa é reduzida a 70,7% (A4 → A5) e as duas ocupam a folha inteira, sem sobra branca: imprima em A4 sem borda e corte ao meio. Nomes seguidos ficam lado a lado (1º e 2º, 3º e 4º…) e o verso já sai alinhado.</p>
              </div>
            )}
            <Campo rotulo="Imprimir">
              <select className={entrada} value={c.imprimir || "tudo"} onChange={(e) => set({ imprimir: e.target.value })}>
                <option value="tudo">Frente e verso (impressora duplex; molde é simétrico, qualquer borda serve)</option>
                <option value="frentes">Só as frentes</option>
                <option value="versos">Só os versos</option>
              </select>
            </Campo>
            <div className="grid grid-cols-3 gap-2">
              <Campo rotulo="Placa largura (mm)"><input type="number" className={entrada} value={c.placaW} onChange={(e) => set({ placaW: Math.max(40, Number(e.target.value) || 0) })} /></Campo>
              <Campo rotulo="Placa altura (mm)"><input type="number" className={entrada} value={c.placaH} onChange={(e) => set({ placaH: Math.max(40, Number(e.target.value) || 0) })} /></Campo>
              <Campo rotulo="Dobra (mm)"><input type="number" step="0.5" className={entrada} value={c.dobra} onChange={(e) => set({ dobra: Math.max(5, Number(e.target.value) || 0) })} /></Campo>
            </div>
            <div className="flex items-center gap-3">
              <Campo rotulo="Cor do molde"><input type="color" className="h-8 w-14 rounded" value={c.corMolde} onChange={(e) => set({ corMolde: e.target.value })} /></Campo>
              <button type="button" onClick={restaurar} className="inline-flex items-center gap-1 text-xs text-[#8B6A1F] underline mt-4"><MdRestartAlt /> Restaurar medidas padrão</button>
            </div>
            <p className="text-[11px] text-[#6B6458]">Padrão: placa 160 × 220 mm (capa A5 em pé; deitada vira 220 × 160) com 17,5 mm de dobra, cantos cortados a 45°. Paisagem imprime em folha A4 deitada.</p>
          </Painel>

        </div>

        <div ref={colRef} className={`pre-fixa flex flex-col gap-3 items-center min-w-0 ${abas.clsVer}`}>
          <div className="flex flex-wrap items-center justify-center gap-2 w-full">
            <button type="button" className="p-1.5 rounded-lg border border-[#D8CBA8] bg-white" onClick={() => setIdx((i) => Math.max(0, i - 1))}><MdChevronLeft /></button>
            <select className="rounded-lg border border-[#D8CBA8] bg-white px-2 py-1.5 text-sm max-w-[220px]" value={Math.min(idx, nomes.length - 1)} onChange={(e) => setIdx(Number(e.target.value))}>
              {nomes.map((d, i) => <option key={i} value={i}>{i + 1}. {d.nome || Object.values(d)[0] || "—"}</option>)}
            </select>
            <button type="button" className="p-1.5 rounded-lg border border-[#D8CBA8] bg-white" onClick={() => setIdx((i) => Math.min(nomes.length - 1, i + 1))}><MdChevronRight /></button>
            <Chip ativo={lado === "frente"} onClick={() => setLado("frente")}>Frente</Chip>
            <Chip ativo={lado === "verso"} onClick={() => setLado("verso")}>Verso</Chip>
          </div>
          <div className="shadow-[0_6px_24px_rgba(36,52,77,0.2)] bg-white" style={{ width: largPre, height: largPre * (F.h / F.w) }}>
            <div style={{ zoom }}>
              <CapaFolha c={c} dados={dados} lado={lado} interativo={lado === "frente"} sel={sel} onSel={(i) => set({ sel: i })} onMover={(i, x, y) => set({ itens: capasCfg.get().itens.map((it, k) => (k === i ? { ...it, x, y } : it)) })} versao={0} onEditar={(i) => { set({ sel: i }); setTimeout(() => { txtRef.current?.focus(); txtRef.current?.select(); }, 50); }} />
            </div>
          </div>
          <p className="text-[11px] text-[#6B6458] text-center">Arraste os textos na prévia para posicionar. A linha preta é a placa; a cinza, o recorte do papel.</p>
        </div>
      </div>

      <div className="cp-print">
        {a5
          ? folhasA5.slice(0, 300).map((cel, k) => <div key={k} className="cp-pag"><FolhaA5 cel={cel} /></div>)
          : paginas.slice(0, 600).map((p, k) => (
            <div key={k} className="cp-pag"><CapaFolha c={c} dados={p.d} lado={p.lado} /></div>
          ))}
      </div>
    </div>
  );
}
