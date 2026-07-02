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
  );

  const opcoesDeTemas = Object.entries(TEMAS).map(([id, { nome }]) => ({ id, nome }));

  const onFooterTypeChange = (type, label, icon) => {
    setFooterType(type);
    toast(`${label} selecionado`, { icon });
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm border-b border-gray-200/80 px-6 py-5 print:hidden shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-col gap-5">
        {/* Linha 1: Modelo, Data e Perfil */}
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Modelo:
            </span>
            <TemplateSelector selected={template} onSelect={setTemplate} compact />
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Data Base:
            </span>
            <input
              type={inputType}
              min={inputType === "number" ? 2020 : undefined}
              max={inputType === "number" ? 2035 : undefined}
              value={inputValue}
              onChange={(e) => handleDateChange(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-1.5 text-xs bg-white font-medium focus:ring-2 focus:ring-gray-300 focus:outline-none transition w-28"
            />
          </div>

          <div className="flex items-center gap-2 border-l border-gray-200 pl-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 whitespace-nowrap">
              Perfil:
            </span>
            <BusinessProfileSelector
              selected={businessProfileId || "default"}
              onSelect={setBusinessProfile}
              compact
            />
          </div>
        </div>

        {/* Linha 2: Temas, Cores, Fonte, Rodapé, Logo, Marca d'água, Capa */}
        <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-gray-100/80">
          {/* Temas */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 whitespace-nowrap">
              Layout:
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {opcoesDeTemas.map(({ id, nome }) => (
                <button
                  key={id}
                  onClick={() => applyThemeColors(id)}
                  className={`px-3 py-1 text-[11px] rounded-full border transition-all ${
                    colorTheme === id
                      ? "bg-gray-900 text-white border-gray-900 shadow-sm"
                      : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                  }`}
                >
                  {nome}
                </button>
              ))}
            </div>
          </div>

          {/* Cores */}
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1">
              <MdColorLens className="w-3.5 h-3.5" />
              Cores:
            </span>
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
                  className="w-7 h-7 p-0 border-2 border-gray-200 rounded-full cursor-pointer hover:border-gray-400 transition"
                  title={title}
                />
              ))}
            </div>
          </div>

          {/* Fonte */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1">
              <MdFontDownload className="w-3.5 h-3.5" />
              Fonte:
            </span>
            <select
              value={fontFamily}
              onChange={(e) => setFontFamily(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-1 text-xs bg-white focus:ring-2 focus:ring-gray-300 focus:outline-none transition"
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
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 whitespace-nowrap">
              Rodapé:
            </span>
            {[
              { type: "default", label: "Rodapé padrão", icon: "📄", display: "Padrão" },
              { type: "biblical", label: "Rodapé bíblico", icon: "📖", display: "Bíblico" },
            ].map(({ type, label, icon, display }) => (
              <button
                key={type}
                onClick={() => onFooterTypeChange(type, label, icon)}
                className={`px-3 py-1 text-[11px] rounded-full border transition-all ${
                  footerType === type
                    ? "bg-gray-900 text-white border-gray-900"
                    : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                }`}
              >
                {display}
              </button>
            ))}
          </div>

          {/* Logo */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1">
              <MdImage className="w-3.5 h-3.5" />
              Logo:
            </span>
            <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs px-3 py-1.5 rounded-lg border border-gray-200 flex items-center gap-1.5 transition hover:border-gray-400">
              <MdUpload className="w-3.5 h-3.5" />
              {logo ? "Alterar" : "Enviar"}
              <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
            </label>
            {logo && (
              <button
                onClick={handleRemoveLogo}
                className="text-red-400 hover:text-red-600 text-xs underline transition"
              >
                Remover
              </button>
            )}
          </div>

          {/* Marca d'água */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1">
              <MdImage className="w-3.5 h-3.5" />
              Marca:
            </span>
            <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs px-3 py-1.5 rounded-lg border border-gray-200 flex items-center gap-1.5 transition hover:border-gray-400">
              <MdUpload className="w-3.5 h-3.5" />
              {watermarkSrc ? "Alterar" : "Enviar"}
              <input type="file" accept="image/*" onChange={handleWatermarkUpload} className="hidden" />
            </label>
            {watermarkSrc && (
              <>
                <button
                  onClick={handleRemoveWatermark}
                  className="text-red-400 hover:text-red-600 text-xs underline transition"
                >
                  Remover
                </button>
                <div className="flex items-center gap-1">
                  <span className="text-[8px] text-gray-400">Opacidade:</span>
                  <input
                    type="range"
                    min="0.01"
                    max="0.1"
                    step="0.01"
                    value={watermarkOpacity}
                    onChange={(e) => setWatermarkOpacity(parseFloat(e.target.value))}
                    className="w-16 h-1 accent-gray-600"
                  />
                </div>
              </>
            )}
          </div>

          {/* Capa */}
          <div className="flex items-center gap-3 border-l border-gray-200 pl-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Capa:
            </span>
            <input
              type="text"
              value={capaNome}
              onChange={(e) => setCapaNome(e.target.value)}
              placeholder="Nome da capa"
              className="border border-gray-300 rounded-lg px-2 py-1 text-xs w-28 bg-white focus:ring-2 focus:ring-gray-300 focus:outline-none"
            />
            <input
              type="text"
              value={capaFrase}
              onChange={(e) => setCapaFrase(e.target.value)}
              placeholder="Frase da capa"
              className="border border-gray-300 rounded-lg px-2 py-1 text-xs w-28 bg-white"
            />
            <select
              value={capaEstilo}
              onChange={(e) => setCapaEstilo(e.target.value)}
              className="border border-gray-300 rounded-lg px-2 py-1 text-xs bg-white focus:ring-2 focus:ring-gray-300 focus:outline-none"
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
