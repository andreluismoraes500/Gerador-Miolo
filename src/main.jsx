import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";

// Vite dispara este evento quando um chunk (import dinâmico) falha ao
// carregar — típico após um deploy novo ou rede instável na 1ª visita.
// Recarrega UMA vez por sessão para pegar o build atual.
window.addEventListener("vite:preloadError", (event) => {
  event.preventDefault();
  try {
    if (sessionStorage.getItem("miolos:preload-reload") === "1") return;
    sessionStorage.setItem("miolos:preload-reload", "1");
  } catch {
    /* sem sessionStorage: recarrega mesmo assim, uma vez por carregamento */
  }
  window.location.reload();
});

// ErrorBoundary na raiz: se algo quebrar nos Providers ou no layout, o
// usuário vê a mensagem com "Recarregar" em vez de uma tela branca.
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
