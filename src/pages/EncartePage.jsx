// Encarte de ofertas de supermercado: grade de produtos com foto, nome e preço.
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { MdAdd, MdDeleteOutline, MdPrint, MdUploadFile } from "react-icons/md";
import Encarte from "../components/encarte/Encarte";
import { encarteCfg, encarteFotos, encarteLogo, FONTES_ENC, novoItemEnc, PALETAS_ENC } from "../lib/encarte";
import { lerImagem } from "../lib/lerImagem";
import GradeModelos, { MiniPaleta } from "../components/ui/GradeModelos";
import Painel from "../components/ui/Painel";
import Faixa from "../components/ui/Faixa";
import BarraEditor, { useAbaMobile } from "../components/ui/BarraEditor";
import { useHistorico } from "../lib/historico";
import OpcoesFonte from "../components/ui/OpcoesFonte";

const MM = 3.7795;
const PAPEL = { a4: [210, 297], a3: [297, 420], a5: [148, 210] };
const entrada = "w-full rounded-lg border border-[#D8CBA8] bg-white px-2 py-1.5 text-sm";
const Campo = ({ rotulo, children }) => (<label className="flex flex-col gap-1 text-xs text-[#24344D]"><span className="font-semibold">{rotulo}</span>{children}</label>);

export default function EncartePage() {
  const cfg = encarteCfg.useStore();
  const set = (o) => encarteCfg.set(o);
  const abas = useAbaMobile();
  const hist = useHistorico(encarteCfg);
  const [, forca] = useState(0);
  const [pg, setPg] = useState(0);
  const [larg, setLarg] = useState(520);
  const col = useRef(null);
  useEffect(() => {
    const ro = new ResizeObserver(() => col.current && setLarg(col.current.clientWidth));
    if (col.current) ro.observe(col.current);
    return () => ro.disconnect();
  }, []);

  const P = PALETAS_ENC.find((x) => x.id === cfg.paleta) || PALETAS_ENC[0];
  const [pw, ph] = PAPEL[cfg.papel] || PAPEL.a4;
  const W = cfg.orient === "paisagem" ? ph : pw, H = cfg.orient === "paisagem" ? pw : ph;
  const porPagina = cfg.cols * cfg.maxLinhas;
  const paginas = useMemo(() => {
    const r = [];
    for (let i = 0; i < cfg.itens.length; i += porPagina) r.push(cfg.itens.slice(i, i + porPagina));
    return r.length ? r : [[]];
  }, [cfg.itens, porPagina]);
  const pgs = Math.min(pg, paginas.length - 1);
  const [altJan, setAltJan] = useState(typeof window !== "undefined" ? window.innerHeight : 800);
  useEffect(() => { const f = () => setAltJan(window.innerHeight); window.addEventListener("resize", f); return () => window.removeEventListener("resize", f); }, []);
  const altDisp = Math.max(260, altJan - 190); // cabeçalho + seletor de folha + respiro
  const z = Math.min(1, larg / (W * MM), altDisp / (H * MM));

  const setItem = (id, o) => set({ itens: cfg.itens.map((i) => (i.id === id ? { ...i, ...o } : i)) });
  const foto = async (id, f) => { try { encarteFotos[id] = await lerImagem(f, 900); toast.success("Foto carregada."); forca((n) => n + 1); } catch { toast.error("Imagem inválida."); } };
  const lote = async (files) => {
    const novos = [];
    for (const f of files) {
      const nome = f.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ").trim().toUpperCase().slice(0, 40) || "PRODUTO";
      const it = novoItemEnc({ nome, preco: "0,00", emoji: "" });
      try { encarteFotos[it.id] = await lerImagem(f, 900); novos.push(it); } catch { /* ignora */ }
    }
    if (novos.length) { set({ itens: [...cfg.itens, ...novos] }); toast.success(`${novos.length} produto(s) criado(s) pelas fotos. Ajuste nome e preço.`); }
  };
  const logo = async (f) => { try { encarteLogo.url = await lerImagem(f, 700); toast.success("Logo carregado."); forca((n) => n + 1); } catch { toast.error("Imagem inválida."); } };

  return (
    <div className="enc-raiz mx-auto max-w-7xl px-4 pt-6 pb-28">
      <style>{`
        .enc-print { display: none; }
        @media print {
          @page { size: ${W}mm ${H}mm; margin: 0; }
          html, body { width: ${W}mm !important; background: #fff !important; }
          .enc-raiz { padding: 0 !important; max-width: none !important; }
          .enc-tela { display: none !important; }
          .enc-print { display: block !important; }
          .enc-print > div { break-after: page; page-break-after: always; height: ${H}mm; overflow: hidden; }
          .enc-print > div:last-child { break-after: auto; page-break-after: auto; }
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        }
      `}</style>
      <div className="enc-tela grid gap-5 lg:grid-cols-[420px_minmax(0,1fr)]">
        <BarraEditor tipo="encarte" abas={abas} historico={hist} onImprimir={() => window.print()} rotuloImprimir={`Imprimir · ${paginas.length} folha${paginas.length === 1 ? "" : "s"}`} aoRestaurar={() => forca((n) => n + 1)} />
        <div className={`flex flex-col gap-4 min-w-0 ${abas.clsEditar}`}>
          <Painel titulo="🛒 Encarte de ofertas">
            <p className="text-[11px] text-[#8B6A1F]">Monte a folha de ofertas da semana: título, validade, produtos com foto e preço, e rodapé com WhatsApp e endereço.</p>
            <GradeModelos itens={PALETAS_ENC.map((p) => ({ id: p.id, rotulo: p.nome, miniatura: <MiniPaleta p={p} /> }))} valor={cfg.paleta} colunas={4} aspecto="aspect-[4/3]" onChange={(id) => set({ paleta: id })} />
          </Painel>
          <Painel titulo="🏷️ Cabeçalho e rodapé" aberto={false}>
            <Campo rotulo="Título"><input className={entrada} value={cfg.titulo} onChange={(e) => set({ titulo: e.target.value })} /></Campo>
            <Campo rotulo="Fonte do título"><select className={entrada} value={cfg.fonteTitulo} onChange={(e) => set({ fonteTitulo: e.target.value })}><OpcoesFonte lista={FONTES_ENC} /></select></Campo>
            <Campo rotulo="Validade (faixa colorida)"><input className={entrada} value={cfg.validade} onChange={(e) => set({ validade: e.target.value })} /></Campo>
            <Campo rotulo="Nome do mercado (canto)"><input className={entrada} value={cfg.mercado} onChange={(e) => set({ mercado: e.target.value })} /></Campo>
            <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#D8CBA8] bg-white text-xs font-semibold cursor-pointer text-[#24344D] self-start"><MdUploadFile /> {encarteLogo.url ? "Trocar logo" : "Logo do mercado"}
              <input type="file" accept="image/*" className="hidden" onChange={(e) => { if (e.target.files[0]) logo(e.target.files[0]); e.target.value = ""; }} /></label>
            {encarteLogo.url && <button type="button" className="text-xs underline text-[#8B2E3F] self-start" onClick={() => { encarteLogo.url = null; forca((n) => n + 1); }}>Remover logo</button>}
            <Campo rotulo="Rodapé (linha grande — WhatsApp, redes)"><input className={entrada} value={cfg.rodape1} onChange={(e) => set({ rodape1: e.target.value })} /></Campo>
            <Campo rotulo="Rodapé (linha pequena — endereço)"><input className={entrada} value={cfg.rodape2} onChange={(e) => set({ rodape2: e.target.value })} /></Campo>
          </Painel>
          <Painel titulo="📐 Folha e grade" aberto={false}>
            <div className="grid grid-cols-2 gap-3">
              <Campo rotulo="Papel"><select className={entrada} value={cfg.papel} onChange={(e) => set({ papel: e.target.value })}><option value="a4">A4</option><option value="a3">A3</option><option value="a5">A5</option></select></Campo>
              <Campo rotulo="Posição"><select className={entrada} value={cfg.orient} onChange={(e) => set({ orient: e.target.value })}><option value="retrato">Em pé</option><option value="paisagem">Deitada</option></select></Campo>
              <Faixa rotulo="Colunas" valor={cfg.cols} min={2} max={7} onChange={(v) => set({ cols: v })} />
              <Faixa rotulo="Linhas por folha" valor={cfg.maxLinhas} min={1} max={8} onChange={(v) => set({ maxLinhas: v })} />
            </div>
            <p className="text-[11px] text-[#6B6458]">{porPagina} ofertas por folha. Com {cfg.itens.length} produto(s), saem {paginas.length} folha(s).</p>
          </Painel>
          <Painel titulo={`🥕 Produtos (${cfg.itens.length})`}>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => set({ itens: [...cfg.itens, novoItemEnc()] })} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#24344D] text-white text-xs font-semibold"><MdAdd /> Produto</button>
              <label className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#D8CBA8] bg-white text-xs font-semibold cursor-pointer text-[#24344D]"><MdUploadFile /> Criar por fotos (várias)
                <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => { lote([...e.target.files]); e.target.value = ""; }} /></label>
              <button type="button" className="text-xs underline text-[#8B2E3F]" onClick={() => { if (window.confirm("Remover todos os produtos?")) set({ itens: [] }); }}>Limpar todos</button>
            </div>
            <div className="flex flex-col gap-2 max-h-[420px] overflow-y-auto pr-1">
              {cfg.itens.map((it, i) => (
                <div key={it.id} className="grid grid-cols-[1fr_72px_52px_auto_auto] gap-1.5 items-center">
                  <input className={entrada} value={it.nome} onChange={(e) => setItem(it.id, { nome: e.target.value })} placeholder="Produto" aria-label={`Produto ${i + 1}`} />
                  <input className={entrada} value={it.preco} onChange={(e) => setItem(it.id, { preco: e.target.value })} placeholder="0,00" aria-label="Preço" />
                  <input className={entrada} value={it.unid} onChange={(e) => setItem(it.id, { unid: e.target.value })} placeholder="kg" aria-label="Unidade" />
                  <label className={`w-8 h-8 grid place-items-center rounded-lg border cursor-pointer ${encarteFotos[it.id] ? "bg-[#e4f5e9] border-[#166534]" : "bg-white border-[#D8CBA8]"}`} title="Foto do produto"><MdUploadFile />
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => { if (e.target.files[0]) foto(it.id, e.target.files[0]); e.target.value = ""; }} /></label>
                  <button type="button" aria-label="Excluir produto" className="w-8 h-8 grid place-items-center text-[#8B2E3F]" onClick={() => { delete encarteFotos[it.id]; set({ itens: cfg.itens.filter((x) => x.id !== it.id) }); }}><MdDeleteOutline /></button>
                </div>))}
            </div>
            <p className="text-[11px] text-[#6B6458]">Dica: use “Criar por fotos” para subir várias imagens de uma vez; o nome do arquivo vira o nome do produto.</p>
          </Painel>
        </div>
        <div ref={col} className={`pre-fixa flex flex-col gap-3 min-w-0 ${abas.clsVer}`}>
          {paginas.length > 1 && <select className="self-start rounded-lg border border-[#D8CBA8] bg-white px-2 py-1 text-xs" value={pgs} onChange={(e) => setPg(Number(e.target.value))}>{paginas.map((_, i) => <option key={i} value={i}>Folha {i + 1} de {paginas.length}</option>)}</select>}
          <div className="shadow-[0_6px_24px_rgba(36,52,77,0.2)] overflow-hidden bg-white" style={{ width: W * MM * z, height: H * MM * z }}>
            <div style={{ transform: `scale(${z})`, transformOrigin: "top left", width: `${W}mm` }}>
              <Encarte cfg={cfg} P={P} itens={paginas[pgs]} W={W} H={H} pagina={pgs} total={paginas.length} />
            </div>
          </div>
        </div>
      </div>
      <div className="enc-print">{paginas.map((it, i) => <div key={i}><Encarte cfg={cfg} P={P} itens={it} W={W} H={H} pagina={i} total={paginas.length} /></div>)}</div>
    </div>
  );
}
