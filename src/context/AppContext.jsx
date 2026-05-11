import { createContext, useContext, useEffect, useState } from "react";

const AppContext = createContext();

const normalizarAlumno = (alumno) => {
  return {
    ...alumno,
    grupos: Array.isArray(alumno.grupos)
      ? alumno.grupos
      : alumno.grupo
        ? [alumno.grupo]
        : [],
  };
};

export function AppProvider({ children }) {

  const [materias, setMaterias] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const [alumnos, setAlumnos] = useState(() => {
    const stored = localStorage.getItem("alumnos");

    const data = stored
      ? JSON.parse(stored)
      : alumnosIniciales;

    return data.map(normalizarAlumno);
  });


  const alumnosIniciales = [
    {
      id: 1,
      nombre: "Juan",
      apellido: "Pérez",
      matricula: "2021001",
      carrera: "Ingeniería en Sistemas",
      semestre: "8",
      grupo: ["A"],
      estado: "Activo",
    },
    {
      id: 2,
      nombre: "María",
      apellido: "García",
      matricula: "2021002",
      carrera: "Ingeniería Civil",
      semestre: "6",
      grupo: ["B"],
      estado: "Activo",
    },
    {
      id: 3,
      nombre: "Carlos",
      apellido: "López",
      matricula: "2021003",
      carrera: "Medicina",
      semestre: "10",
      grupo: ["C"],
      estado: "Inactivo",
    },
  ];




  // Cargar de localStorage
  useEffect(() => {
    const m = JSON.parse(localStorage.getItem("materias")) || [];
    const g = JSON.parse(localStorage.getItem("grupos")) || [];
   

    setMaterias(m);
    setGrupos(g);
    
  }, []);

  // Guardar materias
  useEffect(() => {
    localStorage.setItem("materias", JSON.stringify(materias));
  }, [materias]);

  // Guardar grupos
  useEffect(() => {
    localStorage.setItem("grupos", JSON.stringify(grupos));
  }, [grupos]);

  useEffect(() => {
    localStorage.setItem("alumnos", JSON.stringify(alumnos));
  }, [alumnos]);

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
        grupos,
        setGrupos,
        materias,
        setMaterias,   // <--- AGREGAR ESTA LÍNEA
        generarId,
        alumnos,
        setAlumnos
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);