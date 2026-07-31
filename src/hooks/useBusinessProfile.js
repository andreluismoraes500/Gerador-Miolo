// src/hooks/useBusinessProfile.js
import { useState, useEffect, useCallback } from "react";
import {
  getBusinessProfile,
  BUSINESS_PROFILES,
} from "../config/businessProfiles";
import { usePersistedState } from "./usePersistedState";

export function useBusinessProfile(initialProfileId = "default") {
  const [profileId, setProfileId] = usePersistedState(
    "business-profile-id",
    initialProfileId,
  );

  const [profile, setProfile] = useState(() => getBusinessProfile(profileId));

  useEffect(() => {
    setProfile(getBusinessProfile(profileId));
  }, [profileId]);

  const changeProfile = useCallback(
    (newProfileId) => {
      if (BUSINESS_PROFILES[newProfileId]) {
        setProfileId(newProfileId);
        return true;
      }
      return false;
    },
    [setProfileId],
  );

  // Agora recebe um profileOverride opcional para aplicar cores e rótulos
  const applyProfileColors = useCallback(
    (
      setPrimary,
      setSecondary,
      setBg,
      setNumeroDia,
      setHora,
      setColunaHora,
      setColunaCliente,
      setColunaServico,
      setColunaValor,
      setColunaStatus,
      profileOverride = null, // perfil a ser usado (se não fornecido, usa o profile atual)
    ) => {
      const targetProfile = profileOverride || profile;
      if (!targetProfile) return;

      if (targetProfile.colors) {
        setPrimary(targetProfile.colors.primary);
        setSecondary(targetProfile.colors.secondary);
        setBg(targetProfile.colors.background);
        setNumeroDia(targetProfile.colors.numeroDia || "#1e293b");
        setHora(targetProfile.colors.hora || "#000000");
      }
      if (targetProfile.labels) {
        setColunaHora(targetProfile.labels.hora || "Hora");
        setColunaCliente(targetProfile.labels.cliente || "Cliente");
        setColunaServico(targetProfile.labels.servico || "Serviço");
        setColunaValor(targetProfile.labels.valor || "Valor");
        setColunaStatus(targetProfile.labels.status || "Status");
      }
    },
    [profile],
  );

  const getThemeId = useCallback(() => {
    return profileId;
  }, [profileId]);

  const getPlaceholders = useCallback(() => {
    return profile?.placeholders || {};
  }, [profile]);

  return {
    profile,
    profileId,
    setProfileId: changeProfile,
    applyProfileColors,
    getThemeId,
    getPlaceholders,
    campos: profile?.campos || {},
    layout: profile?.layout || {},
    horario: profile?.horario || {},
    colors: profile?.colors || {},
  };
}
