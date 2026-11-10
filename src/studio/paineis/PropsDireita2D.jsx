import { AlignCenterHorizontal, AlignCenterVertical, AlignEndHorizontal, AlignEndVertical, AlignStartHorizontal, AlignStartVertical, ArrowDownToLine, ArrowUpToLine, ChevronDown, ChevronUp, Copy, Crosshair, Eye, EyeOff, Group as GroupIcon, Lock, LockOpen, Trash2, Ungroup } from "lucide-react";
import { agrupar, alinhar, alterar, centralizar, desagrupar, duplicar, excluir, FONTES, ordem } from "../ops2d";
import { Botao, Cor, Linha, Num, Secao, Seg, Slider } from "./Ui";

const FORMAS = [["1600x1200", "4:3"], ["1200x1200", "1:1"], ["1920x1080", "16:9"], ["1200x1500", "4:5"], ["1080x1920", "9:16"]];

export default function PropsDireita2D({ estado, set, selecao, setSelecao }) {
  const { W, H, elementos } = estado;
  const sel = elementos.filter((e) => selecao.includes(e.id));
  const um = sel.length === 1 ? sel[0] : null;
  const ed = (patch) => set((l) => alterar(l, selecao, patch));
  const cam = [...elementos].reverse();

  return (
    <div className="st-props">
      <Secao titulo="Tela">
        <Linha rotulo="Proporção">
          <select value={`${W}x${H}`} onChange={(e) => { const [w, h] = e.target.value.split("x").map(Number); set((l) => ({ ...l, W: w, H: h })); }}>
            {FORMAS.map(([v, n]) => <option key={v} value={v}>{n} · {v}</option>)}
            {!FORMAS.some(([v]) => v === `${W}x${H}`) && <option value={`${W}x${H}`}>{W}×{H}</option>}
          </select>
        </Linha>
        <Cor rotulo="Cor de fundo" valor={estado.fundoCor || "#ffffff"} onChange={(c) => set((l) => ({ ...l, fundoCor: c, cenario: null }))} />
      </Secao>

      {sel.length > 0 && (
        <Secao titulo={um ? `Objeto · ${um.nome || um.tipo}` : `${sel.length} objetos`}>
          <div className="st-acoes">
            <Botao icone={Copy} title="Duplicar" onClick={() => set((l) => { const r = duplicar(l, selecao); setSelecao(r.ids); return r.l; })} />
            <Botao icone={Trash2} title="Excluir" onClick={() => { set((l) => excluir(l, selecao)); setSelecao([]); }} />
            <Botao icone={sel.every((e) => e.locked) ? LockOpen : Lock} title="Bloquear/desbloquear" onClick={() => ed({ locked: !sel.every((e) => e.locked) })} />
            <Botao icone={sel.every((e) => e.hidden) ? Eye : EyeOff} title="Ocultar/mostrar" onClick={() => ed({ hidden: !sel.every((e) => e.hidden) })} />
            <Botao icone={GroupIcon} title="Agrupar" disabled={sel.length < 2} onClick={() => set((l) => agrupar(l, selecao))} />
            <Botao icone={Ungroup} title="Desagrupar" disabled={!sel.some((e) => e.grupo)} onClick={() => set((l) => desagrupar(l, selecao))} />
          </div>
        </Secao>
      )}

      {sel.length > 0 && (
        <Secao titulo="Alinhamento">
          <div className="st-acoes">
            {[[AlignStartVertical, "esq", "Esquerda"], [AlignCenterVertical, "centroH", "Centro horizontal"], [AlignEndVertical, "dir", "Direita"], [AlignStartHorizontal, "topo", "Topo"], [AlignCenterHorizontal, "centroV", "Centro vertical"], [AlignEndHorizontal, "base", "Base"]].map(([I, m, t]) => (
              <Botao key={m} icone={I} title={t} onClick={() => set((l) => alinhar(l, selecao, m, { W, H }))} />
            ))}
            <Botao icone={Crosshair} title="Centralizar na tela" onClick={() => set((l) => centralizar(l, selecao, { W, H }))} />
          </div>
          <div className="st-acoes">
            <Botao icone={ArrowUpToLine} title="Trazer para frente" onClick={() => set((l) => ordem(l, selecao, "frente"))} />
            <Botao icone={ChevronUp} title="Subir camada" onClick={() => set((l) => ordem(l, selecao, "sobe"))} />
            <Botao icone={ChevronDown} title="Descer camada" onClick={() => set((l) => ordem(l, selecao, "desce"))} />
            <Botao icone={ArrowDownToLine} title="Enviar para trás" onClick={() => set((l) => ordem(l, selecao, "fundo"))} />
          </div>
        </Secao>
      )}

      {um && (
        <>
          <Secao titulo="Dimensões e transformação">
            <div className="st-grade2">
              <Num rotulo="X" valor={um.x} onChange={(v) => ed({ x: v })} />
              <Num rotulo="Y" valor={um.y} onChange={(v) => ed({ y: v })} />
              <Num rotulo="L" valor={um.w} min={8} onChange={(v) => ed({ w: Math.max(8, v) })} />
              <Num rotulo="A" valor={um.h} min={8} onChange={(v) => ed({ h: Math.max(8, v) })} />
            </div>
            <Slider rotulo="Rotação" valor={um.rotation || 0} min={-180} max={180} onChange={(v) => ed({ rotation: v })} un="°" />
            <Slider rotulo="Opacidade" valor={um.opacidade ?? 1} min={0.05} max={1} passo={0.01} onChange={(v) => ed({ opacidade: v })} />
          </Secao>

          <Secao titulo="Cores e conteúdo">
            {um.tipo === "texto" && (
              <>
                <Linha rotulo="Texto"><textarea rows={2} value={um.texto} onChange={(e) => ed({ texto: e.target.value })} /></Linha>
                <Linha rotulo="Fonte"><select value={um.fonte} onChange={(e) => ed({ fonte: e.target.value })}>{FONTES.map((f) => <option key={f} value={f}>{f.split(",")[0].replace(/'/g, "")}</option>)}</select></Linha>
                <Slider rotulo="Tamanho" valor={um.fontSize} min={10} max={240} onChange={(v) => ed({ fontSize: v, h: Math.round(v * 1.15) })} />
                <Cor rotulo="Cor" valor={um.cor} onChange={(c) => ed({ cor: c })} />
                <Seg valor={um.negrito ? "b" : "n"} opcoes={[["n", "Normal"], ["b", "Negrito"]]} onChange={(v) => ed({ negrito: v === "b" })} />
                <Seg valor={um.alinhar || "left"} opcoes={[["left", "Esq."], ["center", "Centro"], ["right", "Dir."]]} onChange={(v) => ed({ alinhar: v })} />
              </>
            )}
            {um.tipo === "acessorio" && (<><Cor rotulo="Cor principal" valor={um.c} onChange={(c) => ed({ c })} /><Cor rotulo="Cor de detalhe" valor={um.d} onChange={(c) => ed({ d: c })} /></>)}
            {um.tipo === "produto" && (
              <>
                <Cor rotulo="Cor da capa" valor={um.cor} onChange={(c) => ed({ cor: c })} />
                {um.kind === "quadro" && <Cor rotulo="Moldura" valor={um.moldura} onChange={(c) => ed({ moldura: c })} />}
                {um.capa && <Botao onClick={() => ed({ capa: null })}>Remover arte da capa</Botao>}
                <p className="st-dica">Para colocar uma arte na capa, selecione o produto e clique em uma imagem em “Uploads”.</p>
              </>
            )}
            {um.tipo === "imagem" && <p className="st-dica">Imagem enviada. Use opacidade e sombra abaixo.</p>}
          </Secao>

          <Secao titulo="Sombra">
            <Seg valor={um.sombra?.on ? "on" : "off"} opcoes={[["off", "Sem sombra"], ["on", "Com sombra"]]} onChange={(v) => ed({ sombra: { ...um.sombra, on: v === "on" } })} />
            {um.sombra?.on && (
              <>
                <Slider rotulo="Desfoque" valor={um.sombra.blur} min={0} max={60} onChange={(v) => ed({ sombra: { ...um.sombra, blur: v } })} />
                <Slider rotulo="Dist. X" valor={um.sombra.x} min={-40} max={40} onChange={(v) => ed({ sombra: { ...um.sombra, x: v } })} />
                <Slider rotulo="Dist. Y" valor={um.sombra.y} min={-40} max={40} onChange={(v) => ed({ sombra: { ...um.sombra, y: v } })} />
                <Slider rotulo="Intensidade" valor={um.sombra.op} min={0} max={1} passo={0.01} onChange={(v) => ed({ sombra: { ...um.sombra, op: v } })} />
              </>
            )}
          </Secao>
        </>
      )}

      <Secao titulo={`Camadas (${elementos.length})`}>
        <ul className="st-camadas">
          {cam.length === 0 && <li className="st-dica">Nenhum objeto ainda. Adicione produtos, acessórios, textos ou imagens.</li>}
          {cam.map((e) => (
            <li key={e.id} className={selecao.includes(e.id) ? "on" : ""} onClick={(ev) => setSelecao((s) => (ev.shiftKey ? [...new Set([...s, e.id])] : [e.id]))}>
              <span className="st-camadas__n">{e.grupo ? "▣ " : ""}{e.nome || e.tipo}</span>
              <button title="Ocultar" onClick={(ev) => { ev.stopPropagation(); set((l) => alterar(l, [e.id], { hidden: !e.hidden })); }}>{e.hidden ? <EyeOff size={13} /> : <Eye size={13} />}</button>
              <button title="Bloquear" onClick={(ev) => { ev.stopPropagation(); set((l) => alterar(l, [e.id], { locked: !e.locked })); }}>{e.locked ? <Lock size={13} /> : <LockOpen size={13} />}</button>
            </li>
          ))}
        </ul>
      </Secao>
    </div>
  );
}
