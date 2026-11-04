import { useEffect, useMemo, useRef, useState } from "react";
import { MdDescription, MdCheckCircle, MdSearch } from "react-icons/md";
import {
  TEMPLATE_MANIFEST,
  TEMPLATE_CATEGORIAS,
  getTemplatesPorCategoria,
} from "../templates/manifest";
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
  const [busca, setBusca] = useState("");
  const [categoria, setCategoria] = useState("todas");

  const grupos = useMemo(
    () =>
      getTemplatesPorCategoria(busca).filter(
        (g) => categoria === "todas" || g.id === categoria,
      ),
    [busca, categoria],
  );

  useEffect(() => {
    if (!grid) return;
    const tween = staggerIn(gridRef.current?.querySelectorAll("[data-tpl]"), {
      stagger: 0.02,
    });
    return () => tween?.kill();
  }, [grid, categoria]);

  if (grid) {
    const chip = (ativo) =>
      `px-3 py-1.5 rounded-full text-xs font-semibold border transition ${
        ativo
          ? "bg-[#24344D] text-[#F6F1E7] border-[#24344D]"
          : "bg-[#FBF8F1] text-[#6B6458] border-[#D8CBA8] hover:border-[#B8933D] hover:text-[#24344D]"
      }`;
    return (
      <div ref={gridRef} className="flex flex-col gap-5">
        <div className="flex flex-col gap-3">
          <div className="relative">
            <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B6A1F]" />
            <input
              type="search"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar modelo (ex.: diário, hábitos, receitas)…"
              aria-label="Buscar modelo"
              className="w-full border border-[#D8CBA8] rounded-lg pl-9 pr-3 py-2 text-sm bg-[#FBF8F1] focus:ring-2 focus:ring-[#B8933D]/40 focus:border-[#B8933D] focus:outline-none transition"
            />
          </div>
          <div className="flex flex-wrap gap-2" role="tablist" aria-label="Categorias">
            <button
              role="tab"
              aria-selected={categoria === "todas"}
              onClick={() => setCategoria("todas")}
              className={chip(categoria === "todas")}
            >
              Todos
            </button>
            {TEMPLATE_CATEGORIAS.map((c) => (
              <button
                key={c.id}
                role="tab"
                aria-selected={categoria === c.id}
                onClick={() => setCategoria(c.id)}
                className={chip(categoria === c.id)}
              >
                {c.nome}
              </button>
            ))}
          </div>
        </div>

        {grupos.length === 0 && (
          <p className="text-sm text-[#6B6458] py-6 text-center">
            Nenhum modelo encontrado para “{busca}”.
          </p>
        )}

        {grupos.map((g) => (
          <section key={g.id} className="flex flex-col gap-3">
            <div className="flex items-baseline gap-2 border-b border-[#D8CBA8] pb-1.5">
              <h3 className="text-sm font-bold text-[#24344D]">{g.nome}</h3>
              <span className="text-[11px] text-[#8B6A1F]">{g.descricao}</span>
              <span className="ml-auto text-[10px] text-[#6B6458]">
                {g.itens.length} {g.itens.length === 1 ? "modelo" : "modelos"}
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {g.itens.map(({ key, nome }) => {
                const isActive = selected === key;
                const accent = accentFor(key);
                return (
                  <button
                    key={key}
                    data-tpl
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
                      {nome}
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    );
  }

  return (
    <div
      className={`flex gap-1 flex-wrap items-end ${compact ? "text-sm" : "mb-6 justify-center"}`}
    >
      {Object.entries(TEMPLATE_MANIFEST).map(([key, t]) => {
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
