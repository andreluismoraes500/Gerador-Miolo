// src/components/TemplateRenderer.jsx
import { TEMPLATES } from "../data/templates.jsx";

export default function TemplateRenderer({
  templateKey,
  customName,
  paid,
  selectedDate,
  printing,
  colorTheme = "classico",
}) {
  const template = TEMPLATES[templateKey];
  if (!template)
    return (
      <p className="p-4 text-center text-xs text-gray-400">
        Template inválido.
      </p>
    );

  const footerName = paid ? customName : "Lucas Cassiano de Moraes";

  return (
    <div className="w-full bg-white">
      {template.layout(footerName, selectedDate, printing, colorTheme)}
    </div>
  );
}
