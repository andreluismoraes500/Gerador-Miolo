import { useState } from "react";
import { MdPrint, MdTune } from "react-icons/md";
import TemplateSelector from "./components/TemplateSelector";
import AgendaPreview from "./components/AgendaPreview";
import PaymentPanel from "./components/PaymentPanel";
import "./styles/print.css";

function formatLocalDate(year, month, day) {
  const pad = (n) => String(n).padStart(2, "0");
  return `${year}-${pad(month + 1)}-${pad(day)}`;
}

export default function App() {
  const hoje = new Date();
  const [template, setTemplate] = useState("diario");
  const [paid, setPaid] = useState(false);
  const [customName, setCustomName] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    formatLocalDate(hoje.getFullYear(), hoje.getMonth(), hoje.getDate()),
  );
  const [printing, setPrinting] = useState(false);
  const [showConfig, setShowConfig] = useState(true);
  const [colorTheme, setColorTheme] = useState("slate");

  const opcoesDeCores = [
    { id: "slate", nome: "Grafite Clássico", classeBg: "bg-slate-500" },
    { id: "zinc", nome: "Cinza Moderno", classeBg: "bg-zinc-500" },
    { id: "blue", nome: "Azul Soft", classeBg: "bg-blue-500" },
    { id: "emerald", nome: "Verde Esmeralda", classeBg: "bg-emerald-500" },
    { id: "amber", nome: "Âmbar Dourado", classeBg: "bg-amber-500" },
    { id: "rose", nome: "Rosa Minimalista", classeBg: "bg-rose-500" },
  ];

  const handlePrint = () => {
    setPrinting(true);
    setTimeout(() => {
      window.print();
      setPrinting(false);
    }, 250);
  };

  // Função handleDateChange ajustada
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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
      <header className="bg-white border-b border-gray-200 py-3 px-6 flex items-center justify-between print:hidden">
        <div className="flex items-center gap-2">
          <h1 className="text-xs font-bold uppercase tracking-widest text-black">
            Miolos de Agenda
          </h1>
          <span className="text-[9px] bg-gray-100 px-1.5 py-0.5 font-mono text-gray-500 rounded">
            v1.0
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

          <div className="flex items-center gap-3 border-t border-gray-100 pt-3">
            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 whitespace-nowrap">
              Cor do Miolo:
            </label>
            <div className="flex items-center gap-2">
              {opcoesDeCores.map((cor) => (
                <button
                  key={cor.id}
                  onClick={() => setColorTheme(cor.id)}
                  title={cor.nome}
                  className={`w-5 h-5 rounded-full ${cor.classeBg} transition-all border ${
                    colorTheme === cor.id
                      ? "ring-2 ring-black ring-offset-2 scale-110"
                      : "opacity-60 hover:opacity-100"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      <main className="flex-1 p-6 flex justify-center items-start overflow-y-auto print:p-0 print:overflow-visible">
        <AgendaPreview
          template={template}
          customName={footerName}
          paid={paid}
          selectedDate={selectedDate}
          printing={printing}
          colorTheme={colorTheme}
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
