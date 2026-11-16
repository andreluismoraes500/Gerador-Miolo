// Uma folha de impressão: frente ou verso (espelhado para alinhar no duplex).
import CartaoFace from "./CartaoFace";

function Marcas({ L, sangria, marcas }) {
  if (!marcas) return null;
  const { posicoes, cw, ch, cols, rows, W, H } = L;
  const xs = new Set(), ys = new Set();
  posicoes.forEach((p) => { xs.add(p.x + sangria); xs.add(p.x + cw - sangria); ys.add(p.y + sangria); ys.add(p.y + ch - sangria); });
  const x0 = L.x0, y0 = L.y0, x1 = L.x0 + L.gridW, y1 = L.y0 + L.gridH;
  const len = Math.min(4, Math.max(0, Math.min(x0, y0) - 1.2));
  if (len < 1 || !cols || !rows) return null;
  const linhas = [];
  xs.forEach((x) => { linhas.push([x, y0 - 1 - len, x, y0 - 1], [x, y1 + 1, x, y1 + 1 + len]); });
  ys.forEach((y) => { linhas.push([x0 - 1 - len, y, x0 - 1, y], [x1 + 1, y, x1 + 1 + len, y]); });
  return (
    <svg style={{ position: "absolute", left: 0, top: 0 }} width={`${W}mm`} height={`${H}mm`} viewBox={`0 0 ${W} ${H}`}>
      {linhas.map((l, i) => <line key={i} x1={l[0]} y1={l[1]} x2={l[2]} y2={l[3]} stroke="#000" strokeWidth="0.15" />)}
    </svg>
  );
}

export default function FolhaCartoes({ cfg, L, lado, quantos, ajustar = true }) {
  const verso = lado === "verso";
  const { W, H, cw, ch, posicoes } = L;
  const virarTopo = cfg.virar === "topo";
  return (
    <div className="cv-folha" style={{ width: `${W}mm`, height: `${H}mm` }}>
      {posicoes.slice(0, quantos).map((p) => {
        // espelha a posição para que o verso caia exatamente atrás da frente
        let x = p.x, y = p.y;
        if (verso) {
          if (virarTopo) y = H - p.y - ch; else x = W - p.x - cw;
          if (ajustar) { x += cfg.ajusteX; y += cfg.ajusteY; }
        }
        return (
          <div key={`${p.c}-${p.r}`} style={{ position: "absolute", left: `${x}mm`, top: `${y}mm`, transform: verso && virarTopo ? "rotate(180deg)" : undefined }}>
            <CartaoFace cfg={cfg} lado={lado} w={L.t.w} h={L.t.h} sangria={cfg.sangria} />
          </div>
        );
      })}
      <Marcas L={L} sangria={cfg.sangria} marcas={cfg.marcas && !verso} />
    </div>
  );
}
