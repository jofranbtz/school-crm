import { useState } from "react";

function Materias() {
  const [materias, setMaterias] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    clave: "",
    nombre: "",
    calificacion: "",
    semestre: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.clave || !form.nombre || !form.calificacion || !form.semestre) {
      alert("Todos los campos son obligatorios");
      return;
    }

    setMaterias([...materias, form]);

    setForm({
      clave: "",
      nombre: "",
      calificacion: "",
      semestre: "",
    });

    setShowForm(false);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">

      {/* HEADER */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold mb-4">Materias</h1>

        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white text-2xl w-12 h-12 rounded-full flex items-center justify-center mx-auto shadow-lg transition"
        >
          +
        </button>
      </div>

      {/* TABLA */}
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        {materias.length === 0 ? (
          <p className="p-6 text-gray-500 text-center">
            No hay materias registradas
          </p>
        ) : (
          <table className="w-full">
            <thead className="bg-blue-500 text-white">
              <tr>
                <th className="p-3">Clave</th>
                <th className="p-3">Nombre</th>
                <th className="p-3">Calificación</th>
                <th className="p-3">Semestre</th>
              </tr>
            </thead>
            <tbody>
              {materias.map((m, index) => (
                <tr key={index} className="border-t text-center hover:bg-gray-100">
                  <td className="p-2">{m.clave}</td>
                  <td className="p-2">{m.nombre}</td>
                  <td className="p-2">{m.calificacion}</td>
                  <td className="p-2">{m.semestre}</td>
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
              Nueva Materia
            </h2>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                name="clave"
                placeholder="Clave"
                value={form.clave}
                onChange={handleChange}
                className="p-2 w-full rounded bg-gray-800 border border-gray-600"
              />

              <input
                type="text"
                name="nombre"
                placeholder="Nombre"
                value={form.nombre}
                onChange={handleChange}
                className="p-2 w-full rounded bg-gray-800 border border-gray-600"
              />

              <input
                type="number"
                min="0"
                max="10"
                step="0.1"
                name="calificacion"
                placeholder="Calificación"
                value={form.calificacion}
                onChange={(e) => {
                  const value = e.target.value;

                  if (value === "" || (parseFloat(value) >= 0 && parseFloat(value) <= 10)) {
                    setForm({
                      ...form,
                      calificacion: value,
                    });
                  }
                }}
                className="p-2 w-full rounded bg-gray-800 border border-gray-600"
              />

              {/* SELECT DE SEMESTRE */}
              <select
                name="semestre"
                value={form.semestre}
                onChange={handleChange}
                className="p-2 w-full rounded bg-gray-800 border border-gray-600"
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

export default Materias;