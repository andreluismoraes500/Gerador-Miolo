// src/context/BusinessProfileContext.jsx

import { createContext, useContext, useMemo } from "react";
import { useBusinessProfile } from "../hooks/useBusinessProfile";

const BusinessProfileContext = createContext(null);

export function BusinessProfileProvider({
  children,
  initialProfileId = "default",
}) {
  const businessProfile = useBusinessProfile(initialProfileId);

  const value = useMemo(() => businessProfile, [businessProfile]);

  return (
    <BusinessProfileContext.Provider value={value}>
      {children}
    </BusinessProfileContext.Provider>
  );
}

export function useBusinessProfileContext() {
  const context = useContext(BusinessProfileContext);
  if (!context) {
    throw new Error(
      "useBusinessProfileContext must be used within BusinessProfileProvider",
    );
  }
  return context;
}
