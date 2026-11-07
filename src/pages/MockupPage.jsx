// src/pages/MockupPage.jsx
//
// Mockup da agenda: mostra a capa (gerada a partir das configurações atuais
// ou enviada como imagem) numa cena realista, com o tipo de encadernação
// escolhido, e permite baixar em PNG (ou SVG).
//
// Dependência nova: html-to-image  →  npm i html-to-image
// (só é usada para "fotografar" a CapaLayout em PNG antes de colocá-la no SVG).

import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { MdDownload, MdImage, MdRefresh } from "react-icons/md";
import { toPng } from "html-to-image";
import CapaLayout from "../components/layouts/CapaLayout";
import { useAgendaConfig } from "../context/AgendaConfigContext";
import BlocoStage, { FORMATOS_BLOCO, PAPELAO } from "../components/mockup/BlocoStage";
import MockupStage, { CENAS, STAGE_H, STAGE_W } from "../components/mockup/MockupStage";
import { METAIS, TIPOS_ANELADOS, TIPOS_ENCADERNACAO } from "../components/mockup/bindings";
import { usePersistedState } from "../hooks/usePersistedState";
import "../styles/mockup.css";

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

  const [capaUpload, setCapaUpload] = useState(null);
  const [miolo, setMiolo] = useState(null);
  const [capaGerada, setCapaGerada] = useState(null);
  const [gerando, setGerando] = useState(false);
  const [baixando, setBaixando] = useState(false);

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
    if (produto !== "agenda" || origem !== "agenda") return;
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

  const tipoAtual = TIPOS_ENCADERNACAO.find((t) => t.id === tipo);

  return (
    <div className="mk-page">
      <header className="mk-head">
        <h1>Mockup da agenda</h1>
        <p>Veja sua agenda como produto pronto, escolha a encadernação e baixe a imagem.</p>
      </header>

      <div className="mk-grid">
        <aside className="mk-controles">
          <Bloco titulo="Produto">
            <div className="mk-seg">
              <button type="button" className={produto === "agenda" ? "is-on" : ""} onClick={() => setProduto("agenda")}>
                Agenda
              </button>
              <button type="button" className={produto === "bloco" ? "is-on" : ""} onClick={() => setProduto("bloco")}>
                Bloco
              </button>
            </div>
          </Bloco>

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

          {produto === "agenda" && (
          <>
          <Bloco titulo="Encadernação / furo">
            <div className="mk-tipos">
              {TIPOS_ENCADERNACAO.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  className={`mk-tipo ${tipo === t.id ? "is-on" : ""}`}
                  onClick={() => setTipo(t.id)}
                >
                  <b>{t.nome}</b>
                  <span>{t.desc}</span>
                </button>
              ))}
            </div>
          </Bloco>

          {temMetal && (
            <Bloco titulo={tipo === "costura" ? "Cor da linha" : "Cor do metal"}>
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
            </Bloco>
          )}

          <Bloco titulo="Visualização">
            <div className="mk-seg">
              <button type="button" className={view === "fechada" ? "is-on" : ""} onClick={() => setView("fechada")}>
                Capa fechada
              </button>
              <button type="button" className={view === "aberta" ? "is-on" : ""} onClick={() => setView("aberta")}>
                Aberta
              </button>
            </div>
          </Bloco>

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

          {view === "aberta" && (
            <Bloco titulo="Página interna (lado direito)">
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
          </Bloco>
        </aside>

        <main className="mk-palco">
          <div className="mk-moldura">
            {produto === "bloco" ? (
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
            />
            )}
            {gerando && <div className="mk-gerando">Gerando capa…</div>}
          </div>
          <div className="mk-acoes">
            <span className="mk-legenda">{produto === "bloco" ? `Bloco ${FORMATOS_BLOCO[formato]?.nome.toLowerCase()} · colado ${lado === "topo" ? "no topo" : "na lateral"}` : `${tipoAtual?.nome} · ${tipoAtual?.desc}`}</span>
            <button type="button" className="mk-btn mk-btn--sec" onClick={baixarSvg}>
              SVG
            </button>
            <button type="button" className="mk-btn" onClick={baixarPng} disabled={baixando}>
              <MdDownload /> {baixando ? "Gerando…" : "Baixar PNG"}
            </button>
          </div>
        </main>
      </div>

      {/* Capa real, fora da tela, apenas para ser capturada em imagem. */}
      {produto === "agenda" && origem === "agenda" && (
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
