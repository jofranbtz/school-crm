import { useState } from "react";
import { useApp } from "../context/AppContext";

function Materias() {
  const { materias, setMaterias, grupos, setGrupos, generarId } = useApp();

  const [showForm, setShowForm] = useState(false);
  const [editando, setEditando] = useState(null);

  const [form, setForm] = useState({
    clave: "",
    nombre: "",
    semestre: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("=== HANDLE SUBMIT ===");
    console.log("editando actual:", editando);
    console.log("form actual:", form);
    console.log("materias actuales:", materias);

    if (!form.clave || !form.nombre || !form.semestre) {
      alert("Todos los campos son obligatorios");
      return;
    }

    if (editando !== null && editando !== undefined) {
      console.log("Entrando en modo EDICIÓN");
      console.log("Buscando materia con id:", editando);
      
      const nuevas = materias.map((m) => {
        console.log(`Comparando ${m.id} (${typeof m.id}) con ${editando} (${typeof editando})`);
        return m.id === editando ? { ...form, id: editando } : m;
      });
      
      console.log("Nuevo array de materias:", nuevas);
      setMaterias(nuevas);
      setEditando(null);
      setShowForm(false);
      setForm({ clave: "", nombre: "", semestre: "" });
    } else {
      console.log("Entrando en modo CREACIÓN");
      setMaterias([...materias, { ...form, id: generarId(materias) }]);
      setForm({ clave: "", nombre: "", semestre: "" });
      setShowForm(false);
    }
  };

  const eliminar = (id) => {

    const tieneGrupoConAlumnos = grupos.some(
      g => g.materiaId === id && g.alumnos.length > 0
    );

    if (tieneGrupoConAlumnos) {
      alert("No puedes eliminar esta materia porque tiene grupos asociados");
      return;
    }

    const confirmar = window.confirm(
      "¿Seguro que deseas eliminar esta materia?"
    );

    if (!confirmar) return;

    setMaterias(materias.filter((m) => m.id !== id));

    setGrupos(
      grupos.filter(g => g.materiaId !== id)
    );
  };

  const editar = (m) => {
    console.log("=== EDITANDO MATERIA ===");
    console.log("Materia original:", m);
    console.log("ID de la materia a editar:", m.id);
    console.log("Tipo del ID:", typeof m.id);
    
    setForm({
      clave: m.clave,
      nombre: m.nombre,
      semestre: m.semestre,
    });
    setEditando(m.id);
    setShowForm(true);
    
    console.log("editando establecido a:", m.id);
    console.log("Form establecido a:", { clave: m.clave, nombre: m.nombre, semestre: m.semestre });
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
                <button type="submit" className="bg-green-500 px-4 py-2"> Guardar </button>
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