import { TEMPLATES } from "../templates";

export default function AgendaPreview({
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

  // Passa explicitamente todos os parâmetros, incluindo footerType
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
}
