import { useState } from "react";
import { jsPDF } from "jspdf";

function Calificaciones() {
  // Datos iniciales de alumnos
  const [alumnos, setAlumnos] = useState([
  
    { id: 1, nombre: "Alejandro", matricula: "2024001", grupo: "208", p1: "", p2: "", p3: "", ord: "" },
    { id: 2, nombre: "Eduardo", matricula: "2024002", grupo: "208", p1: "", p2: "", p3: "", ord: "" },
    { id: 3, nombre: "Guadalupe", matricula: "2024003", grupo: "208", p1: "", p2: "", p3: "", ord: "" },
    { id: 4, nombre: "Fernando", matricula: "2024004", grupo: "408", p1: "", p2: "", p3: "", ord: "" },
    { id: 5, nombre: "Antonio", matricula: "2024005", grupo: "408", p1: "", p2: "", p3: "", ord: "" },
    { id: 6, nombre: "Alain", matricula: "2024006", grupo: "408", p1: "", p2: "", p3: "", ord: "" },
    { id: 7, nombre: "Jose", matricula: "2024007", grupo: "608", p1: "", p2: "", p3: "", ord: "" },
    { id: 8, nombre: "Abdi", matricula: "2024008", grupo: "608", p1: "", p2: "", p3: "", ord: "" },
    { id: 9, nombre: "Jhosua", matricula: "2024009", grupo: "608", p1: "", p2: "", p3: "", ord: "" },
    { id: 10, nombre: "Itzel", matricula: "2024010", grupo: "808", p1: "", p2: "", p3: "", ord: "" },
    { id: 11, nombre: "Taylor", matricula: "2024011", grupo: "808", p1: "", p2: "", p3: "", ord: "" },
    { id: 12, nombre: "Alison", matricula: "2024012", grupo: "808", p1: "", p2: "", p3: "", ord: "" },
    { id: 13, nombre: "Sabrina", matricula: "2024013", grupo: "1008", p1: "", p2: "", p3: "", ord: "" },
    { id: 14, nombre: "Olivia", matricula: "2024014", grupo: "1008", p1: "", p2: "", p3: "", ord: "" },
    { id: 15, nombre: "Ariana", matricula: "2024015", grupo: "1008", p1: "", p2: "", p3: "", ord: "" },
  ]);

  const [grupoSeleccionado, setGrupoSeleccionado] = useState("208");
  const [ponderacionesPorGrupo, setPonderacionesPorGrupo] = useState({});
  const defaultPonderaciones = { p1: 33, p2: 33, p3: 34 };
  const [pesoActual, setPesoActual] = useState(defaultPonderaciones);
  const [errorPonderaciones, setErrorPonderaciones] = useState("");

  const materia = "Matemáticas";
  const cicloEscolar = "2025-2026";

  const generarBoleta = (alumno) => {
    const documento = new jsPDF();
    const final = calcularFinal(alumno);
    const estatus = parseFloat(final) >= 6 ? "Aprobado" : "Reprobado";

    documento.setFontSize(18);
    documento.text("Boleta de Calificaciones", 105, 20, { align: "center" });

    documento.setFontSize(12);
    documento.text(`Nombre: ${alumno.nombre}`, 20, 40);
    documento.text(`Matrícula: ${alumno.matricula}`, 20, 48);
    documento.text(`Materia: ${materia}`, 20, 56);
    documento.text(`Grupo: ${alumno.grupo}`, 20, 64);
    documento.text(`Ciclo escolar: ${cicloEscolar}`, 20, 72);

    documento.setFontSize(14);
    documento.text("Calificaciones", 20, 90);

    documento.setFontSize(12);
    documento.text(`Parcial 1: ${alumno.p1 || "-"}`, 20, 102);
    documento.text(`Parcial 2: ${alumno.p2 || "-"}`, 20, 110);
    documento.text(`Parcial 3: ${alumno.p3 || "-"}`, 20, 118);
    documento.text(`Ordinario: ${alumno.ord || "-"}`, 20, 126);
    documento.text(`Calificación final: ${final}`, 20, 134);
    documento.text(`Estatus: ${estatus}`, 20, 142);

    documento.save(`${alumno.nombre.replace(/\s+/g, "_")}_boleta_${alumno.grupo}.pdf`);
  };

  // Grupos disponibles
  const grupos = ["208", "408", "608", "808", "1008"];

  // Manejar cambio de calificaciones
  const handleChange = (id, campo, valor) => {
    // Validar que solo acepte números entre 0 y 10
    let valorValidado = valor;
    
    if (valor !== "") {
      const num = parseFloat(valor);
      if (isNaN(num)) {
        valorValidado = "";
      } else if (num < 0) {
        valorValidado = "0";
      } else if (num > 10) {
        valorValidado = "10";
      } else {
        valorValidado = num.toString();
      }
    }

    const nuevos = alumnos.map((a) =>
      a.id === id ? { ...a, [campo]: valorValidado } : a
    );
    setAlumnos(nuevos);
  };

  const validarPonderaciones = (pesos) => {
    const total = (Number(pesos.p1) || 0) + (Number(pesos.p2) || 0) + (Number(pesos.p3) || 0);
    if (total !== 100) {
      setErrorPonderaciones("Los porcentajes deben sumar exactamente 100%.");
      return false;
    }

    if ([pesos.p1, pesos.p2, pesos.p3].some((value) => value === "" || Number(value) < 0 || Number(value) > 100)) {
      setErrorPonderaciones("Ingresa porcentajes válidos entre 0 y 100 para cada parcial.");
      return false;
    }

    setErrorPonderaciones("");
    return true;
  };

  const guardarPonderaciones = () => {
    const pesos = {
      p1: Number(pesoActual.p1),
      p2: Number(pesoActual.p2),
      p3: Number(pesoActual.p3),
    };

    if (!validarPonderaciones(pesoActual)) {
      return;
    }

    setPonderacionesPorGrupo({
      ...ponderacionesPorGrupo,
      [grupoSeleccionado]: pesos,
    });
    setErrorPonderaciones("");
  };

  const obtenerPonderaciones = () => {
    return ponderacionesPorGrupo[grupoSeleccionado] ?? null;
  };

  // Calcular calificación final
  const calcularFinal = (a) => {
    const p1 = parseFloat(a.p1) || 0;
    const p2 = parseFloat(a.p2) || 0;
    const p3 = parseFloat(a.p3) || 0;
    const pesos = obtenerPonderaciones();

    const promedioParciales = pesos
      ? (p1 * pesos.p1 + p2 * pesos.p2 + p3 * pesos.p3) / 100
      : (p1 + p2 + p3) / 3;

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

  // Calcular estadísticas del grupo
  const calcularEstadisticas = () => {
    const total = alumnosFiltrados.length;
    let aprobados = 0;
    let reprobados = 0;
    let sumaFinales = 0;
    let contCalificados = 0;

    alumnosFiltrados.forEach((alumno) => {
      const final = parseFloat(calcularFinal(alumno));
      sumaFinales += final;
      contCalificados++;
      if (final >= 6) {
        aprobados++;
      } else {
        reprobados++;
      }
    });

    const promedio = contCalificados > 0 ? (sumaFinales / contCalificados).toFixed(1) : 0;

    return { total, aprobados, reprobados, promedio };
  };

  const estadisticas = calcularEstadisticas();

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
          onChange={(e) => {
            const grupo = e.target.value;
            setGrupoSeleccionado(grupo);
            setPesoActual(ponderacionesPorGrupo[grupo] ?? defaultPonderaciones);
            setErrorPonderaciones("");
          }}
          className="w-full md:w-1/3 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {grupos.map((g) => (
            <option key={g} value={g}>
              Grupo {g}
            </option>
          ))}
        </select>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-900">Configurar ponderaciones</p>
              <p className="text-xs text-gray-600">Solo parcial 1, 2 y 3. Si no se define, se usa promedio simple.</p>
            </div>
            <p className="text-sm text-gray-700">
              {obtenerPonderaciones()
                ? `Ponderaciones guardadas para Grupo ${grupoSeleccionado}`
                : `Sin ponderaciones definidas`}
            </p>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-4">
            {['p1', 'p2', 'p3'].map((campo, index) => (
              <label key={campo} className="block text-sm font-medium text-gray-700">
                Parcial {index + 1}
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={pesoActual[campo]}
                  onChange={(e) =>
                    setPesoActual({
                      ...pesoActual,
                      [campo]: e.target.value,
                    })
                  }
                  className="mt-1 w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </label>
            ))}
          </div>

          <div className="mt-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-gray-700">
              Total: {(Number(pesoActual.p1) || 0) + (Number(pesoActual.p2) || 0) + (Number(pesoActual.p3) || 0)}%
            </p>
            <button
              type="button"
              onClick={guardarPonderaciones}
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Guardar ponderaciones
            </button>
          </div>

          {errorPonderaciones && (
            <p className="mt-2 text-sm text-red-600">{errorPonderaciones}</p>
          )}
        </div>
      </div>

      {/* Estadísticas del grupo */}
<div className="mb-4 grid grid-cols-2 md:grid-cols-4 gap-2">
  <div className="bg-blue-50 p-2 rounded-md border border-blue-200">
    <p className="text-xs font-medium text-blue-600 mb-0">Total de alumnos</p>
    <p className="text-lg font-bold text-blue-900">{estadisticas.total}</p>
  </div>

  <div className="bg-green-50 p-2 rounded-md border border-green-200">
    <p className="text-xs font-medium text-green-600 mb-0">Aprobados</p>
    <p className="text-lg font-bold text-green-900">{estadisticas.aprobados}</p>
  </div>

  <div className="bg-red-50 p-2 rounded-md border border-red-200">
    <p className="text-xs font-medium text-red-600 mb-0">Reprobados</p>
    <p className="text-lg font-bold text-red-900">{estadisticas.reprobados}</p>
  </div>

  <div className="bg-purple-50 p-2 rounded-md border border-purple-200">
    <p className="text-xs font-medium text-purple-600 mb-0">Promedio general</p>
    <p className="text-lg font-bold text-purple-900">{estadisticas.promedio}</p>
  </div>
</div>

      {/* Tabla de calificaciones */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase">
                  Nombre
                </th>
                <th className="px-4 py-2 text-center text-xs font-semibold text-gray-700 uppercase">
                  P1
                </th>
                <th className="px-4 py-2 text-center text-xs font-semibold text-gray-700 uppercase">
                  P2
                </th>
                <th className="px-4 py-2 text-center text-xs font-semibold text-gray-700 uppercase">
                  P3
                </th>
                <th className="px-4 py-2 text-center text-xs font-semibold text-gray-700 uppercase">
                  Ord
                </th>
                <th className="px-4 py-2 text-center text-xs font-semibold text-gray-700 uppercase">
                  Final
                </th>
                <th className="px-4 py-2 text-center text-xs font-semibold text-gray-700 uppercase">
                  Estatus
                </th>
                <th className="px-4 py-2 text-center text-xs font-semibold text-gray-700 uppercase">
                  Acción
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {alumnosFiltrados.map((a) => (
                <tr key={a.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-sm text-gray-900 font-medium">
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
                      className="w-20 px-2 py-1 text-sm border border-gray-300 rounded text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                      className="w-20 px-2 py-1 text-sm border border-gray-300 rounded text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                      className="w-20 px-2 py-1 text-sm border border-gray-300 rounded text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                      className="w-20 px-2 py-1 text-sm border border-gray-300 rounded text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-4 py-2 text-center text-sm font-bold text-gray-900">
                    {calcularFinal(a)}
                  </td>
                  <td className="px-4 py-2 text-center">
                    <span
                      className={`px-2.5 py-1 rounded text-xs font-semibold ${
                        parseFloat(calcularFinal(a)) >= 6
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {parseFloat(calcularFinal(a)) >= 6 ? "Aprobado" : "Reprobado"}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-center">
                    <button
                      type="button"
                      onClick={() => generarBoleta(a)}
                      className="px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      Generar
                    </button>
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