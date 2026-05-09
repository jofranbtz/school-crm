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

  const generarId = (lista) => {

    let nuevoId;

    do {
      nuevoId = Math.floor(10000 + Math.random() * 90000);
    } while (lista.some(item => item.id === nuevoId));

    return nuevoId;
  };

  return (
    <AppContext.Provider 
      value={{ 
        materias, 
        setMaterias, 
        grupos, 
        setGrupos,
        generarId
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);