// src/pages/MockupPage.jsx
//
// Mockup da agenda: mostra a capa (gerada a partir das configurações atuais
// ou enviada como imagem) numa cena realista, com o tipo de encadernação
// escolhido, e permite baixar em PNG (ou SVG).
//
// Dependência nova: html-to-image  →  npm i html-to-image
// (só é usada para "fotografar" a CapaLayout em PNG antes de colocá-la no SVG).

import { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { MdDownload, MdImage, MdRefresh } from "react-icons/md";
import { toPng } from "html-to-image";
import CapaLayout from "../components/layouts/CapaLayout";
import { useAgendaConfig } from "../context/AgendaConfigContext";
import BlocoStage, { FORMATOS_BLOCO, PAPELAO } from "../components/mockup/BlocoStage";
import MockupStage, { CENAS, STAGE_H, STAGE_W } from "../components/mockup/MockupStage";
import { MIOLOS } from "../components/mockup3d/opcoes";
import { FUROS, METAIS, TIPOS_ANELADOS, TIPOS_ENCADERNACAO, formaFuro } from "../components/mockup/bindings";
import { IconeEnc, IconeFuro } from "../components/mockup/IconesEnc";
import { usePersistedState } from "../hooks/usePersistedState";
import {
  TAMANHOS, MATERIAIS, DISPOSICOES, PRODUTOS, FAIXA_ARGOLAS, MODELOS_PRONTOS, PRODUTOS_GRAFICOS,
  QUADRO_TAMANHOS, MOLDURAS, BOTTON_TAMANHOS, CAIXA_TAMANHOS, SACOLA_TAMANHOS,
} from "../components/mockup3d/opcoes";
import "../styles/mockup.css";

// three.js só é baixado quando a pessoa abre o mockup 3D.
const Mockup3D = lazy(() => import("../components/mockup3d/Mockup3D"));

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = (e) => resolve(e.target.result);
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}

function baixar(url, nome) {
  const a = document.createElement("a");
  a.href = url;
  a.download = nome;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

function Bloco({ titulo, children }) {
  return (
    <section className="mk-bloco">
      <h3 className="mk-bloco__titulo">{titulo}</h3>
      {children}
    </section>
  );
}

function Aba({ id, atual, todas, children }) {
  return <div className={`mk-aba ${todas || atual === id ? "is-on" : ""}`}>{children}</div>;
}

// Quantidade: digitar ou usar −/+. Fora da faixa, ajusta ao sair do campo.
function AjusteImagem({ aj, setAj }) {
  const mudou = aj.zoom !== 1 || aj.x !== 0 || aj.y !== 0 || aj.modo !== "cobrir";
  const sl = (rotulo, k, min, max, passo, fmt) => (
    <label className="mk-linha mk-linha--col">
      <span>{rotulo}: <b>{fmt(aj[k])}</b></span>
      <input type="range" min={min} max={max} step={passo} value={aj[k]} onChange={(e) => setAj({ ...aj, [k]: Number(e.target.value) })} />
    </label>
  );
  return (
    <Bloco titulo="Posição da imagem">
      <div className="mk-seg">
        <button type="button" className={aj.modo === "cobrir" ? "is-on" : ""} onClick={() => setAj({ ...aj, modo: "cobrir" })}>Preencher</button>
        <button type="button" className={aj.modo === "caber" ? "is-on" : ""} onClick={() => setAj({ ...aj, modo: "caber" })}>Caber inteira</button>
      </div>
      {sl("Zoom", "zoom", 0.5, 3, 0.05, (v) => `${Math.round(v * 100)}%`)}
      {sl("Horizontal (esq. ↔ dir.)", "x", -1, 1, 0.02, (v) => `${Math.round(v * 100)}`)}
      {sl("Vertical (cima ↕ baixo)", "y", -1, 1, 0.02, (v) => `${Math.round(v * 100)}`)}
      {mudou && <button type="button" className="mk-link" onClick={() => setAj({ zoom: 1, x: 0, y: 0, modo: "cobrir" })}><MdRefresh /> Restaurar posição</button>}
      <p className="mk-dica">Arraste os controles para subir, descer ou aproximar a imagem no produto.</p>
    </Bloco>
  );
}

function Contador({ valor, min, max, onChange, unidade, esmaecido }) {
  const [rascunho, setRascunho] = useState(null); // texto enquanto a pessoa digita
  const txt = rascunho ?? String(valor);
  const setTxt = setRascunho;
  const aplicar = (v) => onChange(Math.min(max, Math.max(min, Math.round(v))));
  return (
    <div className={`mk-contador ${esmaecido ? "is-auto" : ""}`}>
      <button type="button" aria-label="Diminuir" disabled={valor <= min} onClick={() => { setRascunho(null); aplicar(valor - 1); }}>−</button>
      <input
        type="number"
        inputMode="numeric"
        min={min}
        max={max}
        value={txt}
        aria-label="Quantidade"
        onChange={(e) => {
          setTxt(e.target.value);
          const v = Number(e.target.value);
          if (e.target.value !== "" && v >= min && v <= max) onChange(Math.round(v));
        }}
        onBlur={() => { if (rascunho !== null && rascunho !== "" && !Number.isNaN(Number(rascunho))) aplicar(Number(rascunho)); setRascunho(null); }}
      />
      <button type="button" aria-label="Aumentar" disabled={valor >= max} onClick={() => { setRascunho(null); aplicar(valor + 1); }}>+</button>
      {unidade && <span>{unidade}</span>}
    </div>
  );
}

export default function MockupPage() {
  const cfg = useAgendaConfig();
  const svgRef = useRef(null);
  const capaRef = useRef(null);

  const [tipo, setTipo] = usePersistedState("mockup-tipo", "wireo");
  const [metal, setMetal] = usePersistedState("mockup-metal", "prata");
  const [cena, setCena] = usePersistedState("mockup-cena", "creme");
  const [view, setView] = usePersistedState("mockup-view", "fechada");
  const [origem, setOrigem] = usePersistedState("mockup-origem", "agenda");
  const [corCapa, setCorCapa] = usePersistedState("mockup-corCapa", "#1e293b");
  const [brilho, setBrilho] = usePersistedState("mockup-brilho", true);
  const [produto, setProduto] = usePersistedState("mockup-produto", "agenda");
  const [formato, setFormato] = usePersistedState("mockup-bl-formato", "retrato");
  const [lado, setLado] = usePersistedState("mockup-bl-lado", "topo");
  const [espessura, setEspessura] = usePersistedState("mockup-bl-espessura", 3);
  const [papelao, setPapelao] = usePersistedState("mockup-bl-papelao", "kraft");
  const [corCola, setCorCola] = usePersistedState("mockup-bl-cola", "#c0392b");
  const [destacando, setDestacando] = usePersistedState("mockup-bl-destacando", true);
  const [folhaBloco, setFolhaBloco] = useState(null);
  const [visual, setVisual] = usePersistedState("mockup-visual", "3d");
  const [tamanho, setTamanho] = usePersistedState("mockup-tamanho", "a5");
  const [mat, setMat] = usePersistedState("mockup-material", "carton");
  const [disp, setDisp] = usePersistedState("mockup-disp", "esquerda");
  const [aneisAuto, setAneisAuto] = usePersistedState("mockup-aneis-auto", true);
  const [aneisN, setAneisN] = usePersistedState("mockup-aneis-n", 20);
  const [elastico, setElastico] = usePersistedState("mockup-elastico", false);
  const [corElastico, setCorElastico] = usePersistedState("mockup-cor-elastico", "#111111");
  const [fita, setFita] = usePersistedState("mockup-fita", false);
  const [corFita, setCorFita] = usePersistedState("mockup-cor-fita", "#b3262e");
  const [aba, setAba] = usePersistedState("mockup-aba", "produto");
  const [furo, setFuro] = usePersistedState("mockup-furo", "auto");
  const [elasticoLarg, setElasticoLarg] = usePersistedState("mockup-elastico-larg", 6);
  const [elasticoPos, setElasticoPos] = usePersistedState("mockup-elastico-pos", 22);
  const [passante, setPassante] = usePersistedState("mockup-passante", false);
  const [corPassante, setCorPassante] = usePersistedState("mockup-cor-passante", "#111111");
  const [caneta, setCaneta] = usePersistedState("mockup-caneta", false);
  const [cantos, setCantos] = usePersistedState("mockup-cantos", false);
  const [qualidade, setQualidade] = usePersistedState("mockup-qualidade", "alta");
  // quadro
  const [qTam, setQTam] = usePersistedState("mockup-q-tam", "a4");
  const [orient, setOrient] = usePersistedState("mockup-q-orient", "retrato");
  const [moldura, setMoldura] = usePersistedState("mockup-q-moldura", "preto");
  const [molduraLarg, setMolduraLarg] = usePersistedState("mockup-q-larg", 2);
  const [passepartout, setPassepartout] = usePersistedState("mockup-q-passe", true);
  const [montagem, setMontagem] = usePersistedState("mockup-q-montagem", "parede");
  // botton
  const [bTam, setBTam] = usePersistedState("mockup-b-tam", "38");
  const [bQtd, setBQtd] = usePersistedState("mockup-b-qtd", 3);
  const [bBrilho, setBBrilho] = usePersistedState("mockup-b-brilho", true);
  // caneca
  const [cArco, setCArco] = usePersistedState("mockup-c-arco-v3", 340);
  const [cMat, setCMat] = usePersistedState("mockup-c-mat", "brilho");
  const [corCaneca, setCorCaneca] = usePersistedState("mockup-c-cor", "#ffffff");
  const [corInterior, setCorInterior] = usePersistedState("mockup-c-interior", "#ffffff");
  const [corAlca, setCorAlca] = usePersistedState("mockup-c-alca", "#ffffff");
  const [cafe, setCafe] = usePersistedState("mockup-c-cafe", false);
  // cartões
  const [cQtd, setCQtd] = usePersistedState("mockup-cartoes-qtd", 12);
  const [cFosco, setCFosco] = usePersistedState("mockup-cartoes-fosco", false);
  const [arteVerso, setArteVerso] = useState(null);
  // caixa / sacola
  const [cxTam, setCxTam] = usePersistedState("mockup-cx-tam", "m");
  const [abertura, setAbertura] = usePersistedState("mockup-cx-abertura", 0);
  const [corForro, setCorForro] = usePersistedState("mockup-cx-forro", "#f4efe4");
  const [sTam, setSTam] = usePersistedState("mockup-s-tam", "m");
  const [corAlcaSac, setCorAlcaSac] = usePersistedState("mockup-s-alca", "#c9b27c");
  const [girar, setGirar] = useState(false);
  const [ajusteImg, setAjusteImg] = useState({ zoom: 1, x: 0, y: 0, modo: "cobrir" });
  const [gravando, setGravando] = useState(false);
  const m3dRef = useRef(null);

  const [capaUpload, setCapaUpload] = useState(null);
  const [miolo, setMiolo] = useState(null);
  const [mioloTipo, setMioloTipo] = usePersistedState("mockup-miolo-tipo", "pautado");
  const [capaGerada, setCapaGerada] = useState(null);
  const [gerando, setGerando] = useState(false);
  const [baixando, setBaixando] = useState(false);

  const grafico = PRODUTOS_GRAFICOS.includes(produto);
  const agendaLike = produto === "agenda" || produto === "kit" || produto === "calendario";
  const vis = produto === "calendario" || produto === "kit" || grafico ? "3d" : visual;
  const faixa = FAIXA_ARGOLAS[tipo];
  const aneisUsados = faixa ? Math.min(faixa.max, Math.max(faixa.min, aneisN)) : null;
  const aneisProp = faixa && !aneisAuto ? aneisUsados : null;
  const setters = {
    produto: setProduto, tipo: setTipo, disp: setDisp, mat: setMat, metal: setMetal, tamanho: setTamanho,
    view: setView, aneisAuto: setAneisAuto, aneisN: setAneisN, elastico: setElastico, fita: setFita,
    caneta: setCaneta, cantos: setCantos, furo: setFuro, passante: setPassante,
    elasticoLarg: setElasticoLarg, elasticoPos: setElasticoPos,
  };
  const aplicarModelo = (m) => Object.entries(m.set).forEach(([k, v]) => setters[k]?.(v));
  const anelado = TIPOS_ANELADOS.includes(tipo);
  const temMetal = anelado || tipo === "grampo" || tipo === "costura";

  // "Fotografa" a CapaLayout (renderizada fora da tela) sempre que a
  // configuração muda — com debounce, para não travar enquanto se digita.
  const capturar = useCallback(async () => {
    if (!capaRef.current) return;
    setGerando(true);
    try {
      if (document.fonts?.ready) await document.fonts.ready;
      const url = await toPng(capaRef.current, { pixelRatio: 1.4, cacheBust: true });
      setCapaGerada(url);
    } catch (err) {
      console.error("[Mockup] falha ao capturar a capa:", err);
      toast.error("Não foi possível gerar a capa. Tente enviar uma imagem.");
    } finally {
      setGerando(false);
    }
  }, []);

  const anoAtual = new Date().getFullYear();
  const depsCapa = [
    produto,
    origem,
    cfg.capaNome,
    cfg.capaEstilo,
    cfg.capaFrase,
    cfg.colorTheme,
    cfg.logo,
    cfg.fontFamily,
    cfg.backgroundSrc,
    cfg.backgroundOpacity,
    cfg.watermarkSrc,
    cfg.watermarkOpacity,
    cfg.footerType,
  ];
  useEffect(() => {
    if (produto === "bloco" || origem !== "agenda") return;
    const t = setTimeout(capturar, 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, depsCapa);

  const capaSrc = origem === "upload" ? capaUpload : capaGerada;

  const subir = async (file, setter) => {
    if (!file) return;
    try {
      setter(await fileToDataUrl(file));
    } catch {
      toast.error("Não foi possível ler essa imagem.");
    }
  };

  const serializar = () => {
    const svg = svgRef.current;
    if (!svg) return null;
    const clone = svg.cloneNode(true);
    clone.setAttribute("width", STAGE_W);
    clone.setAttribute("height", STAGE_H);
    return new XMLSerializer().serializeToString(clone);
  };

  const baixarSvg = () => {
    const xml = serializar();
    if (!xml) return;
    const url = URL.createObjectURL(new Blob([xml], { type: "image/svg+xml" }));
    baixar(url, produto === "bloco" ? `mockup-bloco-${formato}.svg` : `mockup-agenda-${tipo}.svg`);
    setTimeout(() => URL.revokeObjectURL(url), 1500);
  };

  const baixarPng = async () => {
    const xml = serializar();
    if (!xml) return;
    setBaixando(true);
    try {
      const svgUrl = URL.createObjectURL(new Blob([xml], { type: "image/svg+xml;charset=utf-8" }));
      const img = new Image();
      await new Promise((ok, err) => {
        img.onload = ok;
        img.onerror = err;
        img.src = svgUrl;
      });
      const escala = 2;
      const canvas = document.createElement("canvas");
      canvas.width = STAGE_W * escala;
      canvas.height = STAGE_H * escala;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(svgUrl);
      const blob = await new Promise((ok) => canvas.toBlob(ok, "image/png"));
      if (!blob) throw new Error("toBlob vazio");
      const url = URL.createObjectURL(blob);
      baixar(url, produto === "bloco" ? `mockup-bloco-${formato}.png` : `mockup-agenda-${tipo}-${view}.png`);
      setTimeout(() => URL.revokeObjectURL(url), 1500);
      toast.success("Mockup baixado!");
    } catch (e) {
      console.error("[Mockup] export PNG:", e);
      toast.error("Falha ao gerar o PNG. Tente baixar em SVG.");
    } finally {
      setBaixando(false);
    }
  };

  const baixar3d = async (formatoArq) => {
    const api = m3dRef.current;
    if (!api) return;
    setBaixando(true);
    try {
      const blob = await api.capturar({ tipo: formatoArq, largura: 2400 });
      if (!blob) throw new Error("vazio");
      const url = URL.createObjectURL(blob);
      const nome = produto === "bloco" ? `bloco-${formato}` : produto === "agenda" ? `agenda-${tipo}-${view}` : produto;
      baixar(url, `mockup-${nome}.${formatoArq}`);
      setTimeout(() => URL.revokeObjectURL(url), 1500);
      toast.success("Mockup baixado!");
    } catch (e) {
      console.error("[Mockup3D] export:", e);
      toast.error("Falha ao gerar a imagem.");
    } finally {
      setBaixando(false);
    }
  };

  const gravarVideo = async () => {
    const api = m3dRef.current;
    if (!api || gravando) return;
    setGravando(true);
    const t = toast.loading("Gravando vídeo giratório (6 s)…");
    try {
      const blob = await api.gravar(6);
      const url = URL.createObjectURL(blob);
      baixar(url, `mockup-${produto}.webm`);
      setTimeout(() => URL.revokeObjectURL(url), 2000);
      toast.success("Vídeo baixado!", { id: t });
    } catch (e) {
      toast.error(e.message || "Não foi possível gravar o vídeo.", { id: t });
    } finally {
      setGravando(false);
    }
  };

  const tipoAtual = TIPOS_ENCADERNACAO.find((t) => t.id === tipo);

  return (
    <div className="mk-page">
      <header className="mk-head">
        <h1>Mockup da agenda</h1>
        <p>Veja sua agenda como produto pronto, escolha a encadernação e baixe a imagem.</p>
      </header>

      <div className="mk-grid">
        <aside className="mk-controles">
          {agendaLike && (
            <nav className="mk-abas" role="tablist">
              {[["produto", "Produto"], ["encad", "Encadernação"], ["extras", "Extras"], ["cena", "Cena"]].map(([id, nome]) => (
                <button key={id} type="button" role="tab" aria-selected={aba === id} className={aba === id ? "is-on" : ""} onClick={() => setAba(id)}>
                  {nome}
                </button>
              ))}
            </nav>
          )}
          <Aba id="produto" atual={aba} todas={!agendaLike}>
          <Bloco titulo="Modelos prontos">
            <div className="mk-modelos">
              {MODELOS_PRONTOS.map((m) => (
                <button key={m.id} type="button" onClick={() => aplicarModelo(m)}>
                  {m.nome}
                </button>
              ))}
            </div>
          </Bloco>

          <Bloco titulo="Produto">
            <div className="mk-seg mk-seg--grid">
              {Object.entries(PRODUTOS).map(([id, nome]) => (
                <button key={id} type="button" className={produto === id ? "is-on" : ""} onClick={() => setProduto(id)}>
                  {nome}
                </button>
              ))}
            </div>
          </Bloco>

          {vis !== "3d" || (produto !== "calendario" && produto !== "kit" && !grafico) ? (
          <Bloco titulo="Visual">
            <div className="mk-seg">
              <button type="button" className={visual === "3d" ? "is-on" : ""} onClick={() => setVisual("3d")}>
                3D interativo
              </button>
              <button type="button" className={visual === "2d" ? "is-on" : ""} onClick={() => setVisual("2d")}>
                2D clássico
              </button>
            </div>
          </Bloco>
          ) : null}

          {vis === "3d" && agendaLike && (
            <>
              <Bloco titulo="Tamanho">
                <div className="mk-seg">
                  {Object.entries(TAMANHOS).map(([id, t]) => (
                    <button key={id} type="button" className={tamanho === id ? "is-on" : ""} onClick={() => setTamanho(id)}>
                      {t.nome}
                    </button>
                  ))}
                </div>
              </Bloco>
              <Bloco titulo="Material da capa">
                <div className="mk-tipos">
                  {Object.entries(MATERIAIS).map(([id, m]) => (
                    <button key={id} type="button" className={`mk-tipo ${mat === id ? "is-on" : ""}`} onClick={() => setMat(id)}>
                      <b>{m.nome}</b>
                    </button>
                  ))}
                </div>
              </Bloco>
              {(produto === "kit" || produto === "calendario") && (
                <Bloco titulo={produto === "kit" ? "Arte da folha do bloco" : "Arte do calendário (opcional)"}>
                  <label className="mk-upload">
                    <MdImage /> {folhaBloco ? "Trocar arte" : "Enviar arte"}
                    <input type="file" accept="image/*" hidden onChange={(e) => subir(e.target.files?.[0], setFolhaBloco)} />
                  </label>
                  {folhaBloco && (
                    <button type="button" className="mk-link" onClick={() => setFolhaBloco(null)}>
                      remover
                    </button>
                  )}
                </Bloco>
              )}
            </>
          )}

          {grafico && (
            <>
              <Bloco titulo="Arte">
                <div className="mk-seg">
                  <button type="button" className={origem === "agenda" ? "is-on" : ""} onClick={() => setOrigem("agenda")}>
                    Capa da agenda
                  </button>
                  <button type="button" className={origem === "upload" ? "is-on" : ""} onClick={() => setOrigem("upload")}>
                    Enviar imagem
                  </button>
                </div>
                {origem === "agenda" ? (
                  <button type="button" className="mk-link" onClick={capturar} disabled={gerando}>
                    <MdRefresh /> {gerando ? "Gerando…" : "Atualizar arte"}
                  </button>
                ) : (
                  <label className="mk-upload">
                    <MdImage /> {capaUpload ? "Trocar imagem" : "Escolher imagem"}
                    <input type="file" accept="image/*" hidden onChange={(e) => subir(e.target.files?.[0], setCapaUpload)} />
                  </label>
                )}
                {produto === "cartoes" && (
                  <label className="mk-upload">
                    <MdImage /> {arteVerso ? "Trocar verso" : "Enviar verso (opcional)"}
                    <input type="file" accept="image/*" hidden onChange={(e) => subir(e.target.files?.[0], setArteVerso)} />
                  </label>
                )}
                {(produto === "caixa" || produto === "sacola") && (
                  <label className="mk-linha">
                    Cor da {produto === "caixa" ? "caixa" : "sacola"}
                    <input type="color" value={corCapa} onChange={(e) => setCorCapa(e.target.value)} />
                  </label>
                )}
              </Bloco>
              <AjusteImagem aj={ajusteImg} setAj={setAjusteImg} />

              {produto === "quadro" && (
                <>
                  <Bloco titulo="Tamanho e posição">
                    <div className="mk-seg">
                      {Object.entries(QUADRO_TAMANHOS).map(([id, t]) => (
                        <button key={id} type="button" className={qTam === id ? "is-on" : ""} onClick={() => setQTam(id)}>{t.nome}</button>
                      ))}
                    </div>
                    <div className="mk-seg mk-gap">
                      {["retrato", "paisagem", "quadrado"].map((id) => (
                        <button key={id} type="button" className={orient === id ? "is-on" : ""} onClick={() => setOrient(id)}>
                          {id[0].toUpperCase() + id.slice(1)}
                        </button>
                      ))}
                    </div>
                    <div className="mk-seg mk-gap">
                      <button type="button" className={montagem === "parede" ? "is-on" : ""} onClick={() => setMontagem("parede")}>Na parede</button>
                      <button type="button" className={montagem === "mesa" ? "is-on" : ""} onClick={() => setMontagem("mesa")}>Sobre a mesa</button>
                    </div>
                  </Bloco>
                  <Bloco titulo="Moldura">
                    <div className="mk-tipos">
                      {Object.entries(MOLDURAS).map(([id, m]) => (
                        <button key={id} type="button" className={`mk-tipo ${moldura === id ? "is-on" : ""}`} onClick={() => setMoldura(id)}>
                          <b>{m.nome}</b>
                        </button>
                      ))}
                    </div>
                    <label className="mk-linha">
                      Espessura ({molduraLarg})
                      <input type="range" min={1} max={3} value={molduraLarg} onChange={(e) => setMolduraLarg(Number(e.target.value))} />
                    </label>
                    <label className="mk-linha">
                      Passe-partout
                      <input type="checkbox" checked={passepartout} onChange={(e) => setPassepartout(e.target.checked)} />
                    </label>
                  </Bloco>
                </>
              )}

              {produto === "botton" && (
                <Bloco titulo="Bottons">
                  <div className="mk-seg">
                    {Object.entries(BOTTON_TAMANHOS).map(([id, t]) => (
                      <button key={id} type="button" className={bTam === id ? "is-on" : ""} onClick={() => setBTam(id)}>{t.nome}</button>
                    ))}
                  </div>
                  <div className="mk-seg mk-gap">
                    {[1, 3, 6].map((n) => (
                      <button key={n} type="button" className={bQtd === n ? "is-on" : ""} onClick={() => setBQtd(n)}>{n} un.</button>
                    ))}
                  </div>
                  <label className="mk-linha">
                    Acabamento brilhante
                    <input type="checkbox" checked={bBrilho} onChange={(e) => setBBrilho(e.target.checked)} />
                  </label>
                </Bloco>
              )}

              {produto === "caneca" && (
                <Bloco titulo="Caneca">
                  <div className="mk-seg">
                    <button type="button" className={cArco === 140 ? "is-on" : ""} onClick={() => setCArco(140)}>Arte na frente</button>
                    <button type="button" className={cArco === 340 ? "is-on" : ""} onClick={() => setCArco(340)}>Envolvente total</button>
                  </div>
                  <label className="mk-linha mk-linha--col">
                    <span>Largura da arte <b>{cArco}°</b></span>
                    <input type="range" min="90" max="352" step="2" value={cArco} onChange={(e) => setCArco(Number(e.target.value))} />
                  </label>
                  <div className="mk-seg mk-gap">
                    <button type="button" className={cMat === "brilho" ? "is-on" : ""} onClick={() => setCMat("brilho")}>Brilhante</button>
                    <button type="button" className={cMat === "fosco" ? "is-on" : ""} onClick={() => setCMat("fosco")}>Fosca</button>
                  </div>
                  <label className="mk-linha">Cor da caneca <input type="color" value={corCaneca} onChange={(e) => setCorCaneca(e.target.value)} /></label>
                  <label className="mk-linha">Cor do interior <input type="color" value={corInterior} onChange={(e) => setCorInterior(e.target.value)} /></label>
                  <label className="mk-linha">Cor da alça <input type="color" value={corAlca} onChange={(e) => setCorAlca(e.target.value)} /></label>
                  <label className="mk-linha">
                    Com café
                    <input type="checkbox" checked={cafe} onChange={(e) => setCafe(e.target.checked)} />
                  </label>
                </Bloco>
              )}

              {produto === "cartoes" && (
                <Bloco titulo="Cartões">
                  <label className="mk-linha">
                    Quantidade na pilha ({cQtd})
                    <input type="range" min={3} max={40} value={cQtd} onChange={(e) => setCQtd(Number(e.target.value))} />
                  </label>
                  <label className="mk-linha">
                    Acabamento fosco
                    <input type="checkbox" checked={cFosco} onChange={(e) => setCFosco(e.target.checked)} />
                  </label>
                </Bloco>
              )}

              {produto === "caixa" && (
                <Bloco titulo="Caixa">
                  <div className="mk-seg">
                    {Object.entries(CAIXA_TAMANHOS).map(([id, t]) => (
                      <button key={id} type="button" className={cxTam === id ? "is-on" : ""} onClick={() => setCxTam(id)}>{t.nome}</button>
                    ))}
                  </div>
                  <label className="mk-linha">
                    Abertura da tampa ({abertura}°)
                    <input type="range" min={0} max={110} value={abertura} onChange={(e) => setAbertura(Number(e.target.value))} />
                  </label>
                  <label className="mk-linha">Cor do forro <input type="color" value={corForro} onChange={(e) => setCorForro(e.target.value)} /></label>
                  <div className="mk-seg mk-gap">
                    <button type="button" className={mat !== "brilho" ? "is-on" : ""} onClick={() => setMat("carton")}>Fosca</button>
                    <button type="button" className={mat === "brilho" ? "is-on" : ""} onClick={() => setMat("brilho")}>Laminada</button>
                  </div>
                </Bloco>
              )}

              {produto === "sacola" && (
                <Bloco titulo="Sacola">
                  <div className="mk-seg">
                    {Object.entries(SACOLA_TAMANHOS).map(([id, t]) => (
                      <button key={id} type="button" className={sTam === id ? "is-on" : ""} onClick={() => setSTam(id)}>{t.nome}</button>
                    ))}
                  </div>
                  <label className="mk-linha">Cor da alça <input type="color" value={corAlcaSac} onChange={(e) => setCorAlcaSac(e.target.value)} /></label>
                  <div className="mk-seg mk-gap">
                    <button type="button" className={mat !== "brilho" ? "is-on" : ""} onClick={() => setMat("carton")}>Kraft/fosca</button>
                    <button type="button" className={mat === "brilho" ? "is-on" : ""} onClick={() => setMat("brilho")}>Laminada</button>
                  </div>
                </Bloco>
              )}
            </>
          )}

          {produto === "bloco" && (
            <>
              <Bloco titulo="Arte da folha">
                <label className="mk-upload">
                  <MdImage /> {folhaBloco ? "Trocar arte da folha" : "Enviar arte da folha"}
                  <input type="file" accept="image/*" hidden onChange={(e) => subir(e.target.files?.[0], setFolhaBloco)} />
                </label>
                {folhaBloco && (
                  <button type="button" className="mk-link" onClick={() => setFolhaBloco(null)}>
                    remover (usar pautado)
                  </button>
                )}
              </Bloco>
              <Bloco titulo="Formato">
                <div className="mk-tipos">
                  {Object.entries(FORMATOS_BLOCO).map(([id, f]) => (
                    <button key={id} type="button" className={`mk-tipo ${formato === id ? "is-on" : ""}`} onClick={() => setFormato(id)}>
                      <b>{f.nome}</b>
                    </button>
                  ))}
                </div>
              </Bloco>
              <Bloco titulo="Colagem">
                <div className="mk-seg">
                  <button type="button" className={lado === "topo" ? "is-on" : ""} onClick={() => setLado("topo")}>
                    No topo
                  </button>
                  <button type="button" className={lado === "esquerda" ? "is-on" : ""} onClick={() => setLado("esquerda")}>
                    Na lateral
                  </button>
                </div>
                <label className="mk-linha">
                  Cor da fita de cola
                  <input type="color" value={corCola} onChange={(e) => setCorCola(e.target.value)} />
                </label>
                <label className="mk-linha">
                  Espessura ({espessura})
                  <input type="range" min={1} max={6} value={espessura} onChange={(e) => setEspessura(Number(e.target.value))} />
                </label>
                <label className="mk-linha">
                  Folha destacada
                  <input type="checkbox" checked={destacando} onChange={(e) => setDestacando(e.target.checked)} />
                </label>
              </Bloco>
              <Bloco titulo="Base (papelão)">
                <div className="mk-chips">
                  {Object.entries(PAPELAO).map(([id, c]) => (
                    <button key={id} type="button" title={id} aria-label={id} className={`mk-chip ${papelao === id ? "is-on" : ""}`} style={{ background: c }} onClick={() => setPapelao(id)} />
                  ))}
                </div>
              </Bloco>
            </>
          )}

          {agendaLike && (
          <>
          <Bloco titulo="Capa">
            <div className="mk-seg">
              <button type="button" className={origem === "agenda" ? "is-on" : ""} onClick={() => setOrigem("agenda")}>
                Da minha agenda
              </button>
              <button type="button" className={origem === "upload" ? "is-on" : ""} onClick={() => setOrigem("upload")}>
                Enviar imagem
              </button>
            </div>
            {origem === "agenda" ? (
              <button type="button" className="mk-link" onClick={capturar} disabled={gerando}>
                <MdRefresh /> {gerando ? "Gerando…" : "Atualizar capa"}
              </button>
            ) : (
              <label className="mk-upload">
                <MdImage /> {capaUpload ? "Trocar imagem da capa" : "Escolher imagem da capa"}
                <input type="file" accept="image/*" hidden onChange={(e) => subir(e.target.files?.[0], setCapaUpload)} />
              </label>
            )}
            <label className="mk-linha">
              Cor de fundo da capa
              <input type="color" value={corCapa} onChange={(e) => setCorCapa(e.target.value)} />
            </label>
            <label className="mk-linha">
              Brilho de papel
              <input type="checkbox" checked={brilho} onChange={(e) => setBrilho(e.target.checked)} />
            </label>
          </Bloco>
          {origem === "upload" && <AjusteImagem aj={ajusteImg} setAj={setAjusteImg} />}

          {produto === "agenda" && view === "aberta" && (
            <Bloco titulo="Tipo de miolo (páginas abertas)">
              <div className="mk-miolos">
                {MIOLOS.map((m) => (
                  <button key={m.id} type="button" className={mioloTipo === m.id ? "is-on" : ""} onClick={() => setMioloTipo(m.id)}>
                    <i className={`mk-miolo mk-miolo--${m.id}`} />
                    <span>{m.nome}</span>
                  </button>
                ))}
              </div>
              <p className="mk-dica">A imagem enviada abaixo substitui só a página direita.</p>
              <label className="mk-upload">
                <MdImage /> {miolo ? "Trocar imagem do miolo" : "Enviar imagem do miolo"}
                <input type="file" accept="image/*" hidden onChange={(e) => subir(e.target.files?.[0], setMiolo)} />
              </label>
              {miolo && (
                <button type="button" className="mk-link" onClick={() => setMiolo(null)}>
                  remover (usar pautado)
                </button>
              )}
            </Bloco>
          )}

          </>
          )}

          </Aba>

          {agendaLike && (
            <Aba id="encad" atual={aba}>
              <Bloco titulo="Tipo de encadernação">
                <div className="mk-tipos mk-tipos--icones">
                  {TIPOS_ENCADERNACAO.filter((t) => (produto === "calendario" ? ["wireo", "espiral"].includes(t.id) : produto === "kit" ? t.id !== "bloco" : true)).map((t) => (
                    <button key={t.id} type="button" className={`mk-tipo ${tipo === t.id ? "is-on" : ""}`} onClick={() => setTipo(t.id)}>
                      <IconeEnc id={t.id} />
                      <b>{t.nome}</b>
                      <span>{t.desc}</span>
                    </button>
                  ))}
                </div>
              </Bloco>

              {faixa && (
                <Bloco titulo={tipo === "argolas" ? "Quantidade de argolas" : tipo === "discos" ? "Quantidade de discos" : "Quantidade de anéis"}>
                  <Contador
                    valor={aneisAuto ? faixa.padrao : aneisUsados}
                    min={faixa.min}
                    max={faixa.max}
                    esmaecido={aneisAuto}
                    unidade={`${faixa.min}–${faixa.max}`}
                    onChange={(v) => { setAneisAuto(false); setAneisN(v); }}
                  />
                  <input
                    type="range"
                    className="mk-range"
                    min={faixa.min}
                    max={faixa.max}
                    value={aneisAuto ? faixa.padrao : aneisUsados}
                    onChange={(e) => { setAneisAuto(false); setAneisN(Number(e.target.value)); }}
                  />
                  <label className="mk-linha">
                    Automático (ajusta ao tamanho)
                    <input type="checkbox" checked={aneisAuto} onChange={(e) => setAneisAuto(e.target.checked)} />
                  </label>
                </Bloco>
              )}

              {(tipo === "wireo" || tipo === "espiral" || tipo === "discos") && (
                <Bloco titulo="Furação">
                  <div className="mk-furos">
                    {FUROS.map((f) => (
                      <button key={f.id} type="button" className={furo === f.id ? "is-on" : ""} onClick={() => setFuro(f.id)}>
                        <IconeFuro id={f.id} />
                        <span>{f.id === "auto" ? `Auto · ${formaFuro("auto", tipo)}` : f.nome}</span>
                      </button>
                    ))}
                  </div>
                  <p className="mk-dica">Wire-o costuma ser quadrado, espiral redondo e agenda infinita usa furo em cogumelo.</p>
                </Bloco>
              )}

              {temMetal && (
                <Bloco titulo={tipo === "costura" ? "Cor da linha" : tipo === "discos" ? "Cor dos discos" : "Cor do metal"}>
                  <div className="mk-chips">
                    {Object.entries(METAIS).map(([id, m]) => (
                      <button
                        key={id}
                        type="button"
                        title={m.nome}
                        aria-label={m.nome}
                        className={`mk-chip ${metal === id ? "is-on" : ""}`}
                        style={{ background: `linear-gradient(135deg, ${m.luz}, ${m.base})` }}
                        onClick={() => setMetal(id)}
                      />
                    ))}
                  </div>
                  <label className="mk-linha">
                    Cor personalizada
                    <input type="color" value={/^#/.test(metal) ? metal : "#c9ced6"} onChange={(e) => setMetal(e.target.value)} />
                  </label>
                </Bloco>
              )}

              {produto === "agenda" && (
                <>
                  <Bloco titulo="Posição da encadernação">
                    <div className="mk-seg">
                      {Object.entries(DISPOSICOES).map(([id, nome]) => (
                        <button key={id} type="button" className={disp === id ? "is-on" : ""} onClick={() => setDisp(id)}>
                          {nome}
                        </button>
                      ))}
                    </div>
                  </Bloco>
                  <Bloco titulo="Visualização">
                    <div className="mk-seg">
                      <button type="button" className={view === "fechada" ? "is-on" : ""} onClick={() => setView("fechada")}>Capa fechada</button>
                      <button type="button" className={view === "aberta" ? "is-on" : ""} onClick={() => setView("aberta")}>Aberta</button>
                    </div>
                  </Bloco>
                </>
              )}
            </Aba>
          )}

          {agendaLike && (
            <Aba id="extras" atual={aba}>
              {produto === "agenda" && (
                <>
                  <Bloco titulo="Acabamento">
                    <label className="mk-linha">
                      Cantos arredondados
                      <input type="checkbox" checked={cantos} onChange={(e) => setCantos(e.target.checked)} />
                    </label>
                    <label className="mk-linha">
                      Fita marcadora
                      <span className="mk-par">
                        {fita && <input type="color" value={corFita} onChange={(e) => setCorFita(e.target.value)} />}
                        <input type="checkbox" checked={fita} onChange={(e) => setFita(e.target.checked)} />
                      </span>
                    </label>
                    <label className="mk-linha">
                      Porta-caneta com caneta
                      <input type="checkbox" checked={caneta} onChange={(e) => setCaneta(e.target.checked)} />
                    </label>
                  </Bloco>
                  <Bloco titulo="Elástico">
                    <label className="mk-linha">
                      Usar elástico
                      <span className="mk-par">
                        {elastico && <input type="color" value={corElastico} onChange={(e) => setCorElastico(e.target.value)} />}
                        <input type="checkbox" checked={elastico} onChange={(e) => setElastico(e.target.checked)} />
                      </span>
                    </label>
                    {elastico && (
                      <>
                        <label className="mk-linha mk-linha--col">
                          <span>Largura <b>{elasticoLarg} mm</b></span>
                          <input type="range" min="3" max="20" step="1" value={elasticoLarg} onChange={(e) => setElasticoLarg(Number(e.target.value))} />
                        </label>
                        <label className="mk-linha mk-linha--col">
                          <span>Distância da borda <b>{elasticoPos} mm</b></span>
                          <input type="range" min="8" max="70" step="1" value={elasticoPos} onChange={(e) => setElasticoPos(Number(e.target.value))} />
                        </label>
                        <label className="mk-linha">
                          Passante (laço que prende o elástico)
                          <span className="mk-par">
                            {passante && <input type="color" value={corPassante} onChange={(e) => setCorPassante(e.target.value)} />}
                            <input type="checkbox" checked={passante} onChange={(e) => setPassante(e.target.checked)} />
                          </span>
                        </label>
                      </>
                    )}
                  </Bloco>
                </>
              )}
              {produto !== "agenda" && <p className="mk-dica">Extras estão disponíveis para a agenda.</p>}
            </Aba>
          )}

          <Aba id="cena" atual={aba} todas={!agendaLike}>
          <Bloco titulo="Cenário">
            <div className="mk-chips">
              {Object.entries(CENAS).map(([id, c]) => (
                <button
                  key={id}
                  type="button"
                  title={c.nome}
                  aria-label={c.nome}
                  className={`mk-chip ${cena === id ? "is-on" : ""}`}
                  style={{ background: `linear-gradient(135deg, ${c.a}, ${c.b})` }}
                  onClick={() => setCena(id)}
                />
              ))}
            </div>
            <label className="mk-linha">
              Cor personalizada
              <input type="color" value={/^#/.test(cena) ? cena : "#e8dcc2"} onChange={(e) => setCena(e.target.value)} />
            </label>
          </Bloco>
          </Aba>
        </aside>

        <main className="mk-palco">
          <div className="mk-moldura">
            {vis === "3d" ? (
              <Suspense fallback={<div className="mk3d-host mk3d-carregando">Carregando 3D…</div>}>
                <Mockup3D
                  ref={m3dRef}
                  produto={produto}
                  tipo={tipo}
                  metal={metal}
                  mat={mat}
                  cena={cena}
                  view={view}
                  tamanho={tamanho}
                  corCapa={corCapa}
                  capaSrc={capaSrc}
                  ajuste={ajusteImg}
                  miolosrc={miolo}
                  mioloTipo={mioloTipo}
                  formato={formato}
                  lado={lado}
                  espessura={espessura}
                  folhaSrc={folhaBloco}
                  papelao={papelao}
                  corCola={corCola}
                  destacando={destacando}
                  girar={girar}
                  qualidade={qualidade}
                  arte={capaSrc}
                  arteVerso={arteVerso}
                  qTam={qTam}
                  orient={orient}
                  moldura={moldura}
                  molduraLarg={molduraLarg}
                  passepartout={passepartout}
                  montagem={montagem}
                  bTam={bTam}
                  bQtd={bQtd}
                  bBrilho={bBrilho}
                  cArco={cArco}
                  cMat={cMat}
                  corCaneca={corCaneca}
                  corInterior={produto === "caixa" ? corForro : corInterior}
                  cafe={cafe}
                  cQtd={cQtd}
                  cFosco={cFosco}
                  cxTam={cxTam}
                  abertura={abertura}
                  sTam={sTam}
                  corAlca={produto === "sacola" ? corAlcaSac : corAlca}
                  disp={disp}
                  aneis={aneisProp}
                  furo={furo}
                  elasticoLarg={elasticoLarg}
                  elasticoPos={elasticoPos}
                  passante={passante}
                  corPassante={corPassante}
                  elastico={elastico}
                  corElastico={corElastico}
                  fita={fita}
                  corFita={corFita}
                  caneta={caneta}
                  cantos={cantos}
                />
              </Suspense>
            ) : produto === "bloco" ? (
              <BlocoStage
                ref={svgRef}
                cena={cena}
                formato={formato}
                lado={lado}
                espessura={espessura}
                folhaSrc={folhaBloco}
                papelao={papelao}
                corCola={corCola}
                destacando={destacando}
                brilho={brilho}
              />
            ) : (
            <MockupStage
              ref={svgRef}
              tipo={tipo}
              metal={metal}
              cena={cena}
              view={view}
              capaSrc={capaSrc}
              miolosrc={miolo}
              corCapa={corCapa}
              brilho={brilho}
              mat={mat}
              disp={disp}
              aneis={aneisProp}
              furo={furo}
              cantos={cantos}
              elastico={elastico}
              corElastico={corElastico}
              elasticoLarg={elasticoLarg}
              elasticoPos={elasticoPos}
              passante={passante}
              corPassante={corPassante}
              fita={fita}
              corFita={corFita}
            />
            )}
            {gerando && <div className="mk-gerando">Gerando capa…</div>}
          </div>
          {vis === "3d" && (
            <div className="mk-vistas">
              <span>Arraste para girar · role para aproximar</span>
              <button type="button" onClick={() => m3dRef.current?.preset("tres")}>3/4</button>
              <button type="button" onClick={() => m3dRef.current?.preset("topo")}>Topo</button>
              <button type="button" onClick={() => m3dRef.current?.preset("rasante")}>Rasante</button>
              <button type="button" onClick={() => m3dRef.current?.preset("frente")}>Frente</button>
              <button type="button" className={qualidade === "alta" ? "is-on" : ""} title="Oclusão de ambiente e suavização (mais bonito, usa mais GPU)" onClick={() => setQualidade((q) => (q === "alta" ? "rapida" : "alta"))}>
                {qualidade === "alta" ? "Qualidade alta" : "Modo rápido"}
              </button>
              <button type="button" className={girar ? "is-on" : ""} onClick={() => setGirar((g) => !g)}>
                {girar ? "Parar giro" : "Girar"}
              </button>
            </div>
          )}
          <div className="mk-acoes">
            <span className="mk-legenda">{produto === "bloco" ? `Bloco ${FORMATOS_BLOCO[formato]?.nome.toLowerCase()} · colado ${lado === "topo" ? "no topo" : "na lateral"}` : grafico ? PRODUTOS[produto] : `${tipoAtual?.nome} · ${tipoAtual?.desc}`}</span>
            {vis === "3d" ? (
              <>
                <button type="button" className="mk-btn mk-btn--sec" onClick={gravarVideo} disabled={gravando}>
                  {gravando ? "Gravando…" : "Vídeo"}
                </button>
                <button type="button" className="mk-btn mk-btn--sec" onClick={() => baixar3d("jpg")} disabled={baixando}>
                  JPG
                </button>
                <button type="button" className="mk-btn" onClick={() => baixar3d("png")} disabled={baixando}>
                  <MdDownload /> {baixando ? "Gerando…" : "Baixar PNG"}
                </button>
              </>
            ) : (
              <>
                <button type="button" className="mk-btn mk-btn--sec" onClick={baixarSvg}>
                  SVG
                </button>
                <button type="button" className="mk-btn" onClick={baixarPng} disabled={baixando}>
                  <MdDownload /> {baixando ? "Gerando…" : "Baixar PNG"}
                </button>
              </>
            )}
          </div>
        </main>
      </div>

      {/* Capa real, fora da tela, apenas para ser capturada em imagem. */}
      {produto !== "bloco" && origem === "agenda" && (
        <div className="mk-offscreen" aria-hidden="true">
          <div ref={capaRef} style={{ width: "210mm", height: "297mm" }}>
            <CapaLayout
              capaNome={cfg.capaNome}
              capaEstilo={cfg.capaEstilo}
              capaFrase={cfg.capaFrase}
              colorTheme={cfg.colorTheme}
              logo={cfg.logo}
              footerType={cfg.footerType}
              customColors={cfg.customColors}
              fontFamily={cfg.fontFamily}
              watermarkSrc={cfg.watermarkSrc}
              watermarkOpacity={cfg.watermarkOpacity}
              backgroundSrc={cfg.backgroundSrc}
              backgroundOpacity={cfg.backgroundOpacity}
              selectedDate={`${anoAtual}-01-01`}
            />
          </div>
        </div>
      )}
    </div>
  );
}
