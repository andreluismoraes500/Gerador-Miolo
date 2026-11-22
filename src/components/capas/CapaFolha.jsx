// Uma face da folha A4 da capa: arte recortada no octógono + molde (linhas/marcas).
import { StickerLayer } from "../StickersEditor";
import { aplicar, capasImgs, CAMINHO_FORMA, COR_MOLDE, geom, poligono, PT, tamanhoCaber } from "../../lib/capas";

const rgba = (hex, op) => { const h = /^#[0-9a-f]{6}$/i.test(hex) ? hex.slice(1) : "ffffff"; const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)); return `rgba(${r},${g},${b},${op})`; };

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
  const comItens = comArte; // frente sempre; verso quando a arte do verso está ligada
  const itens = lado === "verso" ? (c.itensVerso || []) : c.itens;
  const molde = lado === "frente" ? c.moldeFrente : c.verso !== "nenhum";
  const pv = lado === "verso" && c.fundoVProprio ? "fundoV" : "fundo"; // verso pode ter fundo próprio
  const fCor = pv === "fundoV" ? c.fundoVCor : c.fundo;
  const fundoImg = c[`${pv}Img`] && capasImgs[pv];
  const fModo = c[`${pv}Modo`], fX = c[`${pv}X`] ?? 50, fY = c[`${pv}Y`] ?? 50, fZoom = c[`${pv}Zoom`] ?? 100, fOpac = c[`${pv}Opac`] ?? 100;
  const cobrir = !!c.cobrirFolha;
  const A = cobrir ? { x: 0, y: 0, w: g.F.w, h: g.F.h } : { x: g.ox, y: g.oy, w: g.W, h: g.H };

  const iniciar = (e, i) => {
    if (!interativo) return;
    e.stopPropagation();
    onSel && onSel(i);
    const art = e.currentTarget.closest("[data-arte]");
    const r = art.getBoundingClientRect();
    const it = itens[i];
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
            position: "absolute", left: `${A.x}mm`, top: `${A.y}mm`, width: `${A.w}mm`, height: `${A.h}mm`,
            background: fCor,
            clipPath: cobrir ? undefined : `polygon(${g.pts.map(([x, y]) => `${x}mm ${y}mm`).join(",")})`,
          }}
        >
          {fundoImg && (
            <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
              <img src={capasImgs[pv]} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: fModo === "inteira" ? "contain" : "cover", objectPosition: `${fX}% ${fY}%`, transformOrigin: `${fX}% ${fY}%`, transform: `scale(${fZoom / 100})`, opacity: fOpac / 100 }} />
            </div>
          )}
          {comItens && itens.map((it, i) => {
            const base = { position: "absolute", left: `${it.x}%`, top: `${it.y}%`, transform: "translate(-50%,-50%)", cursor: interativo ? "move" : "default", touchAction: "none" };
            const marca = interativo && sel === i ? { outline: "0.5mm dashed #2f6fd0", outlineOffset: "1mm" } : {};
            if (it.tipo === "imagem") {
              const src = capasImgs[it.id];
              if (!src) return interativo ? <div key={it.id} onPointerDown={(e) => iniciar(e, i)} style={{ ...base, ...marca, width: `${it.w}mm`, height: `${it.w * 0.6}mm`, border: "0.4mm dashed #999", display: "grid", placeItems: "center", fontSize: "4mm", color: "#999", background: "#ffffffaa" }}>imagem</div> : null;
              return <img key={it.id} src={src} alt="" draggable={false} onPointerDown={(e) => iniciar(e, i)} style={{ ...base, ...marca, width: `${it.w}mm`, height: "auto", maxHeight: `${A.h}mm`, objectFit: "contain", opacity: (it.opac ?? 100) / 100 }} />;
            }
            const txt = aplicar(it.texto, dados);
            const larg = (A.w * it.larg) / 100;
            const forma = it.fundoForma || "nenhum";
            const cam = CAMINHO_FORMA[forma];
            const figura = !!(forma !== "nenhum" && cam?.prop);
            const lTxt = figura ? larg * cam.ocupa : larg; // nas formas de figura, "largura" = largura da figura
            const pt = it.caber ? tamanhoCaber(it.caixaAlta ? txt.toUpperCase() : txt, it, lTxt) : it.tam;
            const pad = it.fundoPad ?? 4, op = (it.fundoOp ?? 100) / 100, bEsp = it.fundoBorda || 0, bCor = it.fundoBordaCor || "#24344D", fCor = it.fundoCor || "#ffffff";
            const comFundo = forma !== "nenhum";
            const cssForma = { retangulo: 0, arredondado: `${Math.max(2, pad)}mm`, pilula: "999px", oval: "50%" }[forma];
            const extra = comFundo ? (cam ? pad * (cam.pad || 1) : pad) : 0;
            // formas "de figura" mantêm a proporção; o texto fica centralizado, em uma largura menor
            const wFig = figura ? larg : 0;
            const padBx = figura ? `0 ${(larg - lTxt) / 2}mm` : comFundo ? `${extra}mm ${extra}mm ${extra + (cam?.extra || 0)}mm` : 0;
            return (
              <div
                key={it.id}
                onPointerDown={(e) => iniciar(e, i)}
                onDoubleClick={() => onEditar && onEditar(i)}
                style={{
                  ...base, ...marca, boxSizing: figura ? "border-box" : "content-box", width: `${figura ? wFig : larg}mm`, padding: padBx,
                  ...(figura ? { minHeight: `${wFig / cam.prop}mm`, display: "flex", alignItems: "center", justifyContent: "center" } : {}),
                  ...(comFundo && cssForma !== undefined ? { background: rgba(fCor, op), borderRadius: cssForma, border: bEsp ? `${bEsp}mm solid ${bCor}` : "none" } : {}),
                }}
              >
                {comFundo && cam && (
                  <svg viewBox="0 0 100 100" preserveAspectRatio={figura ? "xMidYMid meet" : "none"} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible", pointerEvents: "none" }}>
                    {cam.d ? <path d={cam.d} fillRule={cam.vazado ? "evenodd" : "nonzero"} fill={fCor} fillOpacity={op} stroke={bEsp ? bCor : "none"} strokeWidth={bEsp * 3.78} vectorEffect="non-scaling-stroke" />
                      : <polygon points={cam.pol} fill={fCor} fillOpacity={op} stroke={bEsp ? bCor : "none"} strokeWidth={bEsp * 3.78} vectorEffect="non-scaling-stroke" strokeLinejoin="round" />}
                  </svg>
                )}
                <div style={{
                  position: "relative", width: figura ? "100%" : undefined, textAlign: it.alinh, fontFamily: it.fonte, fontSize: `${pt * PT}mm`, lineHeight: 1.12,
                  color: it.cor, fontWeight: it.negrito ? 800 : 400, fontStyle: it.italico ? "italic" : "normal", textTransform: it.caixaAlta ? "uppercase" : "none",
                  letterSpacing: `${it.esp * PT}mm`, whiteSpace: it.caber || it.quebra === false ? "pre" : "pre-wrap", wordBreak: "break-word", userSelect: "none",
                }}>
                  {txt || " "}
                </div>
              </div>
            );
          })}
          {comItens && lado === "frente" && <StickerLayer pagina="capa" />}
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
