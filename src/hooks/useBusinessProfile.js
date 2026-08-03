// src/hooks/useBusinessProfile.js
import { useState, useEffect, useCallback } from "react";
import {
  getBusinessProfile,
  BUSINESS_PROFILES,
} from "../config/businessProfiles";
import { usePersistedState } from "./usePersistedState";

export function useBusinessProfile(initialProfileId = "default") {
  // IMPORTANTE: a chave precisa começar com "agenda-" — é esse prefixo que
  // captureAgendaState() (src/utils/agendaStateSnapshot.js) usa para tirar
  // a "foto" do localStorage enviada ao backend na hora de gerar o PDF.
  // Antes a chave era "business-profile-id" (sem o prefixo), então o
  // perfil de negócio escolhido (ex: Advogado) NUNCA chegava ao Puppeteer,
  // que sempre renderizava com o perfil padrão ("Geral").
  const [profileId, setProfileId] = usePersistedState(
    "agenda-business-profile-id",
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

  const applyProfileColors = useCallback(
    (
      setPrimary,
      setSecondary,
      setBg,
      setNumeroDia,
      setHora,
      setTableText,
      setColunaHora,
      setColunaCliente,
      setColunaServico,
      setColunaValor,
      setColunaStatus,
      profileOverride = null,
      setMes = null,
      setDiaSemana = null,
    ) => {
      const targetProfile = profileOverride || profile;
      if (!targetProfile) return;

      if (targetProfile.colors) {
        setPrimary(targetProfile.colors.primary);
        setSecondary(targetProfile.colors.secondary);
        setBg(targetProfile.colors.background);
        setNumeroDia(targetProfile.colors.numeroDia || "#1e293b");
        setHora(targetProfile.colors.hora || "#000000");
        setTableText(targetProfile.colors.tableText || "#1e293b");
        // Nome do dia da semana acompanha a cor primária do tema (mesmo
        // padrão que já era usado nos cabeçalhos antes de existir uma cor
        // dedicada); mês/ano usa a secundária, que já é pensada para ser
        // um tom mais discreto/claro em cada perfil.
        if (setDiaSemana) {
          setDiaSemana(
            targetProfile.colors.diaSemana || targetProfile.colors.primary,
          );
        }
        if (setMes) {
          setMes(targetProfile.colors.mes || targetProfile.colors.secondary);
        }
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