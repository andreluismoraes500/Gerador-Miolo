// Cartão de visita: frente e verso alinhados para impressão em duplex.
// Você digita a quantidade e a página monta as folhas automaticamente.
import { useMemo, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { MdPrint, MdUploadFile } from "react-icons/md";
import CartaoFace from "../components/cartao/CartaoFace";
import FolhaCartoes from "../components/cartao/FolhaCartoes";
import { lerImagem } from "../lib/lerImagem";
import { AJUSTE_ARTE, calcularLayout, cartaoCfg, FONTES, PALETAS, PAPEIS, TAMANHOS } from "../lib/cartaoVisita";

const MM = 3.7795; // px por mm

const Campo = ({ rotulo, children, dica }) => (
  <div className="flex flex-col gap-1 text-xs text-[#24344D]">
    <span className="font-semibold">{rotulo}</span>{children}
    {dica && <span className="text-[11px] text-[#8B6A1F]">{dica}</span>}
  </div>
);
const entrada = "w-full rounded-lg border border-[#D8CBA8] bg-white px-2 py-1.5 text-sm";
const Painel = ({ titulo, children }) => (
  <section className="bg-[#FBF8F1] border border-[#D8CBA8] rounded-2xl p-4 flex flex-col gap-3">
    <h2 className="font-bold text-[#24344D]">{titulo}</h2>{children}
  </section>
);
const Seg = ({ valor, opcoes, onChange }) => (
  <div className="flex flex-wrap gap-1.5">
    {opcoes.map(([v, n]) => (
      <button key={v} type="button" onClick={() => onChange(v)} className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${valor === v ? "bg-[#24344D] text-white border-[#24344D]" : "bg-white border-[#D8CBA8] text-[#24344D]"}`}>{n}</button>
    ))}
  </div>
);

export default function CartaoVisitaPage() {
  const c = cartaoCfg.useStore();
  const set = (p) => cartaoCfg.set(p);
  const L = useMemo(() => calcularLayout(c), [c]);
  const [folha, setFolha] = useState(0);
  const [ladoPrev, setLadoPrev] = useState("frente");
  const logoRef = useRef(null);

  const enviar = (campo) => async (e) => {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;
    try { set({ [campo]: await lerImagem(f) }); } catch { toast.error("Não foi possível ler a imagem."); }
  };
  const campo = (k, rot, extra = {}) => <Campo rotulo={rot}><input className={entrada} value={c[k]} onChange={(e) => set({ [k]: e.target.value })} {...extra} /></Campo>;

  const folhas = Math.max(L.folhas, 0);
  const paginasTotal = folhas * (c.verso ? 2 : 1);
  const folhaPrev = Math.min(folha, Math.max(folhas - 1, 0));
  const quantosNaFolha = (i) => (i === folhas - 1 ? L.ultima : L.porFolha);
  const escalaFolha = Math.min(1, 620 / (L.W * MM));

  const imprimir = () => {
    if (!L.porFolha) { toast.error("O cartão não cabe nessa folha: reduza as margens ou o espaço."); return; }
    window.print();
  };

  return (
    <div className="cv-raiz mx-auto max-w-7xl px-4 py-6">
      <style>{`
        .cv-print { display: none; }
        .cv-folha { position: relative; background: #fff; overflow: hidden; }
        @media print {
          @page { size: ${L.W}mm ${L.H}mm; margin: 0; }
          html, body { width: ${L.W}mm !important; height: auto !important; }
          .cv-raiz { padding: 0 !important; margin: 0 !important; max-width: none !important; }
          .cv-tela { display: none !important; }
          .cv-print { display: block !important; }
          .cv-print .cv-folha { page-break-after: always; break-after: page; width: ${L.W}mm; height: ${L.H}mm; }
          .cv-print .cv-folha:last-child { page-break-after: auto; break-after: auto; }
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        }
      `}</style>

      <div className="cv-tela grid gap-5 lg:grid-cols-[360px_minmax(0,1fr)]">
        <div className="flex flex-col gap-4">
          <Painel titulo="🪪 Seus dados">
            {campo("nome", "Nome")}{campo("cargo", "Cargo / profissão")}{campo("empresa", "Empresa")}{campo("slogan", "Frase (verso)")}
            {campo("telefone", "Telefone / WhatsApp")}{campo("email", "E-mail")}{campo("site", "Site")}{campo("instagram", "Instagram")}{campo("endereco", "Endereço")}
            <Campo rotulo="Logo (opcional)">
              <div className="flex gap-2 items-center">
                <button type="button" className="px-3 py-1.5 rounded-lg border border-[#D8CBA8] bg-white text-xs font-semibold flex items-center gap-1" onClick={() => logoRef.current?.click()}><MdUploadFile /> Enviar logo</button>
                {c.logo && <button type="button" className="text-xs underline" onClick={() => set({ logo: null })}>remover</button>}
                <input ref={logoRef} type="file" accept="image/*" hidden onChange={enviar("logo")} />
              </div>
            </Campo>
          </Painel>

          <Painel titulo="🎨 Visual">
            <Campo rotulo="Paleta">
              <div className="flex flex-wrap gap-2">
                {PALETAS.map((p) => (
                  <button key={p.nome} type="button" title={p.nome} onClick={() => set({ fundo: p.fundo, texto: p.texto, acento: p.acento, fundoV: p.acento, textoV: p.fundo })}
                    className="w-9 h-9 rounded-full border-2 border-white shadow ring-1 ring-[#D8CBA8]" style={{ background: `linear-gradient(135deg, ${p.fundo} 55%, ${p.acento} 55%)` }} />
                ))}
              </div>
            </Campo>
            <div className="grid grid-cols-3 gap-2">
              {[["fundo", "Fundo"], ["texto", "Texto"], ["acento", "Destaque"]].map(([k, r]) => <Campo key={k} rotulo={r}><input type="color" value={c[k]} onChange={(e) => set({ [k]: e.target.value })} className="w-full h-8 rounded" /></Campo>)}
            </div>
            <Campo rotulo="Fonte do nome"><select className={entrada} value={c.fonte} onChange={(e) => set({ fonte: e.target.value })}>{FONTES.map(([v, n]) => <option key={v} value={v}>{n}</option>)}</select></Campo>
            <Campo rotulo="Fonte do texto"><select className={entrada} value={c.fonteTexto} onChange={(e) => set({ fonteTexto: e.target.value })}>{FONTES.map(([v, n]) => <option key={v} value={v}>{n}</option>)}</select></Campo>
            <Campo rotulo="Layout da frente"><Seg valor={c.layoutF} onChange={(v) => set({ layoutF: v })} opcoes={[["classico", "Clássico"], ["moderno", "Moderno"], ["minimal", "Minimal"], ["elegante", "Elegante"]]} /></Campo>
            <label className="flex items-center gap-2 text-xs"><input type="checkbox" checked={c.verso} onChange={(e) => set({ verso: e.target.checked })} /> Imprimir também o verso</label>
            {c.verso && (
              <>
                <Campo rotulo="Layout do verso"><Seg valor={c.layoutV} onChange={(v) => set({ layoutV: v })} opcoes={[["logo", "Logo"], ["contatos", "Contatos"], ["monograma", "Monograma"]]} /></Campo>
                <label className="flex items-center gap-2 text-xs"><input type="checkbox" checked={c.mesmaCorVerso} onChange={(e) => set({ mesmaCorVerso: e.target.checked })} /> Verso com as mesmas cores da frente</label>
                {!c.mesmaCorVerso && (
                  <div className="grid grid-cols-2 gap-2">
                    <Campo rotulo="Fundo do verso"><input type="color" value={c.fundoV} onChange={(e) => set({ fundoV: e.target.value })} className="w-full h-8 rounded" /></Campo>
                    <Campo rotulo="Texto do verso"><input type="color" value={c.textoV} onChange={(e) => set({ textoV: e.target.value })} className="w-full h-8 rounded" /></Campo>
                  </div>
                )}
              </>
            )}
          </Painel>

          <Painel titulo="🖼️ Usar arte pronta (opcional)">
            <p className="text-[11px] text-[#8B6A1F]">Se você já tem o cartão desenhado, envie as imagens da frente e do verso. Elas ocupam o cartão inteiro.</p>
            {[["Frente", "arteFrente", "usarArteFrente", "ajusteF"], ["Verso", "arteVerso", "usarArteVerso", "ajusteV"]].map(([r, k, u, aj]) => {
              const a = { ...AJUSTE_ARTE, ...(c[aj] || {}) };
              const ed = (p) => set({ [aj]: { ...a, ...p } });
              return (
                <div key={k} className="flex flex-col gap-2 border-t border-[#E8DFC8] pt-3 first:border-0 first:pt-0">
                  <div className="flex items-center gap-2 text-xs">
                    <label className="px-3 py-1.5 rounded-lg border border-[#D8CBA8] bg-white font-semibold cursor-pointer" style={{ display: "inline-flex", gap: 4, alignItems: "center" }}><MdUploadFile /> {r}<input type="file" accept="image/*" hidden onChange={async (e) => { await enviar(k)(e); set({ [u]: true, [aj]: { ...AJUSTE_ARTE } }); }} /></label>
                    {c[k] && <><label className="flex items-center gap-1"><input type="checkbox" checked={c[u]} onChange={(e) => set({ [u]: e.target.checked })} /> usar</label><button type="button" className="underline" onClick={() => set({ [k]: null, [u]: false })}>remover</button></>}
                  </div>
                  {c[k] && c[u] && (
                    <div className="flex flex-col gap-2 text-xs text-[#24344D]">
                      <Seg valor={a.modo} onChange={(v) => ed({ modo: v })} opcoes={[["caber", "Imagem inteira"], ["cobrir", "Preencher (corta)"], ["esticar", "Esticar"]]} />
                      {a.modo === "caber" && (
                        <div className="flex items-center gap-2 flex-wrap">
                          <span>Fundo:</span>
                          <Seg valor={a.fundoModo} onChange={(v) => ed({ fundoModo: v })} opcoes={[["desfoque", "Desfocado"], ["cor", "Cor"]]} />
                          {a.fundoModo === "cor" && <input type="color" value={a.fundoCor} onChange={(e) => ed({ fundoCor: e.target.value })} />}
                        </div>
                      )}
                      <label className="grid grid-cols-[70px_1fr_36px] items-center gap-2">Zoom<input type="range" min={0.5} max={3} step={0.02} value={a.zoom} onChange={(e) => ed({ zoom: Number(e.target.value) })} /><span>{a.zoom.toFixed(2)}×</span></label>
                      <label className="grid grid-cols-[70px_1fr_36px] items-center gap-2">Horizontal<input type="range" min={-100} max={100} value={a.x} onChange={(e) => ed({ x: Number(e.target.value) })} /><span>{a.x}</span></label>
                      <label className="grid grid-cols-[70px_1fr_36px] items-center gap-2">Vertical<input type="range" min={-100} max={100} value={a.y} onChange={(e) => ed({ y: Number(e.target.value) })} /><span>{a.y}</span></label>
                      <div className="flex gap-2">
                        <button type="button" className="px-3 py-1.5 rounded-lg border border-[#D8CBA8] bg-white font-semibold" onClick={() => ed({ girar: !a.girar })}>↻ Girar 90°</button>
                        <button type="button" className="px-3 py-1.5 rounded-lg border border-[#D8CBA8] bg-white font-semibold" onClick={() => set({ [aj]: { ...AJUSTE_ARTE } })}>Restaurar</button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            {(() => {
              const img = c.usarArteFrente && c.arteFrente;
              const retrato = c.tamanho !== "50x90";
              return img && retrato && c.ajusteF?.modo !== "cobrir" ? <p className="text-[11px] text-[#8B6A1F]">Dica: se a imagem é vertical (em pé), o cartão <b>50 × 90 mm (vertical)</b> aproveita quase toda a arte. <button type="button" className="underline font-semibold" onClick={() => set({ tamanho: "50x90" })}>Usar cartão vertical</button></p> : null;
            })()}
          </Painel>
        </div>

        <div className="flex flex-col gap-4 min-w-0">
          <Painel titulo="🖨️ Impressão automática">
            <div className="grid gap-3 sm:grid-cols-3">
              <Campo rotulo="Quantidade de cartões"><input type="number" min={1} max={20000} className={`${entrada} text-lg font-bold`} value={c.quantidade} onChange={(e) => set({ quantidade: Math.max(1, Math.min(20000, Number(e.target.value) || 1)) })} /></Campo>
              <Campo rotulo="Tamanho do cartão"><select className={entrada} value={c.tamanho} onChange={(e) => set({ tamanho: e.target.value })}>{Object.entries(TAMANHOS).map(([k, v]) => <option key={k} value={k}>{v.nome}</option>)}</select></Campo>
              <Campo rotulo="Papel"><select className={entrada} value={c.papel} onChange={(e) => set({ papel: e.target.value })}>{Object.entries(PAPEIS).map(([k, v]) => <option key={k} value={k}>{v.nome}</option>)}</select></Campo>
            </div>
            <div className="rounded-xl bg-white border border-[#D8CBA8] p-3 text-sm text-[#24344D] leading-relaxed">
              {L.porFolha ? (
                <>
                  <b>{L.porFolha} cartões por folha</b> ({L.cols} × {L.rows}, folha {L.W > L.H ? "deitada" : "em pé"}). Para {c.quantidade} cartões:{" "}
                  <b>{folhas} {folhas === 1 ? "folha" : "folhas"}</b>{c.verso ? <> frente e verso = <b>{paginasTotal} páginas</b></> : null}
                  {L.ultima < L.porFolha && L.folhas > 0 ? <> · a última folha terá {L.ultima} cartões ({L.porFolha - L.ultima} de sobra).</> : "."}
                </>
              ) : <span className="text-red-700">O cartão não cabe nessa folha com essas margens.</span>}
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <Campo rotulo="Margem da folha (mm)"><input type="number" min={0} max={30} className={entrada} value={c.margem} onChange={(e) => set({ margem: Math.max(0, Number(e.target.value) || 0) })} /></Campo>
              <Campo rotulo="Espaço entre cartões (mm)"><input type="number" min={0} max={20} className={entrada} value={c.espaco} onChange={(e) => set({ espaco: Math.max(0, Number(e.target.value) || 0) })} /></Campo>
              <Campo rotulo="Sangria (mm)"><select className={entrada} value={c.sangria} onChange={(e) => set({ sangria: Number(e.target.value) })}><option value={0}>Sem sangria</option><option value={1}>1 mm</option><option value={2}>2 mm</option><option value={3}>3 mm</option></select></Campo>
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-2 items-end">
              <Campo rotulo="Posição na folha"><Seg valor={c.orientacao} onChange={(v) => set({ orientacao: v })} opcoes={[["auto", "Automática"], ["retrato", "Em pé"], ["paisagem", "Deitada"]]} /></Campo>
              {c.verso && <Campo rotulo="Virar a folha pela" dica={c.virar === "lado" ? "Duplex “borda longa” (padrão da maioria das impressoras)." : "Duplex “borda curta”: o verso sai girado 180°."}><Seg valor={c.virar} onChange={(v) => set({ virar: v })} opcoes={[["lado", "Lateral"], ["topo", "Topo"]]} /></Campo>}
              <label className="flex items-center gap-2 text-xs"><input type="checkbox" checked={c.marcas} onChange={(e) => set({ marcas: e.target.checked })} /> Marcas de corte</label>
            </div>
            {c.verso && (
              <div className="grid gap-3 sm:grid-cols-2">
                <Campo rotulo="Ajuste fino do verso — horizontal (mm)" dica="Se o verso sair deslocado, compense aqui (use décimos, ex.: 0.5)."><input type="number" step={0.1} className={entrada} value={c.ajusteX} onChange={(e) => set({ ajusteX: Number(e.target.value) || 0 })} /></Campo>
                <Campo rotulo="Ajuste fino do verso — vertical (mm)"><input type="number" step={0.1} className={entrada} value={c.ajusteY} onChange={(e) => set({ ajusteY: Number(e.target.value) || 0 })} /></Campo>
              </div>
            )}
            <button type="button" onClick={imprimir} className="self-start inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#8B1D2C] text-white font-bold hover:opacity-90"><MdPrint size={20} /> Imprimir / salvar em PDF ({paginasTotal} páginas)</button>
            <p className="text-[11px] text-[#8B6A1F]">Na janela de impressão escolha <b>frente e verso (duplex)</b> e escala <b>100%</b> (sem “ajustar à página”). Sem duplex: imprima as páginas ímpares, vire as folhas e imprima as pares.</p>
          </Painel>

          <Painel titulo="👀 Pré-visualização">
            <div className="flex flex-wrap gap-6 items-start">
              {["frente", ...(c.verso ? ["verso"] : [])].map((lado) => (
                <div key={lado} className="flex flex-col gap-1">
                  <span className="text-xs font-semibold capitalize text-[#24344D]">{lado}</span>
                  <div style={{ zoom: Math.min(2.6, 330 / (L.t.w * MM)), boxShadow: "0 6px 20px #0003", borderRadius: 2 }}>
                    <CartaoFace cfg={c} lado={lado} w={L.t.w} h={L.t.h} sangria={0} />
                  </div>
                </div>
              ))}
            </div>
            {L.porFolha > 0 && (
              <>
                <div className="flex flex-wrap gap-2 items-center mt-2">
                  <Seg valor={ladoPrev} onChange={setLadoPrev} opcoes={[["frente", "Folha (frente)"], ...(c.verso ? [["verso", "Folha (verso)"]] : [])]} />
                  <select className="rounded-lg border border-[#D8CBA8] bg-white px-2 py-1 text-xs" value={folhaPrev} onChange={(e) => setFolha(Number(e.target.value))}>
                    {Array.from({ length: Math.min(folhas, 200) }).map((_, i) => <option key={i} value={i}>Folha {i + 1} de {folhas}</option>)}
                  </select>
                </div>
                <div className="overflow-auto rounded-lg bg-[#ddd] p-3">
                  <div style={{ zoom: escalaFolha, width: "fit-content", boxShadow: "0 4px 16px #0004" }}>
                    <FolhaCartoes cfg={c} L={L} lado={ladoPrev} quantos={quantosNaFolha(folhaPrev)} />
                  </div>
                </div>
                <p className="text-[11px] text-[#8B6A1F]">O verso é espelhado automaticamente: cada verso fica exatamente atrás da sua frente quando a folha é virada.</p>
              </>
            )}
          </Painel>
        </div>
      </div>

      {/* Saída de impressão: todas as folhas, alternando frente e verso */}
      <div className="cv-print">
        {Array.from({ length: folhas }).flatMap((_, i) => [
          <FolhaCartoes key={`f${i}`} cfg={c} L={L} lado="frente" quantos={quantosNaFolha(i)} />,
          ...(c.verso ? [<FolhaCartoes key={`v${i}`} cfg={c} L={L} lado="verso" quantos={quantosNaFolha(i)} />] : []),
        ])}
      </div>
    </div>
  );
}
