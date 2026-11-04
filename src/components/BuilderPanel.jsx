// src/components/BuilderPanel.jsx
//
// Painel de controle do "Modo Montagem": escolher módulos (templates),
// reordenar, remover e aplicar presets prontos. A pré-visualização e a
// impressão em si ficam em AgendaBuilderPreview.jsx.

import { useState } from "react";
import {
  MdAdd,
  MdDelete,
  MdDragIndicator,
  MdAutoAwesome,
  MdDeleteSweep,
  MdStars,
  MdWorkOutline,
  MdSpa,
  MdChecklistRtl,
  MdSchool,
} from "react-icons/md";
import { TEMPLATE_MANIFEST } from "../templates/manifest";
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
  "cadernoUniversitario",
  "caligrafia",
  "noivas",
  "partituras",
]);

const ANNUAL_DAY_TEMPLATES = new Set(["anualCompleto", "anualLivre", "anualComercialDuplo"]);

// Ícone de cada preset rápido — só estética, ajuda a diferenciar os combos
// num piscar de olhos antes mesmo de ler o rótulo.
const PRESET_ICONS = {
  essencial: MdStars,
  profissional: MdWorkOutline,
  bemEstar: MdSpa,
  organizacao: MdChecklistRtl,
  universitario: MdSchool,
};

export default function BuilderPanel({ builder }) {
  const { modules, addModule, removeModule, reorderModule, clearModules, loadPreset } = builder;
  const [selectedToAdd, setSelectedToAdd] = useState(Object.keys(TEMPLATE_MANIFEST)[0]);

  // Drag-and-drop: uid do módulo sendo arrastado e índice sobre o qual paira.
  const [draggedUid, setDraggedUid] = useState(null);
  const [dragOverIdx, setDragOverIdx] = useState(null);

  const handleDragStart = (uid) => (e) => {
    setDraggedUid(uid);
    // Necessário para o Firefox aceitar o drag.
    e.dataTransfer.effectAllowed = "move";
    try {
      e.dataTransfer.setData("text/plain", uid);
    } catch {
      // alguns navegadores mobile não suportam — sem problema, seguimos com o state
    }
  };

  const handleDragOver = (idx) => (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverIdx !== idx) setDragOverIdx(idx);
  };

  const handleDrop = (idx) => (e) => {
    e.preventDefault();
    if (draggedUid) reorderModule(draggedUid, idx);
    setDraggedUid(null);
    setDragOverIdx(null);
  };

  const handleDragEnd = () => {
    setDraggedUid(null);
    setDragOverIdx(null);
  };

  const templateOptions = Object.entries(TEMPLATE_MANIFEST).map(([key, t]) => ({
    key,
    nome: t.nome,
  }));

  const temPlannerMensal = modules.some((m) => m.templateKey === "plannerMensal");
  const temAnual = modules.some((m) => ANNUAL_DAY_TEMPLATES.has(m.templateKey));
  const mesclagemAtiva = temPlannerMensal && temAnual;

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
          {Object.entries(BUILDER_PRESETS).map(([id, preset]) => {
            const Icon = PRESET_ICONS[id] ?? MdStars;
            return (
              <button
                key={id}
                onClick={() => loadPreset(id)}
                className="group px-3 py-1.5 text-[11px] font-medium rounded-full border border-[#D8CBA8] bg-[#FBF8F1] text-[#6B6458] hover:border-[#B8933D] hover:text-[#24344D] hover:bg-white hover:shadow-sm active:scale-[0.97] transition-all flex items-center gap-1.5"
              >
                <Icon className="w-3.5 h-3.5 text-[#B8933D] group-hover:text-[#8B6A1F] transition-colors" />
                {preset.label}
              </button>
            );
          })}
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

        {mesclagemAtiva && (
          <div className="text-[11px] text-[#1B5E3F] bg-[#E4F3EA] border border-[#B7DEC7] rounded-lg px-3 py-2 flex items-start gap-2">
            <span>✅</span>
            <span>
              <strong>Mesclagem automática ativa:</strong> como você tem o{" "}
              <strong>Planner Mensal</strong> junto com um módulo anual, o planner de cada mês vai
              sair sozinho, sempre antes do dia 1 daquele mês (janeiro antes do dia 1/jan,
              fevereiro logo após 31/jan e antes do dia 1/fev, e assim por diante). Não é preciso
              adicionar o Planner Mensal 12 vezes.
            </span>
          </div>
        )}

        {/* Lista de módulos escolhidos */}
        {modules.length === 0 ? (
          <div className="text-center text-xs text-[#8a8272] border border-dashed border-[#D8CBA8] rounded-lg py-6 bg-[#FBF8F1]/60">
            Nenhum módulo ainda. Escolha um preset ou adicione módulos manualmente acima.
          </div>
        ) : (
          <ol className="flex flex-col gap-1.5">
            {modules.map((mod, idx) => {
              const def = TEMPLATE_MANIFEST[mod.templateKey];
              if (!def) return null;
              const isDragging = draggedUid === mod.uid;
              const showDropLine = dragOverIdx === idx && draggedUid && draggedUid !== mod.uid;
              return (
                <li
                  key={mod.uid}
                  draggable
                  onDragStart={handleDragStart(mod.uid)}
                  onDragOver={handleDragOver(idx)}
                  onDrop={handleDrop(idx)}
                  onDragEnd={handleDragEnd}
                  className={`flex items-center gap-3 bg-[#FBF8F1] border rounded-lg px-3 py-2 transition-all hover:shadow-sm hover:border-[#C9B77E] ${
                    isDragging
                      ? "opacity-40 border-dashed border-[#B8933D]"
                      : "border-[#D8CBA8]"
                  } ${showDropLine ? "border-t-4 border-t-[#B8933D]" : ""}`}
                >
                  <span
                    className="text-[#8B6A1F] cursor-grab active:cursor-grabbing shrink-0 touch-none"
                    title="Arrastar para reordenar"
                  >
                    <MdDragIndicator className="w-4 h-4" />
                  </span>
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
