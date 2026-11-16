import { createContext, useContext, useCallback, useMemo } from "react";
import { usePersistedState } from "../hooks/usePersistedState";

const AgendaDataContext = createContext();

export function AgendaDataProvider({ children }) {
  const [editData, setEditData] = usePersistedState("agenda-edit-data", {});

  const setField = useCallback(
    (key, value) => setEditData((prev) => ({ ...prev, [key]: value })),
    [setEditData],
  );

  const getField = useCallback((key) => editData[key] || "", [editData]);

  const value = useMemo(
    () => ({ editData, setField, getField }),
    [editData, setField, getField],
  );

  return (
    <AgendaDataContext.Provider value={value}>
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
