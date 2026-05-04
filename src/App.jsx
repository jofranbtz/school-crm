import './App.css'
import { Routes, Route } from 'react-router-dom'
import { useEffect } from "react";
import client from "./api/client";

import Layout from "./components/Layout";

import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Alumnos from './pages/Alumnos.jsx'
import Grupos from './pages/Grupos.jsx'
import Calificaciones from './pages/Calificaciones.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Materias from './pages/Materias.jsx'

function App() {
  useEffect(() => {
    client.get("/users")
      .then((res) => console.log(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="alumnos" element={<Alumnos />} />
        <Route path="grupos" element={<Grupos />} />
        <Route path="calificaciones" element={<Calificaciones />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="materias" element={<Materias />} />
      </Route>
    </Routes>
  );
}

export default App;