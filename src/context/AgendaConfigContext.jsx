// src/context/AgendaConfigContext.jsx
import { createContext, useContext, useCallback, useMemo } from "react";
import { usePersistedState } from "../hooks/usePersistedState";

const AgendaConfigContext = createContext(null);

export function AgendaConfigProvider({ children }) {
  // --- aparência ---
  const [logo, setLogo] = usePersistedState("agenda-logo", null);
  const [colorTheme, setColorTheme] = usePersistedState(
    "agenda-colorTheme",
    "classico",
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
  const [backgroundSrc, setBackgroundSrc] = usePersistedState(
    "agenda-backgroundSrc",
    null,
  );
  const [backgroundOpacity, setBackgroundOpacity] = usePersistedState(
    "agenda-backgroundOpacity",
    0.12,
  );

  // --- CORES DOS DIAS DO CALENDÁRIO ---
  const [domingoColor, setDomingoColor] = usePersistedState(
    "agenda-domingoColor",
    "#ef4444",
  );
  const [sabadoColor, setSabadoColor] = usePersistedState(
    "agenda-sabadoColor",
    "#3b82f6",
  );
  const [diaNormalColor, setDiaNormalColor] = usePersistedState(
    "agenda-diaNormalColor",
    "#374151",
  );
  const [feriadoColor, setFeriadoColor] = usePersistedState(
    "agenda-feriadoColor",
    "#dc2626",
  );
  const [comemorativaColor, setComemorativaColor] = usePersistedState(
    "agenda-comemorativaColor",
    "#b45309",
  );

  // --- COR DO NÚMERO DO DIA ---
  const [numeroDiaColor, setNumeroDiaColor] = usePersistedState(
    "agenda-numeroDiaColor",
    "#000000",
  );

  // --- COR DOS HORÁRIOS ---
  const [horaColor, setHoraColor] = usePersistedState(
    "agenda-horaColor",
    "#000000",
  );

  // --- RÓTULOS DAS COLUNAS ---
  const [colunaHora, setColunaHora] = usePersistedState(
    "agenda-colunaHora",
    "Hora",
  );
  const [colunaCliente, setColunaCliente] = usePersistedState(
    "agenda-colunaCliente",
    "Cliente",
  );
  const [colunaServico, setColunaServico] = usePersistedState(
    "agenda-colunaServico",
    "Serviço",
  );
  const [colunaValor, setColunaValor] = usePersistedState(
    "agenda-colunaValor",
    "Valor",
  );
  const [colunaStatus, setColunaStatus] = usePersistedState(
    "agenda-colunaStatus",
    "Status",
  );

  // --- conteúdo da capa ---
  const [capaNome, setCapaNome] = usePersistedState("agenda-capaNome", "");
  const [capaEstilo, setCapaEstilo] = usePersistedState(
    "agenda-capaEstilo",
    "classico",
  );
  const [capaFrase, setCapaFrase] = usePersistedState("agenda-capaFrase", "");

  // --- rodapé ---
  const [footerType, setFooterType] = usePersistedState(
    "agenda-footerType",
    "default",
  );
  const [footerHidden, setFooterHidden] = usePersistedState(
    "agenda-footerHidden",
    false,
  );

  const removeLogo = useCallback(() => setLogo(null), [setLogo]);
  const removeWatermark = useCallback(
    () => setWatermarkSrc(null),
    [setWatermarkSrc],
  );
  const removeBackground = useCallback(
    () => setBackgroundSrc(null),
    [setBackgroundSrc],
  );

  const customColors = useMemo(
    () => ({
      primary: primaryColor,
      secondary: secondaryColor,
      background: bgColor,
      domingo: domingoColor,
      sabado: sabadoColor,
      diaNormal: diaNormalColor,
      feriado: feriadoColor,
      comemorativa: comemorativaColor,
      numeroDia: numeroDiaColor,
      hora: horaColor,
    }),
    [
      primaryColor,
      secondaryColor,
      bgColor,
      domingoColor,
      sabadoColor,
      diaNormalColor,
      feriadoColor,
      comemorativaColor,
      numeroDiaColor,
      horaColor,
    ],
  );

  const value = useMemo(
    () => ({
      logo,
      setLogo,
      removeLogo,
      colorTheme,
      setColorTheme,
      primaryColor,
      setPrimaryColor,
      secondaryColor,
      setSecondaryColor,
      bgColor,
      setBgColor,
      domingoColor,
      setDomingoColor,
      sabadoColor,
      setSabadoColor,
      diaNormalColor,
      setDiaNormalColor,
      feriadoColor,
      setFeriadoColor,
      comemorativaColor,
      setComemorativaColor,
      numeroDiaColor,
      setNumeroDiaColor,
      horaColor,
      setHoraColor,
      colunaHora,
      setColunaHora,
      colunaCliente,
      setColunaCliente,
      colunaServico,
      setColunaServico,
      colunaValor,
      setColunaValor,
      colunaStatus,
      setColunaStatus,
      customColors,
      fontFamily,
      setFontFamily,
      watermarkSrc,
      setWatermarkSrc,
      watermarkOpacity,
      setWatermarkOpacity,
      removeWatermark,
      backgroundSrc,
      setBackgroundSrc,
      backgroundOpacity,
      setBackgroundOpacity,
      removeBackground,
      capaNome,
      setCapaNome,
      capaEstilo,
      setCapaEstilo,
      capaFrase,
      setCapaFrase,
      footerType,
      setFooterType,
      footerHidden,
      setFooterHidden,
    }),
    [
      logo,
      setLogo,
      removeLogo,
      colorTheme,
      setColorTheme,
      primaryColor,
      setPrimaryColor,
      secondaryColor,
      setSecondaryColor,
      bgColor,
      setBgColor,
      domingoColor,
      setDomingoColor,
      sabadoColor,
      setSabadoColor,
      diaNormalColor,
      setDiaNormalColor,
      feriadoColor,
      setFeriadoColor,
      comemorativaColor,
      setComemorativaColor,
      numeroDiaColor,
      setNumeroDiaColor,
      horaColor,
      setHoraColor,
      colunaHora,
      setColunaHora,
      colunaCliente,
      setColunaCliente,
      colunaServico,
      setColunaServico,
      colunaValor,
      setColunaValor,
      colunaStatus,
      setColunaStatus,
      customColors,
      fontFamily,
      setFontFamily,
      watermarkSrc,
      setWatermarkSrc,
      watermarkOpacity,
      setWatermarkOpacity,
      removeWatermark,
      backgroundSrc,
      setBackgroundSrc,
      backgroundOpacity,
      setBackgroundOpacity,
      removeBackground,
      capaNome,
      setCapaNome,
      capaEstilo,
      setCapaEstilo,
      capaFrase,
      setCapaFrase,
      footerType,
      setFooterType,
      footerHidden,
      setFooterHidden,
    ],
  );

  return (
    <AgendaConfigContext.Provider value={value}>
      {children}
    </AgendaConfigContext.Provider>
  );
}

export function useAgendaConfig() {
  const ctx = useContext(AgendaConfigContext);
  if (!ctx)
    throw new Error("useAgendaConfig must be used within AgendaConfigProvider");
  return ctx;
}
