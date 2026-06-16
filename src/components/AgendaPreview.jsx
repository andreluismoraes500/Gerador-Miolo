import { TEMPLATES } from "../data/templates";

export default function AgendaPreview({
  template,
  customName,
  paid,
  selectedDate,
  printing,
  colorTheme = "classico",
  logo,
}) {
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
      )}
    </div>
  );
}
