import { useState, useEffect } from "react";

// Acesso ao localStorage à prova de falhas. Em navegadores com storage
// bloqueado (modo privado, cookies desativados, WebView do Instagram/WhatsApp),
// ou com a cota cheia (logo/fundo em base64), getItem/setItem LANÇAM exceção.
// Como isso rodava dentro dos Providers (fora de qualquer ErrorBoundary), a
// exceção derrubava o app inteiro na primeira visita.
function safeGet(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSet(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* storage indisponível ou cheio — segue só em memória */
  }
}

export function usePersistedState(key, initialValue) {
  const [state, setState] = useState(() => {
    const stored = safeGet(key);
    if (stored === null || stored === "undefined") return initialValue;
    try {
      return JSON.parse(stored);
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    if (state === undefined) return;
    try {
      safeSet(key, JSON.stringify(state));
    } catch {
      /* JSON.stringify falhou (valor circular etc.) */
    }
  }, [key, state]);

  return [state, setState];
}
