// Um adesivo desenhado em SVG (tudo em mm): forma, fundo, imagem (ajuste automático), textos e anel.
import { memo, useId } from "react";
import { AREA_TXT, ajustar, caminho, ehLacre, larguraLivre, pesoFonte } from "../../lib/adesivo";
import { emLargura } from "../../lib/cartaz";

function Padrao({ id, item, cw, ch }) {
  const c2 = item.fundo2;
  if (item.padrao === "degrade") return <defs><linearGradient id={id} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={item.fundo} /><stop offset="1" stopColor={c2} /></linearGradient></defs>;
  if (item.padrao === "bolinhas") return <defs><pattern id={id} width="3.6" height="3.6" patternUnits="userSpaceOnUse"><circle cx="1.8" cy="1.8" r="0.7" fill={c2} /></pattern></defs>;
  if (item.padrao === "listras") return <defs><pattern id={id} width="3.4" height="3.4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="1.7" height="3.4" fill={c2} /></pattern></defs>;
  if (item.padrao === "lacre") return <defs><pattern id={id} width="1.3" height="1.3" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="1.3" height="0.16" fill={c2} /><rect width="0.16" height="1.3" fill={c2} /></pattern></defs>;
  if (item.padrao === "raios") {
    const n = 24, R = Math.hypot(cw, ch), cx = cw / 2, cy = ch / 2;
    const d = Array.from({ length: n / 2 }, (_, i) => { const a0 = (i * 2 / n) * Math.PI * 2, a1 = ((i * 2 + 1) / n) * Math.PI * 2; return `M${cx} ${cy}L${cx + R * Math.cos(a0)} ${cy + R * Math.sin(a0)}L${cx + R * Math.cos(a1)} ${cy + R * Math.sin(a1)}Z`; }).join("");
    return <defs><path id={id} d={d} fill={c2} /></defs>;
  }
  return null;
}

// Conteúdo do medalhão (círculo) dos lacres: texto pequeno no alto, imagem no meio e texto principal embaixo.
function Medalhao({ cx, cy, R0, item, foto, uid }) {
  const ins = 0.7, ai = ins + item.anel + (item.anelDuplo ? 1.2 : 0.5);
  const Ri = Math.max(2, R0 - ai), regH = Ri * 1.5, top = cy - regH / 2;
  const temImg = !!foto?.src;
  const partes = [["t3", (item.t3 || "").trim() ? 0.2 : 0], ["img", temImg ? 0.38 : 0], ["t1", (item.t1 || "").trim() ? 0.42 : 0]].filter((x) => x[1] > 0);
  const soma = partes.reduce((s, x) => s + x[1], 0) || 1;
  let y = top;
  const els = [];
  partes.forEach(([k, wt]) => {
    const hA = (regH * wt) / soma, y0 = y, y1 = y + hA; y = y1;
    const dy = Math.max(Math.abs(y0 - cy), Math.abs(y1 - cy));
    const cord = 2 * Math.sqrt(Math.max(0.01, Ri * Ri - dy * dy)) * 0.94;
    if (k === "img") {
      const side = Math.min(hA, cord), z = foto.zoom ?? 1, ix = cx - side / 2, iy = y0 + (hA - side) / 2;
      const tx = ((foto.x ?? 0) / 100) * (side / 2), ty = ((foto.y ?? 0) / 100) * (side / 2);
      els.push(<g key="img" clipPath={`url(#m${uid})`}><image href={foto.src} x={ix} y={iy} width={side} height={side} preserveAspectRatio={(foto.modo ?? "inteira") === "inteira" ? "xMidYMid meet" : "xMidYMid slice"} transform={`translate(${tx} ${ty}) translate(${cx} ${iy + side / 2}) scale(${z}) translate(${-cx} ${-(iy + side / 2)})`} /></g>);
      els.push(<clipPath key="cp" id={`m${uid}`}><rect x={ix} y={iy} width={side} height={side} /></clipPath>);
    } else {
      const fonte = k === "t1" ? item.fonte1 : item.fonte2;
      const r = ajustar(item[k], cord, hA, hA * 0.95, fonte);
      const tot = r.linhas.length * r.fs * 1.08, ty0 = y0 + (hA - tot) / 2;
      r.linhas.forEach((ln, i) => els.push(<text key={`${k}${i}`} x={cx} y={ty0 + i * r.fs * 1.08 + (r.fs * 1.08 - r.fs) / 2 + r.fs * 0.8} textAnchor="middle" fontSize={r.fs} fill={item.corT1} style={{ fontFamily: fonte, fontWeight: pesoFonte(fonte) }}>{ln}</text>));
    }
  });
  return <g>{els}</g>;
}

function Lacre({ forma, cw, ch, b, w, h, item, foto, uid, lay }) {
  const cx = cw / 2, R0 = w / 2, ins = 0.7;
  const medCy = forma === "lacreMedalhao" ? ch / 2 : ch - b - R0;
  const a = w * (forma === "lacreMedalhao" ? 0.24 : 0.15), ws = 2 * a;
  const textos = [];
  const fonte = item.fonte2;
  if ((item.t2 || "").trim()) {
    if (forma === "lacreMedalhao") {
      const segH = medCy - R0 - 0.8 - (b + 1.2);
      if (segH > 3) {
        const r = ajustar(item.t2, ws * 0.84, segH * 0.92, ws * 0.3, fonte, { upper: true });
        const tot = r.linhas.length * r.fs * 1.08;
        [b + 1.2 + (segH - tot) / 2, ch - (b + 1.2) - segH + (segH - tot) / 2].forEach((y0, k) => r.linhas.forEach((ln, i) => textos.push(<text key={`${k}-${i}`} x={cx} y={y0 + i * r.fs * 1.08 + (r.fs * 1.08 - r.fs) / 2 + r.fs * 0.8} textAnchor="middle" fontSize={r.fs} fill={item.corT2} style={{ fontFamily: fonte, fontWeight: pesoFonte(fonte) }}>{ln}</text>)));
      }
    } else {
      const y0 = b + a + 1, y1 = medCy - R0 - 1, len = y1 - y0, mid = (y0 + y1) / 2;
      const fs = Math.min(ws * 0.42, (len * 0.92) / Math.max(0.1, emLargura(item.t2, fonte)));
      if (len > 5) textos.push(<text key="st" x={cx} y={mid + fs * 0.35} textAnchor="middle" fontSize={fs} fill={item.corT2} transform={`rotate(-90 ${cx} ${mid})`} style={{ fontFamily: fonte, fontWeight: pesoFonte(fonte) }}>{item.t2}</text>);
    }
  }
  const rr = R0 - ins - item.anel / 2;
  const cheio = lay === "imagem" && !!foto?.src; // imagem preenche o círculo todo
  return (
    <g>
      <circle cx={cx} cy={medCy} r={R0 - 0.01} fill={item.fundoMed} />
      {cheio && (
        <g clipPath={`url(#md${uid})`}>
          <clipPath id={`md${uid}`}><circle cx={cx} cy={medCy} r={R0 - 0.01} /></clipPath>
          {(foto.modo ?? "inteira") === "inteira" && <circle cx={cx} cy={medCy} r={R0} fill={foto.bg || item.fundoMed} />}
          <image href={foto.src} x={cx - R0} y={medCy - R0} width={2 * R0} height={2 * R0} preserveAspectRatio={(foto.modo ?? "inteira") === "inteira" ? "xMidYMid meet" : "xMidYMid slice"} transform={`translate(${((foto.x ?? 0) / 100) * R0} ${((foto.y ?? 0) / 100) * R0}) translate(${cx} ${medCy}) scale(${foto.zoom ?? 1}) translate(${-cx} ${-medCy})`} />
        </g>
      )}
      {item.anel > 0 && <circle cx={cx} cy={medCy} r={rr} fill="none" stroke={item.corAnel} strokeWidth={item.anel} />}
      {item.anel > 0 && item.anelDuplo && <circle cx={cx} cy={medCy} r={Math.max(0.5, rr - item.anel / 2 - 0.9)} fill="none" stroke={item.corAnel} strokeWidth={Math.max(0.2, item.anel * 0.35)} />}
      {!cheio && lay !== "imagem" && <Medalhao cx={cx} cy={medCy} R0={R0} item={item} foto={foto} uid={uid} />}
      {textos}
    </g>
  );
}

function Adesivo({ forma, w, h, sangria = 1, item, foto, guia = false, corGuia = "#000", fluido = false }) {
  const uid = useId().replace(/:/g, "");
  const b = sangria, cw = w + 2 * b, ch = h + 2 * b, cx = cw / 2, cy = ch / 2;
  const corte = caminho(forma, cx, cy, w, h, 0);
  const sang = caminho(forma, cx, cy, w, h, b);
  const lay = item.layout;
  const lacre = ehLacre(forma);
  const temImg = lay !== "texto" && !!foto?.src && !lacre;
  const area = lay === "imagemTexto" ? { x: 0, y: 0, w: cw, h: b + h * (item.imgPct / 100) } : { x: 0, y: 0, w: cw, h: ch };
  const ak = AREA_TXT[forma] || [0.86, 0.8];

  // ---- textos ----
  const blocos = [];
  if (lay !== "imagem" && !lacre) {
    let rw = w * ak[0], rt, rh;
    if (lay === "imagemTexto") { rt = area.h + h * 0.02; rh = b + h - rt - h * 0.07; rw = w * Math.min(ak[0] + 0.06, 0.9); }
    else { rh = h * ak[1]; rt = cy - rh / 2 + (forma === "coracao" ? -h * 0.04 : 0); }
    const campos = [["t1", item.fonte1, item.corT1, 0.55], ["t2", item.fonte2, item.corT2, 0.3], ["t3", item.fonte2, item.corT2, 0.15]].filter(([k]) => (item[k] || "").trim());
    const soma = campos.reduce((s, c) => s + c[3], 0) || 1;
    let fsAnt = Infinity;
    campos.forEach(([k, fonte, cor, wt], i) => {
      const hA = (rh * wt) / soma;
      const maxFs = Math.min(hA * 0.95, i === 0 ? rh : fsAnt * 0.75);
      const r = ajustar(item[k], rw, hA, Math.max(1.5, maxFs), fonte);
      fsAnt = r.fs; blocos.push({ ...r, fonte, cor, k });
    });
    const gap = rh * 0.02;
    const empilha = () => {
      const tot = blocos.reduce((s, x) => s + x.linhas.length * x.fs * 1.08, 0) + (blocos.length - 1) * gap;
      let y = rt + (rh - tot) / 2;
      blocos.forEach((bl) => { bl.y = y; bl.h = bl.linhas.length * bl.fs * 1.08; y += bl.h + gap; });
    };
    empilha();
    // formas curvas: refaz cada bloco com a largura livre na sua altura (o texto não encosta na borda)
    if (lay === "texto" && larguraLivre(forma, w, h, 0) !== Infinity) {
      for (let pass = 0; pass < 2; pass += 1) {
        blocos.forEach((bl) => {
          const dy = Math.max(Math.abs(bl.y - cy), Math.abs(bl.y + bl.h - cy));
          const lw = Math.min(rw, larguraLivre(forma, w, h, dy) * 0.94);
          const r = ajustar(item[bl.k], lw, bl.h, bl.fs, bl.fonte);
          Object.assign(bl, { fs: r.fs, linhas: r.linhas });
        });
        empilha();
      }
    }
  }

  const fundoFill = item.padrao === "degrade" ? `url(#g${uid})` : item.fundo;
  const imgT = (() => {
    if (!temImg) return "";
    const z = foto.zoom ?? 1, tx = ((foto.x ?? 0) / 100) * (area.w / 2), ty = ((foto.y ?? 0) / 100) * (area.h / 2);
    const ccx = area.x + area.w / 2, ccy = area.y + area.h / 2;
    return `translate(${tx} ${ty}) translate(${ccx} ${ccy}) scale(${z}) translate(${-ccx} ${-ccy})`;
  })();
  const inteira = (foto?.modo ?? "inteira") === "inteira";
  const ins = 0.7;

  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={fluido ? "100%" : `${cw}mm`} height={fluido ? "100%" : `${ch}mm`} viewBox={`0 0 ${cw} ${ch}`} style={{ display: "block", overflow: "hidden" }}>
      <defs>
        <clipPath id={`c${uid}`}><path d={sang} /></clipPath>
        <clipPath id={`a${uid}`}><rect x={area.x} y={area.y} width={area.w} height={area.h} /></clipPath>
      </defs>
      <Padrao id={item.padrao === "raios" ? `r${uid}` : item.padrao === "degrade" ? `g${uid}` : `p${uid}`} item={item} cw={cw} ch={ch} />
      <g clipPath={`url(#c${uid})`}>
        <rect width={cw} height={ch} fill={fundoFill} />
        {item.padrao === "raios" && <use href={`#r${uid}`} opacity="0.35" />}
        {(item.padrao === "bolinhas" || item.padrao === "listras" || item.padrao === "lacre") && <rect width={cw} height={ch} fill={`url(#p${uid})`} />}
        {temImg && (
          <g clipPath={`url(#a${uid})`}>
            {inteira && <rect x={area.x} y={area.y} width={area.w} height={area.h} fill={foto.bg || item.fundo} />}
            <image href={foto.src} x={area.x} y={area.y} width={area.w} height={area.h} preserveAspectRatio={inteira ? "xMidYMid meet" : "xMidYMid slice"} transform={imgT} />
          </g>
        )}
        {lay !== "texto" && !temImg && !lacre && <text className="print:invisible" x={area.x + area.w / 2} y={area.y + area.h / 2} textAnchor="middle" fontSize={Math.min(w, h) * 0.1} fill="#9a9a9a" style={{ fontFamily: "sans-serif", fontWeight: 700 }}>SUA IMAGEM</text>}
        {lacre && <Lacre forma={forma} cw={cw} ch={ch} b={b} w={w} h={h} item={item} foto={foto} uid={uid} lay={lay} />}
        {blocos.map((bl) => bl.linhas.map((ln, i) => (
          <text key={`${bl.k}${i}`} x={cx} y={bl.y + i * bl.fs * 1.08 + (bl.fs * 1.08 - bl.fs) / 2 + bl.fs * 0.8} textAnchor="middle" fontSize={bl.fs} fill={bl.cor} style={{ fontFamily: bl.fonte, fontWeight: pesoFonte(bl.fonte) }}>{ln}</text>
        )))}
      </g>
      {item.anel > 0 && !lacre && <path d={caminho(forma, cx, cy, w, h, -(ins + item.anel / 2))} fill="none" stroke={item.corAnel} strokeWidth={item.anel} />}
      {item.anel > 0 && item.anelDuplo && !lacre && <path d={caminho(forma, cx, cy, w, h, -(ins + item.anel + 0.9))} fill="none" stroke={item.corAnel} strokeWidth={Math.max(0.2, item.anel * 0.35)} />}
      {guia && <path d={corte} fill="none" stroke={corGuia} strokeWidth="0.12" />}
    </svg>
  );
}

export default memo(Adesivo);
