// src/hooks/useAgendaSettings.js
import { useState, useCallback } from "react";
import { toast } from "react-hot-toast";
import { TEMAS } from "../themes";
import { useAgendaConfig } from "../context/AgendaConfigContext";
import { usePersistedState } from "./usePersistedState";
import { useBusinessProfile } from "./useBusinessProfile";
import { getBusinessProfile } from "../config/businessProfiles";

function formatLocalDate(year, month, day) {
  const pad = (n) => String(n).padStart(2, "0");
  return `${year}-${pad(month + 1)}-${pad(day)}`;
}

const hoje = new Date();
const DATA_INICIAL = formatLocalDate(
  hoje.getFullYear(),
  hoje.getMonth(),
  hoje.getDate(),
);

export function useAgendaSettings() {
  const [template, setTemplate] = usePersistedState(
    "agenda-template",
    "diario",
  );
  const [selectedDate, setSelectedDate] = usePersistedState(
    "agenda-selectedDate",
    DATA_INICIAL,
  );
  const [customName, setCustomName] = usePersistedState(
    "agenda-customName",
    "",
  );
  const [printing, setPrinting] = useState(false);
  const [showConfig, setShowConfig] = useState(true);

  const {
    logo,
    setLogo,
    removeLogo,
    colorTheme,
    setColorTheme,
    setPrimaryColor,
    setSecondaryColor,
    setBgColor,
    setWatermarkSrc,
    setBackgroundSrc,
    removeBackground,
    setNumeroDiaColor,
    setHoraColor,
    setTableTextColor,
    setMesColor,
    setDiaSemanaColor,
    setColunaHora,
    setColunaCliente,
    setColunaServico,
    setColunaValor,
    setColunaStatus,
  } = useAgendaConfig();

  const {
    profile: businessProfile,
    profileId: businessProfileId,
    setProfileId: _setBusinessProfileId,
    applyProfileColors,
    getThemeId,
  } = useBusinessProfile();

  const handleSetBusinessProfile = useCallback(
    (newProfileId) => {
      const success = _setBusinessProfileId(newProfileId);
      if (success) {
        const newProfile = getBusinessProfile(newProfileId);
        applyProfileColors(
          setPrimaryColor,
          setSecondaryColor,
          setBgColor,
          setNumeroDiaColor,
          setHoraColor,
          setTableTextColor,
          setColunaHora,
          setColunaCliente,
          setColunaServico,
          setColunaValor,
          setColunaStatus,
          newProfile,
          setMesColor,
          setDiaSemanaColor,
        );
        setColorTheme(getThemeId());
        toast.success(`Perfil alterado para ${newProfile.nome}`);
      }
    },
    [
      _setBusinessProfileId,
      applyProfileColors,
      setPrimaryColor,
      setSecondaryColor,
      setBgColor,
      setNumeroDiaColor,
      setHoraColor,
      setTableTextColor,
      setColunaHora,
      setColunaCliente,
      setColunaServico,
      setColunaValor,
      setColunaStatus,
      setColorTheme,
      getThemeId,
    ],
  );

  const applyThemeColors = useCallback(
    (themeId) => {
      const theme = TEMAS[themeId];
      if (theme?.colors) {
        setPrimaryColor(theme.colors.primary);
        setSecondaryColor(theme.colors.secondary);
        setBgColor(theme.colors.background);
        setNumeroDiaColor(theme.colors.numeroDia || "#1e293b");
        setHoraColor(theme.colors.hora || "#000000");
        setTableTextColor(theme.colors.tableText || "#1e293b");
        // Nome do dia da semana acompanha a primária, mês/ano acompanha a
        // secundária — mesmo padrão usado ao trocar de perfil de negócio.
        setDiaSemanaColor(theme.colors.diaSemana || theme.colors.primary);
        setMesColor(theme.colors.mes || theme.colors.secondary);
        if (theme.labels) {
          setColunaHora(theme.labels.hora || "Hora");
          setColunaCliente(theme.labels.cliente || "Cliente");
          setColunaServico(theme.labels.servico || "Serviço");
          setColunaValor(theme.labels.valor || "Valor");
          setColunaStatus(theme.labels.status || "Status");
        }
      } else {
        setPrimaryColor("#1e293b");
        setSecondaryColor("#94a3b8");
        setBgColor("#f8fafc");
        setNumeroDiaColor("#1e293b");
        setHoraColor("#000000");
        setTableTextColor("#1e293b");
        setDiaSemanaColor("#1e293b");
        setMesColor("#94a3b8");
      }
      setColorTheme(themeId);
    },
    [
      setPrimaryColor,
      setSecondaryColor,
      setBgColor,
      setNumeroDiaColor,
      setHoraColor,
      setTableTextColor,
      setMesColor,
      setDiaSemanaColor,
      setColunaHora,
      setColunaCliente,
      setColunaServico,
      setColunaValor,
      setColunaStatus,
      setColorTheme,
    ],
  );

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
    setWatermarkSrc(null);
    toast("Marca d'água removida", { icon: "🗑️" });
  }, [setWatermarkSrc]);

  const handleBackgroundUpload = useCallback(
    (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onloadend = () => {
        setBackgroundSrc(reader.result);
        toast.success("Fundo enviado!");
      };
      reader.readAsDataURL(file);
    },
    [setBackgroundSrc],
  );

  const handleRemoveBackground = useCallback(() => {
    removeBackground();
    toast("Fundo removido", { icon: "🗑️" });
  }, [removeBackground]);

  const footerName =
    customName && customName.trim() !== ""
      ? customName
      : "Lucas Cassiano de Moraes";

  return {
    template,
    setTemplate,
    selectedDate,
    setSelectedDate,
    customName,
    setCustomName,
    footerName,
    printing,
    setPrinting,
    showConfig,
    setShowConfig,
    handlePrint,
    handleLogoUpload,
    handleRemoveLogo,
    handleWatermarkUpload,
    handleRemoveWatermark,
    handleBackgroundUpload,
    handleRemoveBackground,
    applyThemeColors,
    businessProfile,
    businessProfileId,
    setBusinessProfile: handleSetBusinessProfile,
  };
}