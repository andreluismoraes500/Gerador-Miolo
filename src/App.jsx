// src/App.jsx

import { MdPrint, MdTune } from "react-icons/md";
import { Toaster } from "react-hot-toast";
import AgendaPreview from "./components/AgendaPreview";
import PaymentPanel from "./components/PaymentPanel";
import ConfigBar from "./components/ConfigBar";
import { AgendaConfigProvider, useAgendaConfig } from "./context/AgendaConfigContext";
import { AgendaDataProvider } from "./context/AgendaDataContext";
import { BusinessProfileProvider } from "./context/BusinessProfileContext";
import { useAgendaSettings } from "./hooks/useAgendaSettings";
import "./styles/print.css";

function AppContent() {
  // Configurações de aparência vivem no contexto
  const config = useAgendaConfig();

  // Configurações de sessão/template/perfil vivem no hook
  const settings = useAgendaSettings();

  const {
    template, setTemplate,
    selectedDate, setSelectedDate,
    paid, setPaid,
    customName, setCustomName,
    footerName, clearFooterName,
    printing,
    showConfig, setShowConfig,
    handlePrint,
    handleLogoUpload, handleRemoveLogo,
    handleWatermarkUpload, handleRemoveWatermark,
    applyThemeColors,
    businessProfile, businessProfileId, setBusinessProfile,
  } = settings;

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 flex flex-col font-sans text-gray-900">
      <Toaster position="bottom-right" />

      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200/80 py-3 px-6 flex items-center justify-between print:hidden shadow-sm">
        <div className="flex items-center gap-3">
          <h1 className="text-sm font-bold uppercase tracking-widest text-gray-800">
            Miolos de Agenda
          </h1>
          <span className="text-[9px] bg-gray-100 px-2 py-0.5 font-mono text-gray-500 rounded-full">
            vBeta
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
        <ConfigBar
          template={template}
          setTemplate={setTemplate}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          applyThemeColors={applyThemeColors}
          handleLogoUpload={handleLogoUpload}
          handleRemoveLogo={handleRemoveLogo}
          handleWatermarkUpload={handleWatermarkUpload}
          handleRemoveWatermark={handleRemoveWatermark}
          businessProfileId={businessProfileId}
          setBusinessProfile={setBusinessProfile}
        />
      )}

      <main className="flex-1 p-6 flex justify-center items-start overflow-y-auto print:p-0 print:overflow-visible">
        <AgendaPreview
          template={template}
          customName={footerName}
          paid={paid}
          selectedDate={selectedDate}
          printing={printing}
          businessProfile={businessProfile}
          businessProfileId={businessProfileId}
        />
      </main>

      <PaymentPanel
        paid={paid}
        customName={customName}
        onPayment={setPaid}
        onNameChange={setCustomName}
        onClearName={clearFooterName}
      />
    </div>
  );
}

export default function App() {
  return (
    <AgendaConfigProvider>
      <AgendaDataProvider>
        <BusinessProfileProvider initialProfileId="default">
          <AppContent />
        </BusinessProfileProvider>
      </AgendaDataProvider>
    </AgendaConfigProvider>
  );
}
