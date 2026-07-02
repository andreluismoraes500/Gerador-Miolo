import { createContext, useContext } from "react";
import { usePersistedState } from "../hooks/usePersistedState";

const AgendaDataContext = createContext();

export function AgendaDataProvider({ children }) {
  const [editData, setEditData] = usePersistedState("agenda-edit-data", {});

  const setField = (key, value) => {
    setEditData((prev) => ({ ...prev, [key]: value }));
  };

  const getField = (key) => {
    return editData[key] || "";
  };

  return (
    <AgendaDataContext.Provider value={{ editData, setField, getField }}>
      {children}
    </AgendaDataContext.Provider>
  );
}

export function useAgendaData() {
  const context = useContext(AgendaDataContext);
  if (!context) {
    throw new Error("useAgendaData must be used within AgendaDataProvider");
  }
  return context;
}
