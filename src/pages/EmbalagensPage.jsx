// Embalagens: moldes de sacola, caixas, cone, pirâmide e marcador, com arte por peça, stickers e vários por folha.
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { MdAdd, MdContentCopy, MdDeleteOutline, MdPrint, MdRestartAlt, MdUploadFile } from "react-icons/md";
import { PainelStickers, StickerLayer } from "../components/StickersEditor";
import EmbalagemSvg from "../components/embalagens/EmbalagemSvg";
import { PAPEIS } from "../lib/cartaoVisita";
import { encaixar } from "../lib/calendario";
import { EMB_PADRAO, embCfg, embImgs, FONTES_EMB, faceNova, geometria, itemTextoEmb, MODELOS_EMB, paramsPadrao, TEMAS_EMB } from "../lib/embalagens";
import { stickersDados } from "../lib/stickers";
import { lerImagem } from "../lib/lerImagem";

const MM = 3.7795;
const entrada = "w-full rounded-lg border border-[#D8CBA8] bg-white px-2 py-1.5 text-sm";
const Painel = ({ titulo, children, cls = "" }) => (
  <section className={`bg-[#FBF8F1] border border-[#D8CBA8] rounded-2xl p-4 flex flex-col gap-3 ${cls}`}><h2 className="font-bold text-[#24344D]">{titulo}</h2>{children}</section>
);
const Campo = ({ rotulo, children }) => <label className="flex flex-col gap-1 text-xs text-[#24344D]"><span className="font-semibold">{rotulo}</span>{children}</label>;
const Faixa = ({ rotulo, valor, min, max, step = 1, un = "", onChange }) => (
  <label className="flex flex-col gap-1 text-[11px] font-semibold text-[#6B6458]">
    <span className="flex justify-between"><span>{rotulo}</span><span className="text-[#24344D]">{valor}{un}</span></span>
    <input type="range" min={min} max={max} step={step} value={valor} onChange={(e) => onChange(Number(e.target.value))} />
  </label>
);
const Chip = ({ ativo, children, ...p }) => (
  <button type="button" {...p} className={`text-xs px-3 py-1.5 rounded-full border ${ativo ? "bg-[#24344D] text-white border-[#24344D]" : "bg-white text-[#24344D] border-[#D8CBA8]"}`}>{children}</button>
);

export default function EmbalagensPage() {
  const cfg = embCfg.useStore();
  const set = (o) => embCfg.set(o);
  const [, forca] = useState(0);
  const [folhaSel, setFolhaSel] = useState(0);
  const [selT, setSelT] = useState(0);
  const [largPre, setLargPre] = useState(520);
  const colRef = useRef(null);

  useEffect(() => {
    const ro = new ResizeObserver(() => colRef.current && setLargPre(colRef.current.clientWidth));
    if (colRef.current) ro.observe(colRef.current);
    return () => ro.disconnect();
  }, []);

  const modelo = MODELOS_EMB[cfg.modelo] ? cfg.modelo : "bala";
  const mod = MODELOS_EMB[modelo];
  const P = useMemo(() => ({ ...paramsPadrao(modelo), ...(cfg.params[modelo] || {}) }), [modelo, cfg.params]);
  const geo = useMemo(() => geometria(modelo, P), [modelo, P]);
  const faceSel = geo.faces.find((f) => f.id === cfg.sel) || geo.faces[0];
  const idxSel = geo.faces.findIndex((f) => f.id === faceSel.id);
  const arteModelo = cfg.arte[modelo] || {};
  const fd = arteModelo[faceSel.id] || faceNova(cfg.tema, idxSel === 0);
  const setFace = (o) => set({ arte: { ...cfg.arte, [modelo]: { ...arteModelo, [faceSel.id]: { ...fd, ...o } } } });
  const pagina = `emb-${modelo}`;
  const tSel = Math.min(selT, fd.textos.length - 1);
  const texto = fd.textos[tSel];
  const setTexto = (o) => setFace({ textos: fd.textos.map((t, i) => (i === tSel ? { ...t, ...o } : t)) });

  // folha de impressão
  const s = cfg.escala / 100;
  const cw = geo.w * s, ch = geo.h * s;
  const N = useMemo(() => encaixar(cfg.papel, cw, ch, cfg.margem, cfg.espaco, cfg.orient), [cfg.papel, cw, ch, cfg.margem, cfg.espaco, cfg.orient]);
  const nomes = cfg.usarNomes ? cfg.nomes.split(/\r?\n/).map((n) => n.trim()).filter(Boolean) : [];
  const copias = nomes.length ? nomes.map((n) => ({ nome: n })) : Array.from({ length: Math.max(1, cfg.qtd) }, () => ({ nome: "Nome" }));
  const folhas = useMemo(() => {
    if (!N.porFolha) return [];
    const f = [];
    for (let i = 0; i < copias.length; i += N.porFolha) f.push(copias.slice(i, i + N.porFolha));
    return f;
  }, [N.porFolha, copias.length, cfg.nomes, cfg.usarNomes]); // eslint-disable-line react-hooks/exhaustive-deps
  const fp = Math.min(folhaSel, Math.max(0, folhas.length - 1));
  const z = Math.min(1, largPre / (N.W * MM));

  const ajustar = () => {
    const p = PAPEIS[cfg.papel] || PAPEIS.a4;
    const fit = (W, H) => Math.min((W - 2 * cfg.margem) / geo.w, (H - 2 * cfg.margem) / geo.h);
    const k = Math.max(fit(p.w, p.h), fit(p.h, p.w));
    set({ escala: Math.max(20, Math.min(100, Math.floor(k * 100))) });
  };
  const setParam = (k, v) => set({ params: { ...cfg.params, [modelo]: { ...P, [k]: v } } });
  const aplicarTema = (cor) => {
    const novo = {};
    geo.faces.forEach((f, i) => { const at = arteModelo[f.id] || faceNova(cfg.tema, i === 0); novo[f.id] = { ...at, fundo: cor }; });
    set({ tema: cor, arte: { ...cfg.arte, [modelo]: novo } });
  };
  const imgPara = async (file) => {
    try { embImgs[`${modelo}:${faceSel.id}`] = await lerImagem(file); setFace({ imgOn: true }); forca((n) => n + 1); }
    catch { toast.error("Não foi possível ler a imagem."); }
  };
  const copiarParaTodas = () => {
    const novo = {};
    geo.faces.forEach((f, i) => {
      const at = arteModelo[f.id] || faceNova(cfg.tema, i === 0);
      if (f.id === faceSel.id) { novo[f.id] = fd; return; }
      novo[f.id] = { ...at, fundo: fd.fundo, imgOn: fd.imgOn, op: fd.op, modo: fd.modo, textos: fd.textos.map((t) => ({ ...t, id: Math.random().toString(36).slice(2, 9) })) };
      const src = embImgs[`${modelo}:${faceSel.id}`];
      if (src) embImgs[`${modelo}:${f.id}`] = src;
    });
    set({ arte: { ...cfg.arte, [modelo]: novo } });
    forca((n) => n + 1);
    toast.success("Arte copiada para todas as peças.");
  };
  const restaurar = () => {
    if (!window.confirm("Restaurar esta embalagem ao padrão? Medidas, cores, textos, imagens e stickers dela voltam ao início.")) return;
    Object.keys(embImgs).filter((k) => k.startsWith(`${modelo}:`)).forEach((k) => { delete embImgs[k]; });
    stickersDados.set({ itens: stickersDados.get().itens.filter((i) => i.pagina !== pagina) });
    const { [modelo]: _a, ...arteResto } = cfg.arte; const { [modelo]: _p, ...paramsResto } = cfg.params; // eslint-disable-line no-unused-vars
    set({ arte: arteResto, params: paramsResto, sel: "" });
    forca((n) => n + 1);
    toast.success("Embalagem restaurada ao padrão.");
  };
  const imprimir = () => {
    if (!folhas.length) { toast.error("O molde não cabe nessa folha. Use “Ajustar à folha” ou outro papel."); return; }
    window.print();
  };
  const moverTexto = (faceId, k, x, y) => {
    const a = embCfg.get().arte[modelo] || {};
    const i = geo.faces.findIndex((f) => f.id === faceId);
    const at = a[faceId] || faceNova(embCfg.get().tema, i === 0);
    embCfg.set({ arte: { ...embCfg.get().arte, [modelo]: { ...a, [faceId]: { ...at, textos: at.textos.map((t, j) => (j === k ? { ...t, x, y } : t)) } } } });
  };

  const renderFolha = (fl, key, interativo) => (
    <div key={key} className="emb-folha" style={{ position: "relative", width: `${N.W}mm`, height: `${N.H}mm`, background: "#fff", overflow: "hidden" }}>
      {fl.map((d, k) => N.pos[k] && (
        <div key={k} style={{ position: "absolute", left: `${N.pos[k].x}mm`, top: `${N.pos[k].y}mm`, width: `${cw}mm`, height: `${ch}mm` }}>
          <EmbalagemSvg geo={geo} cfg={{ ...cfg, sel: faceSel.id }} modelo={modelo} dados={d} interativo={interativo && k === 0}
            onSel={(id) => set({ sel: id })} onMoverTexto={moverTexto} selTexto={tSel} onSelTexto={setSelT} />
          <StickerLayer pagina={pagina} />
        </div>))}
    </div>
  );

  return (
    <div className="emb-raiz mx-auto max-w-7xl px-4 py-6">
      <style>{`
        .emb-print { display: none; }
        @media print {
          @page { size: ${N.W}mm ${N.H}mm; margin: 0; }
          html, body { width: ${N.W}mm !important; height: auto !important; }
          .emb-raiz { padding: 0 !important; margin: 0 !important; max-width: none !important; }
          .emb-tela { display: none !important; }
          .emb-print { display: block !important; }
          .emb-print .emb-folha { break-after: page; page-break-after: always; }
          .emb-print .emb-folha:last-child { break-after: auto; page-break-after: auto; }
          .emb-rot { display: none !important; }
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        }
      `}</style>

      <div className="emb-tela grid gap-5 lg:grid-cols-[400px_minmax(0,1fr)]">
        <div className="flex flex-col gap-4 min-w-0">
          <Painel titulo="📦 Escolha a embalagem">
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(MODELOS_EMB).map(([k, m]) => (
                <button key={k} type="button" onClick={() => { set({ modelo: k, sel: "" }); setFolhaSel(0); setSelT(0); }} className={`text-left rounded-xl border p-2.5 ${modelo === k ? "border-[#8B1D2C] bg-white ring-1 ring-[#8B1D2C]" : "border-[#D8CBA8] bg-[#FBF8F1]"}`}>
                  <div className="text-sm font-bold text-[#24344D]"><span className="mr-1">{m.icone}</span>{m.nome}</div>
                </button>))}
            </div>
            <p className="text-[11px] text-[#8B6A1F]">{mod.desc}</p>
          </Painel>

          <Painel titulo="📐 Medidas">
            <div className="grid grid-cols-2 gap-3">
              {mod.campos.map((c) => c.tipo === "check"
                ? <label key={c.k} className="flex gap-2 items-center text-xs col-span-2"><input type="checkbox" checked={!!P[c.k]} onChange={(e) => setParam(c.k, e.target.checked)} />{c.rotulo}</label>
                : c.tipo === "sel"
                  ? <Campo key={c.k} rotulo={c.rotulo}><select className={entrada} value={P[c.k]} onChange={(e) => setParam(c.k, e.target.value)}>{c.ops.map(([v, n]) => <option key={v} value={v}>{n}</option>)}</select></Campo>
                  : <Campo key={c.k} rotulo={c.rotulo}><input type="number" min={c.min} max={c.max} step={c.passo} className={entrada} value={P[c.k]} onChange={(e) => setParam(c.k, Math.max(c.min, Math.min(c.max, Number(e.target.value) || c.min)))} /></Campo>)}
            </div>
            <p className="text-[11px] text-[#6B6458]">Molde aberto: <b>{Math.round(geo.w)} × {Math.round(geo.h)} mm</b>. Linha cheia = corte; tracejada = dobra.</p>
          </Painel>

          <Painel titulo="🎨 Cor da embalagem">
            <div className="flex flex-wrap gap-2 items-center">
              {TEMAS_EMB.map((c) => <button key={c} type="button" aria-label={`Cor ${c}`} onClick={() => aplicarTema(c)} style={{ background: c }} className={`w-8 h-8 rounded-full border ${cfg.tema === c ? "ring-2 ring-offset-1 ring-[#24344D]" : "border-[#D8CBA8]"}`} />)}
              <input type="color" value={cfg.tema} onChange={(e) => aplicarTema(e.target.value)} className="w-8 h-8 rounded-full" aria-label="Cor personalizada" />
            </div>
            <p className="text-[11px] text-[#6B6458]">Pinta todas as peças de uma vez. Depois ajuste cada peça abaixo.</p>
          </Painel>

          <Painel titulo={`✏️ Personalizar peça: ${faceSel.nome}`}>
            <div className="flex flex-wrap gap-1.5">
              {geo.faces.map((f) => <Chip key={f.id} ativo={f.id === faceSel.id} onClick={() => { set({ sel: f.id }); setSelT(0); }}>{f.nome}</Chip>)}
            </div>
            <p className="text-[11px] text-[#6B6458]">Dica: clique direto na peça da prévia. Arraste os textos para posicionar.</p>
            <div className="grid grid-cols-2 gap-3">
              <Campo rotulo="Cor de fundo da peça"><input type="color" className="h-8 w-full rounded" value={fd.fundo} onChange={(e) => setFace({ fundo: e.target.value })} /></Campo>
              <Campo rotulo="Giro do conteúdo">
                <select className={entrada} value={fd.rot ?? "auto"} onChange={(e) => setFace({ rot: e.target.value === "auto" ? null : Number(e.target.value) })}>
                  <option value="auto">Automático</option><option value={0}>0°</option><option value={90}>90°</option><option value={180}>180°</option><option value={270}>270°</option>
                </select>
              </Campo>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#D8CBA8] bg-white text-xs font-semibold cursor-pointer text-[#24344D]">
                <MdUploadFile /> {embImgs[`${modelo}:${faceSel.id}`] ? "Trocar imagem" : "Imagem na peça"}
                <input type="file" accept="image/*" className="hidden" onChange={(e) => { if (e.target.files[0]) imgPara(e.target.files[0]); e.target.value = ""; }} />
              </label>
              {fd.imgOn && <button type="button" className="text-xs text-[#8B2E3F] underline" onClick={() => { delete embImgs[`${modelo}:${faceSel.id}`]; setFace({ imgOn: false }); }}>Remover imagem</button>}
            </div>
            {fd.imgOn && (
              <div className="grid grid-cols-2 gap-3 items-end">
                <Faixa rotulo="Opacidade da imagem" valor={fd.op ?? 100} min={5} max={100} un="%" onChange={(v) => setFace({ op: v })} />
                <div className="flex gap-1.5"><Chip ativo={fd.modo === "cobrir"} onClick={() => setFace({ modo: "cobrir" })}>Cobrir</Chip><Chip ativo={fd.modo === "inteira"} onClick={() => setFace({ modo: "inteira" })}>Inteira</Chip></div>
              </div>
            )}

            <div className="border-t border-[#E7DCC0] pt-3 flex flex-col gap-3">
              <div className="flex flex-wrap gap-1.5 items-center">
                {fd.textos.map((t, i) => <Chip key={t.id} ativo={i === tSel} onClick={() => setSelT(i)}>{t.texto.replace(/\s+/g, " ").slice(0, 14) || "Texto"}</Chip>)}
                <button type="button" onClick={() => { setFace({ textos: [...fd.textos, itemTextoEmb({ cor: fd.fundo ? (fd.fundo.toLowerCase() === "#ffffff" ? "#24344D" : "#ffffff") : "#ffffff", y: 30 + 15 * fd.textos.length })] }); setSelT(fd.textos.length); }} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#24344D] text-white text-xs font-semibold"><MdAdd /> Texto</button>
              </div>
              {texto && (
                <div className="flex flex-col gap-3">
                  <Campo rotulo="Texto (Enter = nova linha)"><textarea rows={2} className={entrada} value={texto.texto} onChange={(e) => setTexto({ texto: e.target.value })} /></Campo>
                  <Campo rotulo="Fonte">
                    <select className={entrada} value={texto.fonte} style={{ fontFamily: texto.fonte }} onChange={(e) => setTexto({ fonte: e.target.value })}>{FONTES_EMB.map(([v, n]) => <option key={v} value={v} style={{ fontFamily: v }}>{n}</option>)}</select>
                  </Campo>
                  <Faixa rotulo="Tamanho da letra" valor={texto.tam} min={6} max={200} un=" pt" onChange={(v) => setTexto({ tam: v })} />
                  <div className="flex flex-wrap items-center gap-1.5">
                    {[["left", "Esq."], ["center", "Centro"], ["right", "Dir."]].map(([id, n]) => <Chip key={id} ativo={texto.alinh === id} onClick={() => setTexto({ alinh: id })}>{n}</Chip>)}
                    <Chip ativo={texto.negrito} onClick={() => setTexto({ negrito: !texto.negrito })}><b>N</b></Chip>
                    <Chip ativo={texto.italico} onClick={() => setTexto({ italico: !texto.italico })}><i>I</i></Chip>
                    <Chip ativo={texto.caixaAlta} onClick={() => setTexto({ caixaAlta: !texto.caixaAlta })}>AA</Chip>
                    <input type="color" value={texto.cor} onChange={(e) => setTexto({ cor: e.target.value })} className="h-8 w-10 rounded" title="Cor do texto" />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <Faixa rotulo="Espaço entre letras" valor={texto.esp} min={0} max={20} un=" pt" onChange={(v) => setTexto({ esp: v })} />
                    <Faixa rotulo="← →" valor={texto.x} min={0} max={100} step={0.5} un="%" onChange={(v) => setTexto({ x: v })} />
                    <Faixa rotulo="↑ ↓" valor={texto.y} min={0} max={100} step={0.5} un="%" onChange={(v) => setTexto({ y: v })} />
                  </div>
                  <div className="flex flex-wrap gap-3 text-xs">
                    <button type="button" className="text-[#8B6A1F] underline" onClick={() => setTexto({ texto: `${texto.texto}{nome}` })}>Inserir {"{nome}"}</button>
                    <button type="button" className="inline-flex items-center gap-1 text-[#24344D]" onClick={() => { setFace({ textos: [...fd.textos, { ...texto, id: Math.random().toString(36).slice(2, 9), y: Math.min(95, texto.y + 8) }] }); setSelT(fd.textos.length); }}><MdContentCopy /> Duplicar</button>
                    <button type="button" className="inline-flex items-center gap-1 text-[#8B2E3F]" onClick={() => { setFace({ textos: fd.textos.filter((_, i) => i !== tSel) }); setSelT(0); }}><MdDeleteOutline /> Excluir</button>
                  </div>
                </div>
              )}
            </div>
            <button type="button" onClick={copiarParaTodas} className="self-start text-xs underline font-semibold text-[#24344D]">Copiar esta arte para todas as peças</button>
          </Painel>

          <PainelStickers prefixo="" semRepetir />
          <p className="text-[11px] text-[#6B6458] -mt-2">Os stickers aparecem em todos os moldes da folha, na mesma posição.</p>

          <Painel titulo="✂️ Linhas de corte e dobra">
            <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs">
              <label className="flex gap-2 items-center"><input type="checkbox" checked={cfg.linhaCorte} onChange={(e) => set({ linhaCorte: e.target.checked })} />Linha de corte (cheia)</label>
              <label className="flex gap-2 items-center"><input type="checkbox" checked={cfg.linhaDobra} onChange={(e) => set({ linhaDobra: e.target.checked })} />Linha de dobra (tracejada)</label>
            </div>
            <div className="grid grid-cols-2 gap-3 items-end">
              <Campo rotulo="Cor das linhas"><input type="color" className="h-8 w-full rounded" value={cfg.corLinha} onChange={(e) => set({ corLinha: e.target.value })} /></Campo>
              <Faixa rotulo="Espessura" valor={cfg.espLinha} min={0.1} max={0.8} step={0.05} un=" mm" onChange={(v) => set({ espLinha: v })} />
            </div>
            <label className="flex gap-2 items-center text-xs"><input type="checkbox" checked={cfg.rotulos} onChange={(e) => set({ rotulos: e.target.checked })} />Mostrar nome das peças na prévia (não imprime)</label>
          </Painel>

          <Painel titulo="🧩 Folha de impressão">
            <div className="grid grid-cols-2 gap-3">
              <Campo rotulo="Papel"><select className={entrada} value={cfg.papel} onChange={(e) => set({ papel: e.target.value })}>{Object.entries(PAPEIS).map(([k, v]) => <option key={k} value={k}>{v.nome}</option>)}</select></Campo>
              <Campo rotulo="Posição da folha"><select className={entrada} value={cfg.orient} onChange={(e) => set({ orient: e.target.value })}><option value="auto">Automática (a que couber mais)</option><option value="retrato">Em pé</option><option value="paisagem">Deitada</option></select></Campo>
              <Campo rotulo="Margem (mm)"><input type="number" min={0} className={entrada} value={cfg.margem} onChange={(e) => set({ margem: Math.max(0, Number(e.target.value) || 0) })} /></Campo>
              <Campo rotulo="Espaço entre moldes (mm)"><input type="number" min={0} className={entrada} value={cfg.espaco} onChange={(e) => set({ espaco: Math.max(0, Number(e.target.value) || 0) })} /></Campo>
            </div>
            <Faixa rotulo="Tamanho do molde" valor={cfg.escala} min={20} max={150} un="%" onChange={(v) => set({ escala: v })} />
            <div className="flex flex-wrap gap-3 items-center text-xs">
              <button type="button" onClick={ajustar} className="px-3 py-1.5 rounded-lg border border-[#D8CBA8] bg-white font-semibold text-[#24344D]">Ajustar à folha</button>
              <button type="button" onClick={() => set({ escala: 100 })} className="underline text-[#8B6A1F]">100%</button>
            </div>
            <label className="flex gap-2 items-center text-xs"><input type="checkbox" checked={cfg.usarNomes} onChange={(e) => set({ usarNomes: e.target.checked })} />Um molde para cada nome (use <b>{"{nome}"}</b> nos textos)</label>
            {cfg.usarNomes
              ? <textarea rows={5} className={`${entrada} font-mono text-xs`} value={cfg.nomes} onChange={(e) => set({ nomes: e.target.value })} placeholder={"Maria\nJoão"} />
              : <Campo rotulo="Quantidade de moldes"><input type="number" min={1} max={2000} className={entrada} value={cfg.qtd} onChange={(e) => set({ qtd: Math.max(1, Number(e.target.value) || 1) })} /></Campo>}
            <div className="text-xs text-[#24344D]">
              {N.porFolha ? <><b>{N.porFolha} por folha</b> ({N.cols} × {N.rows}) → <b>{folhas.length}</b> {folhas.length === 1 ? "folha" : "folhas"} para {copias.length} molde(s).</>
                : <span className="text-red-700">O molde ({Math.round(cw)} × {Math.round(ch)} mm) não cabe nessa folha. Use “Ajustar à folha”, papel A3 ou reduza as medidas.</span>}
            </div>
          </Painel>

          <button type="button" onClick={restaurar} className="self-start inline-flex items-center gap-1 text-xs text-[#8B6A1F] underline"><MdRestartAlt /> Restaurar esta embalagem ao padrão</button>
          <button type="button" onClick={imprimir} className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#8B1D2C] text-white font-bold hover:bg-[#741626]"><MdPrint /> Imprimir / salvar em PDF ({folhas.length} folha{folhas.length === 1 ? "" : "s"})</button>
        </div>

        <div ref={colRef} className="pre-fixa flex flex-col gap-3 min-w-0">
          {folhas.length > 0 ? (
            <>
              <select className="self-start rounded-lg border border-[#D8CBA8] bg-white px-2 py-1 text-xs" value={fp} onChange={(e) => setFolhaSel(Number(e.target.value))}>
                {folhas.map((_, i) => <option key={i} value={i}>Folha {i + 1} de {folhas.length}</option>)}
              </select>
              <div className="shadow-[0_6px_24px_rgba(36,52,77,0.2)] bg-white overflow-hidden" style={{ width: N.W * MM * z, height: N.H * MM * z }}>
                <div style={{ transform: `scale(${z})`, transformOrigin: "top left", width: `${N.W}mm` }}>{renderFolha(folhas[fp], "pre", true)}</div>
              </div>
              <p className="text-[11px] text-[#6B6458]">Clique numa peça para editar. Arraste os textos. Linha cheia: cortar · tracejada: dobrar.</p>
            </>
          ) : <p className="text-sm text-red-700">O molde não cabe nessa folha.</p>}
        </div>
      </div>
      <div className="emb-print">{folhas.map((f, i) => renderFolha(f, i, false))}</div>
    </div>
  );
}
