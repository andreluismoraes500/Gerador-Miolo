// Uma face da folha A4 da capa: arte recortada no octógono + molde (linhas/marcas).
import { StickerLayer } from "../StickersEditor";
import { aplicar, capasImgs, COR_MOLDE, geom, poligono, PT, tamanhoCaber } from "../../lib/capas";

function Molde({ c, g }) {
  const cor = c.corMolde || COR_MOLDE;
  if (c.molde === "nenhum") return null;
  const bx = g.ox + g.px, by = g.oy + g.py, w = c.placaW, h = c.placaH;
  if (c.molde === "marcas") {
    const a = 27, i = 2.5, l = [];
    const x1 = bx + i, x2 = bx + w - i, y1 = by + i, y2 = by + h - i;
    [[x1, y1, 1, 1], [x2, y1, -1, 1], [x1, y2, 1, -1], [x2, y2, -1, -1]].forEach(([x, y, sx, sy]) => {
      l.push(<polyline key={`${x}${y}`} points={`${x + sx * a},${y} ${x},${y} ${x},${y + sy * a}`} fill="none" stroke={cor} strokeWidth="0.7" />);
    });
    return <>{l}</>;
  }
  return (
    <>
      <polygon points={poligono(g.pts.map(([x, y]) => [x + g.ox, y + g.oy]))} fill="none" stroke={cor} strokeOpacity="0.55" strokeWidth="0.25" />
      <rect x={bx} y={by} width={w} height={h} fill="none" stroke={cor} strokeWidth="0.3" />
    </>
  );
}

export default function CapaFolha({ c, dados, lado = "frente", interativo = false, sel = -1, onSel, onMover, versao = 0, onEditar }) {
  const g = geom(c);
  const comArte = lado === "frente" || c.verso === "fundo";
  const comItens = lado === "frente";
  const molde = lado === "frente" ? c.moldeFrente : c.verso !== "nenhum";
  const fundoImg = c.fundoImg && capasImgs.fundo;

  const iniciar = (e, i) => {
    if (!interativo) return;
    e.stopPropagation();
    onSel && onSel(i);
    const art = e.currentTarget.closest("[data-arte]");
    const r = art.getBoundingClientRect();
    const it = c.itens[i];
    const x0 = e.clientX, y0 = e.clientY, ix = it.x, iy = it.y;
    const mover = (ev) => {
      const nx = Math.max(0, Math.min(100, ix + ((ev.clientX - x0) / r.width) * 100));
      const ny = Math.max(0, Math.min(100, iy + ((ev.clientY - y0) / r.height) * 100));
      onMover && onMover(i, +nx.toFixed(2), +ny.toFixed(2));
    };
    const fim = () => { window.removeEventListener("pointermove", mover); window.removeEventListener("pointerup", fim); };
    window.addEventListener("pointermove", mover);
    window.addEventListener("pointerup", fim);
  };

  return (
    <div data-v={versao} style={{ position: "relative", width: `${g.F.w}mm`, height: `${g.F.h}mm`, background: "#fff", overflow: "hidden", breakInside: "avoid" }}>
      {comArte && (
        <div
          data-arte
          style={{
            position: "absolute", left: `${g.ox}mm`, top: `${g.oy}mm`, width: `${g.W}mm`, height: `${g.H}mm`,
            background: c.fundo,
            clipPath: `polygon(${g.pts.map(([x, y]) => `${x}mm ${y}mm`).join(",")})`,
          }}
        >
          {fundoImg && <img src={capasImgs.fundo} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: c.fundoModo === "inteira" ? "contain" : "cover", opacity: (c.fundoOpac ?? 100) / 100 }} />}
          {comItens && c.itens.map((it, i) => {
            const base = { position: "absolute", left: `${it.x}%`, top: `${it.y}%`, transform: "translate(-50%,-50%)", cursor: interativo ? "move" : "default", touchAction: "none" };
            const marca = interativo && sel === i ? { outline: "0.5mm dashed #2f6fd0", outlineOffset: "1mm" } : {};
            if (it.tipo === "imagem") {
              const src = capasImgs[it.id];
              if (!src) return interativo ? <div key={it.id} onPointerDown={(e) => iniciar(e, i)} style={{ ...base, ...marca, width: `${it.w}mm`, height: `${it.w * 0.6}mm`, border: "0.4mm dashed #999", display: "grid", placeItems: "center", fontSize: "4mm", color: "#999", background: "#ffffffaa" }}>imagem</div> : null;
              return <img key={it.id} src={src} alt="" draggable={false} onPointerDown={(e) => iniciar(e, i)} style={{ ...base, ...marca, width: `${it.w}mm`, height: "auto", maxHeight: `${g.H}mm`, objectFit: "contain", opacity: (it.opac ?? 100) / 100 }} />;
            }
            const txt = aplicar(it.texto, dados);
            const larg = (g.W * it.larg) / 100;
            const pt = it.caber ? tamanhoCaber(it.caixaAlta ? txt.toUpperCase() : txt, it, larg) : it.tam;
            return (
              <div
                key={it.id}
                onPointerDown={(e) => iniciar(e, i)}
                onDoubleClick={() => onEditar && onEditar(i)}
                style={{
                  ...base, ...marca, width: `${larg}mm`, textAlign: it.alinh, fontFamily: it.fonte, fontSize: `${pt * PT}mm`, lineHeight: 1.12,
                  color: it.cor, fontWeight: it.negrito ? 800 : 400, fontStyle: it.italico ? "italic" : "normal", textTransform: it.caixaAlta ? "uppercase" : "none",
                  letterSpacing: `${it.esp * PT}mm`, whiteSpace: it.caber || it.quebra === false ? "pre" : "pre-wrap", wordBreak: "break-word", userSelect: "none",
                }}
              >
                {txt || " "}
              </div>
            );
          })}
          {comItens && <StickerLayer pagina="capa" />}
        </div>
      )}
      {molde && (
        <svg viewBox={`0 0 ${g.F.w} ${g.F.h}`} width={`${g.F.w}mm`} height={`${g.F.h}mm`} style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none" }}>
          <Molde c={c} g={g} />
        </svg>
      )}
    </div>
  );
}
