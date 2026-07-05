// src/components/ConfigBar.jsx
//
// Barra de configuração. Aparência é lida diretamente do AgendaConfigContext,
// reduzindo o número de props recebidos de ~25 para 8.

import { MdUpload, MdColorLens, MdFontDownload, MdImage } from "react-icons/md";
import { TEMAS } from "../themes";
import TemplateSelector from "./TemplateSelector";
import { useDateInput } from "../hooks/useDateInput";
import { getCapaEstiloOptions } from "../config/capaStyles.jsx";
import BusinessProfileSelector from "./BusinessProfileSelector";
import { useAgendaConfig } from "../context/AgendaConfigContext";
import { toast } from "react-hot-toast";

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

export default function ConfigBar({
  // template / data
  template, setTemplate,
  selectedDate, setSelectedDate,
  // handlers vindos de useAgendaSettings
  applyThemeColors,
  handleLogoUpload, handleRemoveLogo,
  handleWatermarkUpload, handleRemoveWatermark,
  // perfil de negócio
  businessProfileId, setBusinessProfile,
  // modo montagem (esconde o seletor de Modelo, que não se aplica aqui)
  builderMode = false,
}) {
  // Aparência lida diretamente do contexto
  const {
    colorTheme,
    primaryColor, setPrimaryColor,
    secondaryColor, setSecondaryColor,
    bgColor, setBgColor,
    fontFamily, setFontFamily,
    logo,
    footerType, setFooterType,
    watermarkSrc,
    watermarkOpacity, setWatermarkOpacity,
    capaNome, setCapaNome,
    capaEstilo, setCapaEstilo,
    capaFrase, setCapaFrase,
  } = useAgendaConfig();

  const { inputType, inputValue, handleDateChange } = useDateInput(
    template,
    selectedDate,
    setSelectedDate,
    builderMode,
  );

  const opcoesDeTemas = Object.entries(TEMAS).map(([id, { nome }]) => ({ id, nome }));

  const onFooterTypeChange = (type, label, icon) => {
    setFooterType(type);
    toast(`${label} selecionado`, { icon });
  };

  const Label = ({ icon: Icon, children }) => (
    <span className="text-[10px] font-bold uppercase tracking-wider text-[#8B6A1F] flex items-center gap-1 whitespace-nowrap">
      {Icon && <Icon className="w-3.5 h-3.5" />}
      {children}
    </span>
  );

  const inputCls =
    "border border-[#D8CBA8] rounded-lg px-3 py-1.5 text-xs bg-[#FBF8F1] font-medium focus:ring-2 focus:ring-[#B8933D]/40 focus:border-[#B8933D] focus:outline-none transition";

  return (
    <div className="bg-[#F1EADB]/95 backdrop-blur-sm border-b border-[#D8CBA8] px-6 py-5 print:hidden">
      <div className="max-w-7xl mx-auto flex flex-col gap-5">
        {/* Linha 1: Modelo, Data e Perfil */}
        <div className="flex flex-wrap items-end gap-6">
          {builderMode ? (
            <div className="flex items-center gap-2 text-[11px] text-[#8B6A1F] italic">
              Use o painel de montagem abaixo para escolher os módulos da agenda.
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Label>Modelo:</Label>
              <TemplateSelector selected={template} onSelect={setTemplate} compact />
            </div>
          )}

          <div className="flex items-center gap-3">
            <Label>{builderMode ? "Ano:" : "Data Base:"}</Label>
            <input
              type={inputType}
              min={inputType === "number" ? 2020 : undefined}
              max={inputType === "number" ? 2035 : undefined}
              value={inputValue}
              onChange={(e) => handleDateChange(e.target.value)}
              className={`${inputCls} ${builderMode ? "w-20" : "w-28"}`}
            />
          </div>

          <div className="flex items-center gap-2 border-l border-[#D8CBA8] pl-4">
            <Label>Perfil:</Label>
            <BusinessProfileSelector
              selected={businessProfileId || "default"}
              onSelect={setBusinessProfile}
              compact
            />
          </div>
        </div>

        {/* Linha 2: Temas, Cores, Fonte, Rodapé, Logo, Marca d'água, Capa */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-4 pt-4 border-t border-[#D8CBA8]/70">
          {/* Temas */}
          <div className="flex items-center gap-2">
            <Label>Layout:</Label>
            <div className="flex items-center gap-1.5 flex-wrap">
              {opcoesDeTemas.map(({ id, nome }) => (
                <button
                  key={id}
                  onClick={() => applyThemeColors(id)}
                  className={`px-3 py-1 text-[11px] font-medium rounded-full border transition-all ${
                    colorTheme === id
                      ? "bg-[#24344D] text-[#F6F1E7] border-[#24344D] shadow-sm"
                      : "bg-[#FBF8F1] text-[#6B6458] border-[#D8CBA8] hover:border-[#B8933D] hover:text-[#24344D]"
                  }`}
                >
                  {nome}
                </button>
              ))}
            </div>
          </div>

          {/* Cores */}
          <div className="flex items-center gap-3">
            <Label icon={MdColorLens}>Cores:</Label>
            <div className="flex items-center gap-2">
              {[
                { value: primaryColor, onChange: setPrimaryColor, title: "Cor primária" },
                { value: secondaryColor, onChange: setSecondaryColor, title: "Cor secundária" },
                { value: bgColor, onChange: setBgColor, title: "Cor de fundo" },
              ].map(({ value, onChange, title }) => (
                <input
                  key={title}
                  type="color"
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  className="w-7 h-7 p-0 border-2 border-[#D8CBA8] rounded-full cursor-pointer hover:border-[#B8933D] transition shadow-sm"
                  title={title}
                />
              ))}
            </div>
          </div>

          {/* Fonte */}
          <div className="flex items-center gap-2">
            <Label icon={MdFontDownload}>Fonte:</Label>
            <select
              value={fontFamily}
              onChange={(e) => setFontFamily(e.target.value)}
              className={inputCls}
              style={{ fontFamily }}
            >
              {FONT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value} style={{ fontFamily: opt.value }}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Rodapé */}
          <div className="flex items-center gap-2">
            <Label>Rodapé:</Label>
            {[
              { type: "default", label: "Rodapé padrão", icon: "📄", display: "Padrão" },
              { type: "biblical", label: "Rodapé bíblico", icon: "📖", display: "Bíblico" },
            ].map(({ type, label, icon, display }) => (
              <button
                key={type}
                onClick={() => onFooterTypeChange(type, label, icon)}
                className={`px-3 py-1 text-[11px] font-medium rounded-full border transition-all ${
                  footerType === type
                    ? "bg-[#24344D] text-[#F6F1E7] border-[#24344D] shadow-sm"
                    : "bg-[#FBF8F1] text-[#6B6458] border-[#D8CBA8] hover:border-[#B8933D] hover:text-[#24344D]"
                }`}
              >
                {display}
              </button>
            ))}
          </div>

          {/* Logo */}
          <div className="flex items-center gap-2">
            <Label icon={MdImage}>Logo:</Label>
            <label className="cursor-pointer bg-[#FBF8F1] hover:bg-[#EFE4C8] text-[#24344D] text-xs px-3 py-1.5 rounded-lg border border-[#D8CBA8] flex items-center gap-1.5 transition hover:border-[#B8933D]">
              <MdUpload className="w-3.5 h-3.5" />
              {logo ? "Alterar" : "Enviar"}
              <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
            </label>
            {logo && (
              <button
                onClick={handleRemoveLogo}
                className="text-[#8B2E3F] hover:text-[#6E2432] text-xs underline transition"
              >
                Remover
              </button>
            )}
          </div>

          {/* Marca d'água */}
          <div className="flex items-center gap-2">
            <Label icon={MdImage}>Marca:</Label>
            <label className="cursor-pointer bg-[#FBF8F1] hover:bg-[#EFE4C8] text-[#24344D] text-xs px-3 py-1.5 rounded-lg border border-[#D8CBA8] flex items-center gap-1.5 transition hover:border-[#B8933D]">
              <MdUpload className="w-3.5 h-3.5" />
              {watermarkSrc ? "Alterar" : "Enviar"}
              <input type="file" accept="image/*" onChange={handleWatermarkUpload} className="hidden" />
            </label>
            {watermarkSrc && (
              <>
                <button
                  onClick={handleRemoveWatermark}
                  className="text-[#8B2E3F] hover:text-[#6E2432] text-xs underline transition"
                >
                  Remover
                </button>
                <div className="flex items-center gap-1">
                  <span className="text-[8px] text-[#8B6A1F] uppercase tracking-wide">Opacidade:</span>
                  <input
                    type="range"
                    min="0.01"
                    max="0.1"
                    step="0.01"
                    value={watermarkOpacity}
                    onChange={(e) => setWatermarkOpacity(parseFloat(e.target.value))}
                    className="w-16 h-1 accent-[#B8933D]"
                  />
                </div>
              </>
            )}
          </div>

          {/* Capa */}
          <div className="flex items-center gap-3 border-l border-[#D8CBA8] pl-4">
            <Label>Capa:</Label>
            <input
              type="text"
              value={capaNome}
              onChange={(e) => setCapaNome(e.target.value)}
              placeholder="Nome da capa"
              className={`${inputCls} w-28`}
            />
            <input
              type="text"
              value={capaFrase}
              onChange={(e) => setCapaFrase(e.target.value)}
              placeholder="Frase da capa"
              className={`${inputCls} w-28`}
            />
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
      </div>
    </div>
  );
}
