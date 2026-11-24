// Adesivos: redondo, quadrado, retângulo, oval, selo e coração — com modelos prontos,
// imagem com ajuste automático, textos, anel e folha com vários por página.
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { MdContentCopy, MdDeleteOutline, MdPrint, MdUploadFile, MdAdd } from "react-icons/md";
import Adesivo from "../components/adesivo/Adesivo";
import ControlesImagem from "../components/ControlesImagem";
import BotaoPadrao from "../components/BotaoPadrao";
import { adesivoCfg, caminho, coresPadrao, ehLacre, FONTES_AD, FORMAS, itemNovo, layoutFolha, LAYOUTS_AD, MODELOS_AD, PADROES_AD } from "../lib/adesivo";
import { limparCacheMedida } from "../lib/cartaz";
import { PAPEIS } from "../lib/cartaoVisita";
import { lerImagem } from "../lib/lerImagem";
import { AJ_PADRAO, corDoCanto } from "../lib/imagemAjuste";
import Painel from "../components/ui/Painel";
import { Fluxo } from "../components/ui/Etapa";
import Faixa from "../components/ui/Faixa";
import BarraEditor, { useAbaMobile } from "../components/ui/BarraEditor";
import { useHistorico } from "../lib/historico";
import { temImagem } from "../lib/projetos";
import OpcoesFonte from "../components/ui/OpcoesFonte";

const MM = 3.7795;
const entrada = "w-full rounded-lg border border-[#D8CBA8] bg-white px-2 py-1.5 text-sm";
const Campo = ({ rotulo, children, dica }) => (
  <div className="flex flex-col gap-1 text-xs text-[#24344D]"><span className="font-semibold">{rotulo}</span>{children}{dica && <span className="text-[11px] text-[#8B6A1F]">{dica}</span>}</div>
);
const Cor = ({ rotulo, valor, onChange }) => (
  <Campo rotulo={rotulo}><input type="color" className="h-8 w-full rounded" value={/^#[0-9a-f]{6}$/i.test(valor) ? valor : "#ffffff"} onChange={(e) => onChange(e.target.value)} /></Campo>
);

function IconeForma({ forma, ativo }) {
  const lac = ehLacre(forma);
  const d = caminho(forma, 12, 12, lac ? 11 : forma.startsWith("ret") || forma === "oval" ? 21 : 18, lac ? 22 : forma.startsWith("ret") ? 13 : forma === "oval" ? 15 : 18, 0);
  return <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true"><path d={d} fill={ativo ? "#24344D" : "#e8dfc8"} stroke="#24344D" strokeWidth="1" /></svg>;
}

function Folha({ L, cfg, itens, fotos }) {
  return (
    <div className="ad-folha" style={{ position: "relative", width: `${L.W}mm`, height: `${L.H}mm`, background: "#fff", overflow: "hidden" }}>
      {itens.map((it, i) => (
        <div key={i} style={{ position: "absolute", left: `${L.pos[i].x}mm`, top: `${L.pos[i].y}mm` }}>
          <Adesivo forma={cfg.forma} w={cfg.w} h={cfg.h} sangria={cfg.sangria} item={it} foto={fotos[it.id]} guia={cfg.guias} corGuia={cfg.corGuia} />
        </div>
      ))}
    </div>
  );
}

export default function AdesivosPage() {
  const cfg = adesivoCfg.useStore();
  const set = (p) => adesivoCfg.set(p);
  const abas = useAbaMobile();
  const hist = useHistorico(adesivoCfg);
  const [fotos, setFotos] = useState({});
  const [sel, setSel] = useState(cfg.itens[0]?.id);
  const [folha, setFolha] = useState(0);
  const [, refaz] = useState(0);
  const inp = useRef(null);

  useEffect(() => { // remede os textos quando as fontes web terminarem de carregar
    const f = () => { limparCacheMedida(); refaz((n) => n + 1); };
    document.fonts?.ready?.then(f);
    document.fonts?.addEventListener?.("loadingdone", f);
    return () => document.fonts?.removeEventListener?.("loadingdone", f);
  }, []);

  const item = cfg.itens.find((i) => i.id === sel) || cfg.itens[0];
  const setItem = (p) => set({ itens: cfg.itens.map((i) => (i.id === item.id ? { ...i, ...p } : i)) });
  const setFonte = (p) => set({ itens: cfg.itens.map((i) => (cfg.fontesTodos || i.id === item.id ? { ...i, ...p } : i)) });
  const foto = item ? fotos[item.id] : null;
  const setFoto = (p) => setFotos((o) => ({ ...o, [item.id]: { ...AJ_PADRAO, ...(o[item.id] || {}), ...p } }));

  const lista = useMemo(() => cfg.itens.flatMap((i) => Array.from({ length: Math.max(0, i.qtd) }, () => i)), [cfg.itens]);
  const L = useMemo(() => layoutFolha(cfg, lista.length), [cfg, lista.length]);
  const fatia = (n) => lista.slice(n * L.porFolha, (n + 1) * L.porFolha);
  const fp = Math.min(folha, Math.max(L.folhas - 1, 0));
  const escala = Math.min(1, 620 / (L.W * MM));

  const aplicarModelo = (m) => {
    const itens = m.itens().map((i, k) => ({ ...i, modelo: m.id, modeloIdx: k }));
    set({ forma: m.forma, w: m.w, h: m.h, itens });
    setSel(itens[0].id); setFotos({}); setFolha(0);
    toast.success(`Modelo “${m.nome}” aplicado`);
  };
  const novo = () => { const i = itemNovo({ nome: `Adesivo ${cfg.itens.length + 1}` }); set({ itens: [...cfg.itens, i] }); setSel(i.id); };
  const duplicar = () => { const i = { ...item, id: Math.random().toString(36).slice(2, 9), nome: `${item.nome} (cópia)` }; set({ itens: [...cfg.itens, i] }); if (fotos[item.id]) setFotos((o) => ({ ...o, [i.id]: o[item.id] })); setSel(i.id); };
  const excluir = () => { if (cfg.itens.length < 2) { toast.error("Mantenha ao menos um adesivo."); return; } const r = cfg.itens.filter((i) => i.id !== item.id); set({ itens: r }); setSel(r[0].id); };
  const enviar = async (f) => {
    try { const src = await lerImagem(f, 1600); const bgAuto = await corDoCanto(src); const lac = ehLacre(cfg.forma); setFotos((o) => ({ ...o, [item.id]: { src, bgAuto, bg: bgAuto, ...AJ_PADRAO, ...(lac ? { modo: "preencher" } : {}) } })); if (lac) setItem({ layout: "imagem" }); else if (item.layout === "texto") setItem({ layout: "imagemTexto", imgPct: 60 }); }
    catch { toast.error("Não foi possível ler a imagem."); }
  };
  const tamanhoIgual = (w, h) => set({ w: Math.max(8, w), h: Math.max(8, h) });
  const completar = () => {
    if (!L.porFolha || !cfg.itens.length) return;
    let sobra = (L.porFolha - (lista.length % L.porFolha)) % L.porFolha;
    const r = cfg.itens.map((i, k) => { const extra = Math.floor(sobra / (cfg.itens.length - k)); sobra -= extra; return { ...i, qtd: i.qtd + extra }; });
    set({ itens: r });
  };
  const imprimir = () => {
    if (!lista.length) { toast.error("Defina a quantidade de ao menos um adesivo."); return; }
    if (!L.porFolha) { toast.error("O adesivo não cabe nessa folha."); return; }
    window.print();
  };
  const tamIdx = FORMAS[cfg.forma].tam.findIndex(([a, b]) => a === cfg.w && b === cfg.h);
  const comTexto = item.layout !== "imagem" || ehLacre(cfg.forma), comImg = item.layout !== "texto";

  const adaptador = {
    nome: "Adesivos",
    imgs: () => ({ fotos }),
    aplicarImgs: (i) => { setFotos(i?.fotos || {}); },
    vazio: () => !temImagem(fotos),
    ler: () => ({ cfg: adesivoCfg.get(), imgs: { fotos }, stk: [] }),
    aplicar: (pr) => { setFotos(pr.imgs?.fotos || {}); setSel(pr.cfg.itens?.[0]?.id); setFolha(0); adesivoCfg.set(pr.cfg); },
  };

  return (
    <div className="ad-raiz mx-auto max-w-7xl px-4 pt-6 pb-28">
      <style>{`
        .ad-print { display: none; }
        @media print {
          @page { size: ${L.W}mm ${L.H}mm; margin: 0; }
          html, body { width: ${L.W}mm !important; height: auto !important; }
          .ad-raiz { padding: 0 !important; margin: 0 !important; max-width: none !important; }
          .ad-tela { display: none !important; }
          .ad-print { display: block !important; }
          .ad-print .ad-folha { page-break-after: always; break-after: page; }
          .ad-print .ad-folha:last-child { page-break-after: auto; break-after: auto; }
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        }
      `}</style>

      <div className="ad-tela grid gap-5 lg:grid-cols-[400px_minmax(0,1fr)]">
        <BarraEditor tipo="adesivos" abas={abas} historico={hist} onImprimir={imprimir} rotuloImprimir={"Imprimir"} adaptador={adaptador} aoRestaurar={() => {}} />
        <Fluxo cls={`flex flex-col gap-4 min-w-0 ${abas.clsEditar}`}>
          <Painel titulo="✨ Modelos prontos">
            <div className="grid grid-cols-3 gap-2">
              {MODELOS_AD.map((m) => {
                const it = m.itens()[0];
                return (
                  <button key={m.id} type="button" onClick={() => aplicarModelo(m)} className="flex flex-col items-center gap-1 rounded-xl border border-[#E8DFC8] bg-white p-2 hover:border-[#24344D]">
                    <div style={{ width: 64, height: 56, display: "grid", placeItems: "center" }}>
                      <div style={{ width: m.w >= m.h ? 64 : (64 * m.w) / m.h, aspectRatio: `${m.w} / ${m.h}` }}><Adesivo forma={m.forma} w={m.w} h={m.h} sangria={0} item={it} fluido /></div>
                    </div>
                    <span className="text-[11px] text-[#24344D] font-semibold text-center leading-tight">{m.nome}</span>
                  </button>
                );
              })}
            </div>
          </Painel>

          <Painel titulo="🏷️ Adesivos da folha">
            <div className="flex flex-wrap gap-2">
              {cfg.itens.map((i) => (
                <button key={i.id} type="button" onClick={() => setSel(i.id)} className={`flex items-center gap-2 rounded-xl border px-2 py-1.5 text-xs ${i.id === item.id ? "border-[#24344D] bg-[#24344D] text-white" : "border-[#D8CBA8] bg-white text-[#24344D]"}`}>
                  <span style={{ width: 26, height: 26, display: "inline-block" }}><Adesivo forma={cfg.forma} w={cfg.w} h={cfg.h} sangria={0} item={i} foto={fotos[i.id]} fluido /></span>
                  <span className="max-w-[90px] truncate font-semibold">{i.nome}</span><span className="opacity-70">×{i.qtd}</span>
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={novo} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#24344D] text-white text-xs font-semibold"><MdAdd size={16} /> Novo</button>
              <button type="button" onClick={duplicar} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-[#D8CBA8] bg-white text-xs font-semibold text-[#24344D]"><MdContentCopy size={14} /> Duplicar</button>
              <button type="button" onClick={excluir} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-[#D8CBA8] bg-white text-xs font-semibold text-[#24344D]"><MdDeleteOutline size={16} /> Excluir</button>
            </div>

            <div className="grid grid-cols-2 gap-3 border-t border-[#E8DFC8] pt-3">
              <Campo rotulo="Nome (só para você)"><input className={entrada} value={item.nome} onChange={(e) => setItem({ nome: e.target.value })} /></Campo>
              <Campo rotulo="Quantidade"><input type="number" min={0} max={2000} className={entrada} value={item.qtd} onChange={(e) => setItem({ qtd: Math.max(0, Number(e.target.value) || 0) })} /></Campo>
              <Campo rotulo="Conteúdo"><select className={entrada} value={item.layout} onChange={(e) => setItem({ layout: e.target.value })}>{Object.entries(LAYOUTS_AD).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></Campo>
              <Campo rotulo="Fundo">
                <select className={entrada} value={item.padrao} onChange={(e) => setItem({ padrao: e.target.value })}>{Object.entries(PADROES_AD).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select>
              </Campo>
              <Cor rotulo="Cor do fundo" valor={item.fundo} onChange={(v) => setItem({ fundo: v })} />
              {ehLacre(cfg.forma) && <Cor rotulo="Cor do medalhão" valor={item.fundoMed} onChange={(v) => setItem({ fundoMed: v })} />}
              {item.padrao !== "liso" && <Cor rotulo="2ª cor do fundo" valor={item.fundo2} onChange={(v) => setItem({ fundo2: v })} />}
            </div>

            {comTexto && (
              <div className="grid grid-cols-2 gap-3 border-t border-[#E8DFC8] pt-3">
                <Campo rotulo={ehLacre(cfg.forma) ? "Texto do medalhão" : "Texto principal"}><input className={entrada} value={item.t1} onChange={(e) => setItem({ t1: e.target.value })} /></Campo>
                <Campo rotulo="Fonte principal"><select className={entrada} value={item.fonte1} onChange={(e) => setFonte({ fonte1: e.target.value })}><OpcoesFonte lista={FONTES_AD} /></select></Campo>
                <Campo rotulo={ehLacre(cfg.forma) ? "Texto da tira" : "Texto 2"}><input className={entrada} value={item.t2} onChange={(e) => setItem({ t2: e.target.value })} /></Campo>
                <Campo rotulo={ehLacre(cfg.forma) ? "Fonte da tira e do texto pequeno" : "Fonte do texto 2 e 3"}><select className={entrada} value={item.fonte2} onChange={(e) => setFonte({ fonte2: e.target.value })}><OpcoesFonte lista={FONTES_AD} /></select></Campo>
                <Campo rotulo={ehLacre(cfg.forma) ? "Texto pequeno do medalhão (ex.: EBA!)" : "Texto 3 (pequeno)"}><input className={entrada} value={item.t3} onChange={(e) => setItem({ t3: e.target.value })} /></Campo>
                <label className="flex items-center gap-2 text-xs col-span-2"><input type="checkbox" checked={cfg.fontesTodos} onChange={(e) => set({ fontesTodos: e.target.checked })} /> Usar as mesmas fontes em todos os adesivos da folha</label>
                <div className="grid grid-cols-2 gap-2"><Cor rotulo="Cor texto 1" valor={item.corT1} onChange={(v) => setItem({ corT1: v })} /><Cor rotulo="Cor texto 2" valor={item.corT2} onChange={(v) => setItem({ corT2: v })} /></div>
              </div>
            )}

            <button type="button" className="self-start underline font-semibold text-xs" onClick={() => { setItem(coresPadrao(item)); toast.success("Cores padrão restauradas"); }}>↺ Restaurar cores padrão deste adesivo</button>
            <div className="grid grid-cols-2 gap-3 border-t border-[#E8DFC8] pt-3">
              <Campo rotulo={`Anel (moldura): ${item.anel ? `${item.anel} mm` : "sem"}`}><input type="range" min={0} max={3} step={0.1} value={item.anel} onChange={(e) => setItem({ anel: Number(e.target.value) })} /></Campo>
              <Cor rotulo="Cor do anel" valor={item.corAnel} onChange={(v) => setItem({ corAnel: v })} />
              <label className="flex items-center gap-2 text-xs col-span-2"><input type="checkbox" checked={item.anelDuplo} onChange={(e) => setItem({ anelDuplo: e.target.checked })} disabled={!item.anel} /> Anel duplo (fio fino por dentro)</label>
            </div>

            {comImg && (
              <div className="flex flex-col gap-2 border-t border-[#E8DFC8] pt-3">
                <div className="flex flex-wrap gap-2 items-center">
                  <button type="button" onClick={() => inp.current?.click()} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#24344D] text-white text-sm font-semibold"><MdUploadFile size={18} /> {foto?.src ? "Trocar imagem / logo" : "Enviar imagem / logo"}</button>
                  {foto?.src && <button type="button" className="underline text-xs" onClick={() => setFotos((o) => { const n = { ...o }; delete n[item.id]; return n; })}>Remover</button>}
                </div>
                <input ref={inp} type="file" accept="image/*" hidden onChange={(e) => { if (e.target.files[0]) enviar(e.target.files[0]); e.target.value = ""; }} />
                {item.layout === "imagemTexto" && <Faixa rotulo="Altura da imagem" valor={item.imgPct} min={30} max={85} un="%" onChange={(v) => setItem({ imgPct: v })} />}
                {foto?.src ? <ControlesImagem a={{ ...AJ_PADRAO, ...foto }} bgAuto={foto.bgAuto} mudar={setFoto} /> : <p className="text-[11px] text-[#8B6A1F]">A imagem aparece inteira no adesivo (sem cortar o logo) e você pode ajustar zoom e posição.</p>}
              </div>
            )}
          </Painel>
        </Fluxo>

        <div className={`flex flex-col gap-4 min-w-0 ${abas.clsVer}`}>
          <Painel titulo="📐 Forma e folha">
            <BotaoPadrao onClick={() => { adesivoCfg.resetar(["forma", "w", "h", "sangria", "papel", "margem", "espaco", "guias", "corGuia", "orientacao"]); toast.success("Medidas padrão restauradas"); }} />
            <div className="flex flex-wrap gap-2">
              {Object.entries(FORMAS).map(([k, v]) => (
                <button key={k} type="button" onClick={() => { const [w, h] = v.tam[Math.min(3, v.tam.length - 1)]; set({ forma: k, w, h }); }} className={`flex flex-col items-center gap-0.5 rounded-xl border px-2 py-1.5 text-[11px] font-semibold ${cfg.forma === k ? "border-[#24344D] bg-white" : "border-[#D8CBA8] bg-[#FBF8F1]"} text-[#24344D]`}>
                  <IconeForma forma={k} ativo={cfg.forma === k} />{v.nome}
                </button>
              ))}
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <Campo rotulo="Tamanho pronto">
                <select className={entrada} value={tamIdx >= 0 ? tamIdx : "x"} onChange={(e) => { if (e.target.value !== "x") { const [w, h] = FORMAS[cfg.forma].tam[Number(e.target.value)]; set({ w, h }); } }}>
                  {FORMAS[cfg.forma].tam.map(([w, h], i) => <option key={i} value={i}>{w} × {h} mm</option>)}<option value="x">Personalizado…</option>
                </select>
              </Campo>
              <Campo rotulo="Largura (mm)"><input type="number" min={8} step={0.5} className={entrada} value={cfg.w} onChange={(e) => { const v = Number(e.target.value) || 8; FORMAS[cfg.forma].quadradas ? tamanhoIgual(v, v) : tamanhoIgual(v, cfg.h); }} /></Campo>
              <Campo rotulo="Altura (mm)"><input type="number" min={8} step={0.5} className={entrada} value={cfg.h} onChange={(e) => { const v = Number(e.target.value) || 8; FORMAS[cfg.forma].quadradas ? tamanhoIgual(v, v) : tamanhoIgual(cfg.w, v); }} /></Campo>
              <Campo rotulo="Sangria (mm)" dica="A arte passa do corte para não sobrar borda branca."><input type="number" min={0} max={5} step={0.5} className={entrada} value={cfg.sangria} onChange={(e) => set({ sangria: Math.max(0, Number(e.target.value) || 0) })} /></Campo>
              <Campo rotulo="Papel"><select className={entrada} value={cfg.papel} onChange={(e) => set({ papel: e.target.value })}>{Object.entries(PAPEIS).map(([k, v]) => <option key={k} value={k}>{v.nome}</option>)}</select></Campo>
              <Campo rotulo="Posição"><select className={entrada} value={cfg.orientacao} onChange={(e) => set({ orientacao: e.target.value })}><option value="auto">Automática</option><option value="retrato">Em pé</option><option value="paisagem">Deitada</option></select></Campo>
              <Campo rotulo="Margem (mm)"><input type="number" min={0} className={entrada} value={cfg.margem} onChange={(e) => set({ margem: Math.max(0, Number(e.target.value) || 0) })} /></Campo>
              <Campo rotulo="Espaço entre adesivos (mm)"><input type="number" min={0} step={0.5} className={entrada} value={cfg.espaco} onChange={(e) => set({ espaco: Math.max(0, Number(e.target.value) || 0) })} /></Campo>
              <Campo rotulo="Linha de corte"><div className="flex items-center gap-2"><input type="checkbox" checked={cfg.guias} onChange={(e) => set({ guias: e.target.checked })} /><input type="color" className="h-7 w-12 rounded" value={cfg.corGuia} onChange={(e) => set({ corGuia: e.target.value })} disabled={!cfg.guias} /></div></Campo>
            </div>
            <div className="rounded-xl bg-white border border-[#D8CBA8] p-3 text-sm text-[#24344D] leading-relaxed">
              {L.porFolha ? (
                <><b>{L.porFolha} por folha</b> ({L.cols} × {L.rows}). Total: <b>{lista.length}</b> em <b>{L.folhas} {L.folhas === 1 ? "folha" : "folhas"}</b>
                  {lista.length > 0 && lista.length % L.porFolha !== 0 && <> · a última tem {lista.length % L.porFolha} (faltam {L.porFolha - (lista.length % L.porFolha)}). <button type="button" className="underline font-semibold" onClick={completar}>Completar a folha</button></>}.</>
              ) : <span className="text-red-700">O adesivo não cabe nessa folha com essas margens.</span>}
            </div>
            <p className="text-[11px] text-[#8B6A1F]">Imprima em escala 100% (sem “ajustar à página”), de preferência em papel adesivo. A linha de corte ajuda a recortar à mão ou na máquina de recorte.</p>
          </Painel>

          <Painel titulo="👀 Pré-visualização" cls="pre-fixa">
            {lista.length > 0 && L.porFolha > 0 ? (
              <>
                <select className="self-start rounded-lg border border-[#D8CBA8] bg-white px-2 py-1 text-xs" value={fp} onChange={(e) => setFolha(Number(e.target.value))}>
                  {Array.from({ length: Math.min(L.folhas, 200) }).map((_, i) => <option key={i} value={i}>Folha {i + 1} de {L.folhas}</option>)}
                </select>
                <div className="overflow-auto rounded-lg bg-[#ddd] p-3">
                  <div style={{ zoom: escala, width: "fit-content", boxShadow: "0 4px 16px #0004" }}><Folha L={L} cfg={cfg} itens={fatia(fp)} fotos={fotos} /></div>
                </div>
              </>
            ) : <p className="text-sm text-[#8B6A1F]">Defina a quantidade para ver a folha.</p>}
          </Painel>
        </div>
      </div>

      <div className="ad-print">
        {Array.from({ length: Math.min(L.folhas, 500) }).map((_, n) => <Folha key={n} L={L} cfg={cfg} itens={fatia(n)} fotos={fotos} />)}
      </div>
    </div>
  );
}
