import { useState } from "react";

function Calificaciones() {
  // Datos iniciales de alumnos
  const [alumnos, setAlumnos] = useState([
    { id: 1, nombre: "Jose", grupo: "608", p1: "", p2: "", p3: "", ord: "" },
    { id: 2, nombre: "Alejandro", grupo: "808", p1: "", p2: "", p3: "", ord: "" },
    { id: 3, nombre: "Jesus", grupo: "408", p1: "", p2: "", p3: "", ord: "" },
  ]);

  const [grupoSeleccionado, setGrupoSeleccionado] = useState("608");

  // Grupos disponibles
  const grupos = ["608", "808", "408"];

  // Manejar cambio de calificaciones
  const handleChange = (id, campo, valor) => {
    const nuevos = alumnos.map((a) =>
      a.id === id ? { ...a, [campo]: valor } : a
    );
    setAlumnos(nuevos);
  };

  // Calcular calificación final
  const calcularFinal = (a) => {
    const p1 = parseFloat(a.p1) || 0;
    const p2 = parseFloat(a.p2) || 0;
    const p3 = parseFloat(a.p3) || 0;

    const promedioParciales = (p1 + p2 + p3) / 3;

    if (a.ord === "") {
      return promedioParciales.toFixed(1);
    }

    const ord = parseFloat(a.ord);
    const final = promedioParciales * 0.5 + ord * 0.5;

    return final.toFixed(1);
  };

  // Filtrar alumnos por grupo seleccionado
  const alumnosFiltrados = alumnos.filter(
    (a) => a.grupo === grupoSeleccionado
  );

  return (
    <section className="p-6">
      <h1 className="text-2xl font-bold mb-6">Calificaciones</h1>

      {/* Selector de grupo */}
      <div className="mb-6 bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <label htmlFor="grupo" className="block text-sm font-medium text-gray-700 mb-2">
          Seleccionar Grupo
        </label>
        <select
          id="grupo"
          value={grupoSeleccionado}
          onChange={(e) => setGrupoSeleccionado(e.target.value)}
          className="w-full md:w-1/3 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {grupos.map((g) => (
            <option key={g} value={g}>
              Grupo {g}
            </option>
          ))}
        </select>
      </div>

      {/* Tabla de calificaciones */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Parcial 1
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Parcial 2
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Parcial 3
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ordinario
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Final
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {alumnosFiltrados.map((a) => (
                <tr key={a.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-sm text-gray-900">
                    {a.nombre}
                  </td>
                  <td className="px-4 py-2 text-center">
                    <input
                      type="number"
                      min="0"
                      max="10"
                      step="0.1"
                      value={a.p1}
                      onChange={(e) => handleChange(a.id, "p1", e.target.value)}
                      className="w-20 px-2 py-1 border border-gray-300 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-4 py-2 text-center">
                    <input
                      type="number"
                      min="0"
                      max="10"
                      step="0.1"
                      value={a.p2}
                      onChange={(e) => handleChange(a.id, "p2", e.target.value)}
                      className="w-20 px-2 py-1 border border-gray-300 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-4 py-2 text-center">
                    <input
                      type="number"
                      min="0"
                      max="10"
                      step="0.1"
                      value={a.p3}
                      onChange={(e) => handleChange(a.id, "p3", e.target.value)}
                      className="w-20 px-2 py-1 border border-gray-300 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-4 py-2 text-center">
                    <input
                      type="number"
                      min="0"
                      max="10"
                      step="0.1"
                      value={a.ord}
                      onChange={(e) => handleChange(a.id, "ord", e.target.value)}
                      className="w-20 px-2 py-1 border border-gray-300 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-4 py-2 text-center text-sm font-medium text-gray-900">
                    {calcularFinal(a)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export default Calificaciones;