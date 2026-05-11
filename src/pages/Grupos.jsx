import { useState, useEffect } from "react";
import GroupDashboard from "../components/GroupDashboard";
import { useApp } from "../context/AppContext";

function Grupos() {
  
  const {
    grupos,
    setGrupos,
    materias,
    generarId,
    alumnos,
    setAlumnos
  } = useApp();

  const [grupoSeleccionado, setGrupoSeleccionado] = useState("");

  useEffect(() => {
    if (grupos.length > 0 && !grupoSeleccionado) {
      setGrupoSeleccionado(grupos[0].nombre.replace("Grupo ", ""));
    }
  }, [grupos, grupoSeleccionado]);

  const [pestanaActiva, setPestanaActiva] = useState("asistencia");
  const [grupoVisualizado, setGrupoVisualizado] = useState(null);

  // Datos de alumnos con calificaciones
  const [ponderacionesPorGrupo, setPonderacionesPorGrupo] = useState({});
  const defaultPonderaciones = { p1: 33, p2: 33, p3: 34 };
  const [pesoActual, setPesoActual] = useState(defaultPonderaciones);

  const [asistencias, setAsistencias] = useState([]);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [asistenciaActual, setAsistenciaActual] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [editando, setEditando] = useState(null);

  const [form, setForm] = useState({
    nombre: "",
    materiaId: "",
    ciclo: "",
    docente: "",
  });

  // Datos de alumnos por grupo
  const alumnosPorGrupo = {
    208: alumnos.filter((a) => a.grupo === "208"),
    408: alumnos.filter((a) => a.grupo === "408"),
    608: alumnos.filter((a) => a.grupo === "608"),
    808: alumnos.filter((a) => a.grupo === "808"),
    1008: alumnos.filter((a) => a.grupo === "1008"),
  };

  const listaGrupos = grupos.map((g) => g.nombre);
  const grupoActual = grupos.find(
    (g) => g.nombre === grupoSeleccionado
  );

  const alumnosGrupo = (alumnos ?? []).filter(
    (a) => Array.isArray(a.grupos) && a.grupos.includes(grupoSeleccionado)
  );

  // Obtener ponderaciones
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

    const yaExiste = asistencias.some(
      (a) =>
        a.fecha === fechaSeleccionada &&
        a.grupo === grupoSeleccionado
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

  // Obtener registros de asistencia
  const registrosFecha = asistencias.filter(
    (a) => a.grupo === grupoSeleccionado
  );

  // Calcular asistencia
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

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.nombre || !form.materiaId || !form.ciclo || !form.docente) {
      alert("Todos los campos son obligatorios");
      return;
    }

    if (editando) {
      setGrupos(
        grupos.map(g =>
          g.id === editando
            ? {
                ...g,
                ...form,
                id: editando
              }
            : g
        )
      );

      setEditando(null);

    } else {

      setGrupos([
        ...grupos,
        {
          ...form,
          id: generarId(grupos),
          alumnos: []
        }
      ]);
    }

    setForm({
      nombre:"",
      materiaId:"",
      ciclo:"",
      docente:""
    });

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

  const visualizarGrupo = (grupo) => {
    setGrupoVisualizado(grupo);
  };

  return (
    <section className="p-6">
      <h1 className="text-2xl font-bold mb-6">Grupos</h1>
      <button
        onClick={() => setShowForm(true)}
        className="bg-blue-500 text-white w-12 h-12 rounded-full text-2xl mb-6"
      >
        +
      </button>     

      {/* Selector de grupo */}
      <div className="mb-6 bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <label
          htmlFor="grupo"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
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
          {listaGrupos.map((g) => (
            <option key={g} value={g}>
              Grupo {g}
            </option>
          ))}
        </select>
      </div>

      

      {/* Pestañas */}
      <div className="mb-6 flex items-center border-b border-gray-200 overflow-x-auto">

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

        {/* Empuja Asignaciones hacia la derecha */}
        <div className="ml-auto">
          <button
            onClick={() => setPestanaActiva("asignaciones")}
            className={`px-4 py-2 font-medium transition-colors whitespace-nowrap ${
              pestanaActiva === "asignaciones"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Asignaciones
          </button>
        </div>

      </div>

      {/* Dashboard */}
      {pestanaActiva === "dashboard" && (
        <GroupDashboard
          alumnos={alumnos}
          grupoSeleccionado={grupoSeleccionado}
          calcularFinal={calcularFinal}
        />
      )}

      {/* Calificaciones */}
      {pestanaActiva === "calificaciones" && (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-xl font-bold mb-6">
            Ingrese Calificaciones - Grupo {grupoSeleccionado}
          </h2>

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
                  const final = calcularFinal(alumno);

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
                          value={alumno.p1}
                          onChange={(e) =>
                            handleChangeCalificacion(
                              alumno.id,
                              "p1",
                              e.target.value
                            )
                          }
                          className="w-16 px-2 py-1 border border-gray-300 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </td>

                      <td className="px-4 py-2 text-center border border-gray-200">
                        <input
                          type="number"
                          min="0"
                          max="10"
                          step="0.1"
                          value={alumno.p2}
                          onChange={(e) =>
                            handleChangeCalificacion(
                              alumno.id,
                              "p2",
                              e.target.value
                            )
                          }
                          className="w-16 px-2 py-1 border border-gray-300 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </td>

                      <td className="px-4 py-2 text-center border border-gray-200">
                        <input
                          type="number"
                          min="0"
                          max="10"
                          step="0.1"
                          value={alumno.p3}
                          onChange={(e) =>
                            handleChangeCalificacion(
                              alumno.id,
                              "p3",
                              e.target.value
                            )
                          }
                          className="w-16 px-2 py-1 border border-gray-300 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </td>

                      <td className="px-4 py-2 text-center border border-gray-200">
                        <input
                          type="number"
                          min="0"
                          max="10"
                          step="0.1"
                          value={alumno.ord}
                          onChange={(e) =>
                            handleChangeCalificacion(
                              alumno.id,
                              "ord",
                              e.target.value
                            )
                          }
                          className="w-16 px-2 py-1 border border-gray-300 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
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

      {/* Asistencia */}
      {pestanaActiva === "asistencia" && (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-xl font-bold mb-4">
            Registrar Asistencia - Grupo {grupoSeleccionado}
          </h2>

          <div className="mb-6">
            <label
              htmlFor="fecha"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
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
                        checked={
                          asistenciaActual[alumno.id] === "presente"
                        }
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
                        checked={
                          asistenciaActual[alumno.id] === "ausente"
                        }
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
                        checked={
                          asistenciaActual[alumno.id] === "justificado"
                        }
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

      {/* Asignaciones */}
      {pestanaActiva === "asignaciones" && (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">

          <h2 className="text-xl font-bold mb-6">
            Asignaciones
          </h2>

          {grupos.length === 0 ? (
            <p className="text-gray-600">
              No hay grupos registrados
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">

                <thead className="bg-gray-50">
                  <tr>
                    
                    <th className="px-4 py-2 border border-gray-200">
                      ID
                    </th>
                    
                    <th className="px-4 py-2 border border-gray-200">
                      Nombre de la materia
                    </th>

                    <th className="px-4 py-2 border border-gray-200">
                      Docente responsable
                    </th>
                    
                    <th className="px-4 py-2 border border-gray-200">
                      Ciclo escolar
                    </th>
                  
                    <th className="px-4 py-2 border border-gray-200">
                      Acciones
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {grupos.map((g) => {

                    const materia = materias.find((m) => String(m.id) === String(g.materiaId));

                    return (
                      <tr key={g.id} className="hover:bg-gray-50">

                        <td className="px-4 py-2 border border-gray-200 text-center">
                          {g.id}
                        </td>
                        
                        <td className="px-4 py-2 border border-gray-200 text-center">
                          {materia ? materia.nombre : "Sin materia"}
                        </td>

                        <td className="px-4 py-2 border border-gray-200 text-center">
                          {g.docente}
                        </td>                        

                        <td className="px-4 py-2 border border-gray-200 text-center">
                          {g.ciclo}
                        </td>
                      
                        <td className="px-4 py-2 border border-gray-200 text-center space-x-2">

                          <button
                            onClick={() => visualizarGrupo(g)}
                            className="bg-blue-500 text-white px-3 py-1 rounded"
                          >
                            👁️
                          </button>

                          <button
                            onClick={() => editar(g)}
                            className="bg-yellow-500 text-white px-3 py-1 rounded"
                          >
                            ✏️
                          </button>

                          <button
                            onClick={() => eliminar(g.id)}
                            className="bg-red-500 text-white px-3 py-1 rounded"
                          >
                            🗑️
                          </button>

                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          
          {/* MODAL VISUALIZAR */}
          {grupoVisualizado && (
            <div className="mt-8">
              <h3 className="text-lg font-bold mb-4">
                Alumnos asignados al grupo {grupoVisualizado.nombre}
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 border border-gray-200">
                        Nombre
                      </th>
                      <th className="px-4 py-2 border border-gray-200">
                        Matrícula
                      </th>
                      <th className="px-4 py-2 border border-gray-200">
                        Acción
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {alumnos
                      .filter((a) => a.grupos?.includes(grupoVisualizado.nombre))
                      .map((alumno) => {
                        console.log("Alumno completo:", alumno); // Para debug
                        return (
                          <tr key={alumno.id || alumno.matricula} className="hover:bg-gray-50">
                            <td className="px-4 py-2 border border-gray-200">
                              {alumno.nombre}
                            </td>
                          <td className="px-4 py-2 border border-gray-200 text-center">
                            {alumno.matricula}
                          </td>
                          <td className="px-4 py-2 border border-gray-200 text-center">
                            <button
                              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                              onClick={() => {
                                // Verificar que el alumno tenga un ID válido
                                if (!alumno.id && !alumno.matricula) {
                                  console.error("El alumno no tiene identificador válido", alumno);
                                  alert("Error: No se puede identificar al alumno");
                                  return;
                                }

                                // Usar el ID o la matrícula como identificador
                                const alumnoId = alumno.id || alumno.matricula;
                                
                                console.log("Grupo a quitar:", grupoVisualizado.nombre);
                                console.log("Grupos actuales del alumno:", alumno.grupos);
                                console.log("ID del alumno:", alumnoId);

                                // Crear una copia del estado actual
                                const alumnosActualizados = alumnos.map(a => {
                                  // Comparar usando el campo disponible (id o matricula)
                                  const aId = a.id || a.matricula;
                                  
                                  if (aId === alumnoId) {
                                    // Filtrar SOLO el grupo actual
                                    const gruposActualizados = (a.grupos || []).filter(
                                      g => g !== grupoVisualizado.nombre
                                    );
                                    
                                    console.log("Grupos después de quitar:", gruposActualizados);
                                    
                                    return {
                                      ...a,
                                      grupos: gruposActualizados
                                    };
                                  }
                                  return a;
                                });
                                
                                // Actualizar el estado
                                setAlumnos(alumnosActualizados);
                                
                                // Mostrar mensaje de confirmación
                                console.log(`Alumno ${alumno.nombre} removido del grupo ${grupoVisualizado.nombre}`);
                                
                                // Opcional: Mostrar un pequeño mensaje al usuario
                                alert(`Alumno ${alumno.nombre} removido del grupo`);
                              }}
                            >
                              Quitar
                            </button>
                          </td>
                        </tr>
                        );
                })}  
                  </tbody>
                </table>
              </div>

              <div className="mt-4">
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  onClick={() => {
                    const matricula = prompt("Ingresa la matrícula del alumno a agregar");
                    if (!matricula) return;

                    setAlumnos(prev => {
                      const existe = prev.find(a => a.matricula === matricula);

                      if (!existe) {
                        alert("No se encontró un alumno con esa matrícula");
                        return prev;
                      }

                      // IMPORTANTE: Usar grupoVisualizado.nombre en lugar de grupoSeleccionado
                      const nombreGrupo = grupoVisualizado.nombre;
                      
                      // Verificar si ya está asignado al grupo
                      if (existe.grupos?.includes(nombreGrupo)) {
                        alert(`El alumno ${existe.nombre} ya está asignado al grupo ${nombreGrupo}`);
                        return prev;
                      }

                      // Agregar el grupo al alumno
                      const alumnosActualizados = prev.map(a =>
                        a.matricula === matricula
                          ? {
                              ...a,
                              grupos: a.grupos
                                ? [...new Set([...a.grupos, nombreGrupo])]
                                : [nombreGrupo]
                            }
                          : a
                      );
                      
                      // Mostrar mensaje de éxito
                      alert(`Alumno ${existe.nombre} agregado al grupo ${nombreGrupo}`);
                      
                      return alumnosActualizados;
                    });
                  }}
                >
                  Añadir alumno
                </button>
              </div>
            </div>
          )}





        </div>
      )}

      {/* Resumen */}
      {pestanaActiva === "resumen" && (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-xl font-bold mb-4">
            Resumen de Asistencia - Grupo {grupoSeleccionado}
          </h2>

          {registrosFecha.length === 0 ? (
            <p className="text-gray-600">
              No hay registros de asistencia para este grupo
            </p>
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

                    const estado =
                      porcentaje >= 80
                        ? "Bueno"
                        : porcentaje >= 60
                        ? "Regular"
                        : "Bajo";

                    const colorEstado =
                      porcentaje >= 80
                        ? "text-green-600"
                        : porcentaje >= 60
                        ? "text-yellow-600"
                        : "text-red-600";

                    return (
                      <tr key={alumno.id} className="hover:bg-gray-50">
                        <td className="px-4 py-2 text-sm text-gray-900 border border-gray-200">
                          {alumno.nombre}
                        </td>

                        <td className="px-4 py-2 text-center text-sm font-bold border border-gray-200">
                          {porcentaje}%
                        </td>

                        <td
                          className={`px-4 py-2 text-center text-sm font-semibold border border-gray-200 ${colorEstado}`}
                        >
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



      {/* MODAL FORMULARIO */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div className="bg-gray-900 p-6 rounded text-white w-96">

            <h2 className="text-xl font-bold mb-4 text-center">
              {editando ? "Editar Grupo" : "Nuevo Grupo"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-3">

              <input
                placeholder="Nombre del grupo"
                value={form.nombre}
                onChange={(e)=>
                  setForm({
                    ...form,
                    nombre:e.target.value
                  })
                }
                className="w-full p-2 bg-white text-black rounded"
              />

              <select
                value={form.materiaId}
                onChange={(e)=>
                  setForm({
                    ...form,
                    materiaId: e.target.value
                  })
                }
                className="w-full p-2 bg-blue-500 text-white rounded"
              >
                <option value="">Selecciona materia</option>

                {materias.map(m => (
                  <option key={m.id} value={m.id}>
                    {m.nombre}
                  </option>
                ))}
              </select>

              <input
                placeholder="Ciclo"
                value={form.ciclo}
                onChange={(e)=>
                  setForm({
                    ...form,
                    ciclo:e.target.value
                  })
                }
                className="w-full p-2 bg-white text-black rounded"
              />

              <input
                placeholder="Docente responsable"
                value={form.docente}
                onChange={(e)=>
                  setForm({
                    ...form,
                    docente:e.target.value
                  })
                }
                className="w-full p-2 bg-white text-black rounded"
              />

              <div className="flex gap-2">

                <button className="bg-green-500 px-4 py-2 rounded w-full">
                  Guardar
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditando(null);

                    setForm({
                      nombre:"",
                      materiaId:"",
                      ciclo:"",
                      docente:""
                    });
                  }}
                  className="bg-red-500 px-4 py-2 rounded w-full"
                >
                  Cancelar
                </button>

              </div>
            </form>
          </div>
        </div>
      )}



    </section>
  );
}

export default Grupos;
