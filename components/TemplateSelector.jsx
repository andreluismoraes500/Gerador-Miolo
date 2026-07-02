import { TEMPLATES } from "../templates";

export default function TemplateSelector({
  selected,
  onSelect,
  compact = false,
}) {
  return (
    <div
      className={`flex gap-1.5 flex-wrap ${compact ? "text-sm" : "mb-6 justify-center"}`}
    >
      {Object.entries(TEMPLATES).map(([key, t]) => (
        <button
          key={key}
          onClick={() => onSelect(key)}
          className={`template-btn font-semibold tracking-wide transition-all ${
            compact ? "px-3 py-1 text-[11px] rounded" : "px-4 py-2 rounded-lg"
          } ${
            selected === key
              ? "bg-black text-white shadow-sm"
              : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
          }`}
        >
          {t.nome}
        </button>
      ))}
    </div>
  );
}
