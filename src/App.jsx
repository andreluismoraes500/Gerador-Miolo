// src/App.jsx

import { useCallback } from "react";
import { MdPrint, MdTune, MdPictureAsPdf } from "react-icons/md";
import { Toaster } from "react-hot-toast";
import AgendaPreview from "./components/AgendaPreview";
import PaymentPanel from "./components/PaymentPanel";
import ConfigBar from "./components/ConfigBar";
import { AgendaConfigProvider, useAgendaConfig } from "./context/AgendaConfigContext";
import { AgendaDataProvider } from "./context/AgendaDataContext";
import { BusinessProfileProvider } from "./context/BusinessProfileContext";
import { useAgendaSettings } from "./hooks/useAgendaSettings";
import { usePdfExport } from "./hooks/usePdfExport";
import { gerarDiasDoMes, gerarDiasDoAno } from "./utils/agendaUtils";
import "./styles/print.css";

function AppContent() {
  // customColors já agrupa primary, secondary e background em sync
  const {
    primaryColor, secondaryColor, bgColor, customColors, footerType,
    logo, watermarkSrc, watermarkOpacity,
  } = useAgendaConfig();

  const settings = useAgendaSettings();
  const {
    template, setTemplate,
    selectedDate, setSelectedDate,
    paid, setPaid,
    customName, setCustomName,
    footerName, clearFooterName,
    printing, setPrinting,
    showConfig, setShowConfig,
    handlePrint,
    handleLogoUpload, handleRemoveLogo,
    handleWatermarkUpload, handleRemoveWatermark,
    applyThemeColors,
    businessProfile, businessProfileId, setBusinessProfile,
  } = settings;

  const getExportContext = useCallback(() => {
    const [y, m] = (selectedDate || "").split("-").map(Number);
    let dias = [];
    if (template === "mensalCompleto" && y && m) dias = gerarDiasDoMes(y, m - 1);
    else if (template === "anualCompleto" && y)  dias = gerarDiasDoAno(y);

    // Usa customColors.background como fonte primária (igual ao DiaCompleto.jsx)
    // para garantir que o bgColor está sempre em sync com o tema ativo
    const bg = customColors?.background || bgColor || "#ffffff";

    return {
      template,
      dias,
      primaryColor:   customColors?.primary   || primaryColor,
      secondaryColor: customColors?.secondary  || secondaryColor,
      bgColor:        bg,
      footerName,
      footerType,
      // perfilSlogan não é enviado: no preview/impressão ele usa a classe
      // `print:hidden` (ver Footer.jsx) e nunca aparece no PDF real, então o
      // export nativo também não deve desenhá-lo.
      perfilNome:   businessProfile?.nome   ?? "",
      perfilIcon:   businessProfile?.icon   ?? "",
      clienteLabel: businessProfile?.campos?.cliente ?? "Cliente",
      servicoLabel: businessProfile?.campos?.servico ?? "Compromisso",
      logo:              logo || null,
      watermarkSrc:      watermarkSrc || null,
      watermarkOpacity:  watermarkOpacity ?? 0.03,
    };
  }, [template, selectedDate, primaryColor, secondaryColor, bgColor,
      customColors, footerName, footerType, businessProfile,
      logo, watermarkSrc, watermarkOpacity]);

  const { exportToPdf, exporting } = usePdfExport(setPrinting, getExportContext);

  const getPdfFilename = () => {
    const date = selectedDate || new Date().toISOString().slice(0, 10);
    return `agenda-${template}-${date}.pdf`;
  };

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
          >
            <MdTune className="w-5 h-5" />
          </button>

          <button
            onClick={() => exportToPdf(getPdfFilename())}
            disabled={exporting}
            className="bg-rose-600 hover:bg-rose-700 disabled:bg-rose-300 disabled:cursor-not-allowed text-white text-xs font-semibold py-2 px-4 rounded-lg flex items-center gap-2 transition-all shadow-md hover:shadow-lg"
          >
            <MdPictureAsPdf className="w-4 h-4" />
            {exporting ? "Gerando..." : "Exportar PDF"}
          </button>

          <button
            onClick={handlePrint}
            className="bg-gray-900 hover:bg-gray-800 text-white text-xs font-semibold py-2 px-5 rounded-lg flex items-center gap-2 transition-all shadow-md hover:shadow-lg"
          >
            <MdPrint className="w-4 h-4" />
            Imprimir
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
