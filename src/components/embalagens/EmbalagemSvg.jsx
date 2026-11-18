// Desenha UMA planificação (molde) em SVG, em mm: arte de cada peça, linhas de corte (cheia) e dobra (tracejada).
import { useId } from "react";
import { aplicar } from "../../lib/capas";
import { embImgs, faceNova, PT } from "../../lib/embalagens";

const pontos = (pts) => pts.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(" ");

export default function EmbalagemSvg({ geo, cfg, modelo, dados, interativo = false, onSel, onMoverTexto, selTexto = -1, onSelTexto }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const arteModelo = cfg.arte[modelo] || {};
  const dadoFace = (p, i) => arteModelo[p.id] || faceNova(cfg.tema, i === 0);
  const faceDe = (id) => { const i = geo.faces.findIndex((f) => f.id === id); return i < 0 ? null : dadoFace(geo.faces[i], i); };

  const mover = (e, p, f, k, caixa, grupo) => {
    if (!interativo) return;
    e.stopPropagation();
    onSel && onSel(p.id);
    onSelTexto && onSelTexto(k);
    e.preventDefault();
    const local = (ev) => {
      const m = grupo.getScreenCTM();
      if (!m) return null;
      const pt = new DOMPoint(ev.clientX, ev.clientY).matrixTransform(m.inverse());
      return [((pt.x - caixa.x) / caixa.w) * 100, ((pt.y - caixa.y) / caixa.h) * 100];
    };
    const mv = (ev) => {
      const r = local(ev);
      if (!r) return;
      onMoverTexto && onMoverTexto(p.id, k, +Math.max(0, Math.min(100, r[0])).toFixed(2), +Math.max(0, Math.min(100, r[1])).toFixed(2));
    };
    const fim = () => { window.removeEventListener("pointermove", mv); window.removeEventListener("pointerup", fim); };
    window.addEventListener("pointermove", mv);
    window.addEventListener("pointerup", fim);
  };

  return (
    <svg viewBox={`0 0 ${geo.w} ${geo.h}`} width="100%" height="100%" style={{ display: "block", overflow: "visible" }} xmlns="http://www.w3.org/2000/svg">
      <defs>
        {geo.pecas.map((p) => <clipPath key={p.id} id={`${uid}-${p.id}`}><polygon points={pontos(p.pts)} /></clipPath>)}
      </defs>
      {geo.pecas.map((p) => {
        if (p.tipo === "aba") {
          const pai = faceDe(p.pai);
          return <polygon key={p.id} points={pontos(p.pts)} fill={pai ? pai.fundo : "#fff"} onPointerDown={interativo ? () => onSel && onSel(p.pai) : undefined} />;
        }
        const i = geo.faces.findIndex((f) => f.id === p.id);
        const f = dadoFace(p, i);
        const rot = f.rot ?? p.rot ?? 0;
        const cx = p.bx + p.bw / 2, cy = p.by + p.bh / 2;
        const troca = rot === 90 || rot === 270;
        const cw = troca ? p.bh : p.bw, ch = troca ? p.bw : p.bh;
        const caixa = { x: cx - cw / 2, y: cy - ch / 2, w: cw, h: ch };
        const img = f.imgOn && embImgs[`${modelo}:${p.id}`];
        const selecionada = interativo && cfg.sel === p.id;
        return (
          <g key={p.id} clipPath={`url(#${uid}-${p.id})`} onPointerDown={interativo ? () => onSel && onSel(p.id) : undefined}>
            <polygon points={pontos(p.pts)} fill={f.fundo} />
            <g transform={`rotate(${rot} ${cx} ${cy})`} data-caixa>
              {img && <image href={img} x={caixa.x} y={caixa.y} width={caixa.w} height={caixa.h} preserveAspectRatio={f.modo === "inteira" ? "xMidYMid meet" : "xMidYMid slice"} opacity={(f.op ?? 100) / 100} />}
              {cfg.rotulos && interativo && <text className="emb-rot" x={cx} y={cy} textAnchor="middle" dominantBaseline="central" fontSize={Math.min(5, caixa.w / 8)} fill="#000" opacity="0.18" style={{ pointerEvents: "none" }}>{p.nome}</text>}
              {f.textos.map((t, k) => {
                const txt = aplicar(t.texto, dados);
                const linhas = (t.caixaAlta ? txt.toUpperCase() : txt).split("\n");
                const fs = t.tam * PT, lh = fs * 1.12;
                const tx = caixa.x + (t.x / 100) * caixa.w, ty = caixa.y + (t.y / 100) * caixa.h - ((linhas.length - 1) * lh) / 2;
                const anc = t.alinh === "left" ? "start" : t.alinh === "right" ? "end" : "middle";
                return (
                  <text
                    key={t.id} x={tx} y={ty} textAnchor={anc} dominantBaseline="central" fontFamily={t.fonte} fontSize={fs} fill={t.cor}
                    fontWeight={t.negrito ? 800 : 400} fontStyle={t.italico ? "italic" : "normal"} letterSpacing={t.esp * PT}
                    style={{ cursor: interativo ? "move" : "default", userSelect: "none", touchAction: "none", outline: "none" }}
                    onPointerDown={(e) => mover(e, p, f, k, caixa, e.currentTarget.parentNode)}
                    stroke={interativo && selecionada && selTexto === k ? "#2f6fd0" : "none"} strokeWidth={0.15} strokeDasharray="0.6 0.6" paintOrder="stroke"
                  >
                    {linhas.map((ln, j) => <tspan key={j} x={tx} dy={j === 0 ? 0 : lh}>{ln || " "}</tspan>)}
                  </text>
                );
              })}
            </g>
          </g>
        );
      })}
      {geo.furos.map((fu, i) => <ellipse key={i} cx={fu.x} cy={fu.y} rx={fu.rx} ry={fu.ry} fill="#fff" stroke={cfg.linhaCorte ? cfg.corLinha : "none"} strokeWidth={cfg.espLinha} />)}
      {cfg.linhaDobra && <path d={geo.dobra} fill="none" stroke={cfg.corLinha} strokeWidth={cfg.espLinha} strokeDasharray="1.6 1.2" strokeLinecap="butt" />}
      {cfg.linhaCorte && <path d={geo.corte} fill="none" stroke={cfg.corLinha} strokeWidth={cfg.espLinha * 1.4} strokeLinecap="round" />}
      {interativo && cfg.sel && geo.faces.filter((f) => f.id === cfg.sel).map((p) => <polygon key="sel" className="emb-rot" points={pontos(p.pts)} fill="none" stroke="#2f6fd0" strokeWidth={0.5} strokeDasharray="1.5 1" style={{ pointerEvents: "none" }} />)}
    </svg>
  );
}
