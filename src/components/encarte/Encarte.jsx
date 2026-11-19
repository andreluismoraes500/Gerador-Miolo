// Uma folha de encarte (em mm): cabeçalho, grade de ofertas e rodapé.
import { emLargura, fitTexto, splitPreco } from "../../lib/cartaz";
import { encarteFotos, encarteLogo } from "../../lib/encarte";

function Oferta({ it, w, h, P, fonteNum, nomeFs }) {
  const pillH = Math.min(h * 0.15, 9), priceH = h * 0.27;
  const foto = encarteFotos[it.id];
  const sp = splitPreco(it.preco);
  const circ = priceH * 0.6, disp = w - circ - w * 0.2;
  let fsR = priceH * 0.66;
  if (sp) { const larg = (fs) => fs * (emLargura(sp.r, fonteNum) + 0.5 * (emLargura(`,${sp.c}`, fonteNum))); while (larg(fsR) > disp && fsR > 2) fsR -= 0.3; }
  return (
    <div style={{ width: `${w}mm`, height: `${h}mm`, background: "#fff", borderRadius: `${Math.min(3, w * 0.05)}mm`, border: `0.5mm solid ${P.pill}`, boxSizing: "border-box", overflow: "hidden", display: "flex", flexDirection: "column", position: "relative" }}>
      <div style={{ height: `${pillH}mm`, background: P.pill, color: "#fff", display: "grid", placeItems: "center", textAlign: "center", fontWeight: 800, fontFamily: "'Montserrat', sans-serif", fontSize: `${nomeFs}mm`, lineHeight: 1, textTransform: "uppercase", padding: `0 ${w * 0.04}mm`, overflow: "hidden" }}>{it.nome}</div>
      <div style={{ flex: 1, minHeight: 0, display: "grid", placeItems: "center", background: foto ? "#fff" : "#f3f3f3", position: "relative", overflow: "hidden" }}>
        {foto ? <img src={foto} alt="" style={{ maxWidth: "94%", maxHeight: "94%", objectFit: "contain" }} /> : it.emoji ? <span style={{ fontSize: `${Math.min(w, h) * 0.38}mm`, lineHeight: 1 }}>{it.emoji}</span> : null}
        {it.de && <span style={{ position: "absolute", left: `${w * 0.05}mm`, top: `${h * 0.015}mm`, fontSize: `${Math.max(2.2, w * 0.055)}mm`, color: "#666", textDecoration: "line-through", fontWeight: 700, fontFamily: "'Montserrat', sans-serif" }}>de R$ {it.de}</span>}
      </div>
      <div style={{ height: `${priceH}mm`, display: "flex", alignItems: "center", gap: `${w * 0.03}mm`, padding: `0 ${w * 0.05}mm`, background: "#fff" }}>
        <div style={{ width: `${circ}mm`, height: `${circ}mm`, borderRadius: "50%", background: P.preco, color: "#fff", display: "grid", placeItems: "center", fontWeight: 800, fontFamily: "'Montserrat', sans-serif", fontSize: `${circ * 0.4}mm`, flex: "none" }}>R$</div>
        {sp ? (
          <div style={{ display: "flex", alignItems: "flex-start", color: P.preco, fontFamily: fonteNum, lineHeight: 0.95, minWidth: 0 }}>
            <span style={{ fontSize: `${fsR}mm` }}>{sp.r}</span>
            <span style={{ fontSize: `${fsR * 0.5}mm`, marginTop: `${fsR * 0.06}mm` }}>,{sp.c}</span>
          </div>
        ) : null}
        {it.unid && <span style={{ marginLeft: "auto", alignSelf: "flex-end", marginBottom: `${priceH * 0.1}mm`, fontSize: `${Math.max(2.2, w * 0.055)}mm`, fontWeight: 800, color: P.pill, fontFamily: "'Montserrat', sans-serif", textTransform: "uppercase" }}>{it.unid}</span>}
      </div>
    </div>
  );
}

export default function Encarte({ cfg, P, itens, W, H, pagina = 0, total = 1 }) {
  const m = Math.min(W, H) * 0.03, g = Math.min(W, H) * 0.017;
  const retrato = H >= W;
  const hHead = H * (retrato ? 0.2 : 0.26), hFoot = H * (retrato ? 0.075 : 0.1);
  const cols = Math.max(1, Math.min(cfg.cols, itens.length || 1));
  const linhas = Math.max(1, Math.ceil(itens.length / cols));
  const areaH = H - hHead - hFoot - m, areaW = W - 2 * m;
  const cw = (areaW - g * (cols - 1)) / cols, chv = (areaH - g * (linhas - 1)) / linhas;
  const tituloFs = fitTexto(cfg.titulo, W * 0.62, hHead * 0.5, hHead * 0.5, cfg.fonteTitulo, { upper: true, lh: 1, min: 4 });
  const valFs = fitTexto(cfg.validade, W * 0.66, hHead * 0.15, hHead * 0.1, "'Montserrat', sans-serif", { lh: 1.05, min: 2 });
  const nomeFs = fitTexto(cfg.mercado, W * 0.5, hHead * 0.12, hHead * 0.09, "'Montserrat', sans-serif", { upper: true, lh: 1, min: 2 });
  const f1 = fitTexto(cfg.rodape1, W * 0.9, hFoot * 0.4, hFoot * 0.38, "'Montserrat', sans-serif", { lh: 1, min: 2 });
  const f2 = fitTexto(cfg.rodape2, W * 0.9, hFoot * 0.26, hFoot * 0.24, "'Montserrat', sans-serif", { lh: 1, min: 2 });
  const fonteNum = "'Anton', sans-serif";
  const pillH0 = Math.min(chv * 0.15, 9);
  const nomeFsMin = itens.length ? Math.min(...itens.map((it) => fitTexto(it.nome, cw * 0.86, pillH0 * 0.8, pillH0 * 0.6, "'Montserrat', sans-serif", { upper: true, lh: 1.0, min: 1.6 }))) : 3;
  return (
    <div style={{ width: `${W}mm`, height: `${H}mm`, background: P.fundo, position: "relative", overflow: "hidden", fontFamily: "'Montserrat', sans-serif" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: "100%", height: `${hHead}mm`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: `${hHead * 0.025}mm` }}>
        {encarteLogo.url && <img src={encarteLogo.url} alt="" style={{ position: "absolute", right: `${m}mm`, top: `${m * 0.8}mm`, maxHeight: `${hHead * 0.5}mm`, maxWidth: `${W * 0.2}mm`, objectFit: "contain" }} />}
        {cfg.mercado && <div style={{ position: "absolute", left: `${m}mm`, top: `${m * 0.8}mm`, fontSize: `${nomeFs}mm`, fontWeight: 800, color: P.titulo, opacity: 0.9, letterSpacing: "0.04em", maxWidth: `${W * 0.3}mm`, lineHeight: 1.05 }}>{cfg.mercado}</div>}
        <div style={{ fontFamily: cfg.fonteTitulo, fontSize: `${tituloFs}mm`, lineHeight: 1, color: P.titulo, textTransform: "uppercase", textAlign: "center", maxWidth: `${W * 0.62}mm`, textShadow: "0 0.5mm 0 rgba(0,0,0,0.18)" }}>{cfg.titulo}</div>
        {cfg.validade && <div style={{ background: P.faixa, color: P.faixaTxt, fontSize: `${valFs}mm`, fontWeight: 800, padding: `${hHead * 0.025}mm ${W * 0.03}mm`, borderRadius: `${hHead * 0.2}mm`, textAlign: "center", maxWidth: `${W * 0.76}mm`, lineHeight: 1.1 }}>{cfg.validade}</div>}
      </div>
      <div style={{ position: "absolute", left: `${m}mm`, top: `${hHead}mm`, width: `${areaW}mm`, height: `${areaH}mm`, display: "grid", gridTemplateColumns: `repeat(${cols}, ${cw}mm)`, gridAutoRows: `${chv}mm`, gap: `${g}mm`, justifyContent: "center", alignContent: "start" }}>
        {itens.map((it) => <Oferta key={it.id} it={it} w={cw} h={chv} P={P} fonteNum={fonteNum} nomeFs={nomeFsMin} />)}
      </div>
      <div style={{ position: "absolute", left: 0, bottom: 0, width: "100%", height: `${hFoot}mm`, background: P.rodape, color: P.rodapeTxt, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", lineHeight: 1.1 }}>
        {cfg.rodape1 && <div style={{ fontSize: `${f1}mm`, fontWeight: 800 }}>{cfg.rodape1}</div>}
        {cfg.rodape2 && <div style={{ fontSize: `${f2}mm`, opacity: 0.92 }}>{cfg.rodape2}</div>}
      </div>
      {total > 1 && <div style={{ position: "absolute", right: `${m}mm`, bottom: `${hFoot + 0.5}mm`, fontSize: "2.6mm", color: P.titulo, opacity: 0.7 }}>{pagina + 1}/{total}</div>}
    </div>
  );
}
