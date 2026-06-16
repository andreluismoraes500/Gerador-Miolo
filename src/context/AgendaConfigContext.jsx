import { createContext, useContext, useState } from "react";

const AgendaConfigContext = createContext();

export function AgendaConfigProvider({ children }) {
  const [logo, setLogo] = useState(null);

  const value = {
    logo,
    setLogo,
  };

  return (
    <AgendaConfigContext.Provider value={value}>
      {children}
    </AgendaConfigContext.Provider>
  );
}

export function useAgendaConfig() {
  const context = useContext(AgendaConfigContext);
  if (!context) {
    throw new Error("useAgendaConfig must be used within AgendaConfigProvider");
  }
  return context;
}
