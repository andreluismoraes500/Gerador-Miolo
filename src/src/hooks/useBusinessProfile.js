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

  const applyProfileColors = useCallback(
    (setPrimary, setSecondary, setBg) => {
      if (profile?.colors) {
        setPrimary(profile.colors.primary);
        setSecondary(profile.colors.secondary);
        setBg(profile.colors.background);
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
