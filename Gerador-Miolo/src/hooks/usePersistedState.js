import { useState, useEffect, useRef } from "react";

// Acesso ao localStorage à prova de falhas. Em navegadores com storage
// bloqueado (modo privado, WebView do Instagram/WhatsApp) ou com a cota cheia
// (logo/fundo em base64), getItem/setItem LANÇAM exceção. Como isso roda dentro
// dos Providers (fora de qualquer ErrorBoundary), a exceção derrubaria o app.
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

const SAVE_DELAY_MS = 400;

/**
 * useState persistido em localStorage. A gravação é agrupada (debounce) para
 * não serializar o estado a cada tecla em campos editáveis; ao sair da aba ou
 * desmontar, o último valor pendente é gravado imediatamente.
 */
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

  const pending = useRef(null);

  useEffect(() => {
    if (state === undefined) return;
    const flush = () => {
      try {
        safeSet(key, JSON.stringify(state));
      } catch {
        /* JSON.stringify falhou (valor circular etc.) */
      }
      pending.current = null;
    };
    pending.current = flush;
    const timer = setTimeout(flush, SAVE_DELAY_MS);
    const onHide = () => pending.current?.();
    window.addEventListener("pagehide", onHide);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("pagehide", onHide);
      pending.current?.();
    };
  }, [key, state]);

  return [state, setState];
}
