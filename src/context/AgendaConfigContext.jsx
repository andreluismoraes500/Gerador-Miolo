// src/context/AgendaConfigContext.jsx
//
// Contexto central de configuração da agenda.
// Consolidou o logo (antes isolado) com todo o estado persistido de aparência,
// eliminando a necessidade de sincronização manual entre useAgendaSettings e
// o contexto antigo.

import { createContext, useContext, useCallback, useMemo } from "react";
import { usePersistedState } from "../hooks/usePersistedState";

const AgendaConfigContext = createContext(null);

export function AgendaConfigProvider({ children }) {
  // --- aparência ---
  const [logo, setLogo] = usePersistedState("agenda-logo", null);
  const [colorTheme, setColorTheme] = usePersistedState("agenda-colorTheme", "classico");
  const [primaryColor, setPrimaryColor] = usePersistedState("agenda-primaryColor", "#1e293b");
  const [secondaryColor, setSecondaryColor] = usePersistedState("agenda-secondaryColor", "#94a3b8");
  const [bgColor, setBgColor] = usePersistedState("agenda-bgColor", "#f8fafc");
  const [fontFamily, setFontFamily] = usePersistedState("agenda-fontFamily", "sans-serif");
  const [watermarkSrc, setWatermarkSrc] = usePersistedState("agenda-watermarkSrc", null);
  const [watermarkOpacity, setWatermarkOpacity] = usePersistedState("agenda-watermarkOpacity", 0.03);
  const [backgroundSrc, setBackgroundSrc] = usePersistedState("agenda-backgroundSrc", null);
  const [backgroundOpacity, setBackgroundOpacity] = usePersistedState("agenda-backgroundOpacity", 0.12);

  // --- conteúdo da capa ---
  const [capaNome, setCapaNome] = usePersistedState("agenda-capaNome", "");
  const [capaEstilo, setCapaEstilo] = usePersistedState("agenda-capaEstilo", "classico");
  const [capaFrase, setCapaFrase] = usePersistedState("agenda-capaFrase", "");

  // --- rodapé ---
  const [footerType, setFooterType] = usePersistedState("agenda-footerType", "default");

  const removeLogo = useCallback(() => setLogo(null), [setLogo]);
  const removeWatermark = useCallback(() => setWatermarkSrc(null), [setWatermarkSrc]);
  const removeBackground = useCallback(() => setBackgroundSrc(null), [setBackgroundSrc]);

  const customColors = useMemo(
    () => ({ primary: primaryColor, secondary: secondaryColor, background: bgColor }),
    [primaryColor, secondaryColor, bgColor],
  );

  const value = useMemo(
    () => ({
      // logo
      logo, setLogo, removeLogo,
      // tema / cores
      colorTheme, setColorTheme,
      primaryColor, setPrimaryColor,
      secondaryColor, setSecondaryColor,
      bgColor, setBgColor,
      customColors,
      // fonte
      fontFamily, setFontFamily,
      // marca d'água
      watermarkSrc, setWatermarkSrc, watermarkOpacity, setWatermarkOpacity, removeWatermark,
      // background (imagem de fundo da página)
      backgroundSrc, setBackgroundSrc, backgroundOpacity, setBackgroundOpacity, removeBackground,
      // capa
      capaNome, setCapaNome,
      capaEstilo, setCapaEstilo,
      capaFrase, setCapaFrase,
      // rodapé
      footerType, setFooterType,
    }),
    [
      logo, setLogo, removeLogo,
      colorTheme, setColorTheme,
      primaryColor, setPrimaryColor,
      secondaryColor, setSecondaryColor,
      bgColor, setBgColor,
      customColors,
      fontFamily, setFontFamily,
      watermarkSrc, setWatermarkSrc, watermarkOpacity, setWatermarkOpacity, removeWatermark,
      backgroundSrc, setBackgroundSrc, backgroundOpacity, setBackgroundOpacity, removeBackground,
      capaNome, setCapaNome,
      capaEstilo, setCapaEstilo,
      capaFrase, setCapaFrase,
      footerType, setFooterType,
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
  if (!ctx) throw new Error("useAgendaConfig must be used within AgendaConfigProvider");
  return ctx;
}
