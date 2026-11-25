// Barra fixa no rodapé das telas de edição: Editar/Ver (celular), desfazer/refazer, projetos e imprimir.
import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { MdCopyAll, MdDeleteOutline, MdDownload, MdEdit, MdFolderOpen, MdPrint, MdRedo, MdSave, MdUndo, MdVisibility } from "react-icons/md";
import { assinatura, abrirProjeto, duplicarProjeto, excluirProjeto, listarProjetos, renomearProjeto, restaurarRascunho, salvarProjeto, salvarRascunho, TIPOS } from "../../lib/projetos";

// Aba ativa em telas estreitas: "editar" | "ver"
export function useAbaMobile() {
  const [aba, setAba] = useState("editar");
  return {
    aba, setAba,
    clsEditar: aba === "ver" ? "max-lg:hidden" : "",
    clsVer: aba === "editar" ? "max-lg:hidden" : "",
  };
}

// Guarda as imagens (e o que não fica no localStorage) em um rascunho e restaura ao abrir a tela.
function useRascunho(tipo, adRef, aoRestaurar) {
  useEffect(() => {
    let vivo = true;
    const ad = () => adRef.current;
    if (ad().vazio ? ad().vazio() : true) restaurarRascunho(tipo, ad()).then((ok) => { if (ok && vivo) aoRestaurar(); }).catch(() => {});
    let ultima = assinatura(ad().imgs());
    const t = setInterval(() => {
      const a = assinatura(ad().imgs());
      if (a !== ultima) { ultima = a; salvarRascunho(tipo, ad()).catch(() => {}); }
    }, 2500);
    return () => { vivo = false; clearInterval(t); };
  }, [tipo]); // eslint-disable-line react-hooks/exhaustive-deps
}

const idAtual = (tipo) => { try { return localStorage.getItem(`projeto-atual:${tipo}`) || ""; } catch { return ""; } };
const gravaAtual = (tipo, id) => { try { localStorage.setItem(`projeto-atual:${tipo}`, id || ""); } catch { /* ok */ } };

function ModalProjetos({ tipo, fechar, aoAbrir, adRef, nomeTipo }) {
  const [lista, setLista] = useState(null);
  const [nome, setNome] = useState("");
  const [atual, setAtual] = useState(idAtual(tipo));
  const recarregar = () => listarProjetos(tipo).then(setLista).catch(() => setLista([]));
  useEffect(() => { recarregar(); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const salvarNovo = async () => {
    try { const p = await salvarProjeto(tipo, nome.trim() || `Projeto ${(lista?.length || 0) + 1}`, undefined, adRef.current); gravaAtual(tipo, p.id); setAtual(p.id); setNome(""); toast.success(`Projeto “${p.nome}” salvo.`); recarregar(); }
    catch { toast.error("Não consegui salvar (armazenamento do navegador indisponível)."); }
  };
  const atualizar = async (p) => { try { await salvarProjeto(tipo, p.nome, p.id, adRef.current); toast.success(`“${p.nome}” atualizado.`); recarregar(); } catch { toast.error("Não consegui salvar."); } };
  const abrir = async (p) => { const r = await abrirProjeto(p.id, tipo, adRef.current); if (r) { gravaAtual(tipo, p.id); setAtual(p.id); aoAbrir(); toast.success(`Projeto “${p.nome}” aberto.`); fechar(); } };
  const dup = async (p) => { await duplicarProjeto(p.id); toast.success("Projeto duplicado."); recarregar(); };
  const ren = async (p) => { const n = window.prompt("Novo nome do projeto:", p.nome); if (n && n.trim()) { await renomearProjeto(p.id, n.trim()); recarregar(); } };
  const del = async (p) => { if (!window.confirm(`Excluir o projeto “${p.nome}”?`)) return; await excluirProjeto(p.id); if (atual === p.id) { gravaAtual(tipo, ""); setAtual(""); } toast.success("Projeto excluído."); recarregar(); };
  const btn = "px-2 py-1 rounded-md border border-[#D8CBA8] bg-white text-[11px] font-semibold text-[#24344D] hover:bg-[#EFE4C8]";
  return (
    <div className="fixed inset-0 z-[60] bg-black/40 flex items-end sm:items-center justify-center p-3 print:hidden" onClick={fechar} role="dialog" aria-modal="true" aria-label="Meus projetos">
      <div className="bg-[#FBF8F1] rounded-2xl border border-[#D8CBA8] shadow-xl w-full max-w-lg max-h-[85vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#D8CBA8]">
          <h2 className="font-bold text-[#24344D]">📁 Meus projetos — {nomeTipo}</h2>
          <button type="button" onClick={fechar} className="text-xl leading-none px-2 text-[#6B6458]" aria-label="Fechar">×</button>
        </div>
        <div className="p-4 flex flex-col gap-3 overflow-y-auto">
          <div className="flex gap-2">
            <input value={nome} onChange={(e) => setNome(e.target.value)} onKeyDown={(e) => e.key === "Enter" && salvarNovo()} placeholder="Nome do projeto (ex.: Capas turma A)" className="flex-1 rounded-lg border border-[#D8CBA8] bg-white px-2 py-1.5 text-sm" />
            <button type="button" onClick={salvarNovo} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#24344D] text-white text-xs font-semibold"><MdSave /> Salvar como novo</button>
          </div>
          <p className="text-[11px] text-[#8B6A1F]">Salva tudo o que está na tela agora: textos, cores, medidas e imagens. Fica guardado neste navegador.</p>
          {lista === null && <p className="text-sm text-[#6B6458]">Carregando…</p>}
          {lista && lista.length === 0 && <p className="text-sm text-[#6B6458]">Nenhum projeto salvo ainda.</p>}
          {lista && lista.map((p) => (
            <div key={p.id} className={`rounded-xl border p-3 bg-white flex flex-col gap-2 ${p.id === atual ? "border-[#8B1D2C] ring-1 ring-[#8B1D2C]" : "border-[#D8CBA8]"}`}>
              <div className="flex items-baseline justify-between gap-2">
                <b className="text-sm text-[#24344D] truncate">{p.nome}{p.id === atual ? " · em uso" : ""}</b>
                <span className="text-[10px] text-[#8a8272] shrink-0">{new Date(p.atualizado).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })}</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <button type="button" className={`${btn} !bg-[#24344D] !text-white`} onClick={() => abrir(p)}><MdFolderOpen className="inline" /> Abrir</button>
                {p.id === atual && <button type="button" className={btn} onClick={() => atualizar(p)}><MdSave className="inline" /> Atualizar com a tela atual</button>}
                <button type="button" className={btn} onClick={() => dup(p)}><MdCopyAll className="inline" /> Duplicar</button>
                <button type="button" className={btn} onClick={() => ren(p)}><MdEdit className="inline" /> Renomear</button>
                <button type="button" className={`${btn} !text-[#8B2E3F]`} onClick={() => del(p)}><MdDeleteOutline className="inline" /> Excluir</button>
              </div>
            </div>))}
        </div>
      </div>
    </div>
  );
}

export default function BarraEditor({ tipo, abas, historico, onImprimir, onPdfLeve, rotuloImprimir = "Imprimir", aoRestaurar = () => {}, adaptador }) {
  const [modal, setModal] = useState(false);
  const [imprimindo, setImprimindo] = useState(false);
  const adRef = useRef(adaptador || TIPOS[tipo]);
  useEffect(() => { adRef.current = adaptador || TIPOS[tipo]; });
  useRascunho(tipo, adRef, aoRestaurar);
  const imprimir = async () => {
    setImprimindo(true);
    try { await onImprimir(); } finally { setImprimindo(false); }
  };
  const [gerandoPdf, setGerandoPdf] = useState("");
  const pdfLeve = async () => {
    setGerandoPdf("…");
    try { await onPdfLeve((a, t) => setGerandoPdf(`${Math.round((a / t) * 100)}%`)); } finally { setGerandoPdf(""); }
  };
  const ib = "w-8 sm:w-9 h-9 grid place-items-center rounded-lg border border-[#D8CBA8] bg-white text-[#24344D] disabled:opacity-40";
  return (
    <>
      <div className="fixed bottom-0 inset-x-0 z-30 bg-[#FBF8F1]/95 backdrop-blur border-t border-[#D8CBA8] print:hidden">
        <div className="max-w-7xl 2xl:max-w-[2100px] mx-auto px-3 py-2 flex items-center gap-1.5 sm:gap-2">
          <div className="lg:hidden flex rounded-lg border border-[#D8CBA8] overflow-hidden bg-white shrink-0" role="tablist" aria-label="Alternar entre editar e ver">
            {[["editar", "Editar", MdEdit], ["ver", "Ver", MdVisibility]].map(([k, n, I]) => (
              <button key={k} type="button" role="tab" aria-selected={abas.aba === k} onClick={() => abas.setAba(k)} className={`inline-flex items-center gap-1 px-3 py-2 text-xs font-bold ${abas.aba === k ? "bg-[#24344D] text-white" : "text-[#24344D]"}`}><I />{n}</button>))}
          </div>
          {historico && (
            <div className="flex gap-1 shrink-0">
              <button type="button" className={ib} onClick={historico.desfazer} disabled={!historico.podeDesfazer} title="Desfazer (Ctrl+Z)" aria-label="Desfazer"><MdUndo /></button>
              <button type="button" className={ib} onClick={historico.refazer} disabled={!historico.podeRefazer} title="Refazer (Ctrl+Y)" aria-label="Refazer"><MdRedo /></button>
            </div>)}
          <button type="button" onClick={() => setModal(true)} aria-label="Meus projetos" className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 h-9 rounded-lg border border-[#D8CBA8] bg-white text-xs font-bold text-[#24344D] shrink-0"><MdFolderOpen /> <span className="hidden sm:inline">Meus projetos</span></button>
          {onPdfLeve && <button type="button" onClick={pdfLeve} disabled={!!gerandoPdf || imprimindo} title="Gera um PDF pequeno, pronto para a impressora" className="ml-auto inline-flex items-center justify-center gap-1.5 px-3 sm:px-4 h-10 rounded-xl border-2 border-[#24344D] bg-white text-[#24344D] text-xs sm:text-sm font-bold disabled:opacity-60 min-w-0"><MdDownload className="shrink-0" /><span className="truncate">{gerandoPdf ? `Gerando ${gerandoPdf}` : <>PDF leve</>}</span></button>}
          {onImprimir && <button type="button" onClick={imprimir} disabled={imprimindo} className={`${onPdfLeve ? "" : "ml-auto "}inline-flex items-center justify-center gap-2 px-3 sm:px-6 h-10 rounded-xl bg-[#8B1D2C] text-white text-sm font-bold hover:bg-[#741626] disabled:opacity-70 min-w-0`}>
            {imprimindo ? <span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin shrink-0" /> : <MdPrint className="shrink-0" />}
            <span className="truncate text-xs sm:text-sm">{imprimindo ? "Preparando…" : <>{rotuloImprimir.split(" · ")[0]}<span className="hidden sm:inline">{rotuloImprimir.includes(" · ") ? ` · ${rotuloImprimir.split(" · ").slice(1).join(" · ")}` : ""}</span></>}</span>
          </button>}
        </div>
      </div>
      {modal && <ModalProjetos tipo={tipo} fechar={() => setModal(false)} aoAbrir={aoRestaurar} adRef={adRef} nomeTipo={adaptador?.nome || TIPOS[tipo]?.nome || tipo} />}
    </>
  );
}
