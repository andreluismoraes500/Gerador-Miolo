// Agenda Anual Completa — Clássica, Pop Color e Planner. Todas as datas,
// dias da semana, semanas e feriados vêm do ano escolhido.
import Footer from "../Footer";
import Watermark from "../Watermark";
import Background from "../Background";
import {
  DIAS_PT, DIAS_EN, DIAS_ES, MESES_PT, MESES_EN, MESES_ES, dois, mix,
  semanaDoAno, celulasMes, cabecalhoSemana, mapaFeriados,
} from "../../lib/configAgendaAnual";

const TXT = "#3a3a46";

function Shell({ children, cfg, props, pad = "10mm", fundo }) {
  const { fontFamily, watermarkSrc, watermarkOpacity, backgroundSrc, backgroundOpacity, footerName, footerType, colorTheme, customColors = {}, footerHidden } = props;
  return (
    <div className="printable-page relative overflow-hidden flex flex-col box-border select-none border-0 shadow-none rounded-none"
      style={{ backgroundColor: fundo || customColors.background || "#fff", fontFamily, color: TXT }}>
      {backgroundSrc && <Background src={backgroundSrc} opacity={backgroundOpacity} />}
      {watermarkSrc && <Watermark src={watermarkSrc} opacity={watermarkOpacity} />}
      <div className="relative z-10 flex flex-col flex-1 min-h-0" style={{ padding: `${pad} ${pad} 0` }}>{children}</div>
      <div className="relative z-10 shrink-0">
        <Footer name={footerName} type={footerType} colorTheme={colorTheme} customColors={customColors} fontFamily={fontFamily} hidden={footerHidden} />
      </div>
    </div>
  );
}

const Titulo = ({ cfg, children, sub, tam = "9mm" }) => (
  <div className="shrink-0 text-center" style={{ marginBottom: "5mm" }}>
    <h2 className="leading-none" style={{ fontFamily: cfg.fonteTitulo, color: cfg.cor, fontSize: tam }}>{children}</h2>
    {sub && <div style={{ fontSize: "3mm", color: "#888", marginTop: "1.5mm", letterSpacing: "0.3mm" }}>{sub}</div>}
    <div style={{ height: "0.6mm", width: "26mm", background: mix(cfg.cor, 0.45), margin: "3mm auto 0", borderRadius: "1mm" }} />
  </div>
);

const Linhas = ({ n = 8, cor = "#d9d9e0", alt = "7mm", flex }) => (
  <div className={flex ? "flex-1 flex flex-col" : "flex flex-col"}>
    {Array.from({ length: n }).map((_, i) => (
      <div key={i} style={{ height: alt, borderBottom: `0.25mm solid ${cor}`, flex: flex ? 1 : "none" }} />
    ))}
  </div>
);
const Pontilhado = ({ cor = "#c9c9d3" }) => (
  <div className="flex-1" style={{ backgroundImage: `radial-gradient(${cor} 0.35mm, transparent 0.4mm)`, backgroundSize: "6mm 6mm", backgroundPosition: "3mm 3mm" }} />
);
const Caixa = ({ cfg, titulo, children, flex, style }) => (
  <div className={flex ? "flex flex-col flex-1 min-h-0" : "flex flex-col"} style={{ border: `0.3mm solid ${mix(cfg.cor, 0.35)}`, borderRadius: "2.5mm", overflow: "hidden", ...style }}>
    {titulo && <div style={{ background: mix(cfg.cor, 0.78), color: TXT, fontWeight: 700, fontSize: "3.2mm", padding: "1.4mm 3mm", letterSpacing: "0.2mm" }}>{titulo}</div>}
    <div className="flex flex-col flex-1 min-h-0" style={{ padding: "1.5mm 3mm" }}>{children}</div>
  </div>
);
const Campo = ({ rotulo, cfg, w }) => (
  <div style={{ display: "flex", alignItems: "flex-end", gap: "2mm", height: "8mm", width: w, borderBottom: `0.25mm solid ${mix(cfg.cor, 0.3)}` }}>
    <span style={{ fontSize: "3mm", color: "#666", whiteSpace: "nowrap" }}>{rotulo}</span>
  </div>
);

/* ---------- Mini calendário do mês ---------- */
function MiniMes({ ano, mes, cfg, destaque, tam = "2.6mm", feriados }) {
  const cel = celulasMes(ano, mes, cfg.semanaComeca);
  const cab = cabecalhoSemana(cfg.semanaComeca);
  return (
    <div style={{ fontSize: tam, lineHeight: 1.25 }}>
      <div style={{ fontWeight: 700, color: cfg.cor, marginBottom: "0.8mm", fontSize: `calc(${tam} * 1.15)` }}>{MESES_PT[mes]}</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", textAlign: "center", gap: "0.2mm" }}>
        {cab.map((c, i) => <span key={`h${i}`} style={{ color: "#999", fontWeight: 700 }}>{c}</span>)}
        {cel.map((d, i) => {
          const col = (i % 7 + cfg.semanaComeca) % 7;
          const fer = d && feriados && feriados[`${mes + 1}-${d}`];
          const hoje = d && destaque === d;
          return (
            <span key={i} style={{
              color: hoje ? "#fff" : fer || col === 0 ? "#d6455d" : TXT,
              background: hoje ? cfg.cor : "transparent", borderRadius: "50%", fontWeight: fer ? 700 : 400,
            }}>{d || ""}</span>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- Páginas fixas ---------- */
function Capa({ cfg, props }) {
  const pop = cfg.estilo === "pop";
  const cores = [cfg.cor, mix(cfg.cor, 0.35), mix(cfg.cor, 0.65)];
  return (
    <Shell cfg={cfg} props={props} pad="0mm" fundo={mix(cfg.cor, 0.9)}>
      <div className="flex-1 relative" style={{ overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-30mm", right: "-30mm", width: "110mm", height: "110mm", borderRadius: "50%", background: cores[0], opacity: 0.9 }} />
        <div style={{ position: "absolute", top: "40mm", right: "30mm", width: "60mm", height: "60mm", borderRadius: pop ? "12mm" : "50%", background: cores[1], opacity: 0.8, transform: pop ? "rotate(18deg)" : "none" }} />
        <div style={{ position: "absolute", bottom: "-25mm", left: "-25mm", width: "100mm", height: "100mm", borderRadius: "50%", background: cores[2], opacity: 0.9 }} />
        <div style={{ position: "absolute", bottom: "50mm", left: "25mm", width: "28mm", height: "28mm", borderRadius: pop ? "6mm" : "50%", background: cores[0], opacity: 0.5, transform: pop ? "rotate(-12deg)" : "none" }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: "98mm", textAlign: "center" }}>
          <div style={{ fontFamily: cfg.fonteTitulo, fontSize: "30mm", lineHeight: 1, color: "#2a2a35" }}>{cfg.ano}</div>
          <div style={{ fontSize: "7mm", letterSpacing: "2.5mm", color: "#2a2a35", marginTop: "5mm" }}>{cfg.estilo === "planner" ? "PLANNER" : "AGENDA"}</div>
          <div style={{ fontSize: "3.4mm", color: "#555", marginTop: "3mm", letterSpacing: "0.6mm" }}>{cfg.estilo === "classica" ? "COM HORÁRIO" : cfg.estilo === "pop" ? "POP COLOR" : "DATADO · SEMANAL E MENSAL"}</div>
        </div>
        <div style={{ position: "absolute", left: "30mm", right: "30mm", bottom: "30mm", textAlign: "center" }}>
          <div style={{ borderBottom: "0.3mm solid #2a2a35", height: "9mm" }} />
          <div style={{ fontSize: "3mm", marginTop: "1.5mm" }}>Esta agenda pertence a</div>
        </div>
      </div>
    </Shell>
  );
}

function Dados({ cfg, props }) {
  const L = (rot) => <Campo rotulo={rot} cfg={cfg} />;
  return (
    <Shell cfg={cfg} props={props}>
      <Titulo cfg={cfg}>Meus dados</Titulo>
      <div className="flex flex-col gap-3 flex-1 min-h-0" style={{ fontSize: "3.2mm" }}>
        <Caixa cfg={cfg} titulo="Dados pessoais">
          {L("Nome:")}{L("Endereço:")}
          <div className="grid grid-cols-2 gap-x-4">{L("Cidade/UF:")}{L("CEP:")}{L("Telefone:")}{L("Celular:")}{L("E-mail:")}{L("Nascimento:")}{L("CPF:")}{L("RG:")}</div>
        </Caixa>
        <Caixa cfg={cfg} titulo="Dados comerciais">
          {L("Empresa:")}{L("Cargo:")}
          <div className="grid grid-cols-2 gap-x-4">{L("Telefone:")}{L("Ramal:")}</div>{L("Endereço:")}{L("E-mail:")}
        </Caixa>
        <Caixa cfg={cfg} titulo="Saúde e emergência">
          <div className="grid grid-cols-2 gap-x-4">{L("Tipo sanguíneo:")}{L("Alergias:")}{L("Plano de saúde:")}{L("Nº carteirinha:")}</div>
          {L("Contato de emergência:")}{L("Telefone:")}
        </Caixa>
        <Caixa cfg={cfg} titulo="Anotações importantes" flex><Linhas n={6} flex /></Caixa>
      </div>
    </Shell>
  );
}

function Calendarios({ item, cfg, props }) {
  const fer = mapaFeriados(item.ano);
  const lista = Object.entries(fer).map(([k, nome]) => { const [m, d] = k.split("-").map(Number); return { m, d, nome }; }).sort((a, b) => a.m - b.m || a.d - b.d);
  return (
    <Shell cfg={cfg} props={props}>
      <Titulo cfg={cfg} sub="Feriados nacionais e datas comemorativas em vermelho">{item.ano}</Titulo>
      <div className="grid grid-cols-3 gap-x-5 gap-y-4" style={{ marginBottom: "4mm" }}>
        {Array.from({ length: 12 }).map((_, m) => <MiniMes key={m} ano={item.ano} mes={m} cfg={cfg} tam="2.9mm" feriados={fer} />)}
      </div>
      <div className="flex-1 min-h-0" style={{ columns: 3, columnGap: "5mm", fontSize: "2.5mm", lineHeight: 1.45, color: "#555" }}>
        {lista.map((f) => (
          <div key={`${f.m}-${f.d}`} style={{ breakInside: "avoid" }}><b style={{ color: "#d6455d" }}>{dois(f.d)}/{dois(f.m)}</b> {f.nome}</div>
        ))}
      </div>
    </Shell>
  );
}

function PlanAnual({ item, cfg, props, lista }) {
  const meses = lista ? MESES_PT.slice(item.parte * 3, item.parte * 3 + 3) : MESES_PT.slice(item.parte * 6, item.parte * 6 + 6);
  const tit = lista ? "Planejamento anual" : "Planejamento do ano";
  return (
    <Shell cfg={cfg} props={props}>
      <Titulo cfg={cfg} sub={String(cfg.ano)}>{tit}</Titulo>
      <div className={lista ? "flex flex-col gap-3 flex-1 min-h-0" : "grid grid-cols-2 gap-3 flex-1 min-h-0"} style={{ gridAutoRows: "1fr" }}>
        {meses.map((m) => (
          <Caixa key={m} cfg={cfg} titulo={m} flex><Linhas n={lista ? 8 : 6} flex /></Caixa>
        ))}
      </div>
    </Shell>
  );
}

function Anotacoes({ item, cfg, props }) {
  const pont = item.estilo === "pontilhado" || cfg.estilo === "planner";
  return (
    <Shell cfg={cfg} props={props}>
      <Titulo cfg={cfg}>Anotações</Titulo>
      <div className="flex-1 flex flex-col min-h-0" style={{ marginBottom: "6mm" }}>{pont ? <Pontilhado /> : <Linhas n={30} flex />}</div>
    </Shell>
  );
}

function Contatos({ cfg, props }) {
  return (
    <Shell cfg={cfg} props={props}>
      <Titulo cfg={cfg}>Contatos</Titulo>
      <div className="grid grid-cols-2 gap-3 flex-1 min-h-0" style={{ gridAutoRows: "1fr", marginBottom: "6mm" }}>
        {Array.from({ length: 10 }).map((_, i) => (
          <Caixa key={i} cfg={cfg} flex><Linhas n={4} flex /><div style={{ fontSize: "2.4mm", color: "#aaa" }}>Nome · Telefone · E-mail</div></Caixa>
        ))}
      </div>
    </Shell>
  );
}

/* ---------- Dia (clássica / pop) ---------- */
function DiaBloco({ ms, cfg, compacto }) {
  if (ms === null || ms === undefined) return <div className="flex-1" />;
  const d = new Date(ms);
  const dow = d.getDay();
  const fer = mapaFeriados(d.getFullYear())[`${d.getMonth() + 1}-${d.getDate()}`];
  const sem = semanaDoAno(d, cfg.semanaComeca);
  const pop = cfg.estilo === "pop";
  const dom = dow === 0 || fer;
  const horas = [];
  for (let h = cfg.horaIni; h <= cfg.horaFim; h += 1) horas.push(h);
  const cab = pop ? mix(cfg.cor, 0.8) : "transparent";
  return (
    <div className="flex flex-col flex-1 min-h-0" style={{ gap: compacto ? "1.5mm" : "3mm" }}>
      <div className="shrink-0" style={{ display: "flex", alignItems: "center", gap: "3mm", background: cab, borderRadius: pop ? "3mm" : 0, padding: pop ? "1.5mm 3mm" : "0 0 1.5mm", borderBottom: pop ? "none" : `0.5mm solid ${cfg.cor}` }}>
        <div style={{ fontFamily: cfg.fonteTitulo, fontSize: compacto ? "11mm" : "16mm", lineHeight: 1, color: dom ? "#d6455d" : cfg.cor }}>{dois(d.getDate())}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: compacto ? "4mm" : "5mm", color: TXT }}>{DIAS_PT[dow]}{dow > 0 && dow < 6 ? "-feira" : ""}</div>
          <div style={{ fontSize: "2.5mm", color: "#888" }}>{DIAS_EN[dow]} · {DIAS_ES[dow]}</div>
          {fer && <div style={{ fontSize: "2.8mm", color: "#d6455d", fontWeight: 700 }}>★ {typeof fer === "string" ? fer : fer.nome}</div>}
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontWeight: 700, fontSize: compacto ? "4mm" : "5mm", color: cfg.cor, textTransform: "uppercase", letterSpacing: "0.3mm" }}>{MESES_PT[d.getMonth()]}</div>
          <div style={{ fontSize: "2.5mm", color: "#888" }}>{MESES_EN[d.getMonth()]} · {MESES_ES[d.getMonth()]}</div>
          <div style={{ fontSize: "2.8mm", color: "#666" }}>{String(diaDoAno(d)).padStart(3, "0")} | Semana {dois(sem)}</div>
        </div>
      </div>
      <div className="flex flex-1 min-h-0" style={{ gap: "3mm" }}>
        <div className="flex flex-col" style={{ flex: "1 1 64%", minWidth: 0 }}>
          {horas.map((h) => (
            <div key={h} style={{ flex: 1, display: "flex", alignItems: "flex-end", borderBottom: `0.25mm solid ${mix(cfg.cor, 0.55)}`, minHeight: 0 }}>
              <span style={{ fontSize: "2.8mm", color: cfg.cor, fontWeight: 700, width: "9mm" }}>{dois(h)}h</span>
            </div>
          ))}
        </div>
        <div className="flex flex-col" style={{ flex: "1 1 36%", gap: "2mm", minWidth: 0 }}>
          <MiniMes ano={d.getFullYear()} mes={d.getMonth()} cfg={cfg} destaque={d.getDate()} tam={compacto ? "2.2mm" : "2.6mm"} feriados={mapaFeriados(d.getFullYear())} />
          {["Prioridades", "Tarefas", ...(compacto ? [] : ["Gratidão"]), "Notas"].map((t) => (
            <Caixa key={t} cfg={cfg} titulo={t} flex style={{ borderRadius: pop ? "3mm" : "1mm" }}><Linhas n={4} flex alt="5mm" /></Caixa>
          ))}
        </div>
      </div>
    </div>
  );
}
function diaDoAno(d) {
  return Math.round((new Date(d.getFullYear(), d.getMonth(), d.getDate()) - new Date(d.getFullYear(), 0, 1)) / 86400000) + 1;
}

function Dia({ item, cfg, props }) {
  const dois2 = item.dias.length === 2;
  return (
    <Shell cfg={cfg} props={props} pad="9mm">
      <div className="flex flex-col flex-1 min-h-0" style={{ gap: "4mm", paddingBottom: "4mm" }}>
        {item.dias.map((ms, i) => (
          <div key={i} className="flex flex-col flex-1 min-h-0" style={i > 0 ? { borderTop: `0.3mm dashed ${mix(cfg.cor, 0.3)}`, paddingTop: "3mm" } : {}}>
            <DiaBloco ms={ms} cfg={cfg} compacto={dois2} />
          </div>
        ))}
      </div>
    </Shell>
  );
}

/* ---------- Planner ---------- */
function Roda({ cfg, props }) {
  const areas = ["Saúde", "Família", "Espiritual", "Carreira", "Finanças", "Lazer", "Amigos", "Crescimento"];
  const n = areas.length, R = 78, c = 100;
  return (
    <Shell cfg={cfg} props={props}>
      <Titulo cfg={cfg} sub="Pinte de 0 a 10 cada área">Roda da vida</Titulo>
      <svg viewBox="0 0 200 200" style={{ width: "150mm", height: "150mm", margin: "0 auto" }}>
        {[0.2, 0.4, 0.6, 0.8, 1].map((f, k) => (
          <polygon key={k} fill="none" stroke={mix(cfg.cor, 0.4)} strokeWidth="0.4"
            points={areas.map((_, i) => { const a = (i / n) * Math.PI * 2 - Math.PI / 2; return `${c + Math.cos(a) * R * f},${c + Math.sin(a) * R * f}`; }).join(" ")} />
        ))}
        {areas.map((t, i) => {
          const a = (i / n) * Math.PI * 2 - Math.PI / 2;
          return (
            <g key={t}>
              <line x1={c} y1={c} x2={c + Math.cos(a) * R} y2={c + Math.sin(a) * R} stroke={mix(cfg.cor, 0.4)} strokeWidth="0.4" />
              <text x={c + Math.cos(a) * (R + 10)} y={c + Math.sin(a) * (R + 10)} fontSize="6" textAnchor="middle" dominantBaseline="middle" fill={TXT}>{t}</text>
            </g>
          );
        })}
      </svg>
      <div className="flex-1" />
      <Caixa cfg={cfg} titulo="O que posso fazer para equilibrar?" style={{ marginBottom: "6mm" }}><Linhas n={4} /></Caixa>
    </Shell>
  );
}

function ListaGrade({ cfg, props, titulo, sub, colunas, linhas = 14 }) {
  return (
    <Shell cfg={cfg} props={props}>
      <Titulo cfg={cfg} sub={sub}>{titulo}</Titulo>
      <div className="flex-1 min-h-0 flex flex-col" style={{ border: `0.3mm solid ${mix(cfg.cor, 0.35)}`, borderRadius: "2.5mm", overflow: "hidden", marginBottom: "6mm" }}>
        <div style={{ display: "grid", gridTemplateColumns: colunas.map((c) => c[1]).join(" "), background: mix(cfg.cor, 0.78), fontWeight: 700, fontSize: "3mm" }}>
          {colunas.map((c) => <div key={c[0]} style={{ padding: "1.6mm 2mm" }}>{c[0]}</div>)}
        </div>
        {Array.from({ length: linhas }).map((_, i) => (
          <div key={i} className="flex-1" style={{ display: "grid", gridTemplateColumns: colunas.map((c) => c[1]).join(" "), borderTop: `0.25mm solid ${mix(cfg.cor, 0.6)}` }}>
            {colunas.map((c, j) => <div key={j} style={{ borderLeft: j ? `0.25mm solid ${mix(cfg.cor, 0.6)}` : "none" }} />)}
          </div>
        ))}
      </div>
    </Shell>
  );
}

function Desejos({ cfg, props }) {
  return (
    <Shell cfg={cfg} props={props}>
      <Titulo cfg={cfg} sub="Lista de desejos">Meus desejos</Titulo>
      <div className="flex-1 flex flex-col" style={{ marginBottom: "6mm" }}>
        {Array.from({ length: 24 }).map((_, i) => (
          <div key={i} className="flex-1 flex items-end" style={{ borderBottom: `0.25mm solid ${mix(cfg.cor, 0.5)}`, gap: "2mm" }}>
            <span style={{ width: "4mm", height: "4mm", border: `0.3mm solid ${cfg.cor}`, borderRadius: "1mm", marginBottom: "1mm" }} />
          </div>
        ))}
      </div>
    </Shell>
  );
}

function Registros({ cfg, props }) {
  return (
    <Shell cfg={cfg} props={props}>
      <Titulo cfg={cfg} sub="Memórias do ano">Registros especiais</Titulo>
      <div className="grid grid-cols-2 gap-3 flex-1 min-h-0" style={{ gridAutoRows: "1fr", marginBottom: "6mm" }}>
        {["Conquistas", "Lições aprendidas", "Momentos felizes", "Gratidão do ano"].map((t) => <Caixa key={t} cfg={cfg} titulo={t} flex><Linhas n={9} flex /></Caixa>)}
      </div>
    </Shell>
  );
}

function MesObjetivos({ item, cfg, props }) {
  return (
    <Shell cfg={cfg} props={props}>
      <Titulo cfg={cfg} sub={`${MESES_PT[item.mes]} ${cfg.ano}`} tam="11mm">{MESES_PT[item.mes]}</Titulo>
      <div className="flex flex-col gap-3 flex-1 min-h-0" style={{ marginBottom: "6mm" }}>
        <Caixa cfg={cfg} titulo="Objetivos do mês" flex><Linhas n={6} flex /></Caixa>
        <Caixa cfg={cfg} titulo="Metas e prioridades" flex><Linhas n={6} flex /></Caixa>
        <Caixa cfg={cfg} titulo="Datas importantes" flex><Linhas n={6} flex /></Caixa>
        <Caixa cfg={cfg} titulo="Hábitos para criar" flex><Linhas n={5} flex /></Caixa>
      </div>
    </Shell>
  );
}

function MesPlanejamento({ item, cfg, props }) {
  const cel = celulasMes(cfg.ano, item.mes, 1);
  const cab = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
  const fer = mapaFeriados(cfg.ano);
  const linhas = cel.length / 7;
  return (
    <Shell cfg={cfg} props={props}>
      <Titulo cfg={cfg} sub={String(cfg.ano)} tam="11mm">{MESES_PT[item.mes]}</Titulo>
      <div className="flex-1 min-h-0 flex flex-col" style={{ border: `0.3mm solid ${mix(cfg.cor, 0.35)}`, borderRadius: "2.5mm", overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", background: mix(cfg.cor, 0.78), textAlign: "center", fontWeight: 700, fontSize: "3mm", padding: "1.5mm 0" }}>
          {cab.map((c) => <span key={c}>{c}</span>)}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gridTemplateRows: `repeat(${linhas},1fr)`, flex: 1 }}>
          {cel.map((d, i) => (
            <div key={i} style={{ borderTop: `0.25mm solid ${mix(cfg.cor, 0.6)}`, borderLeft: i % 7 ? `0.25mm solid ${mix(cfg.cor, 0.6)}` : "none", padding: "1mm 1.5mm", fontSize: "3mm", background: d ? "transparent" : mix(cfg.cor, 0.95) }}>
              {d && <b style={{ color: i % 7 === 6 || fer[`${item.mes + 1}-${d}`] ? "#d6455d" : TXT }}>{d}</b>}
              {d && fer[`${item.mes + 1}-${d}`] && <div style={{ fontSize: "1.9mm", color: "#d6455d", lineHeight: 1.1 }}>{fer[`${item.mes + 1}-${d}`]}</div>}
            </div>
          ))}
        </div>
      </div>
      <Caixa cfg={cfg} titulo="Notas" style={{ margin: "4mm 0 6mm" }}><Linhas n={3} /></Caixa>
    </Shell>
  );
}

function MesFinanceiro({ item, cfg, props }) {
  return (
    <ListaGrade cfg={cfg} props={props} titulo="Controle financeiro" sub={`${MESES_PT[item.mes]} ${cfg.ano}`}
      colunas={[["Data", "16%"], ["Descrição", "44%"], ["Categoria", "20%"], ["Valor", "20%"]]} linhas={18} />
  );
}

function MesBalanco({ item, cfg, props }) {
  return (
    <Shell cfg={cfg} props={props}>
      <Titulo cfg={cfg} sub={`${MESES_PT[item.mes]} ${cfg.ano}`}>Balanço mensal</Titulo>
      <div className="grid grid-cols-2 gap-3 flex-1 min-h-0" style={{ gridAutoRows: "1fr", marginBottom: "6mm" }}>
        {["Entradas", "Saídas fixas", "Saídas variáveis", "Metas de economia", "Dívidas", "Resultado do mês"].map((t) => <Caixa key={t} cfg={cfg} titulo={t} flex><Linhas n={6} flex /></Caixa>)}
      </div>
    </Shell>
  );
}

function intervaloSemana(seg) {
  const fim = new Date(seg); fim.setDate(fim.getDate() + 6);
  const a = `${dois(seg.getDate())}/${dois(seg.getMonth() + 1)}`;
  return `${a} a ${dois(fim.getDate())}/${dois(fim.getMonth() + 1)}`;
}

function SemanaA({ item, cfg, props }) {
  const seg = new Date(item.seg);
  const fer = mapaFeriados(seg.getFullYear());
  const dias = Array.from({ length: 4 }).map((_, i) => { const d = new Date(seg); d.setDate(d.getDate() + i); return d; });
  return (
    <Shell cfg={cfg} props={props}>
      <Titulo cfg={cfg} sub={`Semana ${dois(semanaDoAno(seg, 1))} · ${intervaloSemana(seg)}`} tam="8mm">{MESES_PT[item.mes]}</Titulo>
      <div className="flex flex-col gap-2 flex-1 min-h-0" style={{ marginBottom: "6mm" }}>
        {dias.map((d, i) => {
          const f = fer[`${d.getMonth() + 1}-${d.getDate()}`];
          return (
            <Caixa key={i} cfg={cfg} flex titulo={`${DIAS_PT[d.getDay()]} ${dois(d.getDate())}/${dois(d.getMonth() + 1)}${f ? ` — ${f}` : ""}`}>
              <Linhas n={5} flex alt="5mm" />
            </Caixa>
          );
        })}
      </div>
    </Shell>
  );
}

function SemanaB({ item, cfg, props }) {
  const seg = new Date(item.seg);
  const fer = mapaFeriados(seg.getFullYear());
  const dias = Array.from({ length: 3 }).map((_, i) => { const d = new Date(seg); d.setDate(d.getDate() + 4 + i); return d; });
  const hab = ["Beber água", "Exercício", "Leitura", "Oração/meditação", "Dormir bem"];
  return (
    <Shell cfg={cfg} props={props}>
      <Titulo cfg={cfg} sub={`Semana ${dois(semanaDoAno(seg, 1))} · ${intervaloSemana(seg)}`} tam="8mm">{MESES_PT[item.mes]}</Titulo>
      <div className="flex flex-col gap-2 flex-1 min-h-0" style={{ marginBottom: "6mm" }}>
        {dias.map((d, i) => {
          const f = fer[`${d.getMonth() + 1}-${d.getDate()}`];
          return (
            <Caixa key={i} cfg={cfg} flex titulo={`${DIAS_PT[d.getDay()]} ${dois(d.getDate())}/${dois(d.getMonth() + 1)}${f ? ` — ${f}` : ""}`}>
              <Linhas n={3} flex alt="5mm" />
            </Caixa>
          );
        })}
        <Caixa cfg={cfg} titulo="Controle de hábitos" flex>
          <div style={{ display: "grid", gridTemplateColumns: "1fr repeat(7, 6mm)", fontSize: "2.6mm", alignItems: "center", rowGap: "1.2mm" }}>
            <span />{["S", "T", "Q", "Q", "S", "S", "D"].map((c, i) => <span key={i} style={{ textAlign: "center", color: "#888" }}>{c}</span>)}
            {hab.map((h) => (
              <>
                <span key={h}>{h}</span>
                {Array.from({ length: 7 }).map((_, i) => <span key={`${h}${i}`} style={{ width: "3.6mm", height: "3.6mm", border: `0.3mm solid ${cfg.cor}`, borderRadius: "50%", margin: "0 auto" }} />)}
              </>
            ))}
          </div>
        </Caixa>
        <Caixa cfg={cfg} titulo="Check-list da semana" flex><Linhas n={4} flex alt="5mm" /></Caixa>
      </div>
    </Shell>
  );
}

function MesReflexao({ item, cfg, props }) {
  return (
    <Shell cfg={cfg} props={props}>
      <Titulo cfg={cfg} sub={`${MESES_PT[item.mes]} ${cfg.ano}`}>Reflexão do mês</Titulo>
      <div className="flex flex-col gap-3 flex-1 min-h-0" style={{ marginBottom: "6mm" }}>
        {["O que deu certo?", "O que posso melhorar?", "Aprendizados", "Gratidão", "Nota para o próximo mês"].map((t) => <Caixa key={t} cfg={cfg} titulo={t} flex><Linhas n={4} flex /></Caixa>)}
      </div>
    </Shell>
  );
}

/* ---------- Despachante ---------- */
export function PaginaAnual({ item, cfg, ...props }) {
  const c = { cfg, props };
  switch (item.tipo) {
    case "capa": return <Capa {...c} />;
    case "dados": return <Dados {...c} />;
    case "calendarios": return <Calendarios item={item} {...c} />;
    case "planAnual": return <PlanAnual item={item} {...c} />;
    case "planAnualLista": return <PlanAnual item={item} lista {...c} />;
    case "anotacoes": return <Anotacoes item={item} {...c} />;
    case "contatos": return <Contatos {...c} />;
    case "dia": return <Dia item={item} {...c} />;
    case "roda": return <Roda {...c} />;
    case "desejos": return <Desejos {...c} />;
    case "objetivos1": case "objetivos2": case "objetivos3":
      return <ListaGrade {...c} titulo="Objetivos e metas" sub={`Etapa ${item.tipo.slice(-1)}`} colunas={[["Objetivo", "38%"], ["Meta", "26%"], ["Prazo", "16%"], ["Feito", "20%"]]} />;
    case "logins1": case "logins2":
      return <ListaGrade {...c} titulo="Logins e senhas" sub="Guarde em local seguro" colunas={[["Site/App", "30%"], ["Usuário", "35%"], ["Senha", "35%"]]} linhas={16} />;
    case "livros": return <ListaGrade {...c} titulo="Livros e cursos" colunas={[["Título", "46%"], ["Autor/Instituição", "28%"], ["Início", "13%"], ["Fim", "13%"]]} />;
    case "filmes": return <ListaGrade {...c} titulo="Filmes e séries" colunas={[["Título", "46%"], ["Onde assistir", "26%"], ["Data", "13%"], ["Nota", "15%"]]} />;
    case "viagens1": case "viagens2":
      return <ListaGrade {...c} titulo="Viagens" sub="Planejamento" colunas={[["Destino", "30%"], ["Data", "20%"], ["Orçamento", "20%"], ["Notas", "30%"]]} linhas={12} />;
    case "consultas": return <ListaGrade {...c} titulo="Consultas e exames" colunas={[["Data", "16%"], ["Profissional/Exame", "34%"], ["Local", "26%"], ["Resultado", "24%"]]} />;
    case "registros": return <Registros {...c} />;
    case "mesObjetivos": return <MesObjetivos item={item} {...c} />;
    case "mesPlanejamento": return <MesPlanejamento item={item} {...c} />;
    case "mesFinanceiro": return <MesFinanceiro item={item} {...c} />;
    case "mesBalanco": return <MesBalanco item={item} {...c} />;
    case "semanaA": return <SemanaA item={item} {...c} />;
    case "semanaB": return <SemanaB item={item} {...c} />;
    case "mesReflexao": return <MesReflexao item={item} {...c} />;
    default: return null;
  }
}
