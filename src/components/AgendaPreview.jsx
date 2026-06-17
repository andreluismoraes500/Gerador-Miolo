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
}) {
  console.log("🟢 AgendaPreview: footerType recebido =", footerType);

  const currentTemplate = TEMPLATES[template];
  if (!currentTemplate) {
    return (
      <div className="text-center p-8 text-red-500">
        Template não encontrado.
      </div>
    );
  }

  return (
    <div
      className={`agenda-preview-container ${printing ? "is-printing" : ""}`}
    >
      {currentTemplate.layout(
        customName,
        selectedDate,
        printing,
        colorTheme,
        logo,
        footerType,
      )}
    </div>
  );
});

export default AgendaPreview;
