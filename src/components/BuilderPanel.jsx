// src/components/BuilderPanel.jsx
//
// Painel de controle do "Modo Montagem": escolher módulos (templates),
// reordenar, remover e aplicar presets prontos. A pré-visualização e a
// impressão em si ficam em AgendaBuilderPreview.jsx.

import { useState } from "react";
import {
  MdAdd,
  MdDelete,
  MdArrowUpward,
  MdArrowDownward,
  MdAutoAwesome,
  MdDeleteSweep,
} from "react-icons/md";
import { TEMPLATES } from "../templates";
import { BUILDER_PRESETS } from "../hooks/useAgendaBuilder";

// Templates que geram várias páginas sozinhos — vale avisar o usuário.
const MULTI_PAGE_TEMPLATES = new Set([
  "anualCompleto",
  "anualLivre",
  "anualComercialDuplo",
  "mensalCompleto",
  "mensalLivre",
  "mensalComercialDuplo",
  "calendarios",
]);

export default function BuilderPanel({ builder }) {
  const { modules, addModule, removeModule, moveModule, clearModules, loadPreset } = builder;
  const [selectedToAdd, setSelectedToAdd] = useState(Object.keys(TEMPLATES)[0]);

  const templateOptions = Object.entries(TEMPLATES).map(([key, t]) => ({
    key,
    nome: t.nome,
  }));

  return (
    <div className="bg-[#F1EADB]/95 border-b border-[#D8CBA8] px-6 py-5 print:hidden">
      <div className="max-w-7xl mx-auto flex flex-col gap-4">
        {/* Cabeçalho */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-[#24344D] flex items-center gap-2">
              📚 Montagem da Agenda Completa
            </h2>
            <p className="text-[11px] text-[#8B6A1F] mt-0.5">
              Empilhe os módulos na ordem desejada. Ao imprimir, tudo sai como um único PDF contínuo.
            </p>
          </div>

          {modules.length > 0 && (
            <button
              onClick={clearModules}
              className="text-[11px] text-[#8B2E3F] hover:text-[#6E2432] flex items-center gap-1 hover:bg-[#8B2E3F]/10 px-2.5 py-1.5 rounded-md transition"
            >
              <MdDeleteSweep className="w-4 h-4" />
              Limpar tudo
            </button>
          )}
        </div>

        {/* Presets rápidos */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8B6A1F] flex items-center gap-1">
            <MdAutoAwesome className="w-3.5 h-3.5" />
            Começar com:
          </span>
          {Object.entries(BUILDER_PRESETS).map(([id, preset]) => (
            <button
              key={id}
              onClick={() => loadPreset(id)}
              className="px-3 py-1 text-[11px] font-medium rounded-full border border-[#D8CBA8] bg-[#FBF8F1] text-[#6B6458] hover:border-[#B8933D] hover:text-[#24344D] transition-all"
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Adicionar módulo */}
        <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-[#D8CBA8]/70">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8B6A1F] whitespace-nowrap">
            Adicionar módulo:
          </span>
          <select
            value={selectedToAdd}
            onChange={(e) => setSelectedToAdd(e.target.value)}
            className="border border-[#D8CBA8] rounded-lg px-3 py-1.5 text-xs bg-[#FBF8F1] font-medium focus:ring-2 focus:ring-[#B8933D]/40 focus:border-[#B8933D] focus:outline-none transition"
          >
            {templateOptions.map((opt) => (
              <option key={opt.key} value={opt.key}>
                {opt.nome}
                {MULTI_PAGE_TEMPLATES.has(opt.key) ? " (várias páginas)" : ""}
              </option>
            ))}
          </select>
          <button
            onClick={() => addModule(selectedToAdd)}
            className="bg-[#24344D] hover:bg-[#1B2740] text-[#F6F1E7] font-medium text-xs py-1.5 px-3.5 rounded-lg flex items-center gap-1.5 transition"
          >
            <MdAdd className="w-4 h-4" />
            Adicionar
          </button>
        </div>

        {/* Lista de módulos escolhidos */}
        {modules.length === 0 ? (
          <div className="text-center text-xs text-[#8a8272] border border-dashed border-[#D8CBA8] rounded-lg py-6 bg-[#FBF8F1]/60">
            Nenhum módulo ainda. Escolha um preset ou adicione módulos manualmente acima.
          </div>
        ) : (
          <ol className="flex flex-col gap-1.5">
            {modules.map((mod, idx) => {
              const def = TEMPLATES[mod.templateKey];
              if (!def) return null;
              return (
                <li
                  key={mod.uid}
                  className="flex items-center gap-3 bg-[#FBF8F1] border border-[#D8CBA8] rounded-lg px-3 py-2"
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#8B6A1F] bg-[#EFE4C8] border border-[#DEC98B] rounded-full w-6 h-6 flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <span className="text-xs font-medium text-[#24344D] flex-1">
                    {def.nome}
                    {MULTI_PAGE_TEMPLATES.has(mod.templateKey) && (
                      <span className="ml-2 text-[9px] uppercase tracking-wide text-[#8B6A1F] bg-[#EFE4C8] px-1.5 py-0.5 rounded-full border border-[#DEC98B]">
                        várias páginas
                      </span>
                    )}
                  </span>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => moveModule(mod.uid, -1)}
                      disabled={idx === 0}
                      className="p-1.5 rounded-md text-[#6B6458] hover:bg-[#EFE4C8] hover:text-[#24344D] disabled:opacity-30 disabled:hover:bg-transparent transition"
                      title="Mover para cima"
                    >
                      <MdArrowUpward className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => moveModule(mod.uid, 1)}
                      disabled={idx === modules.length - 1}
                      className="p-1.5 rounded-md text-[#6B6458] hover:bg-[#EFE4C8] hover:text-[#24344D] disabled:opacity-30 disabled:hover:bg-transparent transition"
                      title="Mover para baixo"
                    >
                      <MdArrowDownward className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => removeModule(mod.uid)}
                      className="p-1.5 rounded-md text-[#8B2E3F] hover:bg-[#8B2E3F]/10 transition"
                      title="Remover módulo"
                    >
                      <MdDelete className="w-4 h-4" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </div>
    </div>
  );
}
