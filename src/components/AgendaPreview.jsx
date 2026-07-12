// src/components/AgendaPreview.jsx
//
// Componente de visualização pura: recebe apenas dados de conteúdo e delega
// aparência (cores, logo, fonte, etc.) ao contexto AgendaConfig.

import React, { useEffect, useState } from "react";
import { loadTemplate, getCachedTemplate } from "../templates";
import { useAgendaConfig } from "../context/AgendaConfigContext";

const AgendaPreview = React.memo(function AgendaPreview({
  template,
  customName,
  paid,
  selectedDate,
  printing,
  businessProfile,
  businessProfileId,
}) {
  const {
    colorTheme,
    logo,
    footerType,
    customColors,
    fontFamily,
    watermarkSrc,
    watermarkOpacity,
    backgroundSrc,
    backgroundOpacity,
    capaNome,
    capaEstilo,
    capaFrase,
    setCapaFrase,
  } = useAgendaConfig();

  // Cada template só é baixado (chunk separado) na primeira vez que é
  // selecionado — daí em diante fica em cache em memória (ver templates/index.js).
  const [currentTemplate, setCurrentTemplate] = useState(() => getCachedTemplate(template));
  const [loadError, setLoadError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let cancelled = false;
    // Se já está em cache, evita um "flash" de loading trocando na hora.
    const cached = getCachedTemplate(template);
    if (cached) {
      setCurrentTemplate(cached);
      setLoadError(null);
    } else {
      setCurrentTemplate(null);
      setLoadError(null);
      loadTemplate(template)
        .then((def) => {
          if (!cancelled) setCurrentTemplate(def);
        })
        .catch((err) => {
          // Sem isso, uma falha no import dinâmico (ex.: "Failed to fetch
          // dynamically imported module", comum quando o Vite invalida
          // chunks antigos após salvar um arquivo) ficava como promise
          // rejeitada sem tratamento — a tela travava em "Carregando
          // modelo..." pra sempre e o erro só aparecia no console.
          if (!cancelled) setLoadError(err);
        });
    }
    return () => {
      cancelled = true;
    };
  }, [template, retryCount]);

  if (loadError) {
    return (
      <div className="agenda-preview-container flex flex-col items-center justify-center gap-2 py-24 text-xs text-[#8a8272] print:hidden">
        <p>Não foi possível carregar este modelo.</p>
        <button
          type="button"
          onClick={() => setRetryCount((n) => n + 1)}
          className="text-[#8B6A1F] font-semibold underline underline-offset-2 hover:text-[#6B4F10]"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  if (!currentTemplate) {
    return (
      <div className="agenda-preview-container flex items-center justify-center py-24 text-xs text-[#8a8272] print:hidden">
        Carregando modelo...
      </div>
    );
  }

  const layoutProps = {
    footerName: customName,
    selectedDate,
    printing,
    colorTheme,
    logo,
    footerType,
    customColors,
    fontFamily,
    watermarkSrc,
    watermarkOpacity,
    backgroundSrc,
    backgroundOpacity,
    businessType: businessProfileId || "default",
    businessProfile,
    capaNome,
    capaEstilo,
    capaFrase,
    setCapaFrase,
  };

  return (
    <div className={`agenda-preview-container ${printing ? "is-printing" : ""}`}>
      {currentTemplate.layout(layoutProps)}
    </div>
  );
});

export default AgendaPreview;
