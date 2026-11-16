// Mockup de agenda: capa fechada em 3/4 e folhas abertas, com wire-o/espiral coloridos e elástico.
import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { MdDownload, MdUploadFile } from "react-icons/md";
import { carregarImg, desenharAberta, desenharFechada, FIOS, FORMATOS, mockCfg } from "../lib/mockupAgenda";
import { FONTES } from "../lib/cartaoVisita";
import { lerImagem } from "../lib/lerImagem";
import { abrirPdf, renderPagina } from "../lib/pdfPagina";
import BotaoPadrao from "../components/BotaoPadrao";

const entrada = "w-full rounded-lg border border-[#D8CBA8] bg-white px-2 py-1.5 text-sm";
const Campo = ({ rotulo, children }) => (<div className="flex flex-col gap-1 text-xs text-[#24344D]"><span className="font-semibold">{rotulo}</span>{children}</div>);
const Painel = ({ titulo, children, cls = "" }) => (<section className={`bg-[#FBF8F1] border border-[#D8CBA8] rounded-2xl p-4 flex flex-col gap-3 ${cls}`}><h2 className="font-bold text-[#24344D]">{titulo}</h2>{children}</section>);
const Cores = ({ valor, onChange, lista }) => (
  <div className="flex flex-wrap gap-2">
    {lista.map((f) => <button key={f.cor} type="button" title={f.nome} aria-label={f.nome} onClick={() => onChange(f.cor)} style={{ background: f.cor }} className={`w-7 h-7 rounded-full border-2 shadow ${valor === f.cor ? "border-[#24344D]" : "border-white"}`} />)}
    <input type="color" value={valor} onChange={(e) => onChange(e.target.value)} className="w-7 h-7 rounded-full" aria-label="Cor personalizada" />
  </div>
);
const CORES_CAPA = [{ nome: "Rosa", cor: "#d6567a" }, { nome: "Azul", cor: "#2f6fd0" }, { nome: "Verde", cor: "#5f8f6b" }, { nome: "Lavanda", cor: "#7b5cc4" }, { nome: "Marinho", cor: "#24344D" }, { nome: "Terracota", cor: "#c0643a" }, { nome: "Preto", cor: "#26272b" }, { nome: "Dourado", cor: "#b8862d" }];
const CORES_BORDA = [{ nome: "Cinza-azulado", cor: "#9fb0c0" }, { nome: "Bege", cor: "#d8c9ab" }, { nome: "Rosa", cor: "#e9b4c3" }, { nome: "Verde", cor: "#9db8a3" }, { nome: "Marinho", cor: "#3b4d6b" }, { nome: "Branco", cor: "#efefef" }];
const CORES_ELASTICO = [{ nome: "Creme", cor: "#e9e4d9" }, { nome: "Preto", cor: "#26272b" }, { nome: "Marinho", cor: "#24344D" }, { nome: "Rosa", cor: "#e86a9a" }, { nome: "Vermelho", cor: "#c9243a" }, { nome: "Dourado", cor: "#d4a63c" }, { nome: "Cinza", cor: "#8f949c" }];

// Escolha de uma folha: em branco, exemplo, pautada, imagem ou página de PDF.
function FonteFolha({ titulo, tipo, onTipo, onImagem }) {
  const arq = useRef(null);
  const [doc, setDoc] = useState(null);
  const [pag, setPag] = useState(1);
  const escolher = async (f) => {
    if (!f) return;
    try {
      if (f.type === "application/pdf" || /\.pdf$/i.test(f.name)) { const d = await abrirPdf(f); setDoc(d); setPag(1); onImagem(await renderPagina(d, 1)); }
      else { setDoc(null); onImagem(await lerImagem(f, 1600)); }
      if (tipo === "branco") onTipo("imagem");
    } catch { toast.error("Não foi possível ler o arquivo."); }
  };
  const irPara = async (n) => { if (!doc) return; const v = Math.min(doc.numPages, Math.max(1, n)); setPag(v); onImagem(await renderPagina(doc, v)); };
  return (
    <div className="flex flex-col gap-2 border border-[#E8DFC8] rounded-xl bg-white p-2.5">
      <span className="text-xs font-semibold text-[#24344D]">{titulo}</span>
      <select className={entrada} value={tipo} onChange={(e) => onTipo(e.target.value)}>
        <option value="branco">Em branco</option><option value="pertence">“Pertence a:” (exemplo)</option><option value="linhas">Pautada</option><option value="imagem">Somente imagem / PDF</option>
      </select>
      <div className="flex items-center gap-2 flex-wrap">
        <button type="button" onClick={() => arq.current?.click()} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#24344D] text-white text-xs font-semibold"><MdUploadFile size={15} /> Enviar imagem ou PDF</button>
        {doc && <label className="text-xs flex items-center gap-1">Página <input type="number" min={1} max={doc.numPages} value={pag} onChange={(e) => irPara(Number(e.target.value) || 1)} className="w-16 rounded-lg border border-[#D8CBA8] px-2 py-1" /> de {doc.numPages}</label>}
      </div>
      <input ref={arq} type="file" accept="image/*,application/pdf" hidden onChange={(e) => { escolher(e.target.files[0]); e.target.value = ""; }} />
    </div>
  );
}

function baixar(cv, nome) {
  cv.toBlob((b) => { if (!b) return; const a = document.createElement("a"); a.href = URL.createObjectURL(b); a.download = nome; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000); }, "image/png");
}

export default function MockupAgendaPage() {
  const cfg = mockCfg.useStore();
  const set = (p) => mockCfg.set(p);
  const [srcs, setSrcs] = useState({ capa: null, p1: null, p2: null });
  const cvF = useRef(null), cvA = useRef(null);
  const capaInp = useRef(null);
  const [pronto, setPronto] = useState(false);

  useEffect(() => {
    let vivo = true;
    (async () => {
      try { await Promise.all(["italic 40px 'Great Vibes'", "20px 'Montserrat'", "20px 'Playfair Display'", `40px ${cfg.tituloFonte}`].map((f) => document.fonts.load(f))); } catch { /* fontes opcionais */ }
      const [capa, p1, p2] = await Promise.all([carregarImg(srcs.capa), carregarImg(srcs.p1), carregarImg(srcs.p2)]);
      if (!vivo) return;
      if (cvF.current) desenharFechada(cvF.current, cfg, { capa });
      if (cvA.current) desenharAberta(cvA.current, cfg, { p1, p2 });
      setPronto(true);
    })();
    return () => { vivo = false; };
  }, [cfg, srcs]);

  const enviarCapa = async (f) => { if (!f) return; try { const s = await lerImagem(f, 1600); setSrcs((o) => ({ ...o, capa: s })); } catch { toast.error("Não foi possível ler a imagem."); } };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <div className="grid gap-5 lg:grid-cols-[380px_minmax(0,1fr)]">
        <div className="flex flex-col gap-4 min-w-0">
          <BotaoPadrao onClick={() => { mockCfg.resetar(["formato", "espessura", "yaw", "pitch", "passo", "posElastico", "larguraElastico", "tituloX", "tituloY", "tituloTam", "cantos", "capaModo", "capaZoom", "capaX", "capaY", "ajuste", "folhaZoom", "folhaX", "folhaY"]); toast.success("Medidas padrão restauradas"); }} />
          <Painel titulo="📐 Agenda">
            <div className="grid grid-cols-2 gap-3">
              <Campo rotulo="Formato"><select className={entrada} value={cfg.formato} onChange={(e) => set({ formato: e.target.value })}>{Object.entries(FORMATOS).map(([k, v]) => <option key={k} value={k}>{v[0]}</option>)}</select></Campo>
              <Campo rotulo={`Espessura: ${cfg.espessura} mm`}><input type="range" min={6} max={40} value={cfg.espessura} onChange={(e) => set({ espessura: Number(e.target.value) })} /></Campo>
            </div>
          </Painel>

          <Painel titulo="📕 Capa">
            <div className="flex flex-wrap gap-2 items-center">
              <button type="button" onClick={() => capaInp.current?.click()} className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-[#24344D] text-white text-xs font-semibold"><MdUploadFile size={16} /> Enviar arte da capa</button>
              {srcs.capa && <button type="button" onClick={() => setSrcs((o) => ({ ...o, capa: null }))} className="px-3 py-2 rounded-xl border border-[#D8CBA8] text-xs">Remover</button>}
              <input ref={capaInp} type="file" accept="image/*" hidden onChange={(e) => { enviarCapa(e.target.files[0]); e.target.value = ""; }} />
            </div>
            {srcs.capa && (
              <div className="flex flex-col gap-2 border border-[#E8DFC8] rounded-xl bg-white p-2.5">
                <Campo rotulo="Ajuste da arte"><select className={entrada} value={cfg.capaModo} onChange={(e) => set({ capaModo: e.target.value })}><option value="inteira">Automático — cabe inteira (recomendado)</option><option value="preencher">Preencher (corta o excesso)</option></select></Campo>
                <div className="grid grid-cols-3 gap-2">
                  <Campo rotulo={`Zoom ${Math.round(cfg.capaZoom * 100)}%`}><input type="range" min={0.2} max={3} step={0.02} value={cfg.capaZoom} onChange={(e) => set({ capaZoom: Number(e.target.value) })} /></Campo>
                  <Campo rotulo="Horiz."><input type="range" min={-100} max={100} value={cfg.capaX} onChange={(e) => set({ capaX: Number(e.target.value) })} /></Campo>
                  <Campo rotulo="Vert."><input type="range" min={-100} max={100} value={cfg.capaY} onChange={(e) => set({ capaY: Number(e.target.value) })} /></Campo>
                </div>
                <button type="button" className="self-start underline font-semibold text-xs" onClick={() => set({ capaModo: "inteira", capaZoom: 1, capaX: 0, capaY: 0 })}>↺ Restaurar enquadramento</button>
              </div>
            )}
            <Campo rotulo="Cor da capa (sem arte) e dos detalhes"><Cores valor={cfg.corCapa} onChange={(c) => set({ corCapa: c })} lista={CORES_CAPA} /></Campo>
            <Campo rotulo="Cor da lateral / bordas da capa dura"><Cores valor={cfg.corBorda} onChange={(c) => set({ corBorda: c })} lista={CORES_BORDA} /></Campo>
            <Campo rotulo="Título (vazio = só a arte)"><input className={entrada} value={cfg.tituloAgenda} onChange={(e) => set({ tituloAgenda: e.target.value })} /></Campo>
            <div className="grid grid-cols-3 gap-1.5 w-40">
              {[[15, 12, "↖"], [50, 12, "↑"], [85, 12, "↗"], [20, 50, "←"], [50, 50, "•"], [80, 50, "→"], [15, 88, "↙"], [50, 88, "↓"], [85, 88, "↘"]].map(([x, y, t]) => (
                <button key={t} type="button" title="Posição do título" onClick={() => set({ tituloX: x, tituloY: y })} className={`rounded-lg border py-1 text-sm ${cfg.tituloX === x && cfg.tituloY === y ? "bg-[#24344D] text-white" : "bg-white border-[#D8CBA8]"}`}>{t}</button>))}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Campo rotulo={`Horizontal: ${cfg.tituloX}%`}><input type="range" min={5} max={95} value={cfg.tituloX} onChange={(e) => set({ tituloX: Number(e.target.value) })} /></Campo>
              <Campo rotulo={`Vertical: ${cfg.tituloY}%`}><input type="range" min={4} max={96} value={cfg.tituloY} onChange={(e) => set({ tituloY: Number(e.target.value) })} /></Campo>
              <Campo rotulo={`Tamanho: ${cfg.tituloTam}`}><input type="range" min={3} max={26} value={cfg.tituloTam} onChange={(e) => set({ tituloTam: Number(e.target.value) })} /></Campo>
              <Campo rotulo="Cor do título sobre a arte"><input type="color" className="h-8 w-full" value={cfg.corTitulo} onChange={(e) => set({ corTitulo: e.target.value })} /></Campo>
            </div>
            <Campo rotulo="Estilo da fonte"><select className={entrada} value={cfg.tituloFonte} onChange={(e) => set({ tituloFonte: e.target.value })}>
              {FONTES.map(([v, n]) => <option key={v} value={v}>{n}</option>)}
            </select></Campo>
            <Campo rotulo={`Cantos: ${cfg.cantos} mm`}><input type="range" min={0} max={8} value={cfg.cantos} onChange={(e) => set({ cantos: Number(e.target.value) })} /></Campo>
            <label className="flex gap-2 items-center text-xs"><input type="checkbox" checked={cfg.brilho} onChange={(e) => set({ brilho: e.target.checked })} /> Brilho na capa</label>
          </Painel>

          <Painel titulo="📄 Miolo (folhas abertas)">
            <FonteFolha titulo="Folha da esquerda" tipo={cfg.src1} onTipo={(t) => set({ src1: t })} onImagem={(s) => setSrcs((o) => ({ ...o, p1: s }))} />
            <FonteFolha titulo="Folha da direita (primeira folha)" tipo={cfg.src2} onTipo={(t) => set({ src2: t })} onImagem={(s) => setSrcs((o) => ({ ...o, p2: s }))} />
            <div className="grid grid-cols-2 gap-3">
              <Campo rotulo="Ajuste da imagem"><select className={entrada} value={cfg.ajuste} onChange={(e) => set({ ajuste: e.target.value })}><option value="inteira">Automático — cabe inteira</option><option value="preencher">Preencher a folha</option></select></Campo>
              <Campo rotulo="Cor do papel"><input type="color" className="h-8 w-full" value={cfg.papel} onChange={(e) => set({ papel: e.target.value })} /></Campo>
              <Campo rotulo={`Zoom ${Math.round(cfg.folhaZoom * 100)}%`}><input type="range" min={0.2} max={3} step={0.02} value={cfg.folhaZoom} onChange={(e) => set({ folhaZoom: Number(e.target.value) })} /></Campo>
              <div className="grid grid-cols-2 gap-2"><Campo rotulo="Horiz."><input type="range" min={-100} max={100} value={cfg.folhaX} onChange={(e) => set({ folhaX: Number(e.target.value) })} /></Campo><Campo rotulo="Vert."><input type="range" min={-100} max={100} value={cfg.folhaY} onChange={(e) => set({ folhaY: Number(e.target.value) })} /></Campo></div>
            </div>
          </Painel>

          <Painel titulo="🌀 Wire-o / espiral">
            <div className="grid grid-cols-2 gap-3">
              <Campo rotulo="Tipo"><select className={entrada} value={cfg.tipoWire} onChange={(e) => set({ tipoWire: e.target.value, passo: e.target.value === "wireo" ? 8.5 : 9.5 })}><option value="espiral">Espiral (helicoidal)</option><option value="wireo">Wire-o (duplo)</option></select></Campo>
              <Campo rotulo={`Passo entre anéis: ${cfg.passo} mm`}><input type="range" min={6} max={14} step={0.5} value={cfg.passo} onChange={(e) => set({ passo: Number(e.target.value) })} /></Campo>
            </div>
            <Campo rotulo="Cor do wire-o / espiral"><Cores valor={cfg.corWire} onChange={(c) => set({ corWire: c })} lista={FIOS} /></Campo>
          </Painel>

          <Painel titulo="➰ Elástico">
            <label className="flex gap-2 items-center text-xs"><input type="checkbox" checked={cfg.elastico} onChange={(e) => set({ elastico: e.target.checked })} /> Com elástico</label>
            {cfg.elastico && (<>
              <Campo rotulo="Cor do elástico"><Cores valor={cfg.corElastico} onChange={(c) => set({ corElastico: c })} lista={CORES_ELASTICO} /></Campo>
              <div className="grid grid-cols-2 gap-3">
                <Campo rotulo={`Distância da borda: ${cfg.posElastico} mm`}><input type="range" min={5} max={40} value={cfg.posElastico} onChange={(e) => set({ posElastico: Number(e.target.value) })} /></Campo>
                <Campo rotulo={`Largura: ${cfg.larguraElastico} mm`}><input type="range" min={3} max={16} value={cfg.larguraElastico} onChange={(e) => set({ larguraElastico: Number(e.target.value) })} /></Campo>
              </div>
            </>)}
          </Painel>

          <Painel titulo="🎬 Cena">
            <div className="grid grid-cols-2 gap-3">
              <Campo rotulo={`Giro: ${cfg.yaw}°`}><input type="range" min={8} max={60} value={cfg.yaw} onChange={(e) => set({ yaw: Number(e.target.value) })} /></Campo>
              <Campo rotulo={`Inclinação: ${cfg.pitch}°`}><input type="range" min={0} max={40} value={cfg.pitch} onChange={(e) => set({ pitch: Number(e.target.value) })} /></Campo>
              <Campo rotulo="Fundo"><select className={entrada} value={cfg.fundo} onChange={(e) => set({ fundo: e.target.value })}><option value="estudio">Estúdio</option><option value="cor">Cor lisa</option><option value="transparente">Transparente (PNG)</option></select></Campo>
              <Campo rotulo="Cor do fundo"><input type="color" className="h-8 w-full" value={cfg.corFundo} onChange={(e) => set({ corFundo: e.target.value })} /></Campo>
            </div>
          </Painel>
        </div>

        <div className="flex flex-col gap-4 min-w-0 pre-fixa">
          <Painel titulo="📕 Capa fechada">
            <canvas ref={cvF} width={1500} height={1300} className="w-full h-auto rounded-xl bg-[#eee]" />
            <button type="button" disabled={!pronto} onClick={() => baixar(cvF.current, "agenda-fechada.png")} className="self-start inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#8B1D2C] text-white text-sm font-bold"><MdDownload size={18} /> Baixar PNG</button>
          </Painel>
          <Painel titulo="📖 Agenda aberta">
            <canvas ref={cvA} width={1800} height={1100} className="w-full h-auto rounded-xl bg-[#eee]" />
            <button type="button" disabled={!pronto} onClick={() => baixar(cvA.current, "agenda-aberta.png")} className="self-start inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#8B1D2C] text-white text-sm font-bold"><MdDownload size={18} /> Baixar PNG</button>
          </Painel>
        </div>
      </div>
    </div>
  );
}
