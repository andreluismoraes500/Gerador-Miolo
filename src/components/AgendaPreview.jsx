// src/components/AgendaPreview.jsx
//
// Componente de visualização pura: recebe apenas dados de conteúdo e delega
// aparência (cores, logo, fonte, etc.) ao contexto AgendaConfig.

import React from "react";
import { TEMPLATES } from "../templates";
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
    capaNome,
    capaEstilo,
    capaFrase,
    setCapaFrase,
  } = useAgendaConfig();

  const currentTemplate = TEMPLATES[template];
  if (!currentTemplate) {
    return (
      <div className="text-center p-8 text-red-500">
        Template não encontrado.
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
