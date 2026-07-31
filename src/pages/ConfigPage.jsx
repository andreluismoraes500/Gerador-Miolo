// src/pages/ConfigPage.jsx
//
// Segunda etapa do fluxo: toda a aparência da agenda (tema, cores, fonte,
// rodapé, logo, marca d'água e capa), organizada em cards temáticos.

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
import { toast } from "react-hot-toast";
import { TEMAS } from "../themes";
import { getCapaEstiloOptions } from "../config/capaStyles.jsx";
import { useAgendaConfig } from "../context/AgendaConfigContext";

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
];

// PALETAS PRÉ-DEFINIDAS PARA OS DIAS DO CALENDÁRIO
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

function SectionCard({ title, description, icon: Icon, children }) {
  return (
    <section className="bg-[#FBF8F1]/80 border border-[#D8CBA8] rounded-2xl p-5 sm:p-6 shadow-sm">
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
    // CORES DOS DIAS DO CALENDÁRIO
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
    // COR DO NÚMERO DO DIA
    numeroDiaColor,
    setNumeroDiaColor,
  } = useAgendaConfig();

  const opcoesDeTemas = Object.entries(TEMAS).map(([id, { nome }]) => ({
    id,
    nome,
  }));

  const onFooterTypeChange = (type, label, icon) => {
    setFooterType(type);
    toast(`${label} selecionado`, { icon });
  };

  // Função para aplicar uma paleta pré-definida
  const aplicarPaleta = (paleta) => {
    setDomingoColor(paleta.cores.domingo);
    setSabadoColor(paleta.cores.sabado);
    setDiaNormalColor(paleta.cores.diaNormal);
    setFeriadoColor(paleta.cores.feriado);
    setComemorativaColor(paleta.cores.comemorativa);
    toast(`Paleta "${paleta.nome}" aplicada!`, { icon: "🎨" });
  };

  return (
    <div className="max-w-6xl mx-auto px-5 sm:px-6 py-8 flex flex-col gap-6">
      <div>
        <h1
          className="text-2xl sm:text-3xl font-semibold text-[#24344D] tracking-tight"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          Deixe do seu jeito
        </h1>
        <p className="text-sm text-[#6B6458] mt-1">
          Ajuste cores, fonte, rodapé, logo, marca d'água, fundo e a capa da
          agenda.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Tema / Layout de cores */}
        <SectionCard
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

        {/* Cores dos dias do calendário com paletas pré-definidas */}
        <SectionCard
          title="Cores dos dias do calendário"
          description="Escolha uma paleta pronta ou personalize cada cor individualmente."
          icon={MdColorLens}
        >
          {/* Paletas pré-definidas */}
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

          {/* Seletores individuais */}
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
        </SectionCard>

        {/* Rodapé - Personalização do Nome */}
        <SectionCard
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
                  <strong>Lucas Cassiano de Moraes</strong>
                </p>
              )}
              {footerHidden && (
                <p className="text-xs text-[#8B2E3F] mt-2 flex items-center gap-2">
                  <span>🚫</span>
                  Rodapé está oculto. Nenhum texto será exibido.
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
            </div>

            {/* Botão para ocultar/mostrar rodapé */}
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
              <p className="text-[10px] text-[#6B6458] mt-1.5 text-center">
                {footerHidden
                  ? "O rodapé não aparecerá em nenhuma página"
                  : "O rodapé aparecerá em todas as páginas"}
              </p>
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
        </SectionCard>

        {/* Marca d'água */}
        <SectionCard
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
        </SectionCard>
      </div>

      {/* Capa */}
      <SectionCard
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
      </SectionCard>

      {/* Navegação */}
      <div className="flex justify-between pt-2">
        <button
          onClick={() => navigate("/templates")}
          className="text-[#6B6458] hover:text-[#24344D] font-medium text-sm py-3 px-4 rounded-xl flex items-center gap-2 transition-all hover:bg-[#EFE4C8]"
        >
          <MdArrowBack className="w-4 h-4" />
          Voltar aos Modelos
        </button>
        <button
          onClick={() => navigate("/preview")}
          className="bg-[#24344D] hover:bg-[#1B2740] text-[#F6F1E7] font-semibold text-sm py-3 px-6 rounded-xl flex items-center gap-2 transition-all shadow-[0_2px_0_0_#111B2B] hover:shadow-[0_1px_0_0_#111B2B] hover:translate-y-px active:translate-y-0.5 active:shadow-none"
        >
          Ver Visualização
          <MdArrowForward className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
