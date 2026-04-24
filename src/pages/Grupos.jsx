import { useState } from "react";

function Grupos() {
  const materias = [
    { clave: "MAT101", nombre: "Matemáticas" },
    { clave: "PRO102", nombre: "Programación" },
  ];

  const [grupos, setGrupos] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    nombre: "",
    materia: "",
    ciclo: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.nombre || !form.materia || !form.ciclo) {
      alert("Todos los campos son obligatorios");
      return;
    }

    setGrupos([...grupos, form]);

    setForm({
      nombre: "",
      materia: "",
      ciclo: "",
    });

    setShowForm(false);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">

      {/* HEADER */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold mb-4">Grupos</h1>

        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white text-2xl w-12 h-12 rounded-full flex items-center justify-center mx-auto shadow-lg transition"
        >
          +
        </button>
      </div>

      {/* TABLA */}
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        {grupos.length === 0 ? (
          <p className="p-6 text-gray-500 text-center">
            No hay grupos registrados
          </p>
        ) : (
          <table className="w-full">
            <thead className="bg-blue-500 text-white">
              <tr>
                <th className="p-3">Grupo</th>
                <th className="p-3">Materia</th>
                <th className="p-3">Ciclo</th>
              </tr>
            </thead>
            <tbody>
              {grupos.map((g, index) => (
                <tr key={index} className="border-t text-center hover:bg-gray-100">
                  <td className="p-2">{g.nombre}</td>
                  <td className="p-2">{g.materia}</td>
                  <td className="p-2">{g.ciclo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* MODAL */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center">

          <div className="bg-gray-900 text-white p-6 rounded-xl w-full max-w-md shadow-2xl border border-gray-700">
            <h2 className="text-xl font-bold mb-4 text-center">
              Nuevo Grupo
            </h2>

            <form onSubmit={handleSubmit} className="space-y-3">

              <input
                type="text"
                name="nombre"
                placeholder="Nombre del grupo"
                value={form.nombre}
                onChange={handleChange}
                className="p-2 w-full rounded bg-gray-800 border border-gray-600"
              />

              <select
                name="materia"
                value={form.materia}
                onChange={handleChange}
                className="p-2 w-full rounded bg-gray-800 border border-gray-600"
              >
                <option value="">Selecciona una materia</option>
                {materias.map((m, index) => (
                  <option key={index} value={m.nombre}>
                    {m.nombre}
                  </option>
                ))}
              </select>

              <input
                type="text"
                name="ciclo"
                placeholder="Ciclo escolar (ej. 2024-2025)"
                value={form.ciclo}
                onChange={handleChange}
                className="p-2 w-full rounded bg-gray-800 border border-gray-600"
              />

              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-700"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 rounded hover:bg-blue-600"
                >
                  Guardar
                </button>
              </div>

            </form>
          </div>

        </div>
      )}
    </div>
  );
}

export default Grupos;