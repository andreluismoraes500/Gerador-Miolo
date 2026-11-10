// Uma face (frente ou verso) de cartão de visita, desenhada em milímetros.
import { MdEmail, MdLanguage, MdLocationOn, MdPhone } from "react-icons/md";
import { FaInstagram } from "react-icons/fa";
import { AJUSTE_ARTE } from "../../lib/cartaoVisita";

const mm = (v) => `${v}mm`;

function Contatos({ c, cor, tam, gap = 1.1, centro = false }) {
  const itens = [[MdPhone, c.telefone], [MdEmail, c.email], [MdLanguage, c.site], [FaInstagram, c.instagram], [MdLocationOn, c.endereco]].filter((x) => x[1]);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: mm(gap), fontSize: mm(tam), lineHeight: 1.2, alignItems: centro ? "center" : "flex-start" }}>
      {itens.map(([I, t], i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: mm(1.3), whiteSpace: "nowrap" }}>
          <I style={{ color: cor, fontSize: mm(tam * 1.2), flexShrink: 0 }} />{t}
        </div>
      ))}
    </div>
  );
}
const Logo = ({ c, tam, cor, fonte }) => (c.logo
  ? <img src={c.logo} alt="" style={{ maxWidth: mm(tam), maxHeight: mm(tam), objectFit: "contain" }} />
  : <div style={{ width: mm(tam * 0.72), height: mm(tam * 0.72), borderRadius: "50%", border: `${mm(0.35)} solid ${cor}`, display: "grid", placeItems: "center", fontFamily: fonte, fontSize: mm(tam * 0.36), color: cor }}>{(c.empresa || c.nome || "A").trim().slice(0, 1).toUpperCase()}</div>);

// Arte pronta: inteira (com fundo), cobrindo (corta) ou esticada; com zoom, posição e giro de 90°.
function Arte({ src, aj, W, H }) {
  const a = { ...AJUSTE_ARTE, ...(aj || {}) };
  const girar = a.girar;
  const bw = girar ? H : W, bh = girar ? W : H; // caixa onde a imagem é encaixada (antes do giro)
  const fit = a.modo === "cobrir" ? "cover" : a.modo === "esticar" ? "fill" : "contain";
  const pos = `${50 + a.x / 2}% ${50 + a.y / 2}%`;
  const caixa = { position: "absolute", width: mm(bw), height: mm(bh), left: mm((W - bw) / 2), top: mm((H - bh) / 2), transform: girar ? "rotate(90deg)" : undefined, overflow: "hidden" };
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", background: a.modo === "caber" && a.fundoModo === "cor" ? a.fundoCor : "#fff" }}>
      {a.modo === "caber" && a.fundoModo === "desfoque" && (
        <img src={src} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: `blur(${mm(2.2)}) saturate(1.1)`, transform: "scale(1.25)" }} />
      )}
      <div style={caixa}>
        <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: fit, objectPosition: pos, transform: `scale(${a.zoom})`, transformOrigin: pos }} />
      </div>
    </div>
  );
}

export default function CartaoFace({ cfg: c, lado, w, h, sangria = 0, mostrarGuia = false }) {
  const verso = lado === "verso";
  const usaArte = verso ? c.usarArteVerso && c.arteVerso : c.usarArteFrente && c.arteFrente;
  const arte = verso ? c.arteVerso : c.arteFrente;
  const layout = verso ? c.layoutV : c.layoutF;
  const fundo = verso && !c.mesmaCorVerso ? c.fundoV : c.fundo;
  const texto = verso && !c.mesmaCorVerso ? c.textoV : c.texto;
  const acento = verso && !c.mesmaCorVerso && c.fundoV.toLowerCase() === c.acento.toLowerCase() ? texto : c.acento;
  const titulo = c.fonte, corpo = c.fonteTexto;
  const W = w + 2 * sangria, H = h + 2 * sangria;
  const p = Math.min(w, h) * 0.09; // respiro interno
  const base = { position: "absolute", left: mm(sangria), top: mm(sangria), width: mm(w), height: mm(h), boxSizing: "border-box", overflow: "hidden", color: texto, fontFamily: corpo };

  let conteudo;
  if (!usaArte) {
    if (!verso && layout === "classico") {
      conteudo = (
        <div style={{ ...base, padding: mm(p), display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontFamily: titulo, fontSize: mm(h * 0.115), lineHeight: 1.05 }}>{c.nome}</div>
            <div style={{ fontSize: mm(h * 0.052), letterSpacing: mm(0.35), textTransform: "uppercase", color: acento, marginTop: mm(1) }}>{c.cargo}</div>
            <div style={{ width: mm(w * 0.16), height: mm(0.4), background: acento, marginTop: mm(h * 0.05) }} />
          </div>
          <Contatos c={{ ...c, endereco: "" }} cor={acento} tam={h * 0.056} />
          {c.empresa && <div style={{ position: "absolute", right: mm(p), top: mm(p), fontSize: mm(h * 0.05), letterSpacing: mm(0.3), textTransform: "uppercase", opacity: 0.85 }}>{c.empresa}</div>}
        </div>
      );
    } else if (!verso && layout === "moderno") {
      conteudo = (
        <div style={{ ...base, display: "flex" }}>
          <div style={{ width: "32%", background: acento, display: "grid", placeItems: "center" }}><Logo c={c} tam={h * 0.5} cor={fundo} fonte={titulo} /></div>
          <div style={{ flex: 1, padding: mm(p), display: "flex", flexDirection: "column", justifyContent: "center", gap: mm(h * 0.06) }}>
            <div><div style={{ fontFamily: titulo, fontSize: mm(h * 0.105), lineHeight: 1.05 }}>{c.nome}</div><div style={{ fontSize: mm(h * 0.05), letterSpacing: mm(0.3), textTransform: "uppercase", color: acento, marginTop: mm(0.8) }}>{c.cargo}</div></div>
            <Contatos c={{ ...c, endereco: "" }} cor={acento} tam={h * 0.052} />
          </div>
        </div>
      );
    } else if (!verso && layout === "minimal") {
      conteudo = (
        <div style={{ ...base, padding: mm(p), display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", gap: mm(h * 0.045) }}>
          <div style={{ fontFamily: titulo, fontSize: mm(h * 0.12), lineHeight: 1 }}>{c.nome}</div>
          <div style={{ fontSize: mm(h * 0.048), letterSpacing: mm(0.5), textTransform: "uppercase", color: acento }}>{c.cargo}</div>
          <div style={{ width: mm(w * 0.12), height: mm(0.35), background: acento }} />
          <Contatos c={{ ...c, endereco: "" }} cor={acento} tam={h * 0.05} centro />
        </div>
      );
    } else if (!verso && layout === "elegante") {
      conteudo = (
        <div style={{ ...base, padding: mm(p * 0.8) }}>
          <div style={{ position: "absolute", inset: mm(p * 0.55), border: `${mm(0.3)} solid ${acento}` }} />
          <div style={{ position: "relative", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", gap: mm(h * 0.04) }}>
            <div style={{ fontFamily: titulo, fontSize: mm(h * 0.125), lineHeight: 1, color: acento }}>{c.nome}</div>
            <div style={{ fontSize: mm(h * 0.045), letterSpacing: mm(0.6), textTransform: "uppercase" }}>{c.cargo}</div>
            <div style={{ fontSize: mm(h * 0.047), opacity: 0.9, lineHeight: 1.35 }}>{[c.telefone, c.email].filter(Boolean).join("  ·  ")}<br />{[c.site, c.instagram].filter(Boolean).join("  ·  ")}</div>
          </div>
        </div>
      );
    } else if (verso && layout === "logo") {
      conteudo = (
        <div style={{ ...base, padding: mm(p), display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", gap: mm(h * 0.05) }}>
          <Logo c={c} tam={h * 0.42} cor={acento} fonte={titulo} />
          {c.empresa && <div style={{ fontFamily: titulo, fontSize: mm(h * 0.1), lineHeight: 1 }}>{c.empresa}</div>}
          {c.slogan && <div style={{ fontSize: mm(h * 0.045), letterSpacing: mm(0.25), opacity: 0.85 }}>{c.slogan}</div>}
        </div>
      );
    } else if (verso && layout === "contatos") {
      conteudo = (
        <div style={{ ...base, padding: mm(p), display: "flex", flexDirection: "column", justifyContent: "center", gap: mm(h * 0.07) }}>
          <div style={{ fontFamily: titulo, fontSize: mm(h * 0.1), color: acento }}>{c.empresa || c.nome}</div>
          <Contatos c={c} cor={acento} tam={h * 0.056} gap={h * 0.03} />
        </div>
      );
    } else if (verso && layout === "monograma") {
      conteudo = (
        <div style={{ ...base, display: "grid", placeItems: "center" }}>
          <div style={{ fontFamily: titulo, fontSize: mm(h * 0.95), lineHeight: 1, opacity: 0.18, color: acento }}>{(c.empresa || c.nome || "A").trim().slice(0, 1).toUpperCase()}</div>
          <div style={{ position: "absolute", textAlign: "center", fontSize: mm(h * 0.055), letterSpacing: mm(0.5), textTransform: "uppercase" }}>{c.site || c.empresa}</div>
        </div>
      );
    } else {
      conteudo = <div style={base} />;
    }
  } else {
    conteudo = null;
  }
  return (
    <div style={{ position: "relative", width: mm(W), height: mm(H), background: usaArte ? "#fff" : fundo, overflow: "hidden" }}>
      {usaArte && <Arte src={arte} aj={verso ? c.ajusteV : c.ajusteF} W={W} H={H} />}
      {!usaArte && conteudo}
      {mostrarGuia && sangria > 0 && <div style={{ position: "absolute", left: mm(sangria), top: mm(sangria), width: mm(w), height: mm(h), border: "0.2mm dashed rgba(255,0,0,.6)", pointerEvents: "none" }} />}
    </div>
  );
}
