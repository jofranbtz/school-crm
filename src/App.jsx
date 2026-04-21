import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";

function App() {
  return (
    <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/" element={<Layout />}>
        <Route path="alumnos" element={<h1>Alumnos</h1>} />
        <Route path="grupos" element={<h1>Grupos</h1>} />
        <Route path="calificaciones" element={<h1>Calificaciones</h1>} />
        <Route path="dashboard" element={<h1>Dashboard</h1>} />
      </Route>
    </Routes>
  );
}

export default App;