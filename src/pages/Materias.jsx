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



  const [filtro, setFiltro] = useState("PRIMERO_DECIMO");

  const ordenSemestres = [
    "Primero",
    "Segundo",
    "Tercero",
    "Cuarto",
    "Quinto",
    "Sexto",
    "Séptimo",
    "Octavo",
    "Noveno",
    "Décimo",
  ];

  const materiasOrdenadas = [...materias];

  if (filtro === "PRIMERO_DECIMO") {
    materiasOrdenadas.sort(
      (a, b) =>
        ordenSemestres.indexOf(a.semestre) -
        ordenSemestres.indexOf(b.semestre)
    );
  }

  if (filtro === "DECIMO_PRIMERO") {
    materiasOrdenadas.sort(
      (a, b) =>
        ordenSemestres.indexOf(b.semestre) -
        ordenSemestres.indexOf(a.semestre)
    );
  }

  if (filtro === "NOMBRE_AZ") {
    materiasOrdenadas.sort((a, b) =>
      a.nombre.localeCompare(b.nombre)
    );
  }

  if (filtro === "NOMBRE_ZA") {
    materiasOrdenadas.sort((a, b) =>
      b.nombre.localeCompare(a.nombre)
    );
  }






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

      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Materias
        </h1>

        <div className="flex justify-between items-center">

          <div className="flex items-center gap-3">

            <label className="font-semibold">
              Mostrar por:
            </label>

            <select
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2"
            >
              <option value="PRIMERO_DECIMO">
                PRIMER SEMESTRE A DÉCIMO
              </option>

              <option value="DECIMO_PRIMERO">
                DÉCIMO A PRIMERO
              </option>

              <option value="NOMBRE_AZ">
                NOMBRE A - Z
              </option>

              <option value="NOMBRE_ZA">
                NOMBRE Z - A
              </option>
            </select>

          </div>

          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-500 text-white w-12 h-12 rounded-full text-2xl"
          >
            +
          </button>

        </div>
      </div>

      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        {materias.length === 0 ? (
          <p className="p-6 text-center">No hay materias</p>
        ) : (
          <table className="w-full text-center border-collapse">
            <thead className="bg-blue-500 text-white">
              <tr>
                <th className="px-4 py-2 border border-gray-200">
                  ID
                </th>

                <th className="px-4 py-2 border border-gray-200">
                  Clave
                </th>

                <th className="px-4 py-2 border border-gray-200">
                  Nombre
                </th>

                <th className="px-4 py-2 border border-gray-200">
                  Semestre
                </th>

                <th className="px-4 py-2 border border-gray-200">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {materiasOrdenadas.map((m) => (
                <tr key={m.id}>
                  <td className="px-4 py-2 border border-gray-200">{m.id}</td>                  
                  <td className="px-4 py-2 border border-gray-200">{m.clave}</td>
                  <td className="px-4 py-2 border border-gray-200">{m.nombre}</td>
                  <td className="px-4 py-2 border border-gray-200">{m.semestre}</td>
                  <td className="px-4 py-2 border border-gray-200">
                    <button onClick={() => editar(m)} className="bg-blue-500 text-white p-2 rounded">
                      ✏️
                    </button>
                    <button onClick={() => eliminar(m.id)} className="bg-red-500 text-white p-2 rounded">
                      🗑️
                    </button>
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