// src/App.jsx
//
// Ponto de entrada das rotas. O estado da agenda (useAgendaSettings /
// useAgendaBuilder) vive em AppLayout e é repassado às páginas via
// <Outlet context /> — assim nada se perde ao navegar entre elas.

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./layout/AppLayout";
import TemplatesPage from "./pages/TemplatesPage";
import ConfigPage from "./pages/ConfigPage";
import PreviewPage from "./pages/PreviewPage";
import TalonarioPage from "./pages/TalonarioPage";
import { AgendaConfigProvider } from "./context/AgendaConfigContext";
import { AgendaDataProvider } from "./context/AgendaDataContext";
import { BusinessProfileProvider } from "./context/BusinessProfileContext";

export default function App() {
  return (
    <AgendaConfigProvider>
      <AgendaDataProvider>
        <BusinessProfileProvider initialProfileId="default">
          <BrowserRouter>
            <Routes>
              <Route element={<AppLayout />}>
                <Route index element={<Navigate to="/templates" replace />} />
                <Route path="templates" element={<TemplatesPage />} />
                <Route path="config" element={<ConfigPage />} />
                <Route path="preview" element={<PreviewPage />} />
                {/* Talonário agora vive dentro do layout principal do app,
                    compartilhando cabeçalho, navegação e (crucialmente) o
                    print.css global — antes ele ficava fora do AppLayout e,
                    ao ser acessado direto, carregava sem Tailwind/CSS de
                    impressão nenhum. */}
                <Route path="talonario" element={<TalonarioPage />} />
                <Route path="*" element={<Navigate to="/templates" replace />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </BusinessProfileProvider>
      </AgendaDataProvider>
    </AgendaConfigProvider>
  );
}
