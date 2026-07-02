// src/hooks/useAgendaSettings.js
//
// Hook responsável pelas configurações da agenda que ainda não vivem em contexto:
// template, data, perfil de negócio, nome personalizado/pagamento e ações de UI
// (upload de logo/watermark, impressão, etc.).
//
// Estado de aparência (cores, tema, fonte, capa, rodapé, logo, marca d'água) foi
// movido para AgendaConfigContext — consumido via useAgendaConfig().

import { useState, useCallback } from "react";
import { toast } from "react-hot-toast";
import { TEMAS } from "../themes";
import { useAgendaConfig } from "../context/AgendaConfigContext";
import { usePersistedState } from "./usePersistedState";
import { useBusinessProfile } from "./useBusinessProfile";

function formatLocalDate(year, month, day) {
  const pad = (n) => String(n).padStart(2, "0");
  return `${year}-${pad(month + 1)}-${pad(day)}`;
}

const hoje = new Date();
const DATA_INICIAL = formatLocalDate(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());

export function useAgendaSettings() {
  // --- estado local da sessão ---
  const [template, setTemplate] = usePersistedState("agenda-template", "diario");
  const [selectedDate, setSelectedDate] = usePersistedState("agenda-selectedDate", DATA_INICIAL);
  const [paid, setPaid] = usePersistedState("agenda-paid", false);
  const [customName, setCustomName] = usePersistedState("agenda-customName", "");
  const [printing, setPrinting] = useState(false);
  const [showConfig, setShowConfig] = useState(true);

  // --- aparência (contexto) ---
  const {
    logo, setLogo, removeLogo,
    colorTheme, setColorTheme,
    setPrimaryColor, setSecondaryColor, setBgColor,
    setWatermarkSrc,
  } = useAgendaConfig();

  // --- perfil de negócio ---
  const {
    profile: businessProfile,
    profileId: businessProfileId,
    setProfileId: _setBusinessProfileId,
    applyProfileColors,
    getThemeId,
  } = useBusinessProfile();

  // ── handlers ────────────────────────────────────────────────

  const handleSetBusinessProfile = useCallback(
    (newProfileId) => {
      const success = _setBusinessProfileId(newProfileId);
      if (success) {
        applyProfileColors(setPrimaryColor, setSecondaryColor, setBgColor);
        setColorTheme(getThemeId());
        toast.success(`Perfil alterado`);
      }
    },
    [_setBusinessProfileId, applyProfileColors, setPrimaryColor, setSecondaryColor, setBgColor, setColorTheme, getThemeId],
  );

  const applyThemeColors = useCallback(
    (themeId) => {
      const theme = TEMAS[themeId];
      if (theme?.colors) {
        setPrimaryColor(theme.colors.primary);
        setSecondaryColor(theme.colors.secondary);
        setBgColor(theme.colors.background);
      } else {
        setPrimaryColor("#1e293b");
        setSecondaryColor("#94a3b8");
        setBgColor("#f8fafc");
      }
      setColorTheme(themeId);
    },
    [setPrimaryColor, setSecondaryColor, setBgColor, setColorTheme],
  );

  const clearFooterName = useCallback(() => {
    setCustomName("");
    setPaid(false);
    toast.success("Nome do rodapé limpo!", { icon: "🧹" });
  }, [setCustomName, setPaid]);

  const handlePrint = useCallback(() => {
    setPrinting(true);
    setTimeout(() => {
      window.print();
      setPrinting(false);
    }, 250);
  }, []);

  const handleLogoUpload = useCallback(
    (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo(reader.result);
        toast.success("Logo enviado!");
      };
      reader.readAsDataURL(file);
    },
    [setLogo],
  );

  const handleRemoveLogo = useCallback(() => {
    removeLogo();
    toast("Logo removido", { icon: "🗑️" });
  }, [removeLogo]);

  const handleWatermarkUpload = useCallback(
    (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onloadend = () => {
        setWatermarkSrc(reader.result);
        toast.success("Marca d'água enviada!");
      };
      reader.readAsDataURL(file);
    },
    [setWatermarkSrc],
  );

  const handleRemoveWatermark = useCallback(() => {
    // removeWatermark vem do contexto — chamado via useAgendaConfig direto
    setWatermarkSrc(null);
    toast("Marca d'água removida", { icon: "🗑️" });
  }, [setWatermarkSrc]);


  // ── derivados ────────────────────────────────────────────────
  const footerName = paid ? customName : "Lucas Cassiano de Moraes";

  return {
    // template / data
    template, setTemplate,
    selectedDate, setSelectedDate,
    // pagamento / nome
    paid, setPaid,
    customName, setCustomName,
    footerName,
    clearFooterName,
    // ui
    printing, setPrinting,
    showConfig, setShowConfig,
    // handlers de arquivo
    handlePrint,
    handleLogoUpload, handleRemoveLogo,
    handleWatermarkUpload, handleRemoveWatermark,
    // tema
    applyThemeColors,
    // perfil de negócio
    businessProfile,
    businessProfileId,
    setBusinessProfile: handleSetBusinessProfile,
  };
}
