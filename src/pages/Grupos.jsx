import { useState } from "react";
import GroupDashboard from "../components/GroupDashboard";

function Grupos() {
  const [grupoSeleccionado, setGrupoSeleccionado] = useState("208");
  const [pestanaActiva, setPestanaActiva] = useState("asistencia");

  // Datos de alumnos con calificaciones
  const [alumnos, setAlumnos] = useState([
    { id: 1, nombre: "Alejandro", matricula: "2024001", grupo: "208", p1: "10", p2: "9", p3: "8", ord: "4" },
    { id: 2, nombre: "Eduardo", matricula: "2024002", grupo: "208", p1: "9", p2: "2", p3: "7", ord: "6" },
    { id: 3, nombre: "Guadalupe", matricula: "2024003", grupo: "208", p1: "10", p2: "10", p3: "10", ord: "10" },
    { id: 4, nombre: "Fernando", matricula: "2024004", grupo: "408", p1: "5", p2: "4", p3: "7", ord: "6" },
    { id: 5, nombre: "Antonio", matricula: "2024005", grupo: "408", p1: "5", p2: "3", p3: "7", ord: "8" },
    { id: 6, nombre: "Alain", matricula: "2024006", grupo: "408", p1: "8", p2: "9", p3: "10", ord: "9" },
    { id: 7, nombre: "Jose", matricula: "2024007", grupo: "608", p1: "7", p2: "8", p3: "9", ord: "10" },
    { id: 8, nombre: "Abdi", matricula: "2024008", grupo: "608", p1: "5", p2: "4", p3: "9", ord: "5" },
    { id: 9, nombre: "Jhosua", matricula: "2024009", grupo: "608", p1: "6", p2: "7", p3: "8", ord: "9" },
    { id: 10, nombre: "Itzel", matricula: "2024010", grupo: "808", p1: "7", p2: "8", p3: "5", ord: "5" },
    { id: 11, nombre: "Taylor", matricula: "2024011", grupo: "808", p1: "8", p2: "8", p3: "8", ord: "5" },
    { id: 12, nombre: "Alison", matricula: "2024012", grupo: "808", p1: "10", p2: "10", p3: "10", ord: "10" },
    { id: 13, nombre: "Sabrina", matricula: "2024013", grupo: "1008", p1: "10", p2: "8", p3: "9", ord: "9" },
    { id: 14, nombre: "Olivia", matricula: "2024014", grupo: "1008", p1: "10", p2: "10", p3: "10", ord: "10" },
    { id: 15, nombre: "Ariana", matricula: "2024015", grupo: "1008", p1: "8", p2: "8", p3: "8", ord: "8" },
  ]);

  const [ponderacionesPorGrupo, setPonderacionesPorGrupo] = useState({});
  const defaultPonderaciones = { p1: 33, p2: 33, p3: 34 };
  const [pesoActual, setPesoActual] = useState(defaultPonderaciones);

  const [asistencias, setAsistencias] = useState([]);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date().toISOString().split('T')[0]);
  const [asistenciaActual, setAsistenciaActual] = useState({});

  // Datos de alumnos por grupo (para asistencia)
  const alumnosPorGrupo = {
    208: alumnos.filter(a => a.grupo === "208"),
    408: alumnos.filter(a => a.grupo === "408"),
    608: alumnos.filter(a => a.grupo === "608"),
    808: alumnos.filter(a => a.grupo === "808"),
    1008: alumnos.filter(a => a.grupo === "1008"),
  };

  const grupos = Object.keys(alumnosPorGrupo);
  const alumnosGrupo = alumnosPorGrupo[grupoSeleccionado];

  // Calcular calificación final
  const obtenerPonderaciones = () => {
    return ponderacionesPorGrupo[grupoSeleccionado] ?? null;
  };

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

  // Manejar cambio de calificaciones
  const handleChangeCalificacion = (id, campo, valor) => {
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

  // Registrar asistencia
  const registrarAsistencia = () => {
    if (!fechaSeleccionada) {
      alert("Por favor selecciona una fecha");
      return;
    }

    // Verificar si ya existe registro para esta fecha
    const yaExiste = asistencias.some(
      (a) => a.fecha === fechaSeleccionada && a.grupo === grupoSeleccionado
    );

    if (yaExiste) {
      alert("Ya existe un registro de asistencia para esta fecha en este grupo");
      return;
    }

    const registroAsistencia = {
      id: Date.now(),
      fecha: fechaSeleccionada,
      grupo: grupoSeleccionado,
      registros: asistenciaActual,
    };

    setAsistencias([...asistencias, registroAsistencia]);
    setAsistenciaActual({});
    setFechaSeleccionada("");
    alert("Asistencia registrada correctamente");
  };

  // Obtener registros de asistencia para la fecha actual
  const registrosFecha = asistencias.filter(
    (a) => a.grupo === grupoSeleccionado
  );

  // Calcular porcentaje de asistencia por alumno
  const calcularAsistencia = (idAlumno) => {
    let presente = 0;
    let total = 0;

    registrosFecha.forEach((registro) => {
      if (registro.registros[idAlumno]) {
        total++;
        if (registro.registros[idAlumno] === "presente") {
          presente++;
        }
      }
    });

    if (total === 0) return 0;
    return Math.round((presente / total) * 100);
  };

  return (
    <section className="p-6">
      <h1 className="text-2xl font-bold mb-6">Grupos</h1>

      {/* Selector de grupo */}
      <div className="mb-6 bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <label htmlFor="grupo" className="block text-sm font-medium text-gray-700 mb-2">
          Seleccionar Grupo
        </label>
        <select
          id="grupo"
          value={grupoSeleccionado}
          onChange={(e) => {
            setGrupoSeleccionado(e.target.value);
            setAsistenciaActual({});
            setFechaSeleccionada("");
          }}
          className="w-full md:w-1/3 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {grupos.map((g) => (
            <option key={g} value={g}>
              Grupo {g}
            </option>
          ))}
        </select>
      </div>

      {/* Pestañas */}
      <div className="mb-6 flex gap-2 border-b border-gray-200 overflow-x-auto">
        <button
          onClick={() => setPestanaActiva("dashboard")}
          className={`px-4 py-2 font-medium transition-colors whitespace-nowrap ${
            pestanaActiva === "dashboard"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Dashboard
        </button>
        <button
          onClick={() => setPestanaActiva("calificaciones")}
          className={`px-4 py-2 font-medium transition-colors whitespace-nowrap ${
            pestanaActiva === "calificaciones"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Calificaciones
        </button>
        <button
          onClick={() => setPestanaActiva("asistencia")}
          className={`px-4 py-2 font-medium transition-colors whitespace-nowrap ${
            pestanaActiva === "asistencia"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Asistencia
        </button>
        <button
          onClick={() => setPestanaActiva("resumen")}
          className={`px-4 py-2 font-medium transition-colors whitespace-nowrap ${
            pestanaActiva === "resumen"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Resumen
        </button>
      </div>

      {/* Sección Dashboard */}
      {pestanaActiva === "dashboard" && (
        <GroupDashboard
          alumnos={alumnos}
          grupoSeleccionado={grupoSeleccionado}
          calcularFinal={calcularFinal}
        />
      )}

      {/* Sección Calificaciones */}
      {pestanaActiva === "calificaciones" && (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-xl font-bold mb-6">Ingrese Calificaciones - Grupo {grupoSeleccionado}</h2>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border border-gray-200">
                    Alumno
                  </th>
                  <th className="px-4 py-2 text-center text-sm font-semibold text-gray-700 border border-gray-200">
                    Parcial 1
                  </th>
                  <th className="px-4 py-2 text-center text-sm font-semibold text-gray-700 border border-gray-200">
                    Parcial 2
                  </th>
                  <th className="px-4 py-2 text-center text-sm font-semibold text-gray-700 border border-gray-200">
                    Parcial 3
                  </th>
                  <th className="px-4 py-2 text-center text-sm font-semibold text-gray-700 border border-gray-200">
                    Ordinario
                  </th>
                  <th className="px-4 py-2 text-center text-sm font-semibold text-gray-700 border border-gray-200">
                    Final
                  </th>
                </tr>
              </thead>
              <tbody>
                {alumnosGrupo.map((alumno) => {
                  const alumnoCompleto = alumnos.find(a => a.id === alumno.id);
                  const final = calcularFinal(alumnoCompleto);
                  
                  return (
                    <tr key={alumno.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 text-sm text-gray-900 border border-gray-200">
                        {alumno.nombre}
                      </td>
                      <td className="px-4 py-2 text-center border border-gray-200">
                        <input
                          type="number"
                          min="0"
                          max="10"
                          step="0.1"
                          value={alumnoCompleto.p1}
                          onChange={(e) => handleChangeCalificacion(alumno.id, "p1", e.target.value)}
                          className="w-16 px-2 py-1 border border-gray-300 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="-"
                        />
                      </td>
                      <td className="px-4 py-2 text-center border border-gray-200">
                        <input
                          type="number"
                          min="0"
                          max="10"
                          step="0.1"
                          value={alumnoCompleto.p2}
                          onChange={(e) => handleChangeCalificacion(alumno.id, "p2", e.target.value)}
                          className="w-16 px-2 py-1 border border-gray-300 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="-"
                        />
                      </td>
                      <td className="px-4 py-2 text-center border border-gray-200">
                        <input
                          type="number"
                          min="0"
                          max="10"
                          step="0.1"
                          value={alumnoCompleto.p3}
                          onChange={(e) => handleChangeCalificacion(alumno.id, "p3", e.target.value)}
                          className="w-16 px-2 py-1 border border-gray-300 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="-"
                        />
                      </td>
                      <td className="px-4 py-2 text-center border border-gray-200">
                        <input
                          type="number"
                          min="0"
                          max="10"
                          step="0.1"
                          value={alumnoCompleto.ord}
                          onChange={(e) => handleChangeCalificacion(alumno.id, "ord", e.target.value)}
                          className="w-16 px-2 py-1 border border-gray-300 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="-"
                        />
                      </td>
                      <td className="px-4 py-2 text-center text-sm font-semibold text-gray-900 border border-gray-200 bg-gray-50">
                        {final}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <p className="text-sm text-gray-600 mt-4">
            Las calificaciones se guardan automáticamente. El dashboard se actualiza en tiempo real.
          </p>
        </div>
      )}

      {/* Sección Asistencia */}
      {pestanaActiva === "asistencia" && (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-xl font-bold mb-4">Registrar Asistencia - Grupo {grupoSeleccionado}</h2>

          {/* Selector de fecha */}
          <div className="mb-6">
            <label htmlFor="fecha" className="block text-sm font-medium text-gray-700 mb-2">
              Seleccionar Fecha
            </label>
            <input
              type="date"
              id="fecha"
              value={fechaSeleccionada}
              onChange={(e) => setFechaSeleccionada(e.target.value)}
              className="w-full md:w-1/3 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Tabla de asistencia */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border border-gray-200">
                    Alumno
                  </th>
                  <th className="px-4 py-2 text-center text-sm font-semibold text-gray-700 border border-gray-200">
                    Presente
                  </th>
                  <th className="px-4 py-2 text-center text-sm font-semibold text-gray-700 border border-gray-200">
                    Ausente
                  </th>
                  <th className="px-4 py-2 text-center text-sm font-semibold text-gray-700 border border-gray-200">
                    Justificado
                  </th>
                </tr>
              </thead>
              <tbody>
                {alumnosGrupo.map((alumno) => (
                  <tr key={alumno.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 text-sm text-gray-900 border border-gray-200">
                      {alumno.nombre}
                    </td>
                    <td className="px-4 py-2 text-center border border-gray-200">
                      <input
                        type="radio"
                        name={`asistencia-${alumno.id}`}
                        value="presente"
                        checked={asistenciaActual[alumno.id] === "presente"}
                        onChange={(e) =>
                          setAsistenciaActual({
                            ...asistenciaActual,
                            [alumno.id]: e.target.value,
                          })
                        }
                        className="cursor-pointer"
                      />
                    </td>
                    <td className="px-4 py-2 text-center border border-gray-200">
                      <input
                        type="radio"
                        name={`asistencia-${alumno.id}`}
                        value="ausente"
                        checked={asistenciaActual[alumno.id] === "ausente"}
                        onChange={(e) =>
                          setAsistenciaActual({
                            ...asistenciaActual,
                            [alumno.id]: e.target.value,
                          })
                        }
                        className="cursor-pointer"
                      />
                    </td>
                    <td className="px-4 py-2 text-center border border-gray-200">
                      <input
                        type="radio"
                        name={`asistencia-${alumno.id}`}
                        value="justificado"
                        checked={asistenciaActual[alumno.id] === "justificado"}
                        onChange={(e) =>
                          setAsistenciaActual({
                            ...asistenciaActual,
                            [alumno.id]: e.target.value,
                          })
                        }
                        className="cursor-pointer"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Botón registrar */}
          <div className="mt-6">
            <button
              onClick={registrarAsistencia}
              className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Registrar Asistencia
            </button>
          </div>
        </div>
      )}

      {/* Sección Resumen */}
      {pestanaActiva === "resumen" && (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-xl font-bold mb-4">Resumen de Asistencia - Grupo {grupoSeleccionado}</h2>

          {registrosFecha.length === 0 ? (
            <p className="text-gray-600">No hay registros de asistencia para este grupo</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border border-gray-200">
                      Alumno
                    </th>
                    <th className="px-4 py-2 text-center text-sm font-semibold text-gray-700 border border-gray-200">
                      % Asistencia
                    </th>
                    <th className="px-4 py-2 text-center text-sm font-semibold text-gray-700 border border-gray-200">
                      Estado
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {alumnosGrupo.map((alumno) => {
                    const porcentaje = calcularAsistencia(alumno.id);
                    const estado = porcentaje >= 80 ? "Bueno" : porcentaje >= 60 ? "Regular" : "Bajo";
                    const colorEstado =
                      porcentaje >= 80 ? "text-green-600" : porcentaje >= 60 ? "text-yellow-600" : "text-red-600";

                    return (
                      <tr key={alumno.id} className="hover:bg-gray-50">
                        <td className="px-4 py-2 text-sm text-gray-900 border border-gray-200">
                          {alumno.nombre}
                        </td>
                        <td className="px-4 py-2 text-center text-sm font-bold border border-gray-200">
                          {porcentaje}%
                        </td>
                        <td className={`px-4 py-2 text-center text-sm font-semibold border border-gray-200 ${colorEstado}`}>
                          {estado}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </section>
  )
}
export default Grupos;