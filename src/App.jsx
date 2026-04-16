import './App.css'
import { NavLink, Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Alumnos from './pages/Alumnos.jsx'
import Grupos from './pages/Grupos.jsx'
import Calificaciones from './pages/Calificaciones.jsx'
import Dashboard from './pages/Dashboard.jsx'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <nav>
          <NavLink to="/" end>
            Inicio
          </NavLink>
          <NavLink to="/alumnos">Alumnos</NavLink>
          <NavLink to="/grupos">Grupos</NavLink>
          <NavLink to="/calificaciones">Calificaciones</NavLink>
          <NavLink to="/dashboard">Dashboard</NavLink>
        </nav>
      </header>

      <main className="App-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/alumnos" element={<Alumnos />} />
          <Route path="/grupos" element={<Grupos />} />
          <Route path="/calificaciones" element={<Calificaciones />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
