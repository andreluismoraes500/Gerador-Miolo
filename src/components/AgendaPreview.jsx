import React from "react";
import { TEMPLATES } from "../templates";

const AgendaPreview = React.memo(function AgendaPreview({
  template,
  customName,
  paid,
  selectedDate,
  printing,
  colorTheme = "classico",
  logo,
  footerType = "default",
  customColors,
  fontFamily,
  watermarkSrc,
  watermarkOpacity,
}) {
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
    businessType: "manicure",
  };

  return (
    <div
      className={`agenda-preview-container ${printing ? "is-printing" : ""}`}
    >
      {currentTemplate.layout(layoutProps)}
    </div>
  );
});

export default AgendaPreview;
