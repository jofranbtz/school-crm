import { createContext, useContext, useEffect, useState } from "react";

const AppContext = createContext();

export function AppProvider({ children }) {
  const [materias, setMaterias] = useState([]);
  const [grupos, setGrupos] = useState([]);

  // Cargar de localStorage
  useEffect(() => {
    const m = JSON.parse(localStorage.getItem("materias")) || [];
    const g = JSON.parse(localStorage.getItem("grupos")) || [];
    setMaterias(m);
    setGrupos(g);
  }, []);

  // Guardar en localStorage
  useEffect(() => {
    localStorage.setItem("materias", JSON.stringify(materias));
  }, [materias]);

  useEffect(() => {
    localStorage.setItem("grupos", JSON.stringify(grupos));
  }, [grupos]);

  return (
    <AppContext.Provider value={{ materias, setMaterias, grupos, setGrupos }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);