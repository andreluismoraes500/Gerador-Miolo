// src/hooks/useAgendaSettings.js

import { useState, useCallback } from "react";
import { toast } from "react-hot-toast";
import { TEMAS } from "../themes";
import { useAgendaConfig } from "../context/AgendaConfigContext";
import { usePersistedState } from "./usePersistedState";

function formatLocalDate(year, month, day) {
  const pad = (n) => String(n).padStart(2, "0");
  return `${year}-${pad(month + 1)}-${pad(day)}`;
}

export function useAgendaSettings() {
  const hoje = new Date();

  const [template, setTemplate] = usePersistedState(
    "agenda-template",
    "diario",
  );
  const [paid, setPaid] = usePersistedState("agenda-paid", false);
  const [customName, setCustomName] = useState(() => {
    const saved = localStorage.getItem("agenda-customName");
    return saved ? JSON.parse(saved) : "";
  });

  const [selectedDate, setSelectedDate] = usePersistedState(
    "agenda-selectedDate",
    formatLocalDate(hoje.getFullYear(), hoje.getMonth(), hoje.getDate()),
  );
  const [colorTheme, setColorTheme] = usePersistedState(
    "agenda-colorTheme",
    "classico",
  );
  const [footerType, setFooterType] = usePersistedState(
    "agenda-footerType",
    "default",
  );
  const [primaryColor, setPrimaryColor] = usePersistedState(
    "agenda-primaryColor",
    "#1e293b",
  );
  const [secondaryColor, setSecondaryColor] = usePersistedState(
    "agenda-secondaryColor",
    "#94a3b8",
  );
  const [bgColor, setBgColor] = usePersistedState("agenda-bgColor", "#f8fafc");
  const [fontFamily, setFontFamily] = usePersistedState(
    "agenda-fontFamily",
    "sans-serif",
  );
  const [watermarkSrc, setWatermarkSrc] = usePersistedState(
    "agenda-watermarkSrc",
    null,
  );
  const [watermarkOpacity, setWatermarkOpacity] = usePersistedState(
    "agenda-watermarkOpacity",
    0.03,
  );

  // Capa
  const [capaNome, setCapaNome] = usePersistedState("agenda-capaNome", "");
  const [capaEstilo, setCapaEstilo] = usePersistedState(
    "agenda-capaEstilo",
    "classico",
  );

  const [printing, setPrinting] = useState(false);
  const [showConfig, setShowConfig] = useState(true);

  const { logo, setLogo } = useAgendaConfig();
  const [persistedLogo, setPersistedLogo] = usePersistedState(
    "agenda-logo",
    null,
  );
  if (!logo && persistedLogo) {
    setLogo(persistedLogo);
  }

  const clearFooterName = () => {
    setCustomName("");
    setPaid(false);
    localStorage.removeItem("agenda-customName");
    toast.success("Nome do rodapé limpo!", { icon: "🧹" });
  };

  const handlePrint = () => {
    setPrinting(true);
    setTimeout(() => {
      window.print();
      setPrinting(false);
    }, 250);
  };

  const handleLogoUpload = useCallback(
    (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result;
        setLogo(result);
        setPersistedLogo(result);
        toast.success("Logo enviado!");
      };
      reader.readAsDataURL(file);
    },
    [setLogo, setPersistedLogo],
  );

  const handleRemoveLogo = () => {
    setLogo(null);
    setPersistedLogo(null);
    toast("Logo removido", { icon: "🗑️" });
  };

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

  const handleRemoveWatermark = () => {
    setWatermarkSrc(null);
    toast("Marca d'água removida", { icon: "🗑️" });
  };

  const applyThemeColors = (themeId) => {
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
  };

  const handleFooterTypeChange = (type, label, icon) => {
    setFooterType(type);
    toast(`${label} selecionado`, { icon });
  };

  const footerName = paid ? customName : "Lucas Cassiano de Moraes";
  const customColors = {
    primary: primaryColor,
    secondary: secondaryColor,
    background: bgColor,
  };

  const [capaFrase, setCapaFrase] = usePersistedState("agenda-capaFrase", "");

  return {
    template,
    setTemplate,
    paid,
    setPaid,
    customName,
    setCustomName,
    selectedDate,
    setSelectedDate,
    colorTheme,
    footerType,
    primaryColor,
    setPrimaryColor,
    secondaryColor,
    setSecondaryColor,
    bgColor,
    setBgColor,
    fontFamily,
    setFontFamily,
    watermarkSrc,
    watermarkOpacity,
    setWatermarkOpacity,
    printing,
    showConfig,
    setShowConfig,
    logo,
    handlePrint,
    handleLogoUpload,
    handleRemoveLogo,
    handleWatermarkUpload,
    handleRemoveWatermark,
    applyThemeColors,
    handleFooterTypeChange,
    footerName,
    customColors,
    clearFooterName,
    // Novos
    capaNome,
    setCapaNome,
    capaEstilo,
    setCapaEstilo,
    capaFrase,
    setCapaFrase,
  };
}
