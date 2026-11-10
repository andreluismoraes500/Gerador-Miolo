// Mockup Studio: mockup rápido (página existente), editor de composição 2D (react-konva)
// e estúdio de personalização 3D (three.js), com biblioteca, modelos e projetos.
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Box, Download, FolderOpen, Hand, Layers3, Minus, MousePointer2, Moon, PanelLeft, PanelRight, Plus, Redo2, Save, Scan, Sun, Trash2, Undo2, Zap } from "lucide-react";
import Editor2D from "./editor2d/Editor2D";
import Studio3D from "./Studio3D";
import PainelEsquerdo, { ABAS } from "./paineis/PainelEsquerdo";
import PropsDireita2D from "./paineis/PropsDireita2D";
import PropsDireita3D from "./paineis/PropsDireita3D";
import { Botao, Linha, Secao, Seg } from "./paineis/Ui";
import { composicao2d, MODELOS } from "./modelos";
import { PADRAO_3D } from "./padrao3d";
import { PRODUTOS_2D } from "./editor2d/ProdutoNode";
import { alterar, novaImagem, novoAcessorio, novoProduto, novoTexto } from "./ops2d";
import { excluirProjeto, listarProjetos, novoId, salvarProjeto } from "./projetos";
import { useHistoria } from "./useHistoria";
import { lerImagem } from "./useImg";
import { usePersistedState } from "../hooks/usePersistedState";
import "./studio.css";

const INICIAL_2D = { W: 1600, H: 1200, cenario: "bege", fundoCor: "#ffffff", elementos: [] };

function baixar(url, nome) {
  const a = document.createElement("a");
  a.href = url; a.download = nome; document.body.appendChild(a); a.click(); a.remove();
}
const slug = (t) => (t || "mockup").toLowerCase().normalize("NFD").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "mockup";

export default function StudioPage() {
  const [tema, setTema] = usePersistedState("studio-tema", "claro");
  const [modo, setModo] = usePersistedState("studio-modo", "2d");
  const [aba, setAba] = useState("produtos");
  const [nome, setNome] = useState("Meu mockup");
  const [id, setId] = useState(() => novoId());
  const h = useHistoria(INICIAL_2D);
  const { estado: e2d, set: set2d } = h;
  const [selecao, setSelecao] = useState([]);
  const [ferramenta, setFerramenta] = useState("sel");
  const [s3, setS3] = useState(PADRAO_3D);
  const [uploads, setUploads] = useState([]);
  const [exp3, setExp3] = useState({ formato: "png", largura: 2048, transparente: false, segundos: 8, bitrate: 8e6 });
  const [exp2, setExp2] = useState({ formato: "png", escala: 2, transparente: false });
  const [ocupado, setOcupado] = useState(false);
  const [gravando, setGravando] = useState(false);
  const [esq, setEsq] = useState(false);
  const [dir, setDir] = useState(false);
  const [projetos, setProjetos] = useState([]);
  const [menuProj, setMenuProj] = useState(false);
  const ed = useRef(null), m3 = useRef(null);

  const [topo, setTopo] = useState(64);
  useLayoutEffect(() => {
    const medir = () => { const hd = document.querySelector("header"); if (hd) setTopo(Math.max(0, Math.round(hd.getBoundingClientRect().bottom))); };
    medir();
    window.addEventListener("resize", medir);
    const ro = new ResizeObserver(medir); const hd = document.querySelector("header"); hd && ro.observe(hd);
    return () => { window.removeEventListener("resize", medir); ro.disconnect(); };
  }, []);
  const is2d = modo === "2d";
  const temaClasse = tema === "escuro" ? "st-escuro" : "";

  // ----- atalhos
  useEffect(() => {
    const k = (e) => {
      const tag = document.activeElement?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") { e.preventDefault(); e.shiftKey ? h.refazer() : h.desfazer(); }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "y") { e.preventDefault(); h.refazer(); }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "d" && selecao.length) {
        e.preventDefault();
        set2d((l) => { const novos = l.elementos.filter((x) => selecao.includes(x.id)).map((x) => ({ ...x, id: "e" + novoId(), x: x.x + 30, y: x.y + 30, grupo: null })); setTimeout(() => setSelecao(novos.map((n) => n.id))); return { ...l, elementos: [...l.elementos, ...novos] }; });
      }
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [h, selecao, set2d]);

  // ----- uploads
  const aoUpload = async (files) => {
    for (const f of files) {
      try { const r = await lerImagem(f); setUploads((u) => [...u, r]); }
      catch { toast.error(`Não foi possível ler ${f.name}`); }
    }
  };

  // ----- adicionar ao 2D / aplicar no 3D
  const aoAdd = (tipo, payload) => {
    if (tipo === "upload") {
      if (!is2d) { setS3((o) => ({ ...o, capaSrc: payload.src, arteVerso: o.arteVerso })); toast.success("Imagem aplicada à capa 3D"); return; }
      const alvo = e2d.elementos.filter((x) => selecao.includes(x.id) && x.tipo === "produto");
      if (alvo.length) { set2d((l) => alterar(l, alvo.map((x) => x.id), { capa: payload.src })); return; }
      const el = novaImagem(payload.src, payload.w, payload.h, e2d.W, e2d.H, payload.nome);
      set2d((l) => ({ ...l, elementos: [...l.elementos, el] })); setSelecao([el.id]); return;
    }
    if (!is2d) { setModo("2d"); }
    const el = tipo === "texto" ? novoTexto() : tipo === "acessorio" ? novoAcessorio(payload, e2d.W, e2d.H) : novoProduto(payload, e2d.W, e2d.H, uploads.at(-1)?.src);
    set2d((l) => ({ ...l, elementos: [...l.elementos, el] }));
    setSelecao([el.id]);
  };

  const aoModelo = (m) => {
    if (m.tipo === "3d") {
      setS3({ ...PADRAO_3D, ...m.set, luz: PADRAO_3D.luz, capaSrc: s3.capaSrc });
      setModo("3d"); toast.success(`“${m.nome}” carregado no estúdio 3D`);
    } else {
      const c = composicao2d(m.comp, e2d.W, e2d.H);
      h.reiniciar({ ...e2d, cenario: c.cenario, elementos: c.elementos });
      setSelecao([]); setModo("2d"); toast.success(`“${m.nome}” carregado no editor 2D`);
    }
    setNome(m.nome);
    setEsq(false);
  };

  // ----- projetos
  const salvar = () => {
    const ok = salvarProjeto({ id, nome, modo, e2d, s3, uploads: uploads.slice(0, 6) });
    ok ? toast.success("Projeto salvo neste navegador") : toast.error("Sem espaço para salvar (imagens muito grandes). Exporte o resultado.");
  };
  const abrirMenu = () => { setProjetos(listarProjetos()); setMenuProj((m) => !m); };
  const abrir = (p) => {
    setId(p.id); setNome(p.nome); setModo(p.modo);
    h.reiniciar(p.e2d || INICIAL_2D); setS3({ ...PADRAO_3D, ...(p.s3 || {}), luz: { ...PADRAO_3D.luz, ...(p.s3?.luz || {}) } });
    setUploads(p.uploads || []); setSelecao([]); setMenuProj(false);
    toast.success(`Projeto “${p.nome}” aberto`);
  };
  const novo = () => { setId(novoId()); setNome("Meu mockup"); h.reiniciar(INICIAL_2D); setS3(PADRAO_3D); setSelecao([]); setMenuProj(false); };

  // ----- exportação
  const exportar = async () => {
    setOcupado(true);
    try {
      if (is2d) {
        if (exp2.formato === "svg") {
          const svg = ed.current.exportarSVG({ transparente: exp2.transparente });
          baixar(URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" })), `${slug(nome)}.svg`);
        } else {
          baixar(ed.current.exportar(exp2), `${slug(nome)}.${exp2.formato}`);
        }
        toast.success("Imagem exportada");
      } else if (exp3.formato === "webm") {
        setGravando(true);
        toast("Gravando vídeo giratório…", { icon: "🎬" });
        const b = await m3.current.gravar(exp3.segundos, exp3.bitrate);
        baixar(URL.createObjectURL(b), `${slug(nome)}.webm`);
      } else {
        const b = await m3.current.capturar({ tipo: exp3.formato, largura: exp3.largura, transparente: exp3.transparente });
        baixar(URL.createObjectURL(b), `${slug(nome)}-${exp3.largura}.${exp3.formato}`);
        toast.success("Imagem exportada");
      }
    } catch (e) { toast.error(e.message || "Falha ao exportar"); }
    finally { setOcupado(false); setGravando(false); }
  };

  const cam = useCallback((k) => m3.current?.preset(k), []);
  const modelosCount = useMemo(() => MODELOS.length, []);
  void modelosCount; void PRODUTOS_2D;

  const painelEsq = (
    <PainelEsquerdo aba={aba} modo={modo} s3={s3} setS3={setS3} set2d={set2d} uploads={uploads} onUpload={aoUpload} aoAdd={aoAdd} aoModelo={aoModelo} estado2d={e2d} selecao={selecao} />
  );

  return (
    <div className={`st-root ${temaClasse}`} data-modo={modo} style={{ top: topo }}>
      <header className="st-topo">
        <div className="st-logo"><Layers3 size={18} /> <b>Mockup</b> Studio</div>
        <input className="st-nome" value={nome} onChange={(e) => setNome(e.target.value)} aria-label="Nome do projeto" />
        <nav className="st-modos" aria-label="Modo">
          <Link to="/mockup" className="st-modo" title="Mockup rápido (página original)"><Zap size={14} /><span>Rápido</span></Link>
          <button className={`st-modo ${is2d ? "on" : ""}`} onClick={() => setModo("2d")}><MousePointer2 size={14} /><span>Editor 2D</span></button>
          <button className={`st-modo ${!is2d ? "on" : ""}`} onClick={() => setModo("3d")}><Box size={14} /><span>Estúdio 3D</span></button>
        </nav>
        <div className="st-topo__acoes">
          {is2d && <><Botao icone={Undo2} title="Desfazer (Ctrl+Z)" aria-label="Desfazer" disabled={!h.podeDesfazer} onClick={h.desfazer} /><Botao icone={Redo2} title="Refazer (Ctrl+Y)" aria-label="Refazer" disabled={!h.podeRefazer} onClick={h.refazer} /></>}
          <Botao icone={Save} onClick={salvar}><span className="st-oculta-p">Salvar</span></Botao>
          <div className="st-rel">
            <Botao icone={FolderOpen} onClick={abrirMenu} aria-label="Projetos"><span className="st-oculta-p">Projetos</span></Botao>
            {menuProj && (
              <div className="st-menu">
                <button onClick={novo}>+ Novo projeto</button>
                {projetos.length === 0 && <small>Nenhum projeto salvo.</small>}
                {projetos.map((p) => (
                  <div key={p.id} className="st-menu__i">
                    <button onClick={() => abrir(p)}>{p.nome} <small>{p.modo.toUpperCase()} · {new Date(p.atualizado).toLocaleDateString("pt-BR")}</small></button>
                    <button aria-label="Excluir" onClick={() => { excluirProjeto(p.id); setProjetos(listarProjetos()); }}><Trash2 size={13} /></button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <Botao icone={Download} className="st-btn--primario" disabled={ocupado} onClick={exportar}><span className="st-oculta-p">Exportar</span></Botao>
          <Botao icone={tema === "escuro" ? Sun : Moon} aria-label="Alternar tema" title="Claro/escuro" onClick={() => setTema(tema === "escuro" ? "claro" : "escuro")} />
        </div>
      </header>

      <div className={`st-corpo ${esq ? "esq-aberto" : ""} ${dir ? "dir-aberto" : ""}`}>
        <aside className="st-esq">
          <nav className="st-abas" aria-label="Biblioteca">
            {ABAS.map(([k, n, I]) => <button key={k} className={aba === k ? "on" : ""} onClick={() => setAba(k)} title={n}><I size={17} /><span>{n}</span></button>)}
          </nav>
          <div className="st-esq__c">{painelEsq}</div>
        </aside>

        <main className="st-centro">
          {is2d ? (
            <>
              <Editor2D ref={ed} estado={e2d} set={set2d} selecao={selecao} setSelecao={setSelecao} ferramenta={ferramenta} />
              {e2d.elementos.length === 0 && <div className="st-vazio"><b>Comece sua composição</b><span>Adicione produtos, acessórios e imagens pela biblioteca ou carregue um modelo pronto.</span></div>}
            </>
          ) : (
            <Studio3D ref={m3} s={s3} onQualidade={() => { setS3((o) => ({ ...o, qualidade: "rapida" })); toast("Desempenho baixo: efeitos pesados reduzidos", { icon: "⚡" }); }} />
          )}
        </main>

        <aside className="st-dir">
          {is2d ? (
            <>
              <PropsDireita2D estado={e2d} set={set2d} selecao={selecao} setSelecao={setSelecao} />
              <div className="st-props">
                <Secao titulo="Exportação">
                  <Linha rotulo="Formato"><Seg valor={exp2.formato} opcoes={[["png", "PNG"], ["jpg", "JPG"], ["svg", "SVG"]]} onChange={(v) => setExp2({ ...exp2, formato: v })} /></Linha>
                  {exp2.formato !== "svg" && <Linha rotulo="Resolução"><Seg valor={exp2.escala} opcoes={[[1, "1×"], [2, "2×"], [3, "3×"]]} onChange={(v) => setExp2({ ...exp2, escala: v })} /></Linha>}
                  {exp2.formato !== "jpg" && <label className="st-check"><input type="checkbox" checked={exp2.transparente} onChange={(e) => setExp2({ ...exp2, transparente: e.target.checked })} /> Fundo transparente</label>}
                  <p className="st-dica">{e2d.W * (exp2.formato === "svg" ? 1 : exp2.escala)} × {e2d.H * (exp2.formato === "svg" ? 1 : exp2.escala)} px{exp2.formato === "svg" ? " · SVG com objetos embutidos" : ""}</p>
                  <Botao icone={Download} className="st-btn--primario" disabled={ocupado} onClick={exportar}>Exportar agora</Botao>
                </Secao>
              </div>
            </>
          ) : (
            <PropsDireita3D s={s3} setS={setS3} cam={cam} exp={exp3} setExp={setExp3} aoExportar={exportar} gravando={gravando} ocupado={ocupado} />
          )}
        </aside>
      </div>

      <footer className="st-rodape">
        <div className="st-rodape__g">
          <button className="st-btn st-mobile" onClick={() => { setEsq(!esq); setDir(false); }} aria-label="Biblioteca"><PanelLeft size={15} /></button>
          <button className="st-btn st-mobile" onClick={() => { setDir(!dir); setEsq(false); }} aria-label="Propriedades"><PanelRight size={15} /></button>
        </div>
        {is2d ? (
          <div className="st-rodape__g">
            <Botao icone={MousePointer2} className={ferramenta === "sel" ? "on" : ""} title="Selecionar" onClick={() => setFerramenta("sel")} />
            <Botao icone={Hand} className={ferramenta === "mao" ? "on" : ""} title="Mover tela (ou segure Espaço)" onClick={() => setFerramenta("mao")} />
            <Botao icone={Minus} title="Reduzir zoom" onClick={() => ed.current?.zoom(1 / 1.2)} />
            <Botao icone={Plus} title="Ampliar zoom" onClick={() => ed.current?.zoom(1.2)} />
            <Botao icone={Scan} title="Ajustar à tela" onClick={() => ed.current?.ajustar()} />
          </div>
        ) : (
          <div className="st-rodape__g">
            <Seg valor={s3.qualidade} opcoes={[["auto", "Auto"], ["rapida", "Rápida"], ["alta", "Alta"]]} onChange={(v) => setS3((o) => ({ ...o, qualidade: v }))} />
          </div>
        )}
        <div className="st-rodape__g">
          <Seg valor={modo} opcoes={[["2d", "2D"], ["3d", "3D"]]} onChange={setModo} />
        </div>
        <span className="st-rodape__info st-oculta-p">{is2d ? `${e2d.elementos.length} objetos · ${e2d.W}×${e2d.H}` : "Arraste para girar · roda para zoom"}</span>
      </footer>
    </div>
  );
}
