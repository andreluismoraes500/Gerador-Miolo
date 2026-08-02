// src/bootstrap/hydrateFromServer.js
//
// Se a URL tiver ?stateKey=<jobId>, busca no backend (GET /api/state/:id)
// o "retrato" do localStorage que o usuário tinha no navegador dele, e
// escreve esses mesmos valores no localStorage desta aba — que é a aba
// que o Puppeteer está controlando no servidor.
//
// Isso precisa terminar ANTES do React montar a árvore, porque
// usePersistedState lê o localStorage de forma síncrona no useState
// inicial (`useState(() => localStorage.getItem(key))`). Por isso
// main.jsx faz `await hydrateFromServer()` antes de chamar
// `createRoot(...).render(<App />)`.
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
    restoreAgendaState(data.state || data);
  } catch (err) {
    console.error("[hydrateFromServer] Falha ao hidratar estado:", err);
  }
}
