// src/components/BusinessProfileSelector.jsx

import { useState } from "react";
import { getBusinessProfileOptions } from "../config/businessProfiles";

export default function BusinessProfileSelector({
  selected,
  onSelect,
  compact = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const options = getBusinessProfileOptions();

  const selectedProfile = options.find((opt) => opt.id === selected);

  if (compact) {
    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-1.5 text-xs bg-[#FBF8F1] border border-[#D8CBA8] rounded-lg hover:border-[#B8933D] transition"
        >
          <span>{selectedProfile?.label || "📋 Geral"}</span>
          <svg
            className="w-3 h-3 text-[#8B6A1F]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute z-50 mt-1 w-64 bg-[#FBF8F1] border border-[#D8CBA8] rounded-lg shadow-lg overflow-hidden">
            {options.map((opt) => (
              <button
                key={opt.id}
                onClick={() => {
                  onSelect(opt.id);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 text-xs hover:bg-[#EFE4C8] transition flex items-center gap-2 border-b border-[#EFE4C8] last:border-0 ${
                  selected === opt.id ? "bg-[#EFE4C8] font-medium" : ""
                }`}
              >
                <span className="text-lg">{opt.icon || "📋"}</span>
                <div>
                  <div className="font-medium text-[#2B2A28]">{opt.label}</div>
                  {opt.description && (
                    <div className="text-[10px] text-[#8B8172]">
                      {opt.description}
                    </div>
                  )}
                </div>
                {selected === opt.id && (
                  <svg
                    className="w-3 h-3 ml-auto text-[#B8933D]"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    />
                  </svg>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
      {options.map((opt) => (
        <button
          key={opt.id}
          onClick={() => onSelect(opt.id)}
          className={`
            p-4 rounded-xl border-2 text-left transition-all
            ${
              selected === opt.id
                ? "border-[#24344D] bg-[#EFE4C8]/60 shadow-md"
                : "border-[#D8CBA8] bg-[#FBF8F1] hover:border-[#B8933D] hover:bg-[#EFE4C8]/40"
            }
          `}
        >
          <div className="text-2xl mb-2">{opt.icon || "📋"}</div>
          <div className="font-medium text-sm text-[#2B2A28]">{opt.label}</div>
          <div className="text-xs text-[#8B8172] mt-0.5">{opt.description}</div>
        </button>
      ))}
    </div>
  );
}
