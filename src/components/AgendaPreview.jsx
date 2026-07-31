// src/components/AgendaPreview.jsx
//
// Componente de visualização pura: recebe apenas dados de conteúdo e delega
// aparência (cores, logo, fonte, etc.) ao contexto AgendaConfig.

import React, { useEffect, useState, useRef } from "react";
import { loadTemplate, getCachedTemplate } from "../templates";
import { useAgendaConfig } from "../context/AgendaConfigContext";

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

  // ============================================================
  // 🔥 SINAL DE PDF PRONTO
  // Quando o modo de impressão estiver ativo e o template estiver carregado,
  // define window.__PDF_READY__ = true após a renderização.
  // ============================================================
  useEffect(() => {
    if (!printing) return;
    // Aguarda o próximo ciclo de renderização para garantir que o DOM foi atualizado
    const timer = setTimeout(() => {
      if (containerRef.current) {
        const pageBreaks = containerRef.current.querySelectorAll(".page-break");
        const count = pageBreaks.length;
        window.__PDF_READY__ = true;
        window.__PDF_PAGE_COUNT__ = count;
        console.log(`[AgendaPreview] PDF pronto: ${count} páginas`);
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [printing, template, currentTemplate]);

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
