// src/App.jsx

import { MdPrint, MdTune, MdAutoStories, MdDescription } from "react-icons/md";
import { Toaster } from "react-hot-toast";
import AgendaPreview from "./components/AgendaPreview";
import AgendaBuilderPreview from "./components/AgendaBuilderPreview";
import BuilderPanel from "./components/BuilderPanel";
import PaymentPanel from "./components/PaymentPanel";
import ConfigBar from "./components/ConfigBar";
import {
  AgendaConfigProvider,
  useAgendaConfig,
} from "./context/AgendaConfigContext";
import { AgendaDataProvider } from "./context/AgendaDataContext";
import { BusinessProfileProvider } from "./context/BusinessProfileContext";
import { useAgendaSettings } from "./hooks/useAgendaSettings";
import { useAgendaBuilder } from "./hooks/useAgendaBuilder";
import "./styles/print.css";

function AppContent() {
  // Configurações de aparência vivem no contexto
  const config = useAgendaConfig();

  // Configurações de sessão/template/perfil vivem no hook
  const settings = useAgendaSettings();

  // Modo Montagem: empilhar vários templates em um único miolo
  const builder = useAgendaBuilder();

  const {
    template,
    setTemplate,
    selectedDate,
    setSelectedDate,
    paid,
    setPaid,
    customName,
    setCustomName,
    footerName,
    clearFooterName,
    printing,
    showConfig,
    setShowConfig,
    handlePrint,
    handleLogoUpload,
    handleRemoveLogo,
    handleWatermarkUpload,
    handleRemoveWatermark,
    applyThemeColors,
    businessProfile,
    businessProfileId,
    setBusinessProfile,
  } = settings;

  return (
    <div className="min-h-screen bg-[#F6F1E7] bg-[radial-gradient(circle_at_top,#FBF8F1_0%,#F1EADB_55%,#EAE1CD_100%)] flex flex-col font-sans text-[#2B2A28]">
      <Toaster position="bottom-right" />

      <header className="relative bg-[#FBF8F1]/90 backdrop-blur-sm border-b border-[#D8CBA8] py-3.5 px-6 flex items-center justify-between print:hidden shadow-[0_1px_0_0_rgba(184,147,61,0.35)]">
        <div className="flex items-center gap-3.5">
          <div className="relative flex items-center justify-center w-9 h-9 rounded-md bg-[#24344D] shadow-[2px_2px_0_0_#B8933D] shrink-0">
            <span
              className="text-[#F6F1E7] text-base leading-none"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              M
            </span>
          </div>
          <div className="flex items-baseline gap-2.5">
            <h1
              className="text-xl font-semibold tracking-tight text-[#24344D]"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Miolos de Agenda
            </h1>
            <span className="text-[9px] uppercase tracking-[0.15em] bg-[#EFE4C8] text-[#8B6A1F] px-2 py-0.5 font-semibold rounded-full border border-[#DEC98B]">
              Beta
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-lg border border-[#D8CBA8] overflow-hidden mr-1">
            <button
              onClick={() => builder.setBuilderMode(false)}
              className={`px-3 py-2 text-xs font-semibold flex items-center gap-1.5 transition-all ${
                !builder.builderMode
                  ? "bg-[#24344D] text-[#F6F1E7]"
                  : "bg-transparent text-[#6B6458] hover:bg-[#EFE7D8]"
              }`}
              title="Modelo único"
            >
              <MdDescription className="w-4 h-4" />
              Único
            </button>
            <button
              onClick={() => builder.setBuilderMode(true)}
              className={`px-3 py-2 text-xs font-semibold flex items-center gap-1.5 transition-all border-l border-[#D8CBA8] ${
                builder.builderMode
                  ? "bg-[#24344D] text-[#F6F1E7]"
                  : "bg-transparent text-[#6B6458] hover:bg-[#EFE7D8]"
              }`}
              title="Montagem completa"
            >
              <MdAutoStories className="w-4 h-4" />
              Montagem
            </button>
          </div>
          <button
            onClick={() => setShowConfig(!showConfig)}
            className={`p-2.5 rounded-lg transition-all border ${
              showConfig
                ? "bg-[#24344D] text-[#F6F1E7] border-[#24344D] shadow-sm"
                : "text-[#6B6458] border-transparent hover:text-[#24344D] hover:bg-[#EFE7D8] hover:border-[#D8CBA8]"
            }`}
            title="Configurar Parâmetros"
          >
            <MdTune className="w-5 h-5" />
          </button>
          <button
            onClick={handlePrint}
            className="relative bg-[#8B2E3F] hover:bg-[#7A2837] text-[#FBF8F1] text-xs font-semibold py-2.5 px-5 rounded-lg flex items-center gap-2 transition-all shadow-[0_2px_0_0_#5E1F2B] hover:shadow-[0_1px_0_0_#5E1F2B] hover:translate-y-px active:translate-y-0.5 active:shadow-none"
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
          builderMode={builder.builderMode}
        />
      )}

      {showConfig && builder.builderMode && <BuilderPanel builder={builder} />}

      <main className="flex-1 p-8 flex justify-center items-start overflow-y-auto print:p-0 print:overflow-visible">
        {builder.builderMode ? (
          <AgendaBuilderPreview
            modules={builder.modules}
            customName={footerName}
            selectedDate={selectedDate}
            printing={printing}
            businessProfile={businessProfile}
            businessProfileId={businessProfileId}
          />
        ) : (
          <AgendaPreview
            template={template}
            customName={footerName}
            paid={paid}
            selectedDate={selectedDate}
            printing={printing}
            businessProfile={businessProfile}
            businessProfileId={businessProfileId}
          />
        )}
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
