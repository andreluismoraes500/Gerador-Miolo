// src/components/AgendaPreview.jsx
//
// Componente de visualização pura: recebe apenas dados de conteúdo e delega
// aparência (cores, logo, fonte, etc.) ao contexto AgendaConfig.

import React, { useEffect, useState } from "react";
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

  // Cada template só é baixado (chunk separado) na primeira vez que é
  // selecionado — daí em diante fica em cache em memória (ver templates/index.js).
  const [currentTemplate, setCurrentTemplate] = useState(() => getCachedTemplate(template));

  useEffect(() => {
    let cancelled = false;
    // Se já está em cache, evita um "flash" de loading trocando na hora.
    const cached = getCachedTemplate(template);
    if (cached) {
      setCurrentTemplate(cached);
    } else {
      setCurrentTemplate(null);
      loadTemplate(template).then((def) => {
        if (!cancelled) setCurrentTemplate(def);
      });
    }
    return () => {
      cancelled = true;
    };
  }, [template]);

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
    <div className={`agenda-preview-container ${printing ? "is-printing" : ""}`}>
      {currentTemplate.layout(layoutProps)}
    </div>
  );
});

export default AgendaPreview;
