import { useState } from "react";
import { useApp } from "../context/AppContext";

function Materias() {
  const { materias, setMaterias } = useApp();

  const [showForm, setShowForm] = useState(false);
  const [editando, setEditando] = useState(null);

  const [form, setForm] = useState({
    clave: "",
    nombre: "",
    semestre: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.clave || !form.nombre || !form.semestre) {
      alert("Todos los campos son obligatorios");
      return;
    }

    if (editando !== null) {
      const nuevas = materias.map((m) =>
        m.id === editando ? { ...form, id: editando } : m
      );
      setMaterias(nuevas);
      setEditando(null);
    } else {
      setMaterias([...materias, { ...form, id: Date.now() }]);
    }

    setForm({ clave: "", nombre: "", semestre: "" });
    setShowForm(false);
  };

  const eliminar = (id) => {
    setMaterias(materias.filter((m) => m.id !== id));
  };

  const editar = (m) => {
    setForm(m);
    setEditando(m.id);
    setShowForm(true);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">

      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold mb-4">Materias</h1>
        <button onClick={() => setShowForm(true)}
          className="bg-blue-500 text-white w-12 h-12 rounded-full text-2xl">
          +
        </button>
      </div>

      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        {materias.length === 0 ? (
          <p className="p-6 text-center">No hay materias</p>
        ) : (
          <table className="w-full text-center">
            <thead className="bg-blue-500 text-white">
              <tr>
                <th>ID</th>
                <th>Clave</th>
                <th>Nombre</th>
                <th>Semestre</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {materias.map((m) => (
                <tr key={m.id}>
                  <td>{m.id}</td>                  
                  <td>{m.clave}</td>
                  <td>{m.nombre}</td>
                  <td>{m.semestre}</td>
                  <td className="space-x-2">
                    <button onClick={() => editar(m)}>✏️</button>
                    <button onClick={() => eliminar(m.id)}>🗑️</button>
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
              <input name="clave" value={form.clave} onChange={(e)=>setForm({...form,clave:e.target.value})} placeholder="Clave" className="w-full p-2 bg-blue-500 text-white rounded"/>
              <input name="nombre" value={form.nombre} onChange={(e)=>setForm({...form,nombre:e.target.value})} placeholder="Nombre" className="w-full p-2 bg-blue-500 text-white rounded"/>
              
              <select
                value={form.semestre}
                onChange={(e)=>setForm({...form, semestre: e.target.value})}
                className="w-full p-2 bg-blue-500 text-white rounded"
              >
                <option value="">Selecciona semestre</option>
                <option>Primero</option>
                <option>Segundo</option>
                <option>Tercero</option>
                <option>Cuarto</option>
                <option>Quinto</option>
                <option>Sexto</option>
                <option>Séptimo</option>
                <option>Octavo</option>
                <option>Noveno</option>
                <option>Décimo</option>
              </select>

              <div className="flex gap-2">
                <button className="bg-green-500 px-4 py-2">Guardar</button>
                <button type="button" onClick={()=>setShowForm(false)} className="bg-red-500 px-4 py-2">Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Materias;