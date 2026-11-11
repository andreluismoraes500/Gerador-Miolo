// Páginas dos calendários, desenhadas em milímetros.
import { cabecalhoSemana, celulasMes, DIAS_PT, INICIAIS, mapaFeriados, MESES_PT, mix, semanaDoAno } from "../../lib/configAgendaAnual";

const mm = (v) => `${v}mm`;
const TXT = "#2f3140";

function Foto({ foto, cfg, w, h, rotulo }) {
  const c = cfg.cor;
  if (foto?.src) {
    const pos = `${50 + (foto.x || 0) / 2}% ${50 + (foto.y || 0) / 2}%`;
    return (
      <div style={{ width: mm(w), height: mm(h), overflow: "hidden", background: foto.modo === "inteira" ? mix(c, 0.9) : "#fff" }}>
        <img src={foto.src} alt="" style={{ width: "100%", height: "100%", display: "block", objectFit: foto.modo === "inteira" ? "contain" : "cover", objectPosition: pos, transform: `scale(${foto.zoom || 1})`, transformOrigin: pos }} />
      </div>
    );
  }
  return (
    <div style={{ width: mm(w), height: mm(h), background: `linear-gradient(135deg, ${mix(c, 0.55)}, ${mix(c, 0.15)})`, display: "grid", placeItems: "center", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", width: mm(h * 0.9), height: mm(h * 0.9), borderRadius: "50%", background: mix(c, 0.7), opacity: 0.6, right: mm(-h * 0.2), top: mm(-h * 0.25) }} />
      <div style={{ position: "absolute", width: mm(h * 0.5), height: mm(h * 0.5), borderRadius: "50%", background: mix(c, 0.35), opacity: 0.55, left: mm(w * 0.08), bottom: mm(-h * 0.12) }} />
      <span style={{ position: "relative", color: "#fff", fontFamily: cfg.fonteTitulo, fontSize: mm(Math.min(w, h) * 0.12), opacity: 0.9 }}>{rotulo}</span>
    </div>
  );
}

// Grade de um mês. `tam` = tamanho de fonte base em mm.
export function GradeMes({ ano, mes, cfg, w, h, tam, nomes = true }) {
  const cel = celulasMes(ano, mes, cfg.semanaComeca);
  const lin = cel.length / 7;
  const fer = mapaFeriados(ano);
  const cab = cabecalhoSemana(cfg.semanaComeca);
  const c = cfg.cor;
  const est = cfg.estilo;
  const hCab = tam * 2.4;
  const hLinha = (h - hCab) / lin;
  const nomeDia = (i) => DIAS_PT[(i + cfg.semanaComeca) % 7].slice(0, 3);
  return (
    <div style={{ width: mm(w), height: mm(h), fontFamily: cfg.fonteTexto, color: TXT, fontSize: mm(tam), boxSizing: "border-box", border: est === "classico" ? `${mm(0.3)} solid ${mix(c, 0.2)}` : "none", overflow: "hidden" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", height: mm(hCab), alignItems: "center", textAlign: "center", fontWeight: 700, background: est === "minimal" ? "transparent" : est === "colorido" ? c : mix(c, 0.85), color: est === "colorido" ? "#fff" : est === "minimal" ? c : TXT, letterSpacing: mm(0.2), textTransform: "uppercase", fontSize: mm(tam * 0.8) }}>
        {cab.map((_, i) => <span key={i}>{h > 60 && w > 70 ? nomeDia(i) : INICIAIS[(i + cfg.semanaComeca) % 7]}</span>)}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gridTemplateRows: `repeat(${lin},1fr)`, height: mm(h - hCab) }}>
        {cel.map((d, i) => {
          const dow = (i % 7 + cfg.semanaComeca) % 7;
          const f = d && fer[`${mes}-${d}`];
          const fim = dow === 0 || dow === 6;
          const vermelho = !!f || dow === 0;
          return (
            <div key={i} style={{
              position: "relative", padding: mm(tam * 0.3), boxSizing: "border-box", overflow: "hidden",
              borderTop: est === "minimal" ? `${mm(0.2)} solid ${mix(c, 0.7)}` : `${mm(0.2)} solid ${mix(c, 0.55)}`,
              borderLeft: est !== "minimal" && i % 7 ? `${mm(0.2)} solid ${mix(c, 0.55)}` : "none",
              background: d && est === "colorido" && fim ? mix(c, 0.9) : !d && est !== "minimal" ? mix(c, 0.96) : "transparent",
            }}>
              {d && (
                <>
                  <span style={{ fontWeight: 700, fontSize: mm(tam * 1.25), color: vermelho ? "#d6455d" : est === "colorido" || est === "classico" ? c : TXT, lineHeight: 1 }}>{d}</span>
                  {f && nomes && hLinha > tam * 4 && <div style={{ fontSize: mm(tam * 0.55), color: "#d6455d", lineHeight: 1.1, marginTop: mm(tam * 0.15) }}>{f}</div>}
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

function ListaFeriados({ ano, mes, tam, cor }) {
  const fer = mapaFeriados(ano);
  const itens = Object.entries(fer).map(([k, n]) => { const [m, d] = k.split("-").map(Number); return { m, d, n }; }).filter((x) => x.m === mes).sort((a, b) => a.d - b.d);
  if (!itens.length) return null;
  return (
    <div style={{ fontSize: mm(tam), lineHeight: 1.45, color: "#555" }}>
      {itens.map((f) => <div key={f.d}><b style={{ color: "#d6455d" }}>{String(f.d).padStart(2, "0")}</b> <span style={{ color: cor }}>•</span> {f.n}</div>)}
    </div>
  );
}

export function MesParede({ ano, mes, cfg, w, h, foto }) {
  const retrato = h >= w;
  const m = Math.min(w, h) * 0.05;
  const tam = Math.max(1.6, Math.min(w, h) * (retrato ? 0.018 : 0.022));
  const hFoto = retrato ? h * (cfg.fotoPct / 100) : h;
  const wFoto = retrato ? w : w * (cfg.fotoPct / 100);
  const ladoInfo = retrato ? { w: w - 2 * m, h: h - hFoto - 2 * m } : { w: w - wFoto - 2 * m, h: h - 2 * m };
  const tit = Math.min(w, h) * (retrato ? 0.07 : 0.085);
  const temExtras = (cfg.listaFeriados || cfg.notas);
  const hExtra = temExtras && ladoInfo.h > 60 ? ladoInfo.h * 0.2 : 0;
  const hGrade = ladoInfo.h - tit * 1.7 - hExtra;
  return (
    <div style={{ width: mm(w), height: mm(h), display: "flex", flexDirection: retrato ? "column" : "row", background: "#fff", position: "relative", overflow: "hidden" }}>
      <div style={{ width: mm(wFoto), height: mm(hFoto), flexShrink: 0, position: "relative" }}>
        <Foto foto={foto} cfg={cfg} w={wFoto} h={hFoto} rotulo={MESES_PT[mes]} />
        <div style={{ position: "absolute", right: mm(retrato ? m : 0), bottom: retrato ? mm(-tit * 0.55) : mm(m), background: cfg.cor, color: "#fff", padding: `${mm(tit * 0.12)} ${mm(tit * 0.45)}`, borderRadius: mm(tit * 0.15), fontFamily: cfg.fonteTitulo, fontSize: mm(tit * 0.55), letterSpacing: mm(0.3) }}>{ano}</div>
      </div>
      <div style={{ flex: 1, padding: mm(m), display: "flex", flexDirection: "column", gap: mm(tit * 0.25), minWidth: 0, boxSizing: "border-box" }}>
        <div style={{ fontFamily: cfg.fonteTitulo, fontSize: mm(tit), color: cfg.cor, lineHeight: 1, marginTop: retrato ? mm(tit * 0.35) : 0 }}>{MESES_PT[mes]}</div>
        <GradeMes ano={ano} mes={mes} cfg={cfg} w={ladoInfo.w} h={Math.max(30, hGrade)} tam={tam} nomes={cfg.nomesNaGrade} />
        {hExtra > 0 && (
          <div style={{ display: "flex", gap: mm(m * 0.6), flex: 1, minHeight: 0, overflow: "hidden" }}>
            {cfg.listaFeriados && <div style={{ flex: 1 }}><ListaFeriados ano={ano} mes={mes} tam={tam * 0.85} cor={cfg.cor} /></div>}
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
      <div style={{ position: "absolute", inset: 0 }}><Foto foto={foto} cfg={cfg} w={w} h={h * 0.72} rotulo="" /></div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: mm(h * 0.3), background: mix(cfg.cor, 0.92), padding: mm(m), boxSizing: "border-box", textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "center", gap: mm(1.5) }}>
        <div style={{ fontFamily: cfg.fonteTitulo, fontSize: mm(Math.min(w, h) * 0.16), color: cfg.cor, lineHeight: 1 }}>{ano}</div>
        <div style={{ fontFamily: cfg.fonteTexto, fontSize: mm(Math.min(w, h) * 0.035), letterSpacing: mm(0.8), textTransform: "uppercase", color: TXT }}>{cfg.titulo}</div>
        {cfg.subtitulo && <div style={{ fontFamily: cfg.fonteTexto, fontSize: mm(Math.min(w, h) * 0.028), color: "#666" }}>{cfg.subtitulo}</div>}
      </div>
    </div>
  );
}

export function MiniMes({ ano, mes, cfg, tam, w }) {
  const cel = celulasMes(ano, mes, cfg.semanaComeca);
  const fer = mapaFeriados(ano);
  const cab = cabecalhoSemana(cfg.semanaComeca);
  return (
    <div style={{ width: mm(w), fontSize: mm(tam), lineHeight: 1.3, fontFamily: cfg.fonteTexto }}>
      <div style={{ fontFamily: cfg.fonteTitulo, fontSize: mm(tam * 1.55), color: cfg.cor, marginBottom: mm(tam * 0.3), textTransform: "capitalize" }}>{MESES_PT[mes]}</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", textAlign: "center", rowGap: mm(tam * 0.08) }}>
        {cab.map((x, i) => <span key={`h${i}`} style={{ color: mix(cfg.cor, 0.1), fontWeight: 700 }}>{x}</span>)}
        {cel.map((d, i) => {
          const dow = (i % 7 + cfg.semanaComeca) % 7;
          const f = d && fer[`${mes}-${d}`];
          return <span key={i} style={{ color: f || dow === 0 ? "#d6455d" : TXT, fontWeight: f ? 800 : 400, background: f && cfg.estilo === "colorido" ? mix("#d6455d", 0.85) : "transparent", borderRadius: "30%" }}>{d || ""}</span>;
        })}
      </div>
    </div>
  );
}

export function Poster({ cfg, w, h, foto }) {
  const retrato = h >= w;
  const m = Math.min(w, h) * 0.055;
  const comFoto = cfg.fotoPct > 0;
  const hFoto = comFoto ? h * (cfg.fotoPct / 100) * 0.62 : 0;
  const cols = retrato ? 3 : 4, rows = 12 / cols;
  const areaW = w - 2 * m, tit = Math.min(w, h) * 0.1;
  const areaH = h - hFoto - 2 * m - tit * 1.6 - m * 0.5 * (rows - 1);
  const mw = areaW / cols - m * 0.4;
  const tam = Math.max(1.5, Math.min(mw / 15.5, (areaH / rows) / 14.5));
  return (
    <div style={{ width: mm(w), height: mm(h), background: "#fff", position: "relative", overflow: "hidden", fontFamily: cfg.fonteTexto }}>
      {comFoto && <Foto foto={foto} cfg={cfg} w={w} h={hFoto} rotulo={String(cfg.ano)} />}
      <div style={{ padding: `${mm(m * 0.6)} ${mm(m)}`, boxSizing: "border-box" }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", borderBottom: `${mm(0.5)} solid ${cfg.cor}`, paddingBottom: mm(tit * 0.1), marginBottom: mm(m * 0.5) }}>
          <span style={{ fontFamily: cfg.fonteTitulo, fontSize: mm(tit), color: cfg.cor, lineHeight: 1 }}>{cfg.ano}</span>
          <span style={{ fontSize: mm(tit * 0.22), letterSpacing: mm(0.8), textTransform: "uppercase", color: TXT }}>{cfg.titulo}</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: `${mm(m * 0.6)} ${mm(m * 0.5)}` }}>
          {Array.from({ length: 12 }).map((_, i) => <MiniMes key={i} ano={cfg.ano} mes={i} cfg={cfg} tam={tam} w={mw} />)}
        </div>
      </div>
    </div>
  );
}

export function Mini({ cfg, w, h, foto }) {
  const retrato = h > w;
  const faixa = (cfg.fotoPct > 0) ? (retrato ? h * 0.2 : h * 0.2) : 0;
  const cols = retrato ? 3 : 4, rows = 12 / cols;
  const pad = Math.min(w, h) * 0.04;
  const areaW = w - 2 * pad, areaH = h - faixa - 2 * pad;
  const mw = areaW / cols - pad * 0.4;
  const tam = Math.max(1.1, Math.min(mw / 15, (areaH / rows) / 14));
  return (
    <div style={{ width: mm(w), height: mm(h), background: "#fff", overflow: "hidden", position: "relative", fontFamily: cfg.fonteTexto }}>
      {faixa > 0 && (
        <div style={{ height: mm(faixa), position: "relative" }}>
          <Foto foto={foto} cfg={cfg} w={w} h={faixa} rotulo="" />
          <span style={{ position: "absolute", left: mm(pad), bottom: mm(pad * 0.3), color: "#fff", fontFamily: cfg.fonteTitulo, fontSize: mm(faixa * 0.55), textShadow: "0 0 2mm #0006", lineHeight: 1 }}>{cfg.ano}</span>
          <span style={{ position: "absolute", right: mm(pad), bottom: mm(pad * 0.4), color: "#fff", fontSize: mm(faixa * 0.2), letterSpacing: mm(0.3), textTransform: "uppercase", textShadow: "0 0 2mm #0006" }}>{cfg.titulo}</span>
        </div>
      )}
      <div style={{ padding: mm(pad), display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: `${mm(pad * 0.5)} ${mm(pad * 0.4)}` }}>
        {Array.from({ length: 12 }).map((_, i) => <MiniMes key={i} ano={cfg.ano} mes={i} cfg={cfg} tam={tam} w={mw} />)}
      </div>
    </div>
  );
}

export function PainelMesa({ ano, mes, cfg, w, h, foto }) {
  const larg = w > h;
  const m = Math.min(w, h) * 0.05;
  const tit = Math.min(w, h) * 0.12;
  const tam = Math.max(1.3, Math.min(w, h) * (larg ? 0.027 : 0.024));
  const wFoto = larg ? w * 0.38 : w;
  const hFoto = larg ? h : h * 0.34;
  return (
    <div style={{ width: mm(w), height: mm(h), background: "#fff", display: "flex", flexDirection: larg ? "row" : "column", overflow: "hidden", position: "relative" }}>
      <div style={{ width: mm(wFoto), height: mm(hFoto), flexShrink: 0, position: "relative" }}>
        <Foto foto={foto} cfg={cfg} w={wFoto} h={hFoto} rotulo={MESES_PT[mes]} />
        <div style={{ position: "absolute", left: mm(m), bottom: mm(m * 0.8), color: "#fff", fontFamily: cfg.fonteTitulo, fontSize: mm(tit * 1.05), textShadow: "0 0 3mm #0007", lineHeight: 1 }}>{MESES_PT[mes]}</div>
      </div>
      <div style={{ flex: 1, padding: mm(m), boxSizing: "border-box", minWidth: 0, display: "flex", flexDirection: "column", gap: mm(m * 0.4) }}>
        <div style={{ fontSize: mm(tam * 1.1), color: cfg.cor, fontWeight: 700, letterSpacing: mm(0.5), textAlign: "right" }}>{ano}</div>
        <GradeMes ano={ano} mes={mes} cfg={cfg} w={larg ? w - wFoto - 2 * m : w - 2 * m} h={larg ? h - 2 * m - tam * 2.2 : h - hFoto - 2 * m - tam * 2.2} tam={tam} nomes={false} />
      </div>
    </div>
  );
}

export function PlannerMes({ ano, mes, cfg, w, h, foto }) {
  const m = Math.min(w, h) * 0.04;
  const lado = w * 0.24;
  const tit = h * 0.1;
  const tam = Math.max(1.6, h * 0.0165);
  const cfg2 = { ...cfg, semanaNumero: true };
  return (
    <div style={{ width: mm(w), height: mm(h), background: "#fff", display: "flex", padding: mm(m), boxSizing: "border-box", gap: mm(m), fontFamily: cfg.fonteTexto, overflow: "hidden" }}>
      <div style={{ width: mm(lado), flexShrink: 0, display: "flex", flexDirection: "column", gap: mm(m * 0.6) }}>
        <div style={{ height: mm(h * 0.28), borderRadius: mm(2), overflow: "hidden" }}><Foto foto={foto} cfg={cfg} w={lado} h={h * 0.28} rotulo="" /></div>
        <div style={{ fontFamily: cfg.fonteTitulo, fontSize: mm(tit * 0.8), color: cfg.cor, lineHeight: 1 }}>{MESES_PT[mes]}</div>
        <div style={{ fontSize: mm(tam), color: "#888", marginTop: mm(-m * 0.3) }}>{ano}</div>
        {["Metas do mês", "Prioridades", "Notas"].map((t) => (
          <div key={t} style={{ flex: 1, border: `${mm(0.3)} solid ${mix(cfg.cor, 0.45)}`, borderRadius: mm(2), overflow: "hidden", display: "flex", flexDirection: "column" }}>
            <div style={{ background: mix(cfg.cor, 0.85), fontSize: mm(tam * 0.9), fontWeight: 700, padding: `${mm(tam * 0.3)} ${mm(tam * 0.6)}` }}>{t}</div>
            <div style={{ flex: 1, backgroundImage: `repeating-linear-gradient(transparent 0 ${mm(tam * 2.4 - 0.2)}, ${mix(cfg.cor, 0.7)} ${mm(tam * 2.4 - 0.2)} ${mm(tam * 2.4)})` }} />
          </div>
        ))}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <GradeMes ano={ano} mes={mes} cfg={cfg2} w={w - lado - 3 * m} h={h - 2 * m} tam={tam} nomes />
      </div>
    </div>
  );
}
