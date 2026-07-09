import { useEffect, useRef } from "react";
import { MdDescription, MdCheckCircle } from "react-icons/md";
import { TEMPLATES } from "../templates";
import { staggerIn, popHover } from "../utils/gsapAnimations";

// Paleta de acentos usada para dar variedade visual aos cards da galeria,
// escolhida de forma determinística a partir da chave do template (sem
// precisar cadastrar um ícone/cor por template manualmente).
const ACCENTS = [
  { bg: "#EFE4C8", fg: "#8B6A1F" },
  { bg: "#E4ECF3", fg: "#24344D" },
  { bg: "#F3E4E4", fg: "#8B2E3F" },
  { bg: "#E4F0E9", fg: "#1B5E3F" },
];

function accentFor(key) {
  let hash = 0;
  for (let i = 0; i < key.length; i += 1) hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
  return ACCENTS[hash % ACCENTS.length];
}

export default function TemplateSelector({
  selected,
  onSelect,
  compact = false,
  grid = false,
}) {
  const gridRef = useRef(null);

  useEffect(() => {
    if (!grid) return;
    const tween = staggerIn(gridRef.current?.children, { stagger: 0.03 });
    return () => tween?.kill();
    // Reanima sempre que a lista de templates muda de tamanho/ordem.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [grid]);

  if (grid) {
    return (
      <div ref={gridRef} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {Object.entries(TEMPLATES).map(([key, t]) => {
          const isActive = selected === key;
          const accent = accentFor(key);
          return (
            <button
              key={key}
              onClick={() => onSelect(key)}
              onMouseEnter={(e) => popHover(e.currentTarget, true)}
              onMouseLeave={(e) => popHover(e.currentTarget, false)}
              className={`group relative text-left p-4 rounded-2xl border transition-colors ${
                isActive
                  ? "border-[#24344D] bg-[#FBF8F1] shadow-[3px_3px_0_0_#24344D]"
                  : "border-[#D8CBA8] bg-[#FBF8F1]/80 hover:border-[#B8933D] hover:shadow-[2px_2px_0_0_#D8CBA8]"
              }`}
            >
              {isActive && (
                <MdCheckCircle className="absolute top-3 right-3 w-4 h-4 text-[#24344D]" />
              )}
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center mb-3 transition-colors"
                style={{ backgroundColor: accent.bg, color: accent.fg }}
              >
                <MdDescription className="w-4.5 h-4.5" />
              </div>
              <div className="text-xs font-semibold text-[#2B2A28] leading-snug">
                {t.nome}
              </div>
            </button>
          );
        })}
      </div>
    );
  }

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
