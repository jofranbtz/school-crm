import { useState } from "react";
import { useApp } from "../context/AppContext";

function Grupos() {
  const { grupos, setGrupos, materias } = useApp();

  const [grupoSeleccionado, setGrupoSeleccionado] = useState(null);
  const grupoActual = grupos.find(g => g.id === grupoSeleccionado?.id);

  const alumnosDisponibles = [
    { id: 1, nombre: "Juan" },
    { id: 2, nombre: "María" },
    { id: 3, nombre: "Carlos" },
  ];

  const [showForm, setShowForm] = useState(false);
  const [editando, setEditando] = useState(null);

  const [form, setForm] = useState({
    nombre: "",
    materia: "",
    ciclo: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.nombre || !form.materia || !form.ciclo) return;

    if (editando) {
      setGrupos(grupos.map(g => g.id === editando ? { ...form, id: editando } : g));
      setEditando(null);
    } else {
      setGrupos([...grupos, { ...form, id: Date.now(), alumnos: [] }]);
    }

    setForm({ nombre:"", materia:"", ciclo:"" });
    setShowForm(false);
  };

  const eliminar = (id) => {
    setGrupos(grupos.filter(g => g.id !== id));
  };

  const editar = (g) => {
    setForm(g);
    setEditando(g.id);
    setShowForm(true);
  };


  const agregarAlumno = (alumno) => {
    const nuevos = grupos.map(g => {
      if (g.id === grupoSeleccionado.id) {
        if (g.alumnos.find(a => a.id === alumno.id)) return g;

        return {
          ...g,
          alumnos: [...g.alumnos, alumno]
        };
      }
      return g;
    });

    setGrupos(nuevos);
  };



  return (
    <div className="p-6 max-w-5xl mx-auto">

      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold mb-4">Grupos</h1>
        <button onClick={()=>setShowForm(true)} className="bg-blue-500 text-white w-12 h-12 rounded-full text-2xl">+</button>
      </div>

      <div className="bg-white shadow rounded">
        {grupos.length === 0 ? (
          <p className="p-6 text-center">No hay grupos</p>
        ) : (
          <table className="w-full text-center">
            <thead className="bg-blue-500 text-white">
              <tr>
                <th>ID</th>
                <th>Grupo</th>
                <th>Materia</th>
                <th>Ciclo</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              
              {grupos.map(g => (
                <tr key={g.id}>
                  <td>{g.id}</td>                  
                  <td>{g.nombre}</td>
                  <td>{g.materia}</td>
                  <td>{g.ciclo}</td>
                  <td>
                    <button onClick={()=>setGrupoSeleccionado(g)}>👁️</button>
                    <button onClick={()=>editar(g)}>✏️</button>
                    <button onClick={()=>eliminar(g.id)}>🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center">
          <div className="bg-gray-900 p-6 rounded text-white w-96">
            <form onSubmit={handleSubmit} className="space-y-3">

              <input placeholder="Grupo" value={form.nombre} onChange={(e)=>setForm({...form,nombre:e.target.value})} className="w-full p-2 bg-white text-black rounded"/>

              <select value={form.materia} onChange={(e)=>setForm({...form,materia:e.target.value})} className="w-full p-2 bg-white text-black rounded">
                <option value="">Selecciona materia</option>
                {materias.map(m => (
                  <option key={m.id}>{m.nombre}</option>
                ))}
              </select>

              <input placeholder="Ciclo" value={form.ciclo} onChange={(e)=>setForm({...form,ciclo:e.target.value})} className="w-full p-2 bg-white text-black rounded"/>

              <div className="flex gap-2">
                <button className="bg-green-500 px-4 py-2">Guardar</button>
                <button type="button" onClick={()=>setShowForm(false)} className="bg-red-500 px-4 py-2">Cancelar</button>
              </div>

            </form>
          </div>
        </div>
        
      )}
      

      {/* MODAL ALUMNOS */}
      {grupoActual && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center">
          <div className="bg-gray-900 p-6 rounded text-white w-96">

            <h2 className="text-center text-xl mb-4">
              Alumnos - {grupoActual?.nombre}
            </h2>

            {grupoActual?.alumnos.length === 0 ? (
              <p className="text-center mb-4">No hay alumnos</p>
            ) : (
              <ul className="mb-4 text-center">
                {grupoActual?.alumnos.map(a => (
                  <li key={a.id}>{a.nombre}</li>
                ))}
              </ul>
            )}

            <div className="flex flex-wrap gap-2 justify-center mb-4">
              {alumnosDisponibles.map(a => (
                <button
                  key={a.id}
                  onClick={() => agregarAlumno(a)}
                  className="bg-blue-500 px-2 py-1 rounded"
                >
                  {a.nombre}
                </button>
              ))}
            </div>

            <button
              onClick={() => setGrupoSeleccionado(null)}
              className="w-full bg-red-500 py-2 rounded"
            >
              Cerrar
            </button>

          </div>
        </div>
      )}



    </div>    
  );  
}

export default Grupos;