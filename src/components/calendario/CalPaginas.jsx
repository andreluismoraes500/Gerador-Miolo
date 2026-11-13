// Páginas dos calendários, desenhadas em milímetros.
import { feriadosCal, feriadosDoMesCal } from "../../lib/calendario";
import { cabecalhoSemana, celulasMes, DIAS_PT, INICIAIS, MESES_PT, mix, semanaDoAno } from "../../lib/configAgendaAnual";

const mm = (v) => `${v}mm`;
const TXT = "#2f3140";
const corT = (cfg) => cfg.corTitulo || cfg.cor;

const aj = (cfg) => ({ esc: cfg.escala ?? 1, mi: cfg.margemInt ?? 1, dx: cfg.deslocX ?? 0, dy: cfg.deslocY ?? 0, ano: cfg.anoPos ?? "auto" });
const cabe = (fs, texto, larg, f = 0.55) => Math.min(fs, larg / Math.max(1, texto.length * f));

export function Foto({ foto, cfg, w, h }) {
  const c = cfg.cor;
  if (w <= 0.5 || h <= 0.5) return null;
  if (cfg.semFotoArea && !foto?.src) return null;
  if (foto?.src) {
    const pos = `${50 + (foto.x || 0) / 2}% ${50 + (foto.y || 0) / 2}%`;
    return (
      <div style={{ width: mm(w), height: mm(h), overflow: "hidden", background: foto.bg || (foto.modo === "inteira" ? mix(c, 0.9) : "transparent") }}>
        <img src={foto.src} alt="" style={{ width: "100%", height: "100%", display: "block", objectFit: foto.modo === "inteira" ? "contain" : "cover", objectPosition: pos, transform: `scale(${foto.zoom || 1})`, transformOrigin: pos, opacity: (foto.op ?? 100) / 100 }} />
      </div>
    );
  }
  return (
    <div style={{ width: mm(w), height: mm(h), background: `linear-gradient(135deg, ${mix(c, 0.55)}, ${mix(c, 0.15)})`, display: "grid", placeItems: "center", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", width: mm(h * 0.9), height: mm(h * 0.9), borderRadius: "50%", background: mix(c, 0.7), opacity: 0.6, right: mm(-h * 0.2), top: mm(-h * 0.25) }} />
      <div style={{ position: "absolute", width: mm(h * 0.5), height: mm(h * 0.5), borderRadius: "50%", background: mix(c, 0.35), opacity: 0.55, left: mm(w * 0.08), bottom: mm(-h * 0.12) }} />
    </div>
  );
}

// Grade de um mês. `tam` = tamanho de fonte base em mm.
export function GradeMes({ ano, mes, cfg, w, h, tam, nomes = true }) {
  const cel = celulasMes(ano, mes, cfg.semanaComeca);
  const lin = cel.length / 7;
  const fer = feriadosCal(ano);
  const cab = cabecalhoSemana(cfg.semanaComeca);
  const c = cfg.cor;
  const est = cfg.estilo;
  const hCab = tam * 2.4;
  const hLinha = (h - hCab) / lin;
  const nomeDia = (i) => DIAS_PT[(i + cfg.semanaComeca) % 7].slice(0, 3);
  return (
    <div style={{ width: mm(w), height: mm(h), fontFamily: cfg.fonteTexto, color: (cfg.corTexto || TXT), fontSize: mm(tam), boxSizing: "border-box", border: est === "classico" ? `${mm(0.3)} solid ${mix(c, 0.2)}` : "none", overflow: "hidden" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", height: mm(hCab), alignItems: "center", textAlign: "center", fontWeight: 700, background: est === "minimal" ? "transparent" : est === "colorido" ? c : mix(c, 0.85), color: est === "colorido" ? "#fff" : est === "minimal" ? c : (cfg.corTexto || TXT), letterSpacing: mm(0.2), textTransform: "uppercase", fontSize: mm(tam * 0.8) }}>
        {cab.map((_, i) => <span key={i}>{h > 60 && w > 70 ? nomeDia(i) : INICIAIS[(i + cfg.semanaComeca) % 7]}</span>)}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gridTemplateRows: `repeat(${lin},1fr)`, height: mm(h - hCab) }}>
        {cel.map((d, i) => {
          const dow = (i % 7 + cfg.semanaComeca) % 7;
          const info = d && fer[`${mes}-${d}`];
          const f = info && info.nome;
          const fim = dow === 0 || dow === 6;
          const vermelho = (info && info.tipo === "f") || dow === 0;
          return (
            <div key={i} style={{
              position: "relative", padding: mm(tam * 0.3), boxSizing: "border-box", overflow: "hidden",
              borderTop: est === "minimal" ? `${mm(0.2)} solid ${mix(c, 0.7)}` : `${mm(0.2)} solid ${mix(c, 0.55)}`,
              borderLeft: est !== "minimal" && i % 7 ? `${mm(0.2)} solid ${mix(c, 0.55)}` : "none",
              background: d && est === "colorido" && fim ? mix(c, 0.9) : !d && est !== "minimal" ? mix(c, 0.96) : "transparent",
            }}>
              {d && (
                <>
                  <span style={{ fontWeight: 700, fontSize: mm(tam * 1.25), color: vermelho ? (cfg.corFeriado || "#d6455d") : est === "colorido" || est === "classico" ? c : (cfg.corTexto || TXT), lineHeight: 1 }}>{d}</span>
                  {f && nomes && hLinha > tam * 4 && <div style={{ fontSize: mm(tam * 0.55), color: info.tipo === "f" ? (cfg.corFeriado || "#d6455d") : c, lineHeight: 1.1, marginTop: mm(tam * 0.15) }}>{f}</div>}
                  {cfg.semanaNumero && dow === cfg.semanaComeca && hLinha > tam * 3 && <span style={{ position: "absolute", right: mm(tam * 0.3), top: mm(tam * 0.3), fontSize: mm(tam * 0.6), color: "#999" }}>S{semanaDoAno(new Date(ano, mes, d), cfg.semanaComeca)}</span>}
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export const feriadosDoMes = feriadosDoMesCal;
function ListaFeriados({ ano, mes, tam, cor, corF = "#d6455d", corT = "#555" }) {
  const itens = feriadosDoMesCal(ano, mes);
  if (!itens.length) return null;
  return (
    <div style={{ fontSize: mm(tam), lineHeight: 1.45, color: corT, borderTop: `${mm(0.25)} solid ${mix(cor, 0.4)}`, paddingTop: mm(tam * 0.35) }}>
      {itens.map((f) => <div key={f.d}><b style={{ color: f.tipo === "f" ? corF : cor }}>{String(f.d).padStart(2, "0")}</b> <span style={{ color: cor }}>•</span> {f.n}</div>)}
    </div>
  );
}

export function MesParede({ ano, mes, cfg, w, h, foto }) {
  const { esc, mi, dx, dy, ano: anoPos } = aj(cfg);
  const retrato = h >= w;
  const m = Math.min(w, h) * 0.05 * mi;
  const tam = Math.max(1.4, Math.min(w, h) * (retrato ? 0.018 : 0.022) * esc);
  const hFoto = retrato ? h * (cfg.fotoPct / 100) : h;
  const wFoto = retrato ? w : w * (cfg.fotoPct / 100);
  const temFoto = retrato ? hFoto > 1 : wFoto > 1;
  const ladoInfo = retrato ? { w: w - 2 * m, h: h - hFoto - 2 * m } : { w: w - wFoto - 2 * m, h: h - 2 * m };
  const titBase = Math.min(w, h) * (retrato ? 0.07 : 0.085) * esc;
  const anoNaFoto = temFoto && (anoPos === "foto" || (anoPos === "auto" && (retrato ? hFoto : wFoto) > titBase * 2.2));
  const anoNoTitulo = !anoNaFoto && anoPos !== "oculto";
  const nome = MESES_PT[mes];
  const tit = cabe(titBase, nome, ladoInfo.w * (anoNoTitulo ? 0.62 : 0.95));
  const temExtras = (cfg.listaFeriados || cfg.notas);
  const nFer = cfg.listaFeriados ? feriadosDoMes(ano, mes).length : 0;
  const hExtra = temExtras && ladoInfo.h > 60 ? Math.min(ladoInfo.h * 0.3, Math.max(ladoInfo.h * 0.12, nFer * tam * 0.85 * 1.5 + tam * 2.5)) : 0;
  const hGrade = ladoInfo.h - titBase * 1.5 - hExtra;
  return (
    <div style={{ width: mm(w), height: mm(h), display: "flex", flexDirection: retrato ? "column" : "row", background: cfg.corPagina || "#fff", position: "relative", overflow: "hidden" }}>
      {temFoto && (
        <div style={{ width: mm(wFoto), height: mm(hFoto), flexShrink: 0, position: "relative" }}>
          <Foto foto={foto} cfg={cfg} w={wFoto} h={hFoto} />
          {anoNaFoto && <div style={{ position: "absolute", right: mm(retrato ? m : 0), bottom: retrato ? mm(-titBase * 0.55) : mm(m), background: cfg.cor, color: "#fff", padding: `${mm(titBase * 0.12)} ${mm(titBase * 0.45)}`, borderRadius: mm(titBase * 0.15), fontFamily: cfg.fonteTitulo, fontSize: mm(titBase * 0.55), letterSpacing: mm(0.3), lineHeight: 1.1 }}>{ano}</div>}
        </div>
      )}
      <div style={{ flex: 1, padding: mm(m), display: "flex", flexDirection: "column", gap: mm(titBase * 0.2), minWidth: 0, boxSizing: "border-box", transform: `translate(${dx}mm, ${dy}mm)` }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: mm(2), marginTop: anoNaFoto && retrato ? mm(titBase * 0.35) : 0 }}>
          <div style={{ fontFamily: cfg.fonteTitulo, fontSize: mm(tit), color: corT(cfg), lineHeight: 1.05, whiteSpace: "nowrap" }}>{nome}</div>
          {anoNoTitulo && <div style={{ fontFamily: cfg.fonteTitulo, fontSize: mm(titBase * 0.6), color: corT(cfg), lineHeight: 1.05, opacity: 0.85 }}>{ano}</div>}
        </div>
        <GradeMes ano={ano} mes={mes} cfg={cfg} w={ladoInfo.w} h={Math.max(30, hGrade)} tam={tam} nomes={cfg.nomesNaGrade} />
        {hExtra > 0 && (
          <div style={{ display: "flex", gap: mm(m * 0.6), flex: 1, minHeight: 0, overflow: "hidden" }}>
            {cfg.listaFeriados && <div style={{ flex: 1 }}><ListaFeriados ano={ano} mes={mes} tam={tam * 0.85} cor={cfg.cor} corF={cfg.corFeriado || (cfg.corFeriado || "#d6455d")} corT={cfg.corTexto || "#555"} /></div>}
            {cfg.notas && <div style={{ flex: 1, borderBottom: `${mm(0.2)} solid ${mix(cfg.cor, 0.5)}`, fontSize: mm(tam * 0.8), color: "#999" }}>Notas</div>}
          </div>
        )}
      </div>
    </div>
  );
}

export function Capa({ cfg, w, h, foto, ano }) {
  const m = Math.min(w, h) * 0.07;
  return (
    <div style={{ width: mm(w), height: mm(h), position: "relative", overflow: "hidden", background: mix(cfg.cor, 0.9) }}>
      <div style={{ position: "absolute", inset: 0 }}><Foto foto={foto} cfg={cfg} w={w} h={h * 0.72}  /></div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: mm(h * 0.3), background: mix(cfg.cor, 0.92), padding: mm(m), boxSizing: "border-box", textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "center", gap: mm(1.5) }}>
        <div style={{ fontFamily: cfg.fonteTitulo, fontSize: mm(Math.min(w, h) * 0.16), color: corT(cfg), lineHeight: 1 }}>{ano}</div>
        <div style={{ fontFamily: cfg.fonteTexto, fontSize: mm(Math.min(w, h) * 0.035), letterSpacing: mm(0.8), textTransform: "uppercase", color: (cfg.corTexto || TXT) }}>{cfg.titulo}</div>
        {cfg.subtitulo && <div style={{ fontFamily: cfg.fonteTexto, fontSize: mm(Math.min(w, h) * 0.028), color: "#666" }}>{cfg.subtitulo}</div>}
      </div>
    </div>
  );
}

export function MiniMes({ ano, mes, cfg, tam, w, lista }) {
  const cel = celulasMes(ano, mes, cfg.semanaComeca);
  const fer = feriadosCal(ano);
  const cab = cabecalhoSemana(cfg.semanaComeca);
  return (
    <div style={{ width: mm(w), fontSize: mm(tam), lineHeight: 1.3, fontFamily: cfg.fonteTexto }}>
      <div style={{ fontFamily: cfg.fonteTitulo, fontSize: mm(tam * 1.55), color: corT(cfg), marginBottom: mm(tam * 0.3), textTransform: "capitalize" }}>{MESES_PT[mes]}</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", textAlign: "center", rowGap: mm(tam * 0.08) }}>
        {cab.map((x, i) => <span key={`h${i}`} style={{ color: mix(cfg.cor, 0.1), fontWeight: 700 }}>{x}</span>)}
        {cel.map((d, i) => {
          const dow = (i % 7 + cfg.semanaComeca) % 7;
          const info = d && fer[`${mes}-${d}`];
          const feri = info && info.tipo === "f";
          return <span key={i} style={{ color: feri || dow === 0 ? (cfg.corFeriado || "#d6455d") : info ? cfg.cor : (cfg.corTexto || TXT), fontWeight: info ? 800 : 400, background: info && cfg.estilo === "colorido" ? mix(feri ? (cfg.corFeriado || "#d6455d") : cfg.cor, 0.85) : "transparent", borderRadius: "30%" }}>{d || ""}</span>;
        })}
      </div>
      {lista && <div style={{ marginTop: mm(tam * 0.4) }}><ListaFeriados ano={ano} mes={mes} tam={tam * 0.85} cor={cfg.cor} corF={cfg.corFeriado || (cfg.corFeriado || "#d6455d")} corT={cfg.corTexto || "#555"} /></div>}
    </div>
  );
}

export function Poster({ cfg, w, h, foto }) {
  const { esc, mi, dx, dy } = aj(cfg);
  const retrato = h >= w;
  const m = Math.min(w, h) * 0.055 * mi;
  const fundo = !!(foto?.src && (cfg.posterFundo || cfg.fotoPct === 0));
  const comFoto = cfg.fotoPct > 0 && !fundo;
  const hFoto = comFoto ? h * (cfg.fotoPct / 100) * 0.62 : 0;
  const cols = retrato ? 3 : 4, rows = 12 / cols;
  const areaW = w - 2 * m, tit = Math.min(w, h) * 0.1 * esc;
  const areaH = h - hFoto - 2.1 * m - tit * 1.5;
  const mw = areaW / cols - m * 0.4;
  const tam = Math.max(1.5, Math.min(mw / 11.8, (areaH / rows) / (cfg.listaFeriados ? 19.5 : 13.4)) * esc);
  return (
    <div style={{ width: mm(w), height: mm(h), background: cfg.corPagina || "#fff", position: "relative", overflow: "hidden", fontFamily: cfg.fonteTexto }}>
      {fundo && <div style={{ position: "absolute", inset: 0 }}><Foto foto={foto} cfg={cfg} w={w} h={h} /></div>}
      {comFoto && <Foto foto={foto} cfg={cfg} w={w} h={hFoto} />}
      <div style={{ padding: `${mm(m * 0.6)} ${mm(m)}`, boxSizing: "border-box", position: "relative", transform: `translate(${dx}mm, ${dy}mm)` }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", borderBottom: `${mm(0.5)} solid ${cfg.cor}`, paddingBottom: mm(tit * 0.1), marginBottom: mm(m * 0.5) }}>
          <span style={{ fontFamily: cfg.fonteTitulo, fontSize: mm(tit), color: corT(cfg), lineHeight: 1 }}>{cfg.ano}</span>
          <span style={{ fontSize: mm(tit * 0.22), letterSpacing: mm(0.8), textTransform: "uppercase", color: (cfg.corTexto || TXT) }}>{cfg.titulo}</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gridTemplateRows: `repeat(${rows}, 1fr)`, height: mm(areaH), gap: `${mm(m * 0.5)} ${mm(m * 0.5)}` }}>
          {Array.from({ length: 12 }).map((_, i) => <MiniMes key={i} ano={cfg.ano} mes={i} cfg={cfg} tam={tam} w={mw} lista={cfg.listaFeriados} />)}
        </div>
      </div>
    </div>
  );
}

// Ímã só com cabeçalho: nome, logo e telefone numa cor à escolha; abaixo, fundo liso onde o calendário é colado.
export function CabecalhoIma({ cfg, w, h, foto }) {
  const hc = h * ((cfg.cabAltPct ?? 58) / 100);
  const m = Math.min(w, h) * 0.07;
  // faixas só existem se houver texto: sem texto, o logo/imagem se estende até a linha de detalhe
  const temNome = !!(cfg.cabNome || "").trim(), temFone = !!((cfg.cabFone || "").trim() || (cfg.cabLinha || "").trim());
  const hNome = temNome ? hc * (temFone ? 0.27 : 0.3) : 0, hFone = temFone ? hc * (temNome ? 0.33 : 0.38) : 0, hLogo = hc - hNome - hFone;
  const tx = cfg.corCabTxt || "#fff";
  const nome = (cfg.cabNome || "").toUpperCase();
  const fsNome = cabe(hNome * 0.62, nome, w - 2 * m, 0.66);
  const fone = cfg.cabFone || "";
  const fsFone = cabe(hFone * 0.4, fone, w - 2 * m - (cfg.cabZap ? hFone * 0.34 : 0), 0.6);
  return (
    <div style={{ width: mm(w), height: mm(h), background: cfg.corAreaCal || "#fff", position: "relative", overflow: "hidden", fontFamily: cfg.fonteTexto }}>
      <div style={{ height: mm(hc), background: cfg.corCab, color: tx, position: "relative" }}>
        {temNome && <div style={{ height: mm(hNome), display: "grid", placeItems: "center", padding: `0 ${mm(m)}`, fontFamily: cfg.fonteTitulo, fontWeight: 800, fontSize: mm(fsNome), lineHeight: 1, whiteSpace: "nowrap" }}>{nome}</div>}
        <div style={{ height: mm(hLogo), background: foto?.src ? "transparent" : "#fff", display: "grid", placeItems: "center" }}>
          {foto?.src ? <Foto foto={foto} cfg={{ ...cfg, semFotoArea: false }} w={w} h={hLogo} /> : <span className="print:invisible" style={{ color: "#b9b9b9", fontWeight: 800, fontSize: mm(hLogo * 0.3), letterSpacing: mm(0.4) }}>SEU LOGO</span>}
        </div>
        {temFone && <div style={{ height: mm(hFone), display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: mm(hFone * 0.04) }}>
          {cfg.cabLinha && <span style={{ fontSize: mm(hFone * 0.2), letterSpacing: mm(hFone * 0.04), textTransform: "uppercase", opacity: 0.92, lineHeight: 1 }}>{cfg.cabLinha}</span>}
          {fone && <span style={{ display: "inline-flex", alignItems: "center", gap: mm(hFone * 0.08), fontWeight: 800, fontSize: mm(fsFone), lineHeight: 1, whiteSpace: "nowrap" }}>
            {cfg.cabZap && (
              <svg width={`${hFone * 0.3}mm`} height={`${hFone * 0.3}mm`} viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="11" fill={tx} /><path d="M16.6 14.4c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.6.1-.2.2-.6.8-.8 1-.1.2-.3.2-.5.1-.9-.4-1.9-1.1-2.7-2.2-.1-.2 0-.3.1-.4l.4-.5c.1-.1.1-.3 0-.4-.1-.2-.6-1.4-.8-1.9-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.4.1-.7.3-.2.3-.9.9-.9 2.2s1 2.5 1.1 2.7c.1.2 1.9 3 4.7 4.1 2.3.9 2.8.7 3.3.6.5-.1 1.6-.7 1.8-1.3.2-.6.2-1.2.2-1.3-.1-.1-.3-.2-.5-.3z" fill={cfg.corCab} /></svg>
            )}
            {fone}
          </span>}
        </div>}
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: mm(Math.max(0.6, h * 0.008)), background: cfg.corDetalhe || "transparent" }} />
      </div>
      {cfg.guiaCal && (
        <div className="print:invisible" style={{ position: "absolute", left: mm(m), right: mm(m), top: mm(hc + m * 0.8), bottom: mm(m), border: `${mm(0.3)} dashed #bbb`, display: "grid", placeItems: "center", color: "#bbb", fontSize: mm(Math.min(w, h) * 0.05), textAlign: "center" }}>cole o calendário aqui</div>
      )}
    </div>
  );
}

export function PainelMesa({ ano, mes, cfg, w, h, foto }) {
  const { esc, mi, dx, dy, ano: anoPos } = aj(cfg);
  const larg = w > h;
  const m = Math.min(w, h) * 0.05 * mi;
  const titBase = Math.min(w, h) * 0.12 * esc;
  const tam = Math.max(1.2, Math.min(w, h) * (larg ? 0.027 : 0.024) * esc);
  const wFoto = larg ? w * 0.38 : w;
  const hFoto = larg ? h : h * 0.34;
  const nome = MESES_PT[mes];
  const tit = cabe(titBase * 1.05, nome, wFoto - 2 * m);
  const nFer = cfg.listaFeriados ? feriadosDoMes(ano, mes).length : 0;
  const hLista = nFer ? nFer * tam * 0.85 * 1.5 + tam * 1.2 : 0;
  const anoFoto = anoPos === "foto";
  const anoTopo = anoPos === "auto" || anoPos === "titulo";
  const hAno = anoTopo ? tam * 2.6 : 0;
  return (
    <div style={{ width: mm(w), height: mm(h), background: cfg.corPagina || "#fff", display: "flex", flexDirection: larg ? "row" : "column", overflow: "hidden", position: "relative" }}>
      <div style={{ width: mm(wFoto), height: mm(hFoto), flexShrink: 0, position: "relative" }}>
        <Foto foto={foto} cfg={cfg} w={wFoto} h={hFoto} />
        <div style={{ position: "absolute", left: mm(m), right: mm(m), bottom: mm(m * 0.8), color: cfg.semFotoArea ? corT(cfg) : "#fff", fontFamily: cfg.fonteTitulo, textShadow: cfg.semFotoArea ? "none" : "0 0 3mm #0008", lineHeight: 1.05 }}>
          <div style={{ fontSize: mm(tit), whiteSpace: "nowrap" }}>{nome}</div>
          {anoFoto && <div style={{ fontSize: mm(tit * 0.5) }}>{ano}</div>}
        </div>
      </div>
      <div style={{ flex: 1, padding: mm(m), boxSizing: "border-box", minWidth: 0, display: "flex", flexDirection: "column", gap: mm(m * 0.4), transform: `translate(${dx}mm, ${dy}mm)` }}>
        {anoTopo && <div style={{ fontSize: mm(tam * 1.5), color: corT(cfg), fontFamily: cfg.fonteTitulo, textAlign: "right", lineHeight: 1 }}>{ano}</div>}
        <GradeMes ano={ano} mes={mes} cfg={cfg} w={larg ? w - wFoto - 2 * m : w - 2 * m} h={(larg ? h - 2 * m : h - hFoto - 2 * m) - hAno - hLista - m * 0.4} tam={tam} nomes={false} />
        {nFer > 0 && <ListaFeriados ano={ano} mes={mes} tam={tam * 0.85} cor={cfg.cor} corF={cfg.corFeriado || (cfg.corFeriado || "#d6455d")} corT={cfg.corTexto || "#555"} />}
      </div>
    </div>
  );
}

export function PlannerMes({ ano, mes, cfg, w, h, foto }) {
  const { esc, mi, dx, dy, ano: anoPos } = aj(cfg);
  const m = Math.min(w, h) * 0.04 * mi;
  const lado = w * 0.24;
  const tit = cabe(h * 0.1 * esc, MESES_PT[mes], lado * 1.25, 0.6);
  const tam = Math.max(1.4, h * 0.0165 * esc);
  const cfg2 = { ...cfg, semanaNumero: true };
  return (
    <div style={{ width: mm(w), height: mm(h), background: cfg.corPagina || "#fff", fontFamily: cfg.fonteTexto, overflow: "hidden", position: "relative" }}>
      <div style={{ position: "absolute", inset: 0, transform: `translate(${dx}mm, ${dy}mm)`, display: "flex", padding: mm(m), boxSizing: "border-box", gap: mm(m) }}>
      <div style={{ width: mm(lado), flexShrink: 0, display: "flex", flexDirection: "column", gap: mm(m * 0.6) }}>
        <div style={{ height: mm(h * 0.28), borderRadius: mm(2), overflow: "hidden" }}><Foto foto={foto} cfg={cfg} w={lado} h={h * 0.28} /></div>
        <div style={{ fontFamily: cfg.fonteTitulo, fontSize: mm(tit * 0.8), color: corT(cfg), lineHeight: 1 }}>{MESES_PT[mes]}</div>
        {anoPos !== "oculto" && <div style={{ fontSize: mm(tam * 1.3), color: cfg.cor, marginTop: mm(-m * 0.3) }}>{ano}</div>}
        {cfg.listaFeriados && feriadosDoMes(ano, mes).length > 0 && <div style={{ border: `${mm(0.3)} solid ${mix(cfg.cor, 0.45)}`, borderRadius: mm(2), padding: mm(tam * 0.5), background: mix(cfg.cor, 0.95) }}><div style={{ fontSize: mm(tam * 0.9), fontWeight: 700, marginBottom: mm(tam * 0.3) }}>Feriados</div><ListaFeriados ano={ano} mes={mes} tam={tam * 0.85} cor={cfg.cor} corF={cfg.corFeriado || (cfg.corFeriado || "#d6455d")} corT={cfg.corTexto || "#555"} /></div>}
        {["Metas do mês", "Prioridades", "Notas"].map((t) => (
          <div key={t} style={{ flex: 1, border: `${mm(0.3)} solid ${mix(cfg.cor, 0.45)}`, borderRadius: mm(2), overflow: "hidden", display: "flex", flexDirection: "column" }}>
            <div style={{ background: mix(cfg.cor, 0.85), fontSize: mm(tam * 0.9), fontWeight: 700, padding: `${mm(tam * 0.3)} ${mm(tam * 0.6)}` }}>{t}</div>
            <div style={{ flex: 1, backgroundImage: `repeating-linear-gradient(transparent 0 ${mm(tam * 2.4 - 0.2)}, ${mix(cfg.cor, 0.7)} ${mm(tam * 2.4 - 0.2)} ${mm(tam * 2.4)})` }} />
          </div>
        ))}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <GradeMes ano={ano} mes={mes} cfg={cfg2} w={w - lado - 3 * m} h={h - 2 * m} tam={tam} nomes={cfg.nomesNaGrade} />
      </div>
      </div>
    </div>
  );
}
