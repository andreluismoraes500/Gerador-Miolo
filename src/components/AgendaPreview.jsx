// src/components/AgendaPreview.jsx
//
// Componente de visualização pura: recebe apenas dados de conteúdo e delega
// aparência (cores, logo, fonte, etc.) ao contexto AgendaConfig.

import React, { useEffect, useState, useRef } from "react";
import { loadTemplate, getCachedTemplate } from "../templates";
import { useAgendaConfig } from "../context/AgendaConfigContext";
import { usePdfReadySignal } from "../hooks/usePdfReadySignal";

const AgendaPreview = React.memo(function AgendaPreview({
  template,
  customName,
  paid,
  selectedDate,
  printing,
  businessProfile,
  businessProfileId,
}) {
  const {
    colorTheme,
    logo,
    footerType,
    footerHidden,
    customColors,
    fontFamily,
    watermarkSrc,
    watermarkOpacity,
    backgroundSrc,
    backgroundOpacity,
    capaNome,
    capaEstilo,
    capaFrase,
    setCapaFrase,
  } = useAgendaConfig();

  const [currentTemplate, setCurrentTemplate] = useState(() =>
    getCachedTemplate(template),
  );
  const [loadError, setLoadError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    const cached = getCachedTemplate(template);
    if (cached) {
      setCurrentTemplate(cached);
      setLoadError(null);
    } else {
      setCurrentTemplate(null);
      setLoadError(null);
      loadTemplate(template)
        .then((def) => {
          if (!cancelled) setCurrentTemplate(def);
        })
        .catch((err) => {
          if (!cancelled) setLoadError(err);
        });
    }
    return () => {
      cancelled = true;
    };
  }, [template, retryCount]);

  // 🔥 SINAL DE PDF PRONTO: só é seguro observar o DOM depois que o
  // template já foi carregado (currentTemplate existe). O hook cuida de
  // esperar o DOM estabilizar antes de liberar window.__PDF_READY__.
  usePdfReadySignal(containerRef, {
    printing,
    ready: Boolean(printing && currentTemplate),
  });

  if (loadError) {
    return (
      <div className="agenda-preview-container flex flex-col items-center justify-center gap-2 py-24 text-xs text-[#8a8272] print:hidden">
        <p>Não foi possível carregar este modelo.</p>
        <button
          type="button"
          onClick={() => setRetryCount((n) => n + 1)}
          className="text-[#8B6A1F] font-semibold underline underline-offset-2 hover:text-[#6B4F10]"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  if (!currentTemplate) {
    return (
      <div className="agenda-preview-container flex items-center justify-center py-24 text-xs text-[#8a8272] print:hidden">
        Carregando modelo...
      </div>
    );
  }

  const layoutProps = {
    footerName: customName,
    selectedDate,
    printing,
    colorTheme,
    logo,
    footerType,
    footerHidden,
    customColors,
    fontFamily,
    watermarkSrc,
    watermarkOpacity,
    backgroundSrc,
    backgroundOpacity,
    businessType: businessProfileId || "default",
    businessProfile,
    capaNome,
    capaEstilo,
    capaFrase,
    setCapaFrase,
  };

  return (
    <div
      ref={containerRef}
      className={`agenda-preview-container ${printing ? "is-printing" : ""}`}
    >
      {currentTemplate.layout(layoutProps)}
    </div>
  );
});

export default AgendaPreview;