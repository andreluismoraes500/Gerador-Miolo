// Diário "Hora a Hora": título grande, horários com linhas de escrita
// amplas, mini calendário grande e caixa de Anotações.
import { TEMAS } from "../../themes";
import { formatLocalDate, getFeriado, getComemorativa } from "../../utils/agendaUtils";
import Footer from "../Footer";
import Logo from "../Logo";
import Watermark from "../Watermark";
import Background from "../Background";
import EditableField from "../EditableField";
import { horarioCfg } from "../../lib/configHorario";

const DIAS = ["D", "S", "T", "Q", "Q", "S", "S"];

function CalendarioGrande({ data, cor, borda, tam }) {
  const ano = data.getFullYear(), mes = data.getMonth();
  const prim = new Date(ano, mes, 1).getDay();
  const total = new Date(ano, mes + 1, 0).getDate();
  const cel = Array(prim).fill(null).concat(Array.from({ length: total }, (_, i) => i + 1));
  while (cel.length % 7) cel.push(null);
  const g = tam === "pequeno" ? 22 : 30;
  return (
    <div className="shrink-0" style={{ width: g * 7 + 8 }}>
      <p className="text-center capitalize font-semibold mb-1" style={{ color: cor, fontSize: g * 0.55 }}>
        {data.toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}
      </p>
      <div className="grid grid-cols-7 border-b mb-0.5" style={{ borderColor: borda }}>
        {DIAS.map((d, i) => (
          <span key={i} className="text-center font-bold" style={{ color: cor, fontSize: g * 0.42, height: g * 0.7 }}>{d}</span>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {cel.map((d, i) => {
          const foco = d === data.getDate();
          const fer = d && getFeriado(new Date(ano, mes, d));
          const com = d && !fer && getComemorativa(new Date(ano, mes, d));
          return (
            <span key={i} className="flex items-center justify-center" style={{
              height: g, fontSize: g * 0.48,
              fontWeight: foco ? 800 : fer || com ? 600 : 400,
              color: foco ? "#fff" : fer ? "#b91c1c" : com ? "#b45309" : "#374151",
              background: foco ? cor : "transparent", borderRadius: 3,
            }}>{d}</span>
          );
        })}
      </div>
    </div>
  );
}

export default function DiarioHorario({
  data, footerName, colorTheme = "classico", logo, footerType = "default",
  customColors = {}, fontFamily = "sans-serif", watermarkSrc, watermarkOpacity,
  backgroundSrc, backgroundOpacity, footerHidden = false,
}) {
  const cfg = horarioCfg.useStore();
  const tema = TEMAS[colorTheme] || TEMAS.classico;
  const primary = customColors.primary || tema.text || "#000";
  const sec = customColors.secondary || tema.border || "#cbd5e1";
  const diaKey = formatLocalDate(data);
  const ini = Math.min(cfg.inicio, cfg.fim), fim = Math.max(cfg.inicio, cfg.fim);
  const slots = [];
  for (let h = ini; h <= fim; h++) {
    slots.push(`${String(h).padStart(2, "0")}h`);
    if (cfg.meiaHora && h < fim) slots.push(`${String(h).padStart(2, "0")}h30`);
  }
  const mes = data.toLocaleDateString("pt-BR", { month: "long" }).toUpperCase();
  const dia = String(data.getDate()).padStart(2, "0");
  const semana = data.toLocaleDateString("pt-BR", { weekday: "long" }).toUpperCase();
  const orn = (
    <div className="flex items-center gap-2 w-full" style={{ color: sec }}>
      <span className="flex-1 h-px" style={{ background: sec }} />
      <span style={{ color: primary }}>✦</span>
      <span className="flex-1 h-px" style={{ background: sec }} />
    </div>
  );
  return (
    <div className="printable-page font-sans text-gray-900 flex flex-col justify-between box-border select-none border-0 shadow-none rounded-none"
      style={{ backgroundColor: customColors.background || "#fff", fontFamily }}>
      {backgroundSrc && <Background src={backgroundSrc} opacity={backgroundOpacity} />}
      {watermarkSrc && <Watermark src={watermarkSrc} opacity={watermarkOpacity} />}
      <div className="flex flex-col flex-1 min-h-0 gap-2">
        <div className="shrink-0 flex flex-col items-center gap-1 pt-1">
          <Logo src={logo} />
          {orn}
          <h1 className="font-serif tracking-wide leading-none text-[34px] text-center" style={{ color: customColors.numeroDia || primary }}>
            {dia} DE {mes}
          </h1>
          <p className="tracking-[0.35em] text-[13px] font-semibold" style={{ color: customColors.diaSemana || primary }}>{semana}</p>
          {orn}
        </div>
        <div className="tab-horarios flex-1 min-h-0 overflow-hidden flex flex-col">
          {slots.map((h) => (
            <div key={h} className="flex-1 min-h-0 flex gap-2 border-b" style={{ borderColor: sec }}>
              <span className="w-10 shrink-0 pt-1 font-bold text-[14px]" style={{ color: primary }}>{h}</span>
              <div className="flex-1 flex flex-col">
                {Array.from({ length: cfg.linhas }).map((_, i) => (
                  <div key={i} className={`flex-1 min-h-0 ${i < cfg.linhas - 1 ? "border-b border-dotted" : ""}`} style={{ borderColor: sec }}>
                    <EditableField fieldKey={`${diaKey}-${h}-${i}`} className="w-full h-full px-1 text-[13px]" placeholder="" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="shrink-0 flex gap-3 items-stretch" style={{ height: cfg.calendario === "nenhum" ? "26mm" : cfg.calendario === "pequeno" ? "34mm" : "52mm" }}>
          {cfg.calendario !== "nenhum" && <CalendarioGrande data={data} cor={primary} borda={sec} tam={cfg.calendario} />}
          <div className="flex-1 border-2 rounded-md p-2 flex flex-col" style={{ borderColor: primary }}>
            <p className="font-bold text-[13px] tracking-wide" style={{ color: primary }}>Anotações</p>
            <EditableField fieldKey={`${diaKey}-anotacoes`} className="w-full flex-1 text-[13px]" placeholder="" />
          </div>
        </div>
      </div>
      <Footer name={footerName} type={footerType} colorTheme={colorTheme} customColors={customColors} fontFamily={fontFamily} hidden={footerHidden} />
    </div>
  );
}
