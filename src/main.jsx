import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { hydrateFromServer } from "./bootstrap/hydrateFromServer.js";

// Para navegação normal do usuário isto resolve na hora (sem ?stateKey).
// Para a aba controlada pelo Puppeteer (?stateKey=<jobId>), espera
// restaurar o localStorage do usuário antes de montar o app — ver
// src/bootstrap/hydrateFromServer.js para o motivo.
hydrateFromServer().finally(() => {
  createRoot(document.getElementById("root")).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
});