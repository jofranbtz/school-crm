import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-gray-800 text-white p-4 flex gap-4">
      <Link to="/alumnos" className="hover:text-blue-400">Alumnos</Link>
      <Link to="/grupos" className="hover:text-blue-400">Grupos</Link>
      <Link to="/calificaciones" className="hover:text-blue-400">Calificaciones</Link>
      <Link to="/dashboard" className="hover:text-blue-400">Dashboard</Link>
      <Link to="/materias" className="hover:text-blue-400">Materias</Link>
    </nav>
  );
}

export default Navbar;