// Um cartaz de supermercado desenhado em milímetros (4 layouts × retrato/paisagem).
import { claro, escuro } from "../../lib/mockupAgenda";
import { useEffect, useState } from "react";
import { fitTexto, limparCacheMedida, splitPreco } from "../../lib/cartaz";

const MONT = "'Montserrat', sans-serif";

const mm = (v) => `${v}mm`;
const ESTRELA = (() => {
  const n = 20, pts = [];
  for (let k = 0; k < n * 2; k += 1) { const r = k % 2 ? 42 : 50, a = (Math.PI * k) / n - Math.PI / 2; pts.push(`${(50 + r * Math.cos(a)).toFixed(2)}% ${(50 + r * Math.sin(a)).toFixed(2)}%`); }
  return `polygon(${pts.join(",")})`;
})();

function fundoCss(c) {
  const f = c.fundo;
  switch (c.padrao) {
    case "raios": return `repeating-conic-gradient(from 0deg at 50% 42%, ${f} 0deg 7deg, ${claro(f, 0.14)} 7deg 14deg)`;
    case "bolinhas": return `radial-gradient(${claro(f, 0.16)} 14%, transparent 15%) 0 0 / 12mm 12mm, radial-gradient(${claro(f, 0.16)} 14%, transparent 15%) 6mm 6mm / 12mm 12mm, ${f}`;
    case "listras": return `repeating-linear-gradient(135deg, ${f} 0 7mm, ${escuro(f, 0.07)} 7mm 14mm)`;
    case "degrade": return `linear-gradient(180deg, ${claro(f, 0.18)}, ${escuro(f, 0.25)})`;
    default: return f;
  }
}

function Preco({ item, c, w, h, cor }) {
  const p = splitPreco(item.por);
  if (!p) return null;
  const de = splitPreco(item.de), un = (item.unid || "").trim();
  const extra = 1 + (de ? 0.3 : 0) + (un ? 0.24 : 0);
  const F = Math.max(2, Math.min(h / extra, (w * 0.98) / (1.0 + 0.6 * p.r.length)));
  return (
    <div style={{ width: mm(w), height: mm(h), display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: cor, fontFamily: c.fontePreco, lineHeight: 1, whiteSpace: "nowrap" }}>
      {de && <div style={{ fontSize: mm(F * 0.24), textDecoration: "line-through", opacity: 0.85, marginBottom: mm(F * 0.06) }}>DE R$ {de.r},{de.c}</div>}
      <div style={{ display: "flex", alignItems: "flex-start" }}>
        <span style={{ fontSize: mm(F * 0.3), marginTop: mm(F * 0.1), marginRight: mm(F * 0.04) }}>R$</span>
        <span style={{ fontSize: mm(F) }}>{p.r}</span>
        <span style={{ fontSize: mm(F * 0.45), marginTop: mm(F * 0.04) }}>,{p.c}</span>
      </div>
      {un && <div style={{ fontSize: mm(F * 0.2), marginTop: mm(F * 0.06), textTransform: "uppercase", letterSpacing: mm(F * 0.01) }}>{un}</div>}
    </div>
  );
}

function Selo({ txt, c, d }) {
  if (!txt) return null;
  const fs = fitTexto(txt, d * 0.62, d * 0.46, d * 0.24, c.fonteNome, { upper: true, lh: 1 });
  return (
    <div style={{ width: mm(d), height: mm(d), clipPath: ESTRELA, background: c.seloBg, color: c.seloTxt, display: "grid", placeItems: "center", textAlign: "center", fontFamily: c.fonteNome, transform: "rotate(-9deg)" }}>
      <span style={{ fontSize: mm(fs), lineHeight: 1, maxWidth: mm(d * 0.66), textTransform: "uppercase" }}>{txt}</span>
    </div>
  );
}

const abs = (r, extra = {}) => ({ position: "absolute", left: mm(r.x), top: mm(r.y), width: mm(r.w), height: mm(r.h), ...extra });

export default function Cartaz({ cfg: c, item, foto, logo, w, h }) {
  const [, refaz] = useState(0);
  useEffect(() => { // remede os textos quando as fontes web terminarem de carregar
    const f = () => { limparCacheMedida(); refaz((n) => n + 1); };
    document.fonts?.ready?.then(f);
    document.fonts?.addEventListener?.("loadingdone", f);
    return () => document.fonts?.removeEventListener?.("loadingdone", f);
  }, []);
  const R = Math.min(w, h), p = R * 0.05, ret = h >= w * 0.95, lay = c.layout;
  const obsH = item.obs ? R * 0.055 : 0;
  const hdrH = ret ? h * 0.085 : h * 0.13;
  const hdr = { x: p, y: p * 0.9, w: w - 2 * p, h: hdrH };
  let nome, fotoR, preco, obs, pw, ph, estrela = false;

  if (ret) {
    const nomeH = h * (lay === "limpo" ? 0.15 : 0.17);
    const base = h - p * 0.7;
    obs = { x: p, y: base - obsH, w: w - 2 * p, h: obsH };
    if (lay === "destaque") { ph = pw = Math.min(w * 0.56, h * 0.3); estrela = true; }
    else if (lay === "faixa") { pw = w; ph = h * 0.26; }
    else if (lay === "limpo") { pw = w - 2 * p; ph = h * 0.2; }
    else { pw = w - 2 * p; ph = h * 0.22; }
    nome = { x: p, y: hdr.y + hdr.h, w: w - 2 * p, h: nomeH };
    const yPreco = estrela ? 0 : obs.y - ph - p * 0.4;
    const yFotoFim = estrela ? obs.y - p * 0.3 : yPreco - p * 0.3;
    fotoR = { x: p, y: nome.y + nome.h, w: w - 2 * p, h: Math.max(10, yFotoFim - (nome.y + nome.h)) };
    preco = estrela ? { x: w - p - pw, y: fotoR.y + fotoR.h - ph * 0.96, w: pw, h: ph } : { x: lay === "faixa" ? 0 : p, y: yPreco, w: pw, h: ph };
  } else {
    const topo = hdr.y + hdr.h, areaH = h - topo - p - obsH - p * 0.3;
    const fw = w * 0.44, rw = w - fw - 3 * p;
    obs = { x: p, y: h - p * 0.7 - obsH, w: w - 2 * p, h: obsH };
    fotoR = { x: p, y: topo, w: fw, h: areaH };
    nome = { x: fw + 2 * p, y: topo, w: rw, h: areaH * 0.4 };
    if (lay === "destaque") { ph = pw = Math.min(rw, areaH * 0.62); estrela = true; preco = { x: nome.x + (rw - pw) / 2, y: topo + areaH - ph, w: pw, h: ph }; }
    else { pw = rw; ph = areaH * 0.58; preco = { x: nome.x, y: topo + areaH - ph, w: pw, h: ph }; }
  }

  const fsNome = (() => { const dH = item.desc ? nome.h * 0.26 : 0; return { fs: fitTexto(item.nome, nome.w, nome.h - dH, Math.min(nome.h * 0.85, R * 0.12), c.fonteNome, { upper: true, lh: 1.02 }), dH }; })();
  const fsDesc = item.desc ? fitTexto(item.desc, nome.w, fsNome.dH, nome.h * 0.2, MONT, { lh: 1.1 }) : 0;
  const pos = `${50 + (item.fotoX || 0) / 2}% ${50 + (item.fotoY || 0) / 2}%`;
  const seloD = R * (ret ? 0.25 : 0.3);
  const seloTxt = c.mostrarSelo ? (item.selo || c.seloPadrao) : "";
  const seloPos = ret
    ? { x: lay === "destaque" ? p : w - p - seloD, y: fotoR.y - seloD * 0.1 }
    : { x: fotoR.x + fotoR.w - seloD * 1.05, y: fotoR.y - seloD * 0.05 };
  const mercado = (c.mercado || "").trim();
  const fsMerc = fitTexto(mercado, hdr.w * 0.62, hdr.h * 0.5 * 1.05, hdr.h * 0.5, c.fonteNome, { upper: true, lh: 1 });

  return (
    <div style={{ position: "relative", width: mm(w), height: mm(h), overflow: "hidden", background: fundoCss(c), fontFamily: c.fonteNome }}>
      {c.borda && <div style={{ position: "absolute", inset: mm(p * 0.3), border: `${mm(R * 0.012)} solid ${c.destaque}`, borderRadius: mm(R * 0.03), pointerEvents: "none" }} />}

      <div style={abs(hdr, { display: "flex", alignItems: "center", gap: mm(p * 0.6), color: c.texto })}>
        {c.mostrarLogo && logo && <img src={logo} alt="" style={{ height: "100%", maxWidth: mm(hdr.w * 0.34), objectFit: "contain" }} />}
        {mercado && <span style={{ fontSize: mm(fsMerc), textTransform: "uppercase", lineHeight: 1, whiteSpace: "nowrap", letterSpacing: mm(R * 0.002) }}>{mercado}</span>}
      </div>

      <div style={abs(nome, { display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", color: c.texto, lineHeight: 1.02, overflow: "hidden" })}>
        <div style={{ fontSize: mm(fsNome.fs), textTransform: "uppercase", textShadow: c.padrao === "liso" ? "none" : "0 0 1.2mm rgba(0,0,0,.25)" }}>{item.nome}</div>
        {item.desc && <div style={{ fontSize: mm(fsDesc), fontFamily: "'Montserrat', sans-serif", opacity: 0.92, marginTop: mm(fsDesc * 0.2) }}>{item.desc}</div>}
      </div>

      <div style={abs(fotoR, { overflow: "hidden", borderRadius: lay === "limpo" ? mm(R * 0.04) : 0, background: lay === "limpo" ? "rgba(255,255,255,.92)" : "transparent" })}>
        {foto
          ? <img src={foto} alt="" style={{ width: "100%", height: "100%", objectFit: item.fotoModo === "preencher" ? "cover" : "contain", objectPosition: pos, transform: `scale(${item.fotoZoom || 1})`, transformOrigin: pos, display: "block" }} />
          : <div className="cz-ph" style={{ width: "100%", height: "100%", display: "grid", placeItems: "center", color: c.texto, opacity: 0.55, border: `${mm(0.5)} dashed ${c.texto}`, boxSizing: "border-box", fontSize: mm(R * 0.04), textAlign: "center" }}>FOTO DO PRODUTO</div>}
      </div>

      {preco && ph > 0 && (estrela ? (
        <div style={abs(preco, { clipPath: ESTRELA, background: c.precoBg, display: "grid", placeItems: "center" })}>
          <Preco item={item} c={c} w={pw * 0.74} h={ph * 0.6} cor={c.precoTxt} />
        </div>
      ) : (
        <div style={abs(preco, { background: c.precoBg, borderRadius: lay === "faixa" ? 0 : mm(R * (lay === "limpo" ? 0.06 : 0.035)), display: "grid", placeItems: "center", boxShadow: lay === "faixa" ? "none" : "0 0.6mm 1.6mm rgba(0,0,0,.3)" })}>
          <Preco item={item} c={c} w={pw * 0.92} h={ph * 0.88} cor={c.precoTxt} />
        </div>
      ))}

      {seloTxt && <div style={{ position: "absolute", left: mm(seloPos.x), top: mm(seloPos.y) }}><Selo txt={seloTxt} c={c} d={seloD} /></div>}

      {item.obs && <div style={abs(obs, { display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", color: c.texto, fontFamily: "'Montserrat', sans-serif", fontSize: mm(fitTexto(item.obs, obs.w, obs.h, obs.h * 0.7, MONT, { lh: 1.1 })), lineHeight: 1.1, opacity: 0.92 })}>{item.obs}</div>}
    </div>
  );
}
