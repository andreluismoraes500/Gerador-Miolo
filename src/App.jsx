import { useState, useCallback } from "react";
import {
  MdPrint,
  MdTune,
  MdUpload,
  MdColorLens,
  MdFontDownload,
  MdImage,
} from "react-icons/md";
import { Toaster, toast } from "react-hot-toast";
import TemplateSelector from "./components/TemplateSelector";
import AgendaPreview from "./components/AgendaPreview";
import PaymentPanel from "./components/PaymentPanel";
import { TEMAS } from "./themes";
import {
  AgendaConfigProvider,
  useAgendaConfig,
} from "./context/AgendaConfigContext";
import { AgendaDataProvider } from "./context/AgendaDataContext";
import { usePersistedState } from "./hooks/usePersistedState";
import "./styles/print.css";

function formatLocalDate(year, month, day) {
  const pad = (n) => String(n).padStart(2, "0");
  return `${year}-${pad(month + 1)}-${pad(day)}`;
}

function AppContent() {
  const hoje = new Date();
  const [template, setTemplate] = usePersistedState(
    "agenda-template",
    "diario",
  );
  const [paid, setPaid] = usePersistedState("agenda-paid", false);
  const [customName, setCustomName] = usePersistedState(
    "agenda-customName",
    "",
  );
  const [selectedDate, setSelectedDate] = usePersistedState(
    "agenda-selectedDate",
    formatLocalDate(hoje.getFullYear(), hoje.getMonth(), hoje.getDate()),
  );
  const [colorTheme, setColorTheme] = usePersistedState(
    "agenda-colorTheme",
    "classico",
  );
  const [footerType, setFooterType] = usePersistedState(
    "agenda-footerType",
    "default",
  );

  // Novos estados
  const [primaryColor, setPrimaryColor] = usePersistedState(
    "agenda-primaryColor",
    "#1e293b",
  );
  const [secondaryColor, setSecondaryColor] = usePersistedState(
    "agenda-secondaryColor",
    "#94a3b8",
  );
  const [bgColor, setBgColor] = usePersistedState("agenda-bgColor", "#f8fafc");
  const [fontFamily, setFontFamily] = usePersistedState(
    "agenda-fontFamily",
    "sans-serif",
  );
  const [watermarkSrc, setWatermarkSrc] = usePersistedState(
    "agenda-watermarkSrc",
    null,
  );
  const [watermarkOpacity, setWatermarkOpacity] = usePersistedState(
    "agenda-watermarkOpacity",
    0.03,
  );

  const [printing, setPrinting] = useState(false);
  const [showConfig, setShowConfig] = useState(true);

  const { logo, setLogo } = useAgendaConfig();
  const [persistedLogo, setPersistedLogo] = usePersistedState(
    "agenda-logo",
    null,
  );
  if (!logo && persistedLogo) {
    setLogo(persistedLogo);
  }

  const handlePrint = () => {
    setPrinting(true);
    setTimeout(() => {
      window.print();
      setPrinting(false);
    }, 250);
  };

  const handleDateChange = useCallback(
    (value) => {
      // Templates que usam mês (completo)
      const monthBasedTemplates = ["mensalCompleto", "plannerMensal"];
      if (monthBasedTemplates.includes(template)) {
        const [year, month] = value.split("-");
        setSelectedDate(
          formatLocalDate(parseInt(year, 10), parseInt(month, 10) - 1, 1),
        );
      } else if (template === "anualCompleto" || template === "calendarios") {
        const year = parseInt(value, 10);
        if (!isNaN(year)) setSelectedDate(formatLocalDate(year, 0, 1));
      } else {
        setSelectedDate(value); // date
      }
    },
    [template, setSelectedDate],
  );

  const [currentYear, currentMonth] = selectedDate.split("-").map(Number);
  const footerName = paid ? customName : "Lucas Cassiano de Moraes";

  const handleLogoUpload = useCallback(
    (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result;
        setLogo(result);
        setPersistedLogo(result);
        toast.success("Logo enviado com sucesso!");
      };
      reader.readAsDataURL(file);
    },
    [setLogo, setPersistedLogo],
  );

  const handleRemoveLogo = () => {
    setLogo(null);
    setPersistedLogo(null);
    toast("Logo removido", { icon: "🗑️" });
  };

  const handleWatermarkUpload = useCallback(
    (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onloadend = () => {
        setWatermarkSrc(reader.result);
        toast.success("Marca d'água enviada!");
      };
      reader.readAsDataURL(file);
    },
    [setWatermarkSrc],
  );

  const handleRemoveWatermark = () => {
    setWatermarkSrc(null);
    toast("Marca d'água removida", { icon: "🗑️" });
  };

  const opcoesDeTemas = Object.entries(TEMAS).map(([id, { nome }]) => ({
    id,
    nome,
  }));

  const fontOptions = [
    { value: "sans-serif", label: "Sans-serif" },
    { value: "serif", label: "Serif" },
    { value: "monospace", label: "Monospace" },
    { value: "cursive", label: "Cursive" },
    { value: "Inter", label: "Inter" },
    { value: "Cormorant Garamond", label: "Cormorant" },
  ];

  const customColors = {
    primary: primaryColor,
    secondary: secondaryColor,
    background: bgColor,
  };

  // Determina o tipo de input de data
  const getDateInputType = () => {
    if (template === "anualCompleto" || template === "calendarios") {
      return "number";
    }
    if (template === "mensalCompleto" || template === "plannerMensal") {
      return "month";
    }
    return "date";
  };

  const getDateInputValue = () => {
    if (template === "anualCompleto" || template === "calendarios") {
      return currentYear;
    }
    if (template === "mensalCompleto" || template === "plannerMensal") {
      return `${currentYear}-${String(currentMonth).padStart(2, "0")}`;
    }
    return selectedDate;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col font-sans text-gray-900">
      <Toaster position="bottom-right" />
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200/80 py-3 px-6 flex items-center justify-between print:hidden shadow-sm">
        <div className="flex items-center gap-3">
          <h1 className="text-sm font-bold uppercase tracking-widest text-gray-800">
            Miolos de Agenda
          </h1>
          <span className="text-[9px] bg-gray-100 px-2 py-0.5 font-mono text-gray-500 rounded-full">
            v2.0
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowConfig(!showConfig)}
            className="text-gray-500 hover:text-gray-800 p-2 rounded-lg hover:bg-gray-100/80 transition-all"
            title="Configurar Parâmetros"
          >
            <MdTune className="w-5 h-5" />
          </button>
          <button
            onClick={handlePrint}
            className="bg-gray-900 hover:bg-gray-800 text-white text-xs font-semibold py-2 px-5 rounded-lg flex items-center gap-2 transition-all shadow-md hover:shadow-lg"
          >
            <MdPrint className="w-4 h-4" />
            Gerar Impressão / PDF
          </button>
        </div>
      </header>

      {showConfig && (
        <div className="bg-white/90 backdrop-blur-sm border-b border-gray-200/80 px-6 py-5 print:hidden shadow-sm">
          <div className="max-w-7xl mx-auto flex flex-col gap-5">
            {/* Linha 1: Modelo e Data */}
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  Modelo:
                </span>
                <TemplateSelector
                  selected={template}
                  onSelect={setTemplate}
                  compact
                />
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  Data Base:
                </span>
                {getDateInputType() === "number" ? (
                  <input
                    type="number"
                    min="2020"
                    max="2035"
                    value={getDateInputValue()}
                    onChange={(e) => handleDateChange(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-1.5 text-xs w-28 bg-white font-medium focus:ring-2 focus:ring-gray-300 focus:outline-none transition"
                  />
                ) : getDateInputType() === "month" ? (
                  <input
                    type="month"
                    value={getDateInputValue()}
                    onChange={(e) => handleDateChange(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-1.5 text-xs bg-white font-medium focus:ring-2 focus:ring-gray-300 focus:outline-none transition"
                  />
                ) : (
                  <input
                    type="date"
                    value={getDateInputValue()}
                    onChange={(e) => handleDateChange(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-1.5 text-xs bg-white font-medium focus:ring-2 focus:ring-gray-300 focus:outline-none transition"
                  />
                )}
              </div>
            </div>

            {/* Linha 2: Temas, Cores, Fonte, Rodapé, Logo, Marca d'água */}
            <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-gray-100/80">
              {/* Temas predefinidos */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 whitespace-nowrap">
                  Layout:
                </span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {opcoesDeTemas.map(({ id, nome }) => (
                    <button
                      key={id}
                      onClick={() => setColorTheme(id)}
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

              {/* Cores personalizadas */}
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1">
                  <MdColorLens className="w-3.5 h-3.5" />
                  Cores:
                </span>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-7 h-7 p-0 border-2 border-gray-200 rounded-full cursor-pointer hover:border-gray-400 transition"
                    title="Cor primária"
                  />
                  <input
                    type="color"
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    className="w-7 h-7 p-0 border-2 border-gray-200 rounded-full cursor-pointer hover:border-gray-400 transition"
                    title="Cor secundária"
                  />
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-7 h-7 p-0 border-2 border-gray-200 rounded-full cursor-pointer hover:border-gray-400 transition"
                    title="Cor de fundo"
                  />
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
                >
                  {fontOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
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
                <button
                  onClick={() => {
                    setFooterType("default");
                    toast("Rodapé padrão selecionado", { icon: "📄" });
                  }}
                  className={`px-3 py-1 text-[11px] rounded-full border transition-all ${
                    footerType === "default"
                      ? "bg-gray-900 text-white border-gray-900"
                      : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  Padrão
                </button>
                <button
                  onClick={() => {
                    setFooterType("biblical");
                    toast("Rodapé bíblico selecionado", { icon: "📖" });
                  }}
                  className={`px-3 py-1 text-[11px] rounded-full border transition-all ${
                    footerType === "biblical"
                      ? "bg-gray-900 text-white border-gray-900"
                      : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  Bíblico
                </button>
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
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
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
                      className="text-red-400 hover:text-red-600 text-xs underline transition"
                    >
                      Remover
                    </button>
                    <div className="flex items-center gap-1">
                      <span className="text-[8px] text-gray-400">
                        Opacidade:
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
                        className="w-16 h-1 accent-gray-600"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <main className="flex-1 p-6 flex justify-center items-start overflow-y-auto print:p-0 print:overflow-visible">
        <AgendaPreview
          key={`${template}-${selectedDate}-${colorTheme}-${logo}-${footerType}-${primaryColor}-${secondaryColor}-${bgColor}-${fontFamily}-${watermarkSrc}-${watermarkOpacity}`}
          template={template}
          customName={footerName}
          paid={paid}
          selectedDate={selectedDate}
          printing={printing}
          colorTheme={colorTheme}
          logo={logo}
          footerType={footerType}
          customColors={customColors}
          fontFamily={fontFamily}
          watermarkSrc={watermarkSrc}
          watermarkOpacity={watermarkOpacity}
        />
      </main>

      <PaymentPanel
        paid={paid}
        customName={customName}
        onPayment={setPaid}
        onNameChange={setCustomName}
      />
    </div>
  );
}

export default function App() {
  return (
    <AgendaConfigProvider>
      <AgendaDataProvider>
        <AppContent />
      </AgendaDataProvider>
    </AgendaConfigProvider>
  );
}
