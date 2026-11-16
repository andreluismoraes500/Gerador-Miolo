// Diário Devocional — todas as páginas (capa, dados, calendário, devocional
// diário, versículos, gratidão, jejum, pedidos de oração, controle de leitura
// da Bíblia, anotações). Páginas desenhadas em proporção A4 = A5 (imprima em A5).
import Footer from "../Footer";
import Watermark from "../Watermark";
import Background from "../Background";
import EditableField from "../EditableField";
import { CAP_POR_LINHA, MESES, PALETAS, devocionalCfg, diasDoMes, feriadosDoAno } from "../../lib/configDevocional";

/* ---------- Flores (desenhadas em SVG, cantos da página) ---------- */
function Flor({ x, y, r, cor, cor2, rot = 0 }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      {Array.from({ length: 7 }).map((_, i) => (
        <ellipse key={i} cx="0" cy={-r * 0.62} rx={r * 0.42} ry={r * 0.62} fill={cor} opacity="0.92" transform={`rotate(${i * (360 / 7)})`} />
      ))}
      {Array.from({ length: 5 }).map((_, i) => (
        <ellipse key={`b${i}`} cx="0" cy={-r * 0.34} rx={r * 0.24} ry={r * 0.34} fill={cor2} opacity="0.9" transform={`rotate(${i * 72 + 20})`} />
      ))}
      <circle r={r * 0.16} fill="#f5c76a" />
    </g>
  );
}
function Folha({ x, y, w, h, rot, cor }) {
  return <ellipse cx={x} cy={y} rx={w} ry={h} fill={cor} opacity="0.85" transform={`rotate(${rot} ${x} ${y})`} />;
}
function Cluster({ p }) {
  const [a, b, c] = p.flor;
  return (
    <svg viewBox="0 0 170 125" width="100%" height="100%" aria-hidden="true">
      <path d="M0 70 C 40 60, 70 40, 110 5" stroke={p.folha} strokeWidth="1.6" fill="none" />
      <path d="M0 30 C 35 38, 80 55, 150 70" stroke={p.folha} strokeWidth="1.4" fill="none" />
      {[[22, 78, 5, 16, 20], [48, 66, 5, 15, 35], [78, 48, 5, 15, 50], [100, 26, 4.5, 14, 65], [18, 42, 5, 15, -30], [60, 50, 4, 12, 100], [95, 62, 4.5, 13, 110], [128, 70, 4, 12, 100], [120, 10, 4, 12, 20]].map((l, i) => (
        <Folha key={i} x={l[0]} y={l[1]} w={l[2]} h={l[3]} rot={l[4]} cor={p.folha} />
      ))}
      <Flor x={22} y={20} r={21} cor={a} cor2={c} rot={10} />
      <Flor x={60} y={22} r={15} cor={c} cor2={a} rot={40} />
      <Flor x={34} y={58} r={13} cor={b} cor2={c} rot={-20} />
      <Flor x={92} y={8} r={11} cor={b} cor2={a} rot={15} />
      <Flor x={4} y={90} r={12} cor={a} cor2={b} rot={0} />
      {[[78, 36], [112, 38], [50, 90], [140, 18], [10, 60]].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r={i % 2 ? 2.4 : 3} fill={i % 2 ? b : "#f5c76a"} opacity="0.9" />
      ))}
    </svg>
  );
}
function Cantos({ p, baixo = true }) {
  const s = { position: "absolute", pointerEvents: "none", zIndex: 0, width: "46mm", height: "34mm" };
  return (
    <>
      <div style={{ ...s, top: 0, left: 0 }}><Cluster p={p} /></div>
      <div style={{ ...s, top: 0, right: 0, transform: "scaleX(-1)" }}><Cluster p={p} /></div>
      {baixo && <div style={{ ...s, bottom: 0, left: 0, transform: "scaleY(-1)" }}><Cluster p={p} /></div>}
      {baixo && <div style={{ ...s, bottom: 0, right: 0, transform: "scale(-1,-1)" }}><Cluster p={p} /></div>}
    </>
  );
}

/* ---------- Peças ---------- */
function Shell({ children, p, titulo, fonteTitulo, props, semTitulo }) {
  const { fontFamily, watermarkSrc, watermarkOpacity, backgroundSrc, backgroundOpacity, footerName, footerType, colorTheme, customColors = {}, footerHidden } = props;
  return (
    <div className="printable-page relative overflow-hidden flex flex-col justify-between box-border select-none border-0 shadow-none rounded-none"
      style={{ backgroundColor: customColors.background || "#fff", fontFamily }}>
      {backgroundSrc && <Background src={backgroundSrc} opacity={backgroundOpacity} />}
      {watermarkSrc && <Watermark src={watermarkSrc} opacity={watermarkOpacity} />}
      <Cantos p={p} />
      <div className="relative z-10 flex flex-col flex-1 min-h-0" style={{ paddingTop: "3mm", paddingBottom: "20mm" }}>
        {!semTitulo && (
          <h2 className="text-center leading-none shrink-0" style={{ fontFamily: fonteTitulo, color: p.titulo, fontSize: "9mm", marginBottom: "5mm" }}>{titulo}</h2>
        )}
        {children}
      </div>
      <div className="relative z-10">
        <Footer name={footerName} type={footerType} colorTheme={colorTheme} customColors={customColors} fontFamily={fontFamily} hidden={footerHidden} />
      </div>
    </div>
  );
}

const Banda = ({ p, children, className = "", style }) => (
  <div className={`text-center shrink-0 ${className}`} style={{ background: p.banda, color: p.linha, fontSize: "3.4mm", padding: "0.8mm 2mm", borderRadius: "1mm", ...style }}>{children}</div>
);
const Linhas = ({ p, n, className = "flex-1" }) => (
  <div className={`flex flex-col ${className}`}>
    {Array.from({ length: n }).map((_, i) => <div key={i} className="flex-1 border-b" style={{ borderColor: p.linha, minHeight: "4mm" }} />)}
  </div>
);
const Caixa = ({ p, className = "", children }) => (
  <div className={`flex flex-col ${className}`}>{children}</div>
);
const Campo = ({ p, k, rotulo, className = "" }) => (
  <div className={`flex items-baseline gap-1 ${className}`} style={{ background: p.banda, borderRadius: "3mm", padding: "0.8mm 3mm", fontSize: "3.2mm", color: p.linha }}>
    <span className="shrink-0 font-semibold">{rotulo}</span>
    <EditableField fieldKey={`dev-${k}`} className="flex-1 min-w-0" />
  </div>
);

/* ---------- Páginas ---------- */
export function Capa({ cfg, p, ...props }) {
  return (
    <Shell p={p} props={props} semTitulo>
      <div className="flex-1 flex flex-col items-center justify-center text-center gap-6">
        <h1 style={{ fontFamily: cfg.fonteTitulo, color: p.titulo, fontSize: "21mm", lineHeight: 1.02 }}>
          <EditableField fieldKey="dev-capa-titulo" placeholder={cfg.titulo} className="outline-none" />
        </h1>
        <div className="flex items-center gap-3 w-2/3" style={{ color: p.flor[1] }}><span className="flex-1 h-px bg-current" />✦<span className="flex-1 h-px bg-current" /></div>
      </div>
      <Banda p={p} className="self-center" style={{ fontSize: "4mm", padding: "1.2mm 6mm", borderRadius: "3mm" }}>{cfg.frase}</Banda>
      <div className="mt-6 text-center">
        <Banda p={p} className="mx-auto w-40 mb-1" style={{ fontSize: "4mm" }}>Pertence à:</Banda>
        <div className="mx-auto w-4/5 border-2 rounded-xl px-4 py-2 text-center" style={{ borderColor: p.banda, fontSize: "5mm", color: p.titulo }}>
          <EditableField fieldKey="dev-capa-nome" className="w-full" />
        </div>
      </div>
    </Shell>
  );
}

export function Dados({ cfg, p, ...props }) {
  const grupo = (titulo, campos, k) => (
    <div className="flex flex-col gap-1.5">
      <h3 className="text-center" style={{ fontFamily: cfg.fonteTitulo, color: p.titulo, fontSize: "6mm" }}>{titulo}</h3>
      {campos.map(([r, key]) => <Campo key={key} p={p} k={`${k}-${key}`} rotulo={r} />)}
    </div>
  );
  return (
    <Shell p={p} props={props} semTitulo>
      <div className="flex flex-col gap-5 flex-1 min-h-0" style={{ paddingTop: "8mm" }}>
        {grupo("Dados Pessoais", [["Nome:", "n"], ["Endereço:", "e"], ["Telefone:", "t"], ["E-mail:", "m"]], "pes")}
        {grupo("Dados Comerciais", [["Empresa:", "n"], ["Endereço:", "e"], ["Telefone:", "t"], ["E-mail:", "m"]], "com")}
        <div className="flex flex-col gap-1.5">
          <h3 className="text-center" style={{ fontFamily: cfg.fonteTitulo, color: p.titulo, fontSize: "6mm" }}>Informações Importantes</h3>
          <div className="grid grid-cols-2 gap-1.5">
            {[["Data de nasc.:", "dn"], ["Tipo sanguíneo:", "ts"], ["CPF:", "cpf"], ["RG:", "rg"], ["Em caso de emergência:", "em"], ["Alergias:", "al"]].map(([r, k]) => <Campo key={k} p={p} k={`inf-${k}`} rotulo={r} />)}
          </div>
        </div>
        <div className="flex flex-col flex-1 min-h-0">
          <Banda p={p} className="self-center w-40">Anotações</Banda>
          <div className="flex-1 border rounded-md" style={{ borderColor: p.banda, backgroundImage: `linear-gradient(${p.banda} 1px, transparent 1px), linear-gradient(90deg, ${p.banda} 1px, transparent 1px)`, backgroundSize: "6mm 6mm" }} />
        </div>
      </div>
    </Shell>
  );
}

export function Anotacoes({ cfg, p, estilo, ...props }) {
  return (
    <Shell p={p} props={props} titulo="Anotações" fonteTitulo={cfg.fonteTitulo}>
      {estilo === "pontilhado"
        ? <div className="flex-1 rounded-lg" style={{ border: `2px solid ${p.banda}`, backgroundImage: `radial-gradient(${p.flor[1]}99 1px, transparent 1.2px)`, backgroundSize: "6mm 6mm" }} />
        : <Linhas p={p} n={26} />}
    </Shell>
  );
}

function MesCal({ ano, mes, p, fer }) {
  const cel = diasDoMes(ano, mes);
  const set = new Set(fer.filter((f) => f.mes === mes).map((f) => f.dia));
  return (
    <div className="flex flex-col" style={{ fontSize: "2.9mm" }}>
      <Banda p={p} className="font-semibold" style={{ fontSize: "3.6mm", padding: "0.4mm 1mm" }}>{MESES[mes]}</Banda>
      <div className="grid grid-cols-7 text-center font-bold mt-0.5" style={{ color: p.destaque, fontSize: "2.5mm" }}>
        {["D", "S", "T", "Q", "Q", "S", "S"].map((d, i) => <span key={i} style={{ color: i === 0 ? p.destaque : p.linha }}>{d}</span>)}
      </div>
      <div className="grid grid-cols-7 text-center">
        {cel.map((d, i) => (
          <span key={i} style={{ height: "4.6mm", lineHeight: "4.6mm", color: d && (i % 7 === 0 || set.has(d)) ? p.destaque : p.linha, fontWeight: d && set.has(d) ? 700 : 400 }}>{d || ""}</span>
        ))}
      </div>
    </div>
  );
}
export function Calendario({ cfg, p, ano, ...props }) {
  const fer = feriadosDoAno(ano);
  return (
    <Shell p={p} props={props} titulo={`Calendário ${ano}`} fonteTitulo={cfg.fonteTitulo}>
      <div className="grid grid-cols-3 gap-x-4 gap-y-3 shrink-0">
        {MESES.map((_, m) => <MesCal key={m} ano={ano} mes={m} p={p} fer={fer} />)}
      </div>
      <div className="mt-3 border-t pt-2 columns-2 gap-4 flex-1 min-h-0 overflow-hidden" style={{ borderColor: p.banda, fontSize: "2.6mm", color: p.linha }}>
        {fer.map((f, i) => (
          <p key={i} className="leading-snug break-inside-avoid"><b style={{ color: p.destaque }}>{String(f.dia).padStart(2, "0")}/{String(f.mes + 1).padStart(2, "0")}</b> — {f.nome}</p>
        ))}
      </div>
    </Shell>
  );
}

export function DevocionalDia({ cfg, p, idx, ...props }) {
  const k = `dev-d${idx}`;
  return (
    <Shell p={p} props={props} semTitulo>
      <div className="flex flex-col flex-1 min-h-0 gap-2">
        <div className="flex gap-3 shrink-0" style={{ height: "30mm" }}>
          <div className="flex-1 flex flex-col"><Banda p={p}>Passagem do Dia</Banda><Linhas p={p} n={2} /></div>
          <div className="flex-1 flex flex-col items-center">
            <h2 style={{ fontFamily: cfg.fonteTitulo, color: p.titulo, fontSize: "9mm", lineHeight: 1 }}>Devocional</h2>
            <div className="flex gap-1 mt-1">{["D", "S", "T", "Q", "Q", "S", "S"].map((d, i) => <span key={i} className="rounded-full border flex items-center justify-center" style={{ width: "5mm", height: "5mm", fontSize: "2.4mm", borderColor: p.flor[1], color: p.linha, background: p.banda }}>{d}</span>)}</div>
            <Banda p={p} className="w-full mt-auto">Versículo Chave</Banda>
          </div>
        </div>
        {[["O que aprendi:", 7, 3], ["Aplicação:", 7, 3]].map(([t, n, f]) => (
          <div key={t} className="flex flex-col" style={{ flex: f }}><Banda p={p}>{t}</Banda><Linhas p={p} n={n} /></div>
        ))}
        <div className="flex flex-col" style={{ flex: 2 }}>
          <Banda p={p}>Orar por:</Banda>
          <div className="flex gap-3 flex-1"><Linhas p={p} n={3} /><Linhas p={p} n={3} /></div>
        </div>
        <div className="flex gap-3 shrink-0" style={{ height: "26mm" }}>
          {["Motivos para agradecer", "Motivos para pedir perdão"].map((t) => (
            <div key={t} className="flex-1 flex flex-col"><Banda p={p}>{t}</Banda><div className="flex-1" style={{ background: p.banda, borderRadius: "1mm" }} /></div>
          ))}
        </div>
      </div>
    </Shell>
  );
}

export function Gratidao({ cfg, p, ...props }) {
  const bloco = () => (
    <div className="flex flex-col flex-1 min-h-0 gap-2">
      <div className="flex flex-col" style={{ flex: 3 }}><Banda p={p} className="!text-left">Gratidão por:</Banda><Linhas p={p} n={7} /></div>
      <div className="flex gap-3 shrink-0" style={{ height: "24mm" }}>
        {["Gratidão gera:", "Preciso ter mais gratidão por:"].map((t) => (
          <div key={t} className="flex-1 flex flex-col"><Banda p={p}>{t}</Banda><div className="flex-1" style={{ background: p.banda, borderRadius: "1mm" }} /></div>
        ))}
      </div>
    </div>
  );
  return (
    <Shell p={p} props={props} titulo="Gratidão" fonteTitulo={cfg.fonteTitulo}>
      <div className="flex flex-col flex-1 min-h-0 gap-3">{bloco()}{bloco()}</div>
    </Shell>
  );
}

export function Jejum({ cfg, p, ...props }) {
  const bola = (i) => <span key={i} className="rounded-full" style={{ width: "6mm", height: "6mm", background: p.banda }} />;
  const bloco = (inverso) => (
    <div className={`flex gap-3 flex-1 min-h-0 ${inverso ? "flex-row-reverse" : ""}`}>
      <div className="flex flex-col gap-1 shrink-0" style={{ width: "26mm" }}>
        {["Data Início", "Data Término"].map((t) => (
          <div key={t} className="flex flex-col items-center gap-1"><Banda p={p} className="w-full" style={{ fontSize: "2.8mm" }}>{t}</Banda><div className="flex gap-1">{[0, 1, 2].map(bola)}</div></div>
        ))}
      </div>
      <div className="flex-1 flex flex-col rounded-md p-2" style={{ background: p.banda }}>
        <p className="text-center" style={{ fontSize: "3.2mm", color: p.linha }}>Propósito</p>
        <Linhas p={p} n={4} />
      </div>
    </div>
  );
  return (
    <Shell p={p} props={props} titulo="Jejum" fonteTitulo={cfg.fonteTitulo}>
      <div className="flex flex-col flex-1 min-h-0 gap-4">{[0, 1, 2, 3].map((i) => <div key={i} className="flex-1 flex min-h-0">{bloco(i % 2 === 1)}</div>)}</div>
    </Shell>
  );
}

export function Oracao({ cfg, p, ...props }) {
  return (
    <Shell p={p} props={props} titulo="Pedidos de Oração" fonteTitulo={cfg.fonteTitulo}>
      <div className="flex flex-col flex-1 min-h-0">
        <div className="grid shrink-0 gap-1" style={{ gridTemplateColumns: "14mm 1fr 1fr" }}>
          {["Data", "Pedido", "Resposta"].map((t) => <Banda key={t} p={p}>{t}</Banda>)}
        </div>
        <div className="flex flex-col flex-1 min-h-0">
          {Array.from({ length: 26 }).map((_, i) => (
            <div key={i} className="grid flex-1 gap-1 border-b" style={{ gridTemplateColumns: "14mm 1fr 1fr", borderColor: p.linha }}>
              <span className="border-r" style={{ borderColor: p.banda }} /><span className="border-r" style={{ borderColor: p.banda }} /><span />
            </div>
          ))}
        </div>
      </div>
    </Shell>
  );
}

export function Versiculos({ cfg, p, ...props }) {
  return (
    <Shell p={p} props={props} titulo="Versículos Preferidos" fonteTitulo={cfg.fonteTitulo}>
      <div className="flex flex-col flex-1 min-h-0 gap-4">
        {[0, 1].map((i) => (
          <div key={i} className="flex flex-col flex-1 min-h-0 gap-1">
            <Banda p={p}>Versículo</Banda>
            <div className="rounded-md" style={{ background: p.banda, flex: 3 }} />
            <p className="text-center" style={{ fontSize: "3.3mm", color: p.linha }}>O que aprendi com este versículo:</p>
            <Linhas p={p} n={4} className="flex-[2]" />
          </div>
        ))}
      </div>
    </Shell>
  );
}

export function Leitura({ cfg, p, pagina, parte, partes, ...props }) {
  return (
    <Shell p={p} props={props} titulo="Controle de Leitura" fonteTitulo={cfg.fonteTitulo}>
      <div className="flex flex-col flex-1 min-h-0 overflow-hidden" style={{ gap: "1.5mm" }}>
        {pagina.itens.map((it, i) =>
          it.secao ? (
            <p key={i} className="text-center italic shrink-0" style={{ fontSize: "3.4mm", color: p.linha, height: "5.5mm" }}>{it.secao}</p>
          ) : (
            <div key={i} className="shrink-0">
              <Banda p={p} className="font-semibold" style={{ fontSize: "3.2mm", padding: "0.2mm 1mm" }}>{it.livro.nome}</Banda>
              <div className="grid" style={{ gridTemplateColumns: `repeat(${CAP_POR_LINHA}, 1fr)` }}>
                {Array.from({ length: it.livro.cap }).map((_, c) => (
                  <span key={c} className="border text-center" style={{ borderColor: p.linha, height: "5mm", lineHeight: "5mm", fontSize: "2.4mm", color: p.linha, marginRight: "-1px", marginTop: "-1px" }}>{c + 1}</span>
                ))}
              </div>
            </div>
          ),
        )}
      </div>
      <p className="text-center shrink-0" style={{ fontSize: "2.6mm", color: p.linha, opacity: 0.6 }}>{parte}/{partes}</p>
    </Shell>
  );
}

export function PaginaDevocional({ item, idx, ...props }) {
  const cfg = devocionalCfg.get();
  const p = PALETAS[cfg.paleta] || PALETAS.rosa;
  const comum = { cfg, p, ...props };
  switch (item.tipo) {
    case "capa": return <Capa {...comum} />;
    case "dados": return <Dados {...comum} />;
    case "anotacoes": return <Anotacoes {...comum} estilo={item.estilo} />;
    case "calendario": return <Calendario {...comum} ano={item.ano} />;
    case "devocional": return <DevocionalDia {...comum} idx={idx} />;
    case "versiculos": return <Versiculos {...comum} />;
    case "gratidao": return <Gratidao {...comum} />;
    case "jejum": return <Jejum {...comum} />;
    case "oracao": return <Oracao {...comum} />;
    case "leitura": return <Leitura {...comum} pagina={item.pagina} parte={item.parte} partes={item.partes} />;
    default: return null;
  }
}
