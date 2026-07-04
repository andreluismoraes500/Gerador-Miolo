import { TEMPLATES } from "../templates";

export default function TemplateSelector({
  selected,
  onSelect,
  compact = false,
}) {
  return (
    <div
      className={`flex gap-1 flex-wrap items-end ${compact ? "text-sm" : "mb-6 justify-center"}`}
    >
      {Object.entries(TEMPLATES).map(([key, t]) => {
        const isActive = selected === key;
        return (
          <button
            key={key}
            onClick={() => onSelect(key)}
            className={`template-btn relative font-semibold tracking-wide transition-all rounded-t-md border border-b-0 ${
              compact ? "px-3 py-1.5 text-[11px]" : "px-4 py-2.5 rounded-t-lg"
            } ${
              isActive
                ? "bg-[#24344D] text-[#F6F1E7] border-[#24344D] -translate-y-0.5 shadow-[0_-2px_6px_rgba(36,52,77,0.25)] z-10"
                : "bg-[#F1EADB] text-[#6B6458] border-[#D8CBA8] hover:bg-[#EFE4C8] hover:text-[#24344D]"
            }`}
          >
            {t.nome}
            {isActive && (
              <span className="absolute left-0 right-0 -bottom-[1px] h-[2px] bg-[#24344D]" />
            )}
          </button>
        );
      })}
    </div>
  );
}
