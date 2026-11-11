// Bottons: suba várias imagens, defina a quantidade de cada uma e imprima as folhas
// com cada imagem em um quadrado (guia circular de corte e área visível).
import { useMemo, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { MdDeleteOutline, MdPrint, MdUploadFile } from "react-icons/md";
import { calcularBottons, bottonsCfg, DIAMETROS } from "../lib/bottons";
import { PAPEIS } from "../lib/cartaoVisita";
import { lerImagem } from "../lib/lerImagem";

const MM = 3.7795;
const entrada = "w-full rounded-lg border border-[#D8CBA8] bg-white px-2 py-1.5 text-sm";
const Campo = ({ rotulo, children, dica }) => (
  <div className="flex flex-col gap-1 text-xs text-[#24344D]"><span className="font-semibold">{rotulo}</span>{children}{dica && <span className="text-[11px] text-[#8B6A1F]">{dica}</span>}</div>
);
const Painel = ({ titulo, children }) => (
  <section className="bg-[#FBF8F1] border border-[#D8CBA8] rounded-2xl p-4 flex flex-col gap-3"><h2 className="font-bold text-[#24344D]">{titulo}</h2>{children}</section>
);

function Celula({ img, cfg, cell }) {
  const pos = `${50 + img.x / 2}% ${50 + img.y / 2}%`;
  const c = cell / 2, rc = cell / 2 - 0.1, rv = cfg.diametro / 2;
  return (
    <div style={{ position: "relative", width: `${cell}mm`, height: `${cell}mm`, overflow: "hidden", background: "#fff" }}>
      <img src={img.src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: pos, transform: `scale(${img.zoom})`, transformOrigin: pos, display: "block" }} />
      {cfg.guias && (
        <svg style={{ position: "absolute", inset: 0 }} width={`${cell}mm`} height={`${cell}mm`} viewBox={`0 0 ${cell} ${cell}`}>
          <circle cx={c} cy={c} r={rc} fill="none" stroke="#000" strokeWidth="0.2" />
          {cfg.guiaVisivel && <circle cx={c} cy={c} r={rv} fill="none" stroke="#fff" strokeWidth="0.25" strokeDasharray="1.2 0.8" />}
          {cfg.guiaVisivel && <circle cx={c} cy={c} r={rv} fill="none" stroke="#000" strokeWidth="0.1" strokeDasharray="1.2 0.8" strokeDashoffset="1" />}
        </svg>
      )}
    </div>
  );
}

function Folha({ L, cfg, itens }) {
  return (
    <div className="bt-folha" style={{ position: "relative", width: `${L.W}mm`, height: `${L.H}mm`, background: "#fff", overflow: "hidden" }}>
      {itens.map((img, i) => (
        <div key={i} style={{ position: "absolute", left: `${L.posicoes[i].x}mm`, top: `${L.posicoes[i].y}mm` }}>
          <Celula img={img} cfg={cfg} cell={L.cell} />
        </div>
      ))}
    </div>
  );
}

export default function BottonsPage() {
  const cfg = bottonsCfg.useStore();
  const set = (p) => bottonsCfg.set(p);
  const [imgs, setImgs] = useState([]);
  const [folha, setFolha] = useState(0);
  const inp = useRef(null);

  const lista = useMemo(() => imgs.flatMap((im) => Array.from({ length: Math.max(0, im.qtd) }, () => im)), [imgs]);
  const L = useMemo(() => calcularBottons(cfg, lista.length), [cfg, lista.length]);
  const folhas = L.folhas;
  const fatia = (i) => lista.slice(i * L.porFolha, (i + 1) * L.porFolha);
  const fp = Math.min(folha, Math.max(folhas - 1, 0));

  const enviar = async (files) => {
    for (const f of files) {
      try { const src = await lerImagem(f, 1400); setImgs((l) => [...l, { id: Math.random().toString(36).slice(2), src, nome: f.name, qtd: 1, zoom: 1, x: 0, y: 0 }]); }
      catch { toast.error(`Não foi possível ler ${f.name}`); }
    }
  };
  const alt = (id, p) => setImgs((l) => l.map((i) => (i.id === id ? { ...i, ...p } : i)));
  const todas = (qtd) => setImgs((l) => l.map((i) => ({ ...i, qtd })));
  const completar = () => {
    if (!L.porFolha || !imgs.length) return;
    // distribui as sobras da última folha entre as imagens, em ordem
    let sobra = (L.porFolha - (lista.length % L.porFolha)) % L.porFolha;
    setImgs((l) => l.map((i, k) => { const extra = Math.floor(sobra / (l.length - k)); sobra -= extra; return { ...i, qtd: i.qtd + extra }; }));
  };
  const imprimir = () => {
    if (!lista.length) { toast.error("Envie ao menos uma imagem."); return; }
    if (!L.porFolha) { toast.error("O botton não cabe nessa folha."); return; }
    window.print();
  };
  const escala = Math.min(1, 620 / (L.W * MM));

  return (
    <div className="bt-raiz mx-auto max-w-7xl px-4 py-6">
      <style>{`
        .bt-print { display: none; }
        @media print {
          @page { size: ${L.W}mm ${L.H}mm; margin: 0; }
          html, body { width: ${L.W}mm !important; height: auto !important; }
          .bt-raiz { padding: 0 !important; margin: 0 !important; max-width: none !important; }
          .bt-tela { display: none !important; }
          .bt-print { display: block !important; }
          .bt-print .bt-folha { page-break-after: always; break-after: page; }
          .bt-print .bt-folha:last-child { page-break-after: auto; break-after: auto; }
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        }
      `}</style>

      <div className="bt-tela grid gap-5 lg:grid-cols-[380px_minmax(0,1fr)]">
        <div className="flex flex-col gap-4 min-w-0">
          <Painel titulo="🖼️ Imagens dos bottons">
            <button type="button" onClick={() => inp.current?.click()} className="self-start inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#24344D] text-white text-sm font-semibold"><MdUploadFile size={18} /> Enviar imagens (várias)</button>
            <input ref={inp} type="file" accept="image/*" multiple hidden onChange={(e) => { enviar([...e.target.files]); e.target.value = ""; }} />
            {imgs.length > 1 && (
              <div className="flex items-center gap-2 text-xs"><span>Mesma quantidade para todas:</span>
                <input type="number" min={1} max={500} defaultValue={1} className="w-16 rounded-lg border border-[#D8CBA8] px-2 py-1" onChange={(e) => todas(Math.max(0, Number(e.target.value) || 0))} /></div>
            )}
            {!imgs.length && <p className="text-[11px] text-[#8B6A1F]">Cada imagem vira um quadrado na folha, já com o círculo de corte do botton. Defina quantos bottons de cada imagem você quer.</p>}
            <ul className="flex flex-col gap-3">
              {imgs.map((im) => (
                <li key={im.id} className="flex gap-3 border border-[#E8DFC8] rounded-xl bg-white p-2">
                  <div style={{ width: 84, height: 84, flexShrink: 0, borderRadius: 8, overflow: "hidden", position: "relative" }}>
                    <div style={{ zoom: 84 / (L.cell * MM) }}><Celula img={im} cfg={cfg} cell={L.cell} /></div>
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col gap-1 text-xs text-[#24344D]">
                    <div className="flex items-center gap-2">
                      <span className="truncate flex-1 font-semibold" title={im.nome}>{im.nome}</span>
                      <button type="button" aria-label="Remover" onClick={() => setImgs((l) => l.filter((i) => i.id !== im.id))}><MdDeleteOutline size={18} /></button>
                    </div>
                    <label className="flex items-center gap-2">Quantidade <input type="number" min={0} max={1000} value={im.qtd} onChange={(e) => alt(im.id, { qtd: Math.max(0, Number(e.target.value) || 0) })} className="w-16 rounded-lg border border-[#D8CBA8] px-2 py-1" /></label>
                    <label className="grid grid-cols-[48px_1fr] items-center gap-1">Zoom<input type="range" min={1} max={3} step={0.02} value={im.zoom} onChange={(e) => alt(im.id, { zoom: Number(e.target.value) })} /></label>
                    <label className="grid grid-cols-[48px_1fr] items-center gap-1">Horiz.<input type="range" min={-100} max={100} value={im.x} onChange={(e) => alt(im.id, { x: Number(e.target.value) })} /></label>
                    <label className="grid grid-cols-[48px_1fr] items-center gap-1">Vert.<input type="range" min={-100} max={100} value={im.y} onChange={(e) => alt(im.id, { y: Number(e.target.value) })} /></label>
                  </div>
                </li>
              ))}
            </ul>
          </Painel>
        </div>

        <div className="flex flex-col gap-4 min-w-0">
          <Painel titulo="🖨️ Botton e folha">
            <div className="grid gap-3 sm:grid-cols-3">
              <Campo rotulo="Diâmetro do botton (mm)">
                <select className={entrada} value={DIAMETROS.includes(cfg.diametro) ? cfg.diametro : "x"} onChange={(e) => e.target.value !== "x" && set({ diametro: Number(e.target.value) })}>
                  {DIAMETROS.map((d) => <option key={d} value={d}>{d} mm</option>)}<option value="x">Outro…</option>
                </select>
                {!DIAMETROS.includes(cfg.diametro) && <input type="number" className={entrada} value={cfg.diametro} onChange={(e) => set({ diametro: Math.max(10, Number(e.target.value) || 10) })} />}
              </Campo>
              <Campo rotulo="Dobra (mm)" dica={`Corte = ${(cfg.diametro + 2 * cfg.dobra).toFixed(1)} mm. Confira com a sua máquina.`}><input type="number" step={0.5} min={0} className={entrada} value={cfg.dobra} onChange={(e) => set({ dobra: Math.max(0, Number(e.target.value) || 0) })} /></Campo>
              <Campo rotulo="Papel"><select className={entrada} value={cfg.papel} onChange={(e) => set({ papel: e.target.value })}>{Object.entries(PAPEIS).map(([k, v]) => <option key={k} value={k}>{v.nome}</option>)}</select></Campo>
              <Campo rotulo="Margem (mm)"><input type="number" min={0} className={entrada} value={cfg.margem} onChange={(e) => set({ margem: Math.max(0, Number(e.target.value) || 0) })} /></Campo>
              <Campo rotulo="Espaço entre quadrados (mm)"><input type="number" min={0} className={entrada} value={cfg.espaco} onChange={(e) => set({ espaco: Math.max(0, Number(e.target.value) || 0) })} /></Campo>
              <Campo rotulo="Posição"><select className={entrada} value={cfg.orientacao} onChange={(e) => set({ orientacao: e.target.value })}><option value="auto">Automática</option><option value="retrato">Em pé</option><option value="paisagem">Deitada</option></select></Campo>
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs">
              <label className="flex items-center gap-2"><input type="checkbox" checked={cfg.guias} onChange={(e) => set({ guias: e.target.checked })} /> Círculo de corte</label>
              <label className="flex items-center gap-2"><input type="checkbox" checked={cfg.guiaVisivel} onChange={(e) => set({ guiaVisivel: e.target.checked })} disabled={!cfg.guias} /> Área visível (tracejado)</label>
            </div>
            <div className="rounded-xl bg-white border border-[#D8CBA8] p-3 text-sm text-[#24344D] leading-relaxed">
              {L.porFolha ? (
                <><b>{L.porFolha} bottons por folha</b> ({L.cols} × {L.rows}). Total: <b>{lista.length}</b> {lista.length === 1 ? "botton" : "bottons"} em <b>{folhas} {folhas === 1 ? "folha" : "folhas"}</b>
                  {lista.length > 0 && lista.length % L.porFolha !== 0 && <> · a última folha tem {lista.length % L.porFolha} (faltam {L.porFolha - (lista.length % L.porFolha)} para completar). <button type="button" className="underline font-semibold" onClick={completar}>Completar a folha</button></>}.</>
              ) : <span className="text-red-700">O botton não cabe nessa folha com essas margens.</span>}
            </div>
            <button type="button" onClick={imprimir} className="self-start inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#8B1D2C] text-white font-bold hover:opacity-90"><MdPrint size={20} /> Imprimir / salvar em PDF ({folhas} {folhas === 1 ? "página" : "páginas"})</button>
            <p className="text-[11px] text-[#8B6A1F]">Imprima em escala 100% (sem “ajustar à página”). Recorte no círculo de corte; o tracejado mostra o que ficará visível no botton.</p>
          </Painel>

          <Painel titulo="👀 Pré-visualização">
            {lista.length > 0 && L.porFolha > 0 ? (
              <>
                <select className="self-start rounded-lg border border-[#D8CBA8] bg-white px-2 py-1 text-xs" value={fp} onChange={(e) => setFolha(Number(e.target.value))}>
                  {Array.from({ length: Math.min(folhas, 200) }).map((_, i) => <option key={i} value={i}>Folha {i + 1} de {folhas}</option>)}
                </select>
                <div className="overflow-auto rounded-lg bg-[#ddd] p-3">
                  <div style={{ zoom: escala, width: "fit-content", boxShadow: "0 4px 16px #0004" }}><Folha L={L} cfg={cfg} itens={fatia(fp)} /></div>
                </div>
              </>
            ) : <p className="text-sm text-[#8B6A1F]">Envie imagens para ver a folha.</p>}
          </Painel>
        </div>
      </div>

      <div className="bt-print">
        {Array.from({ length: folhas }).map((_, i) => <Folha key={i} L={L} cfg={cfg} itens={fatia(i)} />)}
      </div>
    </div>
  );
}
