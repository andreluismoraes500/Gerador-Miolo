// src/hooks/useAgendaBuilder.js
//
// Hook responsável pelo "Modo Montagem": permite empilhar vários templates
// (módulos) em uma ordem escolhida pelo usuário e gerar, na impressão, um
// único miolo contínuo — reaproveitando a paginação que cada template já
// implementa internamente (page-break / printable-page).

import { useCallback } from "react";
import { usePersistedState } from "./usePersistedState";
import { TEMPLATE_MANIFEST } from "../templates/manifest";

let uidCounter = 0;
function generateUid() {
  uidCounter += 1;
  return `mod-${Date.now()}-${uidCounter}`;
}

// Presets rápidos: combinações comuns de módulos para começar mais rápido.
export const BUILDER_PRESETS = {
  essencial: {
    label: "Combo Essencial",
    modules: ["capa", "dadosPessoais", "calendarios", "metas", "habitos", "anualCompleto", "semanal", "tarefas"],
  },
  profissional: {
    label: "Combo Profissional",
    modules: ["capa", "dadosPessoais", "mensalComercialDuplo", "semanal", "financas", "tarefas"],
  },
  bemEstar: {
    label: "Combo Bem-estar",
    modules: ["capa", "dadosPessoais", "habitos", "gratidao", "saude", "sono", "refeicoes", "metas"],
  },
  organizacao: {
    label: "Combo Organização",
    modules: ["capa", "dadosPessoais", "estudos", "leitura", "viagem", "compras", "wishlist"],
  },
  universitario: {
    label: "Combo Universitário",
    modules: ["capa", "dadosPessoais", "calendarios", "cadernoUniversitario", "estudos", "tarefas"],
  },
};

export function useAgendaBuilder() {
  const [builderMode, setBuilderMode] = usePersistedState("agenda-builderMode", false);
  const [modules, setModules] = usePersistedState("agenda-builderModules", []);

  const addModule = useCallback(
    (templateKey) => {
      if (!TEMPLATE_MANIFEST[templateKey]) return;
      setModules((prev) => [...prev, { uid: generateUid(), templateKey }]);
    },
    [setModules],
  );

  const removeModule = useCallback(
    (uid) => {
      setModules((prev) => prev.filter((m) => m.uid !== uid));
    },
    [setModules],
  );

  const moveModule = useCallback(
    (uid, direction) => {
      setModules((prev) => {
        const index = prev.findIndex((m) => m.uid === uid);
        if (index === -1) return prev;
        const newIndex = index + direction;
        if (newIndex < 0 || newIndex >= prev.length) return prev;
        const next = [...prev];
        [next[index], next[newIndex]] = [next[newIndex], next[index]];
        return next;
      });
    },
    [setModules],
  );

  // Reordena via drag-and-drop: move o módulo `uid` para a posição `targetIndex`.
  const reorderModule = useCallback(
    (uid, targetIndex) => {
      setModules((prev) => {
        const fromIndex = prev.findIndex((m) => m.uid === uid);
        if (fromIndex === -1) return prev;
        const clamped = Math.max(0, Math.min(targetIndex, prev.length - 1));
        if (fromIndex === clamped) return prev;
        const next = [...prev];
        const [moved] = next.splice(fromIndex, 1);
        next.splice(clamped, 0, moved);
        return next;
      });
    },
    [setModules],
  );

  const clearModules = useCallback(() => setModules([]), [setModules]);

  const loadPreset = useCallback(
    (presetId) => {
      const preset = BUILDER_PRESETS[presetId];
      if (!preset) return;
      setModules(preset.modules.map((templateKey) => ({ uid: generateUid(), templateKey })));
    },
    [setModules],
  );

  return {
    builderMode,
    setBuilderMode,
    modules,
    setModules,
    addModule,
    removeModule,
    moveModule,
    reorderModule,
    clearModules,
    loadPreset,
  };
}
