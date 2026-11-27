// src/pages/ConfigPage.jsx
import { DEFAULT_FOOTER_NAME } from "../config/appInfo";
import { useNavigate, useOutletContext } from "react-router-dom";
import {
  MdUpload,
  MdColorLens,
  MdFontDownload,
  MdImage,
  MdArrowBack,
  MdArrowForward,
  MdPerson,
  MdVisibilityOff,
  MdVisibility,
} from "react-icons/md";
import { createContext, useContext, useState } from "react";
import { MdTextFields, MdMenuBook } from "react-icons/md";
import { toast } from "react-hot-toast";
import { TEMAS } from "../themes";
import { getCapaEstiloOptions } from "../config/capaStyles.jsx";
import { fonteCfg } from "../lib/configFonte";
import { logoCfg, LOGO_PADRAO } from "../lib/logoCfg";
import CapaLayout from "../components/layouts/CapaLayout";
import { capaCfg, CAPA_PADRAO, FONTES_CAPA } from "../lib/capaCfg";
import { rodapeCfg } from "../lib/rodapeCfg";
import { fundoCfg, FUNDO_PADRAO, estiloFundo } from "../lib/fundoCfg";
import { useAgendaConfig } from "../context/AgendaConfigContext";
import OpcoesFonte from "../components/ui/OpcoesFonte";

const FONT_OPTIONS = [
  { value: "sans-serif", label: "Sans-serif (padrão)" },
  { value: "serif", label: "Serif" },
  { value: "monospace", label: "Monospace" },
  { value: "cursive", label: "Cursive" },
  { value: "Inter", label: "Inter" },
  { value: "Cormorant Garamond", label: "Cormorant" },
  { value: "Playfair Display", label: "Playfair Display" },
  { value: "Montserrat", label: "Montserrat" },
  { value: "Dancing Script", label: "Dancing Script" },
  { value: "Oswald", label: "Oswald" },
  { value: "Lora", label: "Lora" },
  { value: "Raleway", label: "Raleway" },
  { value: "Nunito", label: "Nunito" },
  { value: "Poppins", label: "Poppins" },
  { value: "Work Sans", label: "Work Sans" },
  { value: "Josefin Sans", label: "Josefin Sans" },
  { value: "Quicksand", label: "Quicksand (arredondada)" },
  { value: "Comfortaa", label: "Comfortaa (arredondada)" },
  { value: "Merriweather", label: "Merriweather (serifada)" },
  { value: "Libre Baskerville", label: "Libre Baskerville (clássica)" },
  { value: "Crimson Text", label: "Crimson Text (livro)" },
  { value: "DM Serif Display", label: "DM Serif Display (títulos)" },
  { value: "Roboto Slab", label: "Roboto Slab" },
  { value: "Bebas Neue", label: "Bebas Neue (caixa alta)" },
  { value: "Courier Prime", label: "Courier Prime (máquina de escrever)" },
  { value: "Caveat", label: "Caveat (manuscrita)" },
  { value: "Patrick Hand", label: "Patrick Hand (manuscrita)" },
  { value: "Indie Flower", label: "Indie Flower (manuscrita)" },
  { value: "Kalam", label: "Kalam (manuscrita)" },
  { value: "Satisfy", label: "Satisfy (script)" },
  { value: "Pacifico", label: "Pacifico (script)" },
  { value: "Great Vibes", label: "Great Vibes (caligrafia)" },
  { value: "Amatic SC", label: "Amatic SC (traço fino)" },
];

const PALETAS_DIAS = [
  {
    id: "classica",
    nome: "Clássica",
    cores: {
      domingo: "#ef4444",
      sabado: "#3b82f6",
      diaNormal: "#374151",
      feriado: "#dc2626",
      comemorativa: "#b45309",
    },
  },
  {
    id: "pastel",
    nome: "Pastel",
    cores: {
      domingo: "#f87171",
      sabado: "#60a5fa",
      diaNormal: "#6b7280",
      feriado: "#fca5a5",
      comemorativa: "#fbbf24",
    },
  },
  {
    id: "escura",
    nome: "Escura",
    cores: {
      domingo: "#991b1b",
      sabado: "#1e40af",
      diaNormal: "#1f2937",
      feriado: "#7f1d1d",
      comemorativa: "#92400e",
    },
  },
  {
    id: "vibrante",
    nome: "Vibrante",
    cores: {
      domingo: "#e11d48",
      sabado: "#2563eb",
      diaNormal: "#111827",
      feriado: "#b91c1c",
      comemorativa: "#d97706",
    },
  },
  {
    id: "natureza",
    nome: "Natureza",
    cores: {
      domingo: "#b45309",
      sabado: "#0369a1",
      diaNormal: "#374151",
      feriado: "#92400e",
      comemorativa: "#15803d",
    },
  },
  {
    id: "monocromatico",
    nome: "Monocromático",
    cores: {
      domingo: "#6b7280",
      sabado: "#6b7280",
      diaNormal: "#1f2937",
      feriado: "#4b5563",
      comemorativa: "#4b5563",
    },
  },
  {
    id: "soft",
    nome: "Soft",
    cores: {
      domingo: "#fb7185",
      sabado: "#38bdf8",
      diaNormal: "#475569",
      feriado: "#f43f5e",
      comemorativa: "#f59e0b",
    },
  },
  {
    id: "retro",
    nome: "Retrô",
    cores: {
      domingo: "#be123c",
      sabado: "#1d4ed8",
      diaNormal: "#451a03",
      feriado: "#991b1b",
      comemorativa: "#b45309",
    },
  },
];

const AbaCtx = createContext("cores");

const ABAS = [
  { id: "cores", rotulo: "Cores", dica: "Tema e cores dos dias", icone: MdColorLens },
  { id: "textos", rotulo: "Textos", dica: "Fonte, rodapé e colunas", icone: MdTextFields },
  { id: "imagens", rotulo: "Imagens", dica: "Logo, marca d'água e fundo", icone: MdImage },
  { id: "capa", rotulo: "Capa", dica: "Nome, frase e estilo", icone: MdMenuBook },
];

function SectionCard({ title, description, icon: Icon, grupo, children }) {
  const aba = useContext(AbaCtx);
  return (
    <section className={`bg-[#FBF8F1]/80 border border-[#D8CBA8] rounded-2xl p-5 sm:p-6 shadow-sm ${grupo && grupo !== aba ? "hidden" : ""}`}>
      <div className="mb-4 flex items-start gap-2.5">
        {Icon && (
          <div className="w-8 h-8 rounded-lg bg-[#EFE4C8] text-[#8B6A1F] flex items-center justify-center shrink-0 mt-0.5">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <div>
          <h2 className="text-sm font-bold text-[#24344D]">{title}</h2>
          {description && (
            <p className="text-xs text-[#8B6A1F] mt-0.5">{description}</p>
          )}
        </div>
      </div>
      {children}
    </section>
  );
}

const inputCls =
  "border border-[#D8CBA8] rounded-lg px-3 py-2 text-sm bg-[#FBF8F1] font-medium focus:ring-2 focus:ring-[#B8933D]/40 focus:border-[#B8933D] focus:outline-none transition";


// Fonte, tamanho e posição dos textos da capa, com prévia da capa inteira
function CapaAjuste({ settings }) {
  const c = capaCfg.useStore();
  const set = (o) => capaCfg.set(o);
  const range = (rotulo, k, min, max, un) => (
    <label className="flex flex-col gap-1 text-[11px] font-semibold text-[#6B6458]">
      <span className="flex justify-between"><span>{rotulo}</span><span className="text-[#24344D]">{c[k]}{un}</span></span>
      <input type="range" min={min} max={max} value={c[k]} onChange={(e) => set({ [k]: Number(e.target.value) })} />
    </label>
  );
  const alin = [["padrao", "Padrão"], ["esq", "Esquerda"], ["centro", "Centro"], ["dir", "Direita"]];
  return (
    <div className="mt-4 flex flex-col sm:flex-row gap-4 border-t border-[#E7DCC0] pt-4">
      <div className="shrink-0">
        <p className="text-[10px] uppercase tracking-wider text-[#8B6A1F] font-bold mb-1">Prévia da capa</p>
        <p className="text-[10px] text-[#6B6458] mb-1 max-w-[200px]">Modelos com capa própria (ex.: Agenda Anual) usam os mesmos ajustes — veja em Visualização.</p>
        <div className="bg-white border border-[#D8CBA8] shadow overflow-hidden relative" style={{ width: 210 * 0.95, height: 297 * 0.95 }}>
          <div className="amostra-pg" style={{ transform: "scale(0.251)", transformOrigin: "top left", width: "210mm", display: "block" }}>
            <div className="page-break"><CapaLayout {...settings} printing={false} /></div>
          </div>
        </div>
      </div>
      <div className="flex-1 flex flex-col gap-3 min-w-[220px]">
        <label className="flex flex-col gap-1 text-[11px] font-semibold text-[#6B6458]">
          Fonte das letras
          <select className="rounded-lg border border-[#D8CBA8] bg-[#FBF8F1] px-2 py-1.5 text-sm" value={c.fonte} onChange={(e) => set({ fonte: e.target.value })} style={{ fontFamily: c.fonte || undefined }}>
            <OpcoesFonte lista={FONTES_CAPA} />
          </select>
        </label>
        <div className="grid grid-cols-3 gap-3">
          {range("Tamanho do nome", "tamNome", 40, 220, "%")}
          {range("Tamanho do ano", "tamAno", 40, 220, "%")}
          {range("Tamanho da frase", "tamFrase", 40, 220, "%")}
        </div>
        <div className="grid grid-cols-3 gap-3">
          {range("Mover ← →", "x", -80, 80, " mm")}
          {range("Mover ↑ ↓", "y", -120, 120, " mm")}
          {range("Espaço da frase", "espaco", -20, 60, " mm")}
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-semibold text-[#6B6458] mr-1">Alinhamento</span>
          {alin.map(([id, n]) => (
            <button key={id} type="button" onClick={() => set({ alinh: id })} className={`text-xs px-3 py-1 rounded-full border ${c.alinh === id ? "bg-[#24344D] text-white border-[#24344D]" : "bg-[#FBF8F1] text-[#24344D] border-[#D8CBA8]"}`}>{n}</button>
          ))}
          <label className="ml-3 flex items-center gap-1.5 text-[11px] font-semibold text-[#6B6458]">Cor do nome
            <input type="color" value={c.corNome || "#374151"} onChange={(e) => set({ corNome: e.target.value })} />
          </label>
        </div>
        <button type="button" onClick={() => set({ ...CAPA_PADRAO })} className="self-start text-xs text-[#8B6A1F] underline">↺ Restaurar padrão da capa</button>
      </div>
    </div>
  );
}

// Opções do rodapé: crédito (só no bíblico) e tamanho das letras
function RodapeAjuste({ footerType }) {
  const c = rodapeCfg.useStore();
  return (
    <div className="mt-3 flex flex-col gap-2.5">
      {footerType === "biblical" && (
        <label className="flex items-center gap-2 text-xs text-[#24344D]">
          <input type="checkbox" checked={c.mostrarCredito} onChange={(e) => rodapeCfg.set({ mostrarCredito: e.target.checked })} />
          Mostrar “Desenho de Miolo por: nome” abaixo do versículo
        </label>
      )}
      <label className="flex flex-col gap-1 text-[11px] font-semibold text-[#6B6458]">
        <span className="flex justify-between"><span>Tamanho das letras do rodapé</span><span className="text-[#24344D]">{c.tamanho}%</span></span>
        <input type="range" min={70} max={300} step={5} value={c.tamanho} onChange={(e) => rodapeCfg.set({ tamanho: Number(e.target.value) })} />
      </label>
    </div>
  );
}

// Tamanho/posição da imagem de fundo, com prévia da página inteira
function FundoAjuste({ src, opacidade }) {
  const c = fundoCfg.useStore();
  const set = (o) => fundoCfg.set(o);
  const modos = [["cobrir", "Cobrir a página"], ["inteira", "Caber inteira"], ["pct", "Tamanho personalizado"]];
  const range = (rotulo, k, min, max, un) => (
    <label className="flex flex-col gap-1 text-[11px] font-semibold text-[#6B6458]">
      <span className="flex justify-between"><span>{rotulo}</span><span className="text-[#24344D]">{c[k]}{un}</span></span>
      <input type="range" min={min} max={max} value={c[k]} onChange={(e) => set({ [k]: Number(e.target.value) })} />
    </label>
  );
  return (
    <div className="mt-3 flex flex-col sm:flex-row gap-4">
      <div className="shrink-0">
        <p className="text-[10px] uppercase tracking-wider text-[#8B6A1F] font-bold mb-1">Prévia da página</p>
        <div className="bg-white border border-[#D8CBA8] shadow relative overflow-hidden" style={{ width: 150, height: 212 }}>
          <div className="absolute inset-0" style={{ backgroundImage: `url(${src})`, ...estiloFundo(c), opacity: Math.min(1, opacidade * 2.2) }} />
          <div className="absolute left-3 right-3 top-4 h-2 bg-gray-200 rounded" />
          {[0, 1, 2, 3, 4, 5, 6].map((i) => <div key={i} className="absolute left-3 right-3 border-t border-gray-300" style={{ top: 40 + i * 22 }} />)}
        </div>
      </div>
      <div className="flex-1 flex flex-col gap-3 min-w-[200px]">
        <div className="flex flex-wrap gap-1.5">
          {modos.map(([id, nome]) => (
            <button key={id} type="button" onClick={() => set({ modo: id })}
              className={`text-xs px-3 py-1.5 rounded-full border ${c.modo === id ? "bg-[#24344D] text-white border-[#24344D]" : "bg-[#FBF8F1] text-[#24344D] border-[#D8CBA8]"}`}>{nome}</button>
          ))}
        </div>
        {c.modo === "pct" && range("Tamanho (largura da imagem)", "tamanho", 10, 200, "%")}
        {c.modo !== "cobrir" && (
          <div className="grid grid-cols-2 gap-3">
            {range("Posição horizontal", "x", 0, 100, "%")}
            {range("Posição vertical", "y", 0, 100, "%")}
          </div>
        )}
        {c.modo === "pct" && (
          <label className="flex items-center gap-2 text-xs text-[#24344D]"><input type="checkbox" checked={c.repetir} onChange={(e) => set({ repetir: e.target.checked })} /> Repetir a imagem (estampa)</label>
        )}
        <button type="button" onClick={() => set({ ...FUNDO_PADRAO })} className="self-start text-xs text-[#8B6A1F] underline">↺ Restaurar padrão</button>
      </div>
    </div>
  );
}

// Ajuste do tamanho do logo com prévia do cabeçalho da página (escala real, A4 reduzido)
function LogoAjuste({ logo }) {
  const c = logoCfg.useStore();
  const num = (rotulo, k, min, max, un) => (
    <label className="flex flex-col gap-1 text-[11px] font-semibold text-[#6B6458]">
      <span className="flex justify-between"><span>{rotulo}</span><span className="text-[#24344D]">{c[k]}{un}</span></span>
      <input type="range" min={min} max={max} value={c[k]} onChange={(e) => logoCfg.set({ [k]: Number(e.target.value) })} />
    </label>
  );
  return (
    <div className="mt-3 flex flex-col gap-3">
      <div className="rounded-lg border border-[#D8CBA8] bg-[#E9E2D0] p-3 overflow-hidden">
        <p className="text-[10px] uppercase tracking-wider text-[#8B6A1F] font-bold mb-2">Prévia do topo da página (A4)</p>
        <div className="mx-auto bg-white shadow overflow-hidden relative" style={{ width: 210 * 1.4, height: 70 * 1.4 }}>
          <div style={{ width: 210 + "mm", transform: "scale(0.37)", transformOrigin: "top left", padding: "15mm 12mm 0 22mm", boxSizing: "border-box" }}>
            <div className="flex items-start justify-between border-b border-gray-300 pb-2">
              <img src={logo} alt="" style={{ height: "8.5mm", width: "auto", objectFit: "contain", zoom: c.escala / 100, maxWidth: c.larguraMax + "mm", maxHeight: c.alturaMax + "mm" }} />
              <span className="text-[11pt] text-gray-500">Título da página</span>
            </div>
            <div className="mt-3 h-3 bg-gray-100 rounded" /><div className="mt-2 h-3 bg-gray-100 rounded w-3/4" />
          </div>
        </div>
      </div>
      <div className="grid sm:grid-cols-3 gap-3">
        {num("Tamanho", "escala", 40, 300, "%")}
        {num("Largura máxima", "larguraMax", 15, 120, " mm")}
        {num("Altura máxima", "alturaMax", 8, 50, " mm")}
      </div>
      <button type="button" onClick={() => logoCfg.set({ ...LOGO_PADRAO })} className="self-start text-xs text-[#8B6A1F] underline">↺ Restaurar tamanho padrão</button>
    </div>
  );
}

export default function ConfigPage() {
  const { settings } = useOutletContext();
  const navigate = useNavigate();
  const {
    applyThemeColors,
    handleLogoUpload,
    handleRemoveLogo,
    handleWatermarkUpload,
    handleRemoveWatermark,
    handleBackgroundUpload,
    handleRemoveBackground,
    customName,
    setCustomName,
    footerName,
  } = settings;

  const cfgCtx = useAgendaConfig();
  const { escala: escalaFonte } = fonteCfg.useStore();
  const {
    colorTheme,
    primaryColor,
    setPrimaryColor,
    secondaryColor,
    setSecondaryColor,
    bgColor,
    setBgColor,
    fontFamily,
    setFontFamily,
    logo,
    footerType,
    setFooterType,
    footerHidden,
    setFooterHidden,
    watermarkSrc,
    watermarkOpacity,
    setWatermarkOpacity,
    backgroundSrc,
    backgroundOpacity,
    setBackgroundOpacity,
    capaNome,
    setCapaNome,
    capaEstilo,
    setCapaEstilo,
    capaFrase,
    setCapaFrase,
    domingoColor,
    setDomingoColor,
    sabadoColor,
    setSabadoColor,
    diaNormalColor,
    setDiaNormalColor,
    feriadoColor,
    setFeriadoColor,
    comemorativaColor,
    setComemorativaColor,
    numeroDiaColor,
    setNumeroDiaColor,
    horaColor,
    setHoraColor,
    mesColor,
    setMesColor,
    diaSemanaColor,
    setDiaSemanaColor,
    colunaHora,
    setColunaHora,
    colunaCliente,
    setColunaCliente,
    colunaServico,
    setColunaServico,
    colunaValor,
    setColunaValor,
    colunaStatus,
    setColunaStatus,
  } = useAgendaConfig();

  const [aba, setAba] = useState("cores");
  const idxAba = ABAS.findIndex((x) => x.id === aba);
  const irAba = (id) => { setAba(id); try { window.scrollTo({ top: 0, behavior: "smooth" }); } catch { /* sem scroll */ } };

  const opcoesDeTemas = Object.entries(TEMAS).map(([id, { nome }]) => ({
    id,
    nome,
  }));

  const onFooterTypeChange = (type, label, icon) => {
    setFooterType(type);
    toast(`${label} selecionado`, { icon });
  };

  const aplicarPaleta = (paleta) => {
    setDomingoColor(paleta.cores.domingo);
    setSabadoColor(paleta.cores.sabado);
    setDiaNormalColor(paleta.cores.diaNormal);
    setFeriadoColor(paleta.cores.feriado);
    setComemorativaColor(paleta.cores.comemorativa);
    toast(`Paleta "${paleta.nome}" aplicada!`, { icon: "🎨" });
  };

  return (
    <AbaCtx.Provider value={aba}>
    <div className="max-w-6xl mx-auto px-5 sm:px-6 py-8 flex flex-col gap-6">
      <div className="rounded-3xl border border-[#D8CBA8] bg-gradient-to-br from-[#FBF3DC] via-[#FBF8F1] to-[#F3E8CC] px-6 py-6 shadow-sm">
        <h1 className="text-2xl sm:text-3xl font-semibold text-[#24344D] tracking-tight" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          Deixe do seu jeito
        </h1>
        <p className="text-sm text-[#6B6458] mt-1 max-w-2xl">
          Siga as 4 etapas abaixo: escolha as cores, ajuste os textos, coloque suas imagens e monte a capa. Tudo é salvo automaticamente — depois é só ver a visualização.
        </p>
      </div>

      <nav aria-label="Etapas da personalização" className="sticky top-0 z-10 -mx-1 px-1 py-2 bg-[#F6F1E7]/90 backdrop-blur grid grid-cols-2 sm:grid-cols-4 gap-2">
        {ABAS.map((x, i) => {
          const ativo = x.id === aba;
          const Icone = x.icone;
          return (
            <button key={x.id} type="button" onClick={() => irAba(x.id)} aria-current={ativo ? "page" : undefined}
              className={`flex items-center gap-2.5 rounded-2xl border px-3 py-2.5 text-left transition-all ${ativo ? "bg-[#24344D] text-white border-[#24344D] shadow-md" : "bg-[#FBF8F1] text-[#24344D] border-[#D8CBA8] hover:border-[#B8933D]"}`}>
              <span className={`w-8 h-8 rounded-xl grid place-items-center shrink-0 text-lg ${ativo ? "bg-[#E0A800] text-[#24344D]" : "bg-[#EFE4C8] text-[#8B6A1F]"}`}><Icone /></span>
              <span className="min-w-0">
                <span className="block text-sm font-bold leading-tight">{i + 1}. {x.rotulo}</span>
                <span className={`block text-[11px] leading-tight truncate ${ativo ? "text-white/75" : "text-[#8B6A1F]"}`}>{x.dica}</span>
              </span>
            </button>
          );
        })}
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Tema / Layout de cores */}
        <SectionCard
          grupo="cores"
          title="Tema de cores"
          description="Aplica uma combinação pronta de primária, secundária e fundo."
          icon={MdColorLens}
        >
          <div className="flex flex-wrap gap-2">
            {opcoesDeTemas.map(({ id, nome }) => (
              <button
                key={id}
                onClick={() => applyThemeColors(id)}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-full border transition-all ${
                  colorTheme === id
                    ? "bg-[#24344D] text-[#F6F1E7] border-[#24344D] shadow-sm"
                    : "bg-[#FBF8F1] text-[#6B6458] border-[#D8CBA8] hover:border-[#B8933D] hover:text-[#24344D]"
                }`}
              >
                {nome}
              </button>
            ))}
          </div>
        </SectionCard>

        {/* Cores personalizadas */}
        <SectionCard
          grupo="cores"
          title="Cores personalizadas"
          description="Ajuste fino, sobrepõe o tema escolhido acima."
          icon={MdColorLens}
        >
          <div className="flex flex-wrap items-center gap-5">
            {[
              {
                value: primaryColor,
                onChange: setPrimaryColor,
                title: "Primária",
              },
              {
                value: secondaryColor,
                onChange: setSecondaryColor,
                title: "Secundária",
              },
              { value: bgColor, onChange: setBgColor, title: "Fundo" },
              {
                value: numeroDiaColor,
                onChange: setNumeroDiaColor,
                title: "Número do dia",
              },
              {
                value: horaColor,
                onChange: setHoraColor,
                title: "Horários",
              },
              {
                value: diaSemanaColor,
                onChange: setDiaSemanaColor,
                title: "Nome do dia",
              },
              {
                value: mesColor,
                onChange: setMesColor,
                title: "Mês/Ano",
              },
            ].map(({ value, onChange, title }) => (
              <div key={title} className="flex flex-col items-center gap-1.5">
                <input
                  type="color"
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  className="w-9 h-9 p-0 border-2 border-[#D8CBA8] rounded-full cursor-pointer hover:border-[#B8933D] transition shadow-sm"
                  title={title}
                />
                <span className="text-[10px] text-[#8B6A1F] font-medium">
                  {title}
                </span>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Tabela de Horários - Rótulos */}
        <SectionCard
          grupo="textos"
          title="Rótulos das colunas"
          description="Personalize os nomes das colunas da tabela de horários."
          icon={MdColorLens}
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8B6A1F] mb-1">
                Hora
              </label>
              <input
                type="text"
                value={colunaHora}
                onChange={(e) => setColunaHora(e.target.value)}
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8B6A1F] mb-1">
                Cliente
              </label>
              <input
                type="text"
                value={colunaCliente}
                onChange={(e) => setColunaCliente(e.target.value)}
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8B6A1F] mb-1">
                Serviço
              </label>
              <input
                type="text"
                value={colunaServico}
                onChange={(e) => setColunaServico(e.target.value)}
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8B6A1F] mb-1">
                Valor
              </label>
              <input
                type="text"
                value={colunaValor}
                onChange={(e) => setColunaValor(e.target.value)}
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8B6A1F] mb-1">
                Status
              </label>
              <input
                type="text"
                value={colunaStatus}
                onChange={(e) => setColunaStatus(e.target.value)}
                className={inputCls}
              />
            </div>
          </div>
        </SectionCard>

        {/* Cores dos dias do calendário com paletas pré-definidas */}
        <SectionCard
          grupo="cores"
          title="Cores dos dias do calendário"
          description="Escolha uma paleta pronta ou personalize cada cor individualmente."
          icon={MdColorLens}
        >
          <div className="mb-4">
            <p className="text-[10px] text-[#8B6A1F] font-medium mb-2">
              Paletas prontas:
            </p>
            <div className="flex flex-wrap gap-2">
              {PALETAS_DIAS.map((paleta) => (
                <button
                  key={paleta.id}
                  onClick={() => aplicarPaleta(paleta)}
                  className="group px-3 py-2 rounded-xl border border-[#D8CBA8] bg-[#FBF8F1] hover:border-[#B8933D] hover:bg-[#EFE4C8] transition-all flex items-center gap-2"
                >
                  <span className="flex items-center gap-1">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: paleta.cores.domingo }}
                    />
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: paleta.cores.sabado }}
                    />
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: paleta.cores.diaNormal }}
                    />
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: paleta.cores.feriado }}
                    />
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: paleta.cores.comemorativa }}
                    />
                  </span>
                  <span className="text-xs text-[#6B6458] font-medium">
                    {paleta.nome}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[10px] text-[#8B6A1F] font-medium mb-2">
              Personalizar cada cor:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {[
                {
                  value: domingoColor,
                  onChange: setDomingoColor,
                  label: "Domingo",
                },
                {
                  value: sabadoColor,
                  onChange: setSabadoColor,
                  label: "Sábado",
                },
                {
                  value: diaNormalColor,
                  onChange: setDiaNormalColor,
                  label: "Dia normal",
                },
                {
                  value: feriadoColor,
                  onChange: setFeriadoColor,
                  label: "Feriado",
                },
                {
                  value: comemorativaColor,
                  onChange: setComemorativaColor,
                  label: "Comemorativa",
                },
              ].map(({ value, onChange, label }) => (
                <div
                  key={label}
                  className="flex flex-col items-center gap-1.5 p-3 bg-[#FBF8F1] rounded-xl border border-[#D8CBA8]"
                >
                  <input
                    type="color"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-10 h-10 p-0 border-2 border-[#D8CBA8] rounded-full cursor-pointer hover:border-[#B8933D] transition shadow-sm"
                    title={label}
                  />
                  <span className="text-[10px] text-[#8B6A1F] font-medium">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </SectionCard>

        {/* Fonte */}
        <SectionCard
          grupo="textos"
          title="Tipografia"
          description="Fonte usada nos textos da agenda."
          icon={MdFontDownload}
        >
          <select
            value={fontFamily}
            onChange={(e) => setFontFamily(e.target.value)}
            className={`${inputCls} w-full`}
            style={{ fontFamily }}
          >
            {FONT_OPTIONS.map((opt) => (
              <option
                key={opt.value}
                value={opt.value}
                style={{ fontFamily: opt.value }}
              >
                {opt.label}
              </option>
            ))}
          </select>

          <div className="mt-4">
            <label className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-[#8B6A1F] mb-1.5">
              Tamanho das letras
              <span className="text-sm normal-case tracking-normal text-[#24344D]">{escalaFonte}%</span>
            </label>
            <input
              type="range"
              min="80"
              max="170"
              step="5"
              value={escalaFonte}
              onChange={(e) => fonteCfg.set({ escala: Number(e.target.value) })}
              className="w-full accent-[#B8933D]"
            />
            <div className="flex justify-between items-center mt-1">
              <span className="text-[11px] text-[#8B6A1F]">Vale para todas as páginas da agenda e do talonário.</span>
              {escalaFonte !== 100 && (
                <button type="button" onClick={() => fonteCfg.set({ escala: 100 })} className="text-[11px] underline text-[#24344D]">
                  restaurar 100%
                </button>
              )}
            </div>
            <p className="mt-3 rounded-lg border border-[#D8CBA8] bg-[#FBF8F1] px-3 py-2" style={{ fontFamily, fontSize: `${14 * escalaFonte / 100}px` }}>
              Aa — O rato roeu a roupa do rei de Roma. 0123456789
            </p>
          </div>
        </SectionCard>

        {/* Rodapé - Personalização do Nome */}
        <SectionCard
          grupo="textos"
          title="Rodapé Personalizado"
          description="Defina o nome que aparecerá no rodapé de todas as páginas."
          icon={MdPerson}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8B6A1F] mb-1.5">
                Nome / Marca no Rodapé:
              </label>
              <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="Ex: Studio Bella, Ana Silva, Gráfica Express"
                className={inputCls}
                disabled={footerHidden}
              />
              {customName && !footerHidden && (
                <p className="text-xs text-[#6B6458] mt-2 flex items-center gap-2">
                  <span className="text-[#2F6B45]">✓</span>
                  Rodapé atual:{" "}
                  <strong className="text-[#24344D]">{customName}</strong>
                </p>
              )}
              {!customName && !footerHidden && (
                <p className="text-xs text-[#8B6A1F] mt-2 flex items-center gap-2">
                  <span>ℹ️</span>
                  Deixe em branco para usar o nome padrão:{" "}
                  <strong>{DEFAULT_FOOTER_NAME}</strong>
                </p>
              )}
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8B6A1F] mb-1.5">
                Estilo do Rodapé:
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  {
                    type: "default",
                    label: "Rodapé padrão",
                    icon: "📄",
                    display: "Padrão",
                  },
                  {
                    type: "biblical",
                    label: "Rodapé bíblico",
                    icon: "📖",
                    display: "Bíblico",
                  },
                ].map(({ type, label, icon, display }) => (
                  <button
                    key={type}
                    onClick={() => onFooterTypeChange(type, label, icon)}
                    className={`px-3.5 py-1.5 text-xs font-medium rounded-full border transition-all ${
                      footerType === type && !footerHidden
                        ? "bg-[#24344D] text-[#F6F1E7] border-[#24344D] shadow-sm"
                        : footerHidden
                          ? "bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed opacity-50"
                          : "bg-[#FBF8F1] text-[#6B6458] border-[#D8CBA8] hover:border-[#B8933D] hover:text-[#24344D]"
                    }`}
                    disabled={footerHidden}
                  >
                    {display}
                  </button>
                ))}
              </div>
              <RodapeAjuste footerType={footerType} />
            </div>

            <div className="pt-2 border-t border-[#D8CBA8]/50">
              <button
                onClick={() => {
                  setFooterHidden(!footerHidden);
                  toast(
                    footerHidden ? "Rodapé visível novamente" : "Rodapé oculto",
                    {
                      icon: footerHidden ? "👁️" : "🚫",
                    },
                  );
                }}
                className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  footerHidden
                    ? "bg-[#2F6B45] text-white hover:bg-[#275A3B]"
                    : "bg-[#8B2E3F] text-white hover:bg-[#7A2837]"
                }`}
              >
                {footerHidden ? (
                  <>
                    <MdVisibility className="w-4 h-4" />
                    Mostrar rodapé
                  </>
                ) : (
                  <>
                    <MdVisibilityOff className="w-4 h-4" />
                    Ocultar rodapé
                  </>
                )}
              </button>
            </div>

            {customName && !footerHidden && (
              <button
                onClick={() => setCustomName("")}
                className="text-[#8B2E3F] hover:text-[#6E2432] text-xs underline transition"
              >
                Remover nome personalizado
              </button>
            )}
          </div>
        </SectionCard>

        {/* Logo */}
        <SectionCard
          grupo="imagens"
          title="Logo"
          description="Aparece no cabeçalho das páginas."
          icon={MdImage}
        >
          <div className="flex items-center gap-3">
            <label className="cursor-pointer bg-[#FBF8F1] hover:bg-[#EFE4C8] text-[#24344D] text-xs px-3.5 py-2 rounded-lg border border-[#D8CBA8] flex items-center gap-1.5 transition hover:border-[#B8933D]">
              <MdUpload className="w-3.5 h-3.5" />
              {logo ? "Alterar logo" : "Enviar logo"}
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
            </label>
            {logo && (
              <>
                <img
                  src={logo}
                  alt="Logo"
                  className="w-9 h-9 rounded-lg object-cover border border-[#D8CBA8]"
                />
                <button
                  onClick={handleRemoveLogo}
                  className="text-[#8B2E3F] hover:text-[#6E2432] text-xs underline transition"
                >
                  Remover
                </button>
              </>
            )}
          </div>
          {logo && <LogoAjuste logo={logo} />}
        </SectionCard>

        {/* Marca d'água */}
        <SectionCard
          grupo="imagens"
          title="Marca d'água"
          description="Imagem sutil no fundo das páginas."
          icon={MdImage}
        >
          <div className="flex flex-wrap items-center gap-3">
            <label className="cursor-pointer bg-[#FBF8F1] hover:bg-[#EFE4C8] text-[#24344D] text-xs px-3.5 py-2 rounded-lg border border-[#D8CBA8] flex items-center gap-1.5 transition hover:border-[#B8933D]">
              <MdUpload className="w-3.5 h-3.5" />
              {watermarkSrc ? "Alterar" : "Enviar"}
              <input
                type="file"
                accept="image/*"
                onChange={handleWatermarkUpload}
                className="hidden"
              />
            </label>
            {watermarkSrc && (
              <>
                <button
                  onClick={handleRemoveWatermark}
                  className="text-[#8B2E3F] hover:text-[#6E2432] text-xs underline transition"
                >
                  Remover
                </button>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-[#8B6A1F] uppercase tracking-wide">
                    Opacidade
                  </span>
                  <input
                    type="range"
                    min="0.01"
                    max="0.1"
                    step="0.01"
                    value={watermarkOpacity}
                    onChange={(e) =>
                      setWatermarkOpacity(parseFloat(e.target.value))
                    }
                    className="w-24 h-1 accent-[#B8933D]"
                  />
                </div>
              </>
            )}
          </div>
        </SectionCard>

        {/* Fundo da página */}
        <SectionCard
          grupo="imagens"
          title="Fundo da página"
          description="Imagem que preenche a página inteira, atrás do conteúdo."
          icon={MdImage}
        >
          <div className="flex flex-wrap items-center gap-3">
            <label className="cursor-pointer bg-[#FBF8F1] hover:bg-[#EFE4C8] text-[#24344D] text-xs px-3.5 py-2 rounded-lg border border-[#D8CBA8] flex items-center gap-1.5 transition hover:border-[#B8933D]">
              <MdUpload className="w-3.5 h-3.5" />
              {backgroundSrc ? "Alterar fundo" : "Enviar fundo"}
              <input
                type="file"
                accept="image/*"
                onChange={handleBackgroundUpload}
                className="hidden"
              />
            </label>
            {backgroundSrc && (
              <>
                <img
                  src={backgroundSrc}
                  alt="Fundo"
                  className="w-9 h-9 rounded-lg object-cover border border-[#D8CBA8]"
                />
                <button
                  onClick={handleRemoveBackground}
                  className="text-[#8B2E3F] hover:text-[#6E2432] text-xs underline transition"
                >
                  Remover
                </button>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-[#8B6A1F] uppercase tracking-wide">
                    Intensidade
                  </span>
                  <input
                    type="range"
                    min="0.01"
                    max="0.5"
                    step="0.01"
                    value={backgroundOpacity}
                    onChange={(e) =>
                      setBackgroundOpacity(parseFloat(e.target.value))
                    }
                    className="w-24 h-1 accent-[#B8933D]"
                  />
                </div>
              </>
            )}
          </div>
          {backgroundSrc && <FundoAjuste src={backgroundSrc} opacidade={backgroundOpacity} />}
        </SectionCard>
      </div>

      {/* Capa */}
      <SectionCard
        grupo="capa"
          title="Capa"
        description="Nome, frase e estilo exibidos na página de capa."
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#8B6A1F]">
              Nome da capa
            </label>
            <input
              type="text"
              value={capaNome}
              onChange={(e) => setCapaNome(e.target.value)}
              placeholder="Ex: Ana Silva"
              className={inputCls}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#8B6A1F]">
              Frase da capa
            </label>
            <input
              type="text"
              value={capaFrase}
              onChange={(e) => setCapaFrase(e.target.value)}
              placeholder="Ex: Organização é liberdade"
              className={inputCls}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#8B6A1F]">
              Estilo
            </label>
            <select
              value={capaEstilo}
              onChange={(e) => setCapaEstilo(e.target.value)}
              className={inputCls}
            >
              {getCapaEstiloOptions().map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <CapaAjuste settings={{ ...settings, ...cfgCtx }} />
      </SectionCard>

      {/* Navegação entre as etapas */}
      <div className="flex justify-between gap-3 pt-2">
        {idxAba === 0 ? (
          <button onClick={() => navigate("/templates")} className="text-[#6B6458] hover:text-[#24344D] font-medium text-sm py-3 px-4 rounded-xl flex items-center gap-2 transition-all hover:bg-[#EFE4C8]">
            <MdArrowBack className="w-4 h-4" />
            Voltar aos Modelos
          </button>
        ) : (
          <button onClick={() => irAba(ABAS[idxAba - 1].id)} className="text-[#6B6458] hover:text-[#24344D] font-medium text-sm py-3 px-4 rounded-xl flex items-center gap-2 transition-all hover:bg-[#EFE4C8]">
            <MdArrowBack className="w-4 h-4" />
            {ABAS[idxAba - 1].rotulo}
          </button>
        )}
        {idxAba < ABAS.length - 1 ? (
          <button onClick={() => irAba(ABAS[idxAba + 1].id)} className="bg-[#24344D] hover:bg-[#1B2740] text-[#F6F1E7] font-semibold text-sm py-3 px-6 rounded-xl flex items-center gap-2 transition-all shadow-[0_2px_0_0_#111B2B]">
            Próximo: {ABAS[idxAba + 1].rotulo}
            <MdArrowForward className="w-4 h-4" />
          </button>
        ) : (
          <button onClick={() => navigate("/preview")} className="bg-[#8B1D2C] hover:bg-[#751824] text-white font-semibold text-sm py-3 px-6 rounded-xl flex items-center gap-2 transition-all shadow-[0_2px_0_0_#4a0f17]">
            Ver Visualização
            <MdArrowForward className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
    </AbaCtx.Provider>
  );
}
