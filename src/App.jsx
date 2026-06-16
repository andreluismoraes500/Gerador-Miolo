import { useState } from "react";
import { MdPrint, MdTune, MdUpload } from "react-icons/md";
import TemplateSelector from "./components/TemplateSelector";
import AgendaPreview from "./components/AgendaPreview";
import PaymentPanel from "./components/PaymentPanel";
import { TEMAS } from "./themes";
import {
  AgendaConfigProvider,
  useAgendaConfig,
} from "./context/AgendaConfigContext";
import "./styles/print.css";

function formatLocalDate(year, month, day) {
  const pad = (n) => String(n).padStart(2, "0");
  return `${year}-${pad(month + 1)}-${pad(day)}`;
}

function AppContent() {
  const hoje = new Date();
  const [template, setTemplate] = useState("diario");
  const [paid, setPaid] = useState(false);
  const [customName, setCustomName] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    formatLocalDate(hoje.getFullYear(), hoje.getMonth(), hoje.getDate()),
  );
  const [printing, setPrinting] = useState(false);
  const [showConfig, setShowConfig] = useState(true);
  const [colorTheme, setColorTheme] = useState("classico");
  const [footerType, setFooterType] = useState("default");

  const { logo, setLogo } = useAgendaConfig();

  // Log para monitorar mudanças no footerType
  console.log("🔵 App: footerType =", footerType);

  const handlePrint = () => {
    setPrinting(true);
    setTimeout(() => {
      window.print();
      setPrinting(false);
    }, 250);
  };

  const handleDateChange = (value) => {
    if (template === "mensalCompleto") {
      const [year, month] = value.split("-");
      setSelectedDate(
        formatLocalDate(parseInt(year, 10), parseInt(month, 10) - 1, 1),
      );
    } else if (template === "anualCompleto" || template === "calendarios") {
      const year = parseInt(value, 10);
      if (!isNaN(year)) setSelectedDate(formatLocalDate(year, 0, 1));
    } else {
      setSelectedDate(value);
    }
  };

  const [currentYear, currentMonth] = selectedDate.split("-").map(Number);
  const footerName = paid ? customName : "Lucas Cassiano de Moraes";

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setLogo(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const opcoesDeTemas = Object.entries(TEMAS).map(([id, { nome }]) => ({
    id,
    nome,
  }));

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
      <header className="bg-white border-b border-gray-200 py-3 px-6 flex items-center justify-between print:hidden">
        <div className="flex items-center gap-2">
          <h1 className="text-xs font-bold uppercase tracking-widest text-black">
            Miolos de Agenda
          </h1>
          <span className="text-[9px] bg-gray-100 px-1.5 py-0.5 font-mono text-gray-500 rounded">
            v2.0
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowConfig(!showConfig)}
            className="text-gray-500 hover:text-black p-2 rounded-md hover:bg-gray-50 transition"
            title="Configurar Parâmetros"
          >
            <MdTune className="w-4 h-4" />
          </button>
          <button
            onClick={handlePrint}
            className="bg-black hover:bg-gray-900 text-white text-xs font-semibold py-1.5 px-4 rounded-md flex items-center gap-2 transition"
          >
            <MdPrint className="w-4 h-4" />
            Gerar Impressão / PDF
          </button>
        </div>
      </header>

      {showConfig && (
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex flex-col gap-4 print:hidden">
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                Modelo:
              </label>
              <TemplateSelector
                selected={template}
                onSelect={setTemplate}
                compact
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                Data Base:
              </label>
              {template === "anualCompleto" || template === "calendarios" ? (
                <input
                  type="number"
                  min="2020"
                  max="2035"
                  value={currentYear}
                  onChange={(e) => handleDateChange(e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1 text-xs w-24 bg-white font-medium"
                />
              ) : template === "mensalCompleto" ? (
                <input
                  type="month"
                  value={`${currentYear}-${String(currentMonth).padStart(2, "0")}`}
                  onChange={(e) => handleDateChange(e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1 text-xs bg-white font-medium"
                />
              ) : (
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => handleDateChange(e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1 text-xs bg-white font-medium"
                />
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 border-t border-gray-100 pt-3">
            {/* Temas */}
            <div className="flex items-center gap-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 whitespace-nowrap">
                Layout Visual:
              </label>
              <div className="flex items-center gap-2 flex-wrap">
                {opcoesDeTemas.map(({ id, nome }) => (
                  <button
                    key={id}
                    onClick={() => setColorTheme(id)}
                    className={`px-3 py-1 text-xs rounded-full border transition ${
                      colorTheme === id
                        ? "bg-black text-white border-black"
                        : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {nome}
                  </button>
                ))}
              </div>
            </div>

            {/* Rodapé */}
            <div className="flex items-center gap-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 whitespace-nowrap">
                Rodapé:
              </label>
              <button
                onClick={() => {
                  console.log("🔄 Clicou em Padrão");
                  setFooterType("default");
                }}
                className={`px-3 py-1 text-xs rounded-full border transition ${
                  footerType === "default"
                    ? "bg-black text-white border-black"
                    : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                }`}
              >
                Padrão
              </button>
              <button
                onClick={() => {
                  console.log("🔄 Clicou em Bíblico");
                  setFooterType("biblical");
                }}
                className={`px-3 py-1 text-xs rounded-full border transition ${
                  footerType === "biblical"
                    ? "bg-black text-white border-black"
                    : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                }`}
              >
                Bíblico
              </button>
            </div>

            {/* Logo */}
            <div className="flex items-center gap-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                Logo:
              </label>
              <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs px-3 py-1 rounded border border-gray-300 flex items-center gap-1 transition">
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
                  onClick={() => setLogo(null)}
                  className="text-red-500 hover:text-red-700 text-xs underline"
                >
                  Remover
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <main className="flex-1 p-6 flex justify-center items-start overflow-y-auto print:p-0 print:overflow-visible">
        <AgendaPreview
          key={`${template}-${selectedDate}-${colorTheme}-${logo}-${footerType}`}
          template={template}
          customName={footerName}
          paid={paid}
          selectedDate={selectedDate}
          printing={printing}
          colorTheme={colorTheme}
          logo={logo}
          footerType={footerType}
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
      <AppContent />
    </AgendaConfigProvider>
  );
}
