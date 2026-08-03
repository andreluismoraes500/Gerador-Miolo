// src/bootstrap/hydrateFromServer.js
//
// Se a URL tiver ?stateKey=<jobId>, busca no backend (GET /api/state/:id)
// o "retrato" de configuração que o usuário tinha no navegador dele, e
// aplica nesta aba — que é a aba que o Puppeteer está controlando no
// servidor. O formato do retrato depende do tipo de job:
//
//   - kind "agenda": retrato do localStorage (template, Montagem
//     Completa, logo, cores etc.) → escrito de volta no localStorage
//     (restoreAgendaState), de onde usePersistedState vai ler.
//   - kind "talonario": a maior parte da config do Talonário vive em
//     useState comum (não localStorage), então o retrato é aplicado via
//     window.__TALONARIO_HYDRATE__, que useTalonarioBuilder lê como
//     valor inicial de cada useState. A pequena parte que É localStorage
//     (cores de destaque) vem dentro de __localStorage e também passa
//     por restoreAgendaState.
//
// Isso precisa terminar ANTES do React montar a árvore, porque tanto
// usePersistedState quanto os useState hidratados leem esse retrato de
// forma síncrona no valor inicial. Por isso main.jsx faz
// `await hydrateFromServer()` antes de chamar `createRoot(...).render()`.
//
// Para qualquer usuário normal (sem ?stateKey na URL) esta função
// retorna imediatamente, sem nenhum custo.

import { restoreAgendaState } from "../utils/agendaStateSnapshot";

export async function hydrateFromServer() {
  const params = new URLSearchParams(window.location.search);
  const stateKey = params.get("stateKey");
  if (!stateKey) return;

  try {
    const res = await fetch(`/api/state/${encodeURIComponent(stateKey)}`);
    if (!res.ok) {
      console.error(
        `[hydrateFromServer] Não foi possível buscar o estado (status ${res.status}).`,
      );
      return;
    }
    const data = await res.json();
    const kind = data.kind || "agenda";
    const state = data.state || {};

    if (kind === "talonario") {
      const { __localStorage, ...rest } = state;
      window.__TALONARIO_HYDRATE__ = rest;
      window.__PDF_HEADLESS__ = true;
      restoreAgendaState(__localStorage || {});
    } else {
      restoreAgendaState(state);
    }
  } catch (err) {
    console.error("[hydrateFromServer] Falha ao hidratar estado:", err);
  }
}