// src/utils/agendaStateSnapshot.js
//
// Toda a personalização do usuário (template escolhido, módulos da
// Montagem Completa, logo, cores, marca d'água, rodapé etc.) é guardada
// em localStorage pelo hook usePersistedState, sempre sob chaves com o
// prefixo "agenda-".
//
// Isso é ótimo para persistência no navegador do usuário, mas é a causa
// raiz de o PDF gerado pelo backend sair diferente (ou genérico) do que
// aparece na tela: o Puppeteer abre uma aba 100% nova, sem NENHUM dado
// desse localStorage. Ele nunca "vê" a Montagem Completa, o combo
// escolhido, o logo, as cores etc. — só os valores padrão do app.
//
// A solução: antes de pedir o PDF ao backend, tiramos uma "foto" de tudo
// que está em localStorage (captureAgendaState) e mandamos junto no
// corpo da requisição. O worker então repassa essa foto para a aba do
// Puppeteer via /api/state/:jobId, e o bootstrap do app
// (src/bootstrap/hydrateFromServer.js) escreve esses mesmos valores no
// localStorage daquela aba ANTES do React montar — assim o app se
// comporta exatamente como no navegador do usuário.

const PREFIX = "agenda-";
// O Talonário guarda algumas poucas configurações em localStorage sob um
// namespace próprio (ex: "talonario-accentColors"). restoreAgendaState
// escreve no localStorage real da aba do Puppeteer, então precisa
// reconhecer os dois namespaces como seguros para gravar.
const KNOWN_PREFIXES = ["agenda-", "talonario-"];

export function captureAgendaState() {
  const snapshot = {};
  for (let i = 0; i < localStorage.length; i += 1) {
    const key = localStorage.key(i);
    if (!key || !key.startsWith(PREFIX)) continue;
    const raw = localStorage.getItem(key);
    try {
      snapshot[key] = JSON.parse(raw);
    } catch {
      snapshot[key] = raw;
    }
  }
  return snapshot;
}

// Versão genérica: captura só as chaves de localStorage sob um prefixo
// específico (usada pelo Talonário, que tem seu próprio namespace).
export function captureLocalStoragePrefixed(prefix) {
  const snapshot = {};
  for (let i = 0; i < localStorage.length; i += 1) {
    const key = localStorage.key(i);
    if (!key || !key.startsWith(prefix)) continue;
    const raw = localStorage.getItem(key);
    try {
      snapshot[key] = JSON.parse(raw);
    } catch {
      snapshot[key] = raw;
    }
  }
  return snapshot;
}

export function restoreAgendaState(snapshot) {
  if (!snapshot || typeof snapshot !== "object") return;
  Object.entries(snapshot).forEach(([key, value]) => {
    // segurança: nunca grava fora dos namespaces conhecidos do app
    if (!KNOWN_PREFIXES.some((p) => key.startsWith(p))) return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.error(`[agendaStateSnapshot] Falha ao restaurar "${key}":`, err);
    }
  });
}