// Imprimir PDF próprio com as mesmas opções de impressão do gerador:
// A4/A5/A6, 2 ou 4 por folha, só frente / só verso.
import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { LadosImpressao } from "../components/OpcoesImpressao";
import { FORMATOS, impressao, prepararImpressao } from "../lib/configImpressao";
import { lerPdf, parseIntervalo } from "../lib/pdfImpressao";
import { pdfCfg, TONS } from "../lib/configPdf";
import PdfFolha from "../components/PdfFolha";
import { PainelStickers, StickerPortais } from "../components/StickersEditor";
import { stickersDados, stickersUi } from "../lib/stickers";

export default function ImprimirPdfPage() {
  const [nome, setNome] = useState("");
  const [paginas, setPaginas] = useState([]); // [{url, larg, alt}]
  const [total, setTotal] = useState(0);
  const [lendo, setLendo] = useState(false);
  const [intervalo, setIntervalo] = useState("");
  const [girar, setGirar] = useState(true);
  const [ajuste, setAjuste] = useState("caber"); // caber | preencher
  const [bgImg, setBgImg] = useState(null);
  const [marcaImg, setMarcaImg] = useState(null);
  const cfg = pdfCfg.useStore();
  const stItens = stickersDados.useStore().itens;
  const { editando } = stickersUi.useStore();
  const token = useRef(0);
  const lerImg = (set) => (e) => {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;
    const r = new FileReader();
    r.onload = () => set(r.result);
    r.readAsDataURL(f);
  };
  const { formato } = impressao.useStore();

  useEffect(() => () => { token.current += 1; }, []);

  const enviar = async (e) => {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;
    if (f.type !== "application/pdf" && !f.name.toLowerCase().endsWith(".pdf")) {
      toast.error("Escolha um arquivo PDF.");
      return;
    }
    const meu = (token.current += 1);
    setNome(f.name);
    setPaginas([]);
    setTotal(0);
    setIntervalo("");
    setLendo(true);
    try {
      await lerPdf(f, {
        onTotal: setTotal,
        onPagina: (i, p) => meu === token.current && setPaginas((a) => { const n = [...a]; n[i] = p; return n; }),
        cancelado: () => meu !== token.current,
      });
    } catch (err) {
      console.error(err);
      toast.error("Não consegui ler esse PDF (protegido por senha ou corrompido?).");
      setNome("");
    } finally {
      if (meu === token.current) setLendo(false);
    }
  };

  const escolhidas = parseIntervalo(intervalo, total).filter((i) => paginas[i]);
  const f = FORMATOS.find((x) => x.id === formato) || FORMATOS[0];
  const porFolha = f.cols * f.rows;
  const folhas = Math.ceil(escolhidas.length / porFolha);

  const imprimir = () => {
    if (!escolhidas.length) return toast.error("Nenhuma página selecionada.");
    const restaurar = prepararImpressao(impressao.get());
    window.print();
    restaurar();
  };

  return (
    <div className="max-w-5xl mx-auto px-5 sm:px-6 py-6 flex flex-col gap-5">
      <div className="print:hidden flex flex-col gap-5">
        <div>
          <h2 className="text-xl font-semibold text-[#24344D]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Imprimir PDF</h2>
          <p className="text-sm text-[#6B6458]">Suba qualquer PDF e imprima com as mesmas opções do gerador: A4, A5, A6, 2 ou 4 por folha, só frente ou só verso.</p>
        </div>

        <label className="border-2 border-dashed border-[#D8CBA8] hover:border-[#B8933D] bg-[#FBF8F1] rounded-2xl p-8 text-center cursor-pointer block transition">
          <input type="file" accept="application/pdf,.pdf" className="hidden" onChange={enviar} />
          <span className="text-3xl block">📄</span>
          <b className="text-[#24344D] text-sm">{nome || "Clique para escolher um PDF"}</b>
          <span className="block text-xs text-[#8B6A1F] mt-1">
            {lendo ? `Preparando páginas… ${paginas.filter(Boolean).length}/${total || "?"}` : total ? `${total} páginas lidas` : "O arquivo fica só no seu navegador — nada é enviado."}
          </span>
        </label>

        {total > 0 && (
          <div className="bg-[#FBF8F1] border border-[#D8CBA8] rounded-xl p-4 flex flex-col gap-3 text-xs text-[#24344D]">
            <LadosImpressao />
            <div className="flex flex-wrap items-end gap-4">
              <label className="flex flex-col gap-1">Páginas (ex.: 1-5, 8, 10-12 — vazio = todas)
                <input value={intervalo} onChange={(e) => setIntervalo(e.target.value)} placeholder="todas" className="border border-[#D8CBA8] rounded-lg px-2.5 py-2 bg-white w-56" />
              </label>
              <label className="flex flex-col gap-1">Ajuste na folha
                <select value={ajuste} onChange={(e) => setAjuste(e.target.value)} className="border border-[#D8CBA8] rounded-lg px-2.5 py-2 bg-white">
                  <option value="caber">Caber inteira (sem cortar)</option>
                  <option value="preencher">Preencher a folha (pode cortar bordas)</option>
                </select>
              </label>
              <label className="flex items-center gap-1.5"><input type="checkbox" checked={girar} onChange={(e) => setGirar(e.target.checked)} />Girar páginas deitadas (paisagem)</label>
            </div>
            <div className="border-t border-[#D8CBA8]/70 pt-3 flex flex-col gap-3">
              <b>🎨 Fundo da página</b>
              <div className="flex flex-wrap items-center gap-2">
                <button type="button" onClick={() => pdfCfg.set({ bgCor: "" })} className={`px-2.5 py-1 rounded-lg border bg-white ${!cfg.bgCor ? "border-[#24344D]" : "border-[#D8CBA8]"}`}>Sem fundo</button>
                {TONS.map((c) => <button key={c} type="button" aria-label={c} onClick={() => pdfCfg.set({ bgCor: c })} className={`w-7 h-7 rounded-full border-2 ${cfg.bgCor === c ? "border-[#24344D]" : "border-white shadow"}`} style={{ background: c }} />)}
                <input type="color" value={cfg.bgCor || "#ffffff"} onChange={(e) => pdfCfg.set({ bgCor: e.target.value })} className="w-8 h-8 rounded cursor-pointer" aria-label="Outra cor" />
                <label className="flex items-center gap-1 ml-2">Intensidade <input type="range" min="5" max="100" value={cfg.bgOp} onChange={(e) => pdfCfg.set({ bgOp: Number(e.target.value) })} /></label>
                <label className="px-2.5 py-1 rounded-lg border border-[#D8CBA8] bg-white cursor-pointer">🖼️ Imagem de fundo<input type="file" accept="image/*" className="hidden" onChange={lerImg(setBgImg)} /></label>
                {bgImg && <button type="button" onClick={() => setBgImg(null)} className="text-[#8B2E3F] underline">remover imagem</button>}
              </div>
              <b>💧 Marca d'água</b>
              <div className="flex flex-wrap items-end gap-3">
                <label className="flex flex-col gap-1">Tipo
                  <select value={cfg.marcaTipo} onChange={(e) => pdfCfg.set({ marcaTipo: e.target.value })} className="border border-[#D8CBA8] rounded-lg px-2.5 py-2 bg-white">
                    <option value="nenhuma">Nenhuma</option><option value="texto">Texto</option><option value="imagem">Imagem / logo</option>
                  </select>
                </label>
                {cfg.marcaTipo === "texto" && <>
                  <label className="flex flex-col gap-1">Texto<input value={cfg.marcaTexto} onChange={(e) => pdfCfg.set({ marcaTexto: e.target.value })} className="border border-[#D8CBA8] rounded-lg px-2.5 py-2 bg-white w-40" /></label>
                  <label className="flex flex-col gap-1">Cor<input type="color" value={cfg.marcaCor} onChange={(e) => pdfCfg.set({ marcaCor: e.target.value })} className="w-10 h-9 rounded" /></label>
                </>}
                {cfg.marcaTipo === "imagem" && (
                  <label className="px-2.5 py-2 rounded-lg border border-[#D8CBA8] bg-white cursor-pointer">{marcaImg ? "Trocar imagem" : "Escolher imagem"}<input type="file" accept="image/*" className="hidden" onChange={lerImg(setMarcaImg)} /></label>
                )}
                {cfg.marcaTipo !== "nenhuma" && <>
                  <label className="flex flex-col gap-1">Transparência<input type="range" min="3" max="80" value={cfg.marcaOp} onChange={(e) => pdfCfg.set({ marcaOp: Number(e.target.value) })} /></label>
                  <label className="flex flex-col gap-1">Tamanho<input type="range" min="8" max="80" value={cfg.marcaTam} onChange={(e) => pdfCfg.set({ marcaTam: Number(e.target.value) })} /></label>
                  <label className="flex flex-col gap-1">Giro<input type="range" min="-90" max="90" value={cfg.marcaGiro} onChange={(e) => pdfCfg.set({ marcaGiro: Number(e.target.value) })} /></label>
                </>}
              </div>
              <PainelStickers prefixo="pdf-" />
            </div>
            <p className="text-[11px] text-[#8B6A1F]">
              {escolhidas.length} página(s) → {folhas} folha(s) {f.id === "a4" ? "A4" : f.nome.toLowerCase()}.
              Na caixa de impressão do navegador, deixe <b>escala 100%</b> e <b>margens: nenhuma</b>.
            </p>
            <button type="button" onClick={imprimir} disabled={lendo} className="self-start bg-[#24344D] disabled:opacity-50 text-[#F6F1E7] font-semibold text-sm py-2.5 px-6 rounded-xl">
              🖨️ Imprimir / salvar PDF
            </button>
          </div>
        )}

        {total > 0 && !editando && (
          <div className="flex flex-wrap gap-3">
            {Array.from({ length: total }).map((_, i) => {
              const p = paginas[i];
              const fora = !escolhidas.includes(i);
              return (
                <div key={i} className={`relative bg-white border border-[#D8CBA8] rounded-md overflow-hidden ${fora ? "opacity-30" : ""}`} style={{ width: 130, height: 184 }}>
                  {p ? <div style={{ zoom: 130 / 794 }}><PdfFolha p={p} cfg={cfg} bgImg={bgImg} marcaImg={marcaImg} ajuste={ajuste} girar={girar} /></div> : <span className="text-[10px] text-gray-400">…</span>}
                  <span className="absolute bottom-0 right-0 bg-[#24344D]/80 text-white text-[9px] px-1.5 rounded-tl">{i + 1}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <StickerPortais ativo={escolhidas.length > 0 && (editando || stItens.length > 0)} />
      {escolhidas.length > 0 && (
        <div className="print-container hidden print:block">
          {escolhidas.map((i) => {
            const p = paginas[i];
            return (
              <div key={i} className="page-break" data-stkey={`pdf-${i}`}>
                <PdfFolha p={p} cfg={cfg} bgImg={bgImg} marcaImg={marcaImg} ajuste={ajuste} girar={girar} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
