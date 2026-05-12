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
  const [cicloSeleccionado, setCicloSeleccionado] = useState("");

  useEffect(() => {
    if (grupos.length > 0 && !grupoSeleccionado) {
      setGrupoSeleccionado(grupos[0].nombre.replace("Grupo ", ""));
    }
  }, [grupos, grupoSeleccionado]);

  const [pestanaActiva, setPestanaActiva] = useState("asistencia");
  const [grupoVisualizado, setGrupoVisualizado] = useState(null);

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

  const listaGrupos = grupos.map((g) => g.nombre);
  const grupoActual = grupos.find((g) => g.nombre === grupoSeleccionado);
  const ciclosDisponibles = [...new Set(grupos.map(g => g.ciclo))];
  const gruposFiltrados = cicloSeleccionado
    ? grupos.filter(g => g.ciclo === cicloSeleccionado)
    : grupos;

  const totalAlumnosCiclo = gruposFiltrados.reduce((total, grupo) => {
    const cantidad = alumnos.filter(a => a.grupos?.includes(grupo.nombre)).length;
    return total + cantidad;
  }, 0);

  const alumnosGrupo = (alumnos ?? []).filter(
    (a) => Array.isArray(a.grupos) && a.grupos.includes(grupoSeleccionado)
  );

  const obtenerPonderaciones = () => ponderacionesPorGrupo[grupoSeleccionado] ?? null;

  const calcularFinal = (a) => {
    const p1 = parseFloat(a.p1) || 0;
    const p2 = parseFloat(a.p2) || 0;
    const p3 = parseFloat(a.p3) || 0;
    const pesos = obtenerPonderaciones();
    const promedioParciales = pesos
      ? (p1 * pesos.p1 + p2 * pesos.p2 + p3 * pesos.p3) / 100
      : (p1 + p2 + p3) / 3;
    if (a.ord === "") return promedioParciales.toFixed(1);
    const ord = parseFloat(a.ord);
    return (promedioParciales * 0.5 + ord * 0.5).toFixed(1);
  };

  const handleChangeCalificacion = (id, campo, valor) => {
    let valorValidado = valor;
    if (valor !== "") {
      const num = parseFloat(valor);
      if (isNaN(num)) valorValidado = "";
      else if (num < 0) valorValidado = "0";
      else if (num > 10) valorValidado = "10";
      else valorValidado = num.toString();
    }
    setAlumnos(alumnos.map((a) => a.id === id ? { ...a, [campo]: valorValidado } : a));
  };

  const registrarAsistencia = () => {
    if (!fechaSeleccionada) { alert("Por favor selecciona una fecha"); return; }
    const yaExiste = asistencias.some(a => a.fecha === fechaSeleccionada && a.grupo === grupoSeleccionado);
    if (yaExiste) { alert("Ya existe un registro de asistencia para esta fecha en este grupo"); return; }
    setAsistencias([...asistencias, { id: Date.now(), fecha: fechaSeleccionada, grupo: grupoSeleccionado, registros: asistenciaActual }]);
    setAsistenciaActual({});
    setFechaSeleccionada("");
    alert("Asistencia registrada correctamente");
  };

  const registrosFecha = asistencias.filter(a => a.grupo === grupoSeleccionado);

  const calcularAsistencia = (idAlumno) => {
    let presente = 0, total = 0;
    registrosFecha.forEach((registro) => {
      if (registro.registros[idAlumno]) {
        total++;
        if (registro.registros[idAlumno] === "presente") presente++;
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
      setGrupos(grupos.map(g => g.id === editando ? { ...g, ...form, id: editando } : g));
      setEditando(null);
    } else {
      setGrupos([...grupos, { ...form, id: generarId(grupos), alumnos: [] }]);
    }
    setForm({ nombre: "", materiaId: "", ciclo: "", docente: "" });
    setShowForm(false);
  };

  const eliminar = (id) => setGrupos(grupos.filter(g => g.id !== id));
  const editar = (g) => { setForm(g); setEditando(g.id); setShowForm(true); };
  const visualizarGrupo = (grupo) => setGrupoVisualizado(grupo);

  return (
    <section className="p-6">

      <style>{`
        /* ── Asignaciones & Ciclos table styles ── */
        .grp-section-title {
          font-size: 20px;
          font-weight: 700;
          color: var(--text-h);
          margin: 0 0 20px;
          letter-spacing: -0.3px;
        }
        .grp-card {
          background: var(--bg);
          border: 1.5px solid var(--border);
          border-radius: 16px;
          padding: 28px;
          box-shadow: var(--shadow);
          overflow: hidden;
        }
        .grp-table-wrap { overflow-x: auto; border-radius: 10px; border: 1.5px solid var(--border); }
        .grp-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 13.5px;
        }
        .grp-table thead tr { background: #0b0d17; }
        .grp-table thead th {
          padding: 12px 16px;
          font-size: 10.5px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #c7d2fe;
          border: none;
          text-align: center;
          white-space: nowrap;
        }
        .grp-table tbody tr {
          border-bottom: 1px solid var(--border);
          transition: background .15s;
        }
        .grp-table tbody tr:last-child { border-bottom: none; }
        .grp-table tbody tr:hover { background: var(--accent-bg); }
        .grp-table td {
          padding: 11px 16px;
          color: var(--text);
          text-align: center;
          border: none;
          vertical-align: middle;
        }
        .grp-id-badge {
          display: inline-flex; align-items: center; justify-content: center;
          width: 26px; height: 26px;
          border-radius: 6px;
          background: var(--code-bg);
          font-size: 12px; font-weight: 700;
          color: var(--text-h);
          font-family: var(--mono);
        }
        .grp-group-tag {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 3px 10px;
          border-radius: 20px;
          background: var(--accent-bg);
          border: 1px solid var(--accent-border);
          font-size: 12px; font-weight: 600;
          color: var(--accent);
        }
        .grp-materia-name {
          font-weight: 600;
          color: var(--text-h);
        }
        .grp-docente { color: var(--text); }
        .grp-ciclo-badge {
          display: inline-block;
          padding: 2px 10px;
          border-radius: 20px;
          background: var(--code-bg);
          font-size: 12px; font-weight: 600;
          color: var(--text-h);
          font-family: var(--mono);
        }
        .grp-count-badge {
          display: inline-flex; align-items: center; justify-content: center;
          min-width: 28px; height: 22px;
          padding: 0 8px;
          border-radius: 20px;
          background: #dcfce7;
          color: #16a34a;
          font-size: 12px; font-weight: 700;
          border: 1px solid #bbf7d0;
        }
        .grp-actions { display: flex; gap: 6px; justify-content: center; }
        .grp-btn {
          display: flex; align-items: center; justify-content: center;
          width: 30px; height: 30px;
          border-radius: 7px;
          border: 1.5px solid transparent;
          cursor: pointer;
          font-size: 13px;
          transition: all .18s;
        }
        .grp-btn-view { background: #f0f9ff; border-color: #bae6fd; color: #0284c7; }
        .grp-btn-view:hover { background: #0284c7; color: #fff; border-color: #0284c7; }
        .grp-btn-edit { background: #fffbeb; border-color: #fde68a; color: #d97706; }
        .grp-btn-edit:hover { background: #d97706; color: #fff; border-color: #d97706; }
        .grp-btn-del { background: #fef2f2; border-color: #fecaca; color: #dc2626; }
        .grp-btn-del:hover { background: #dc2626; color: #fff; border-color: #dc2626; }

        /* Ciclos stat cards */
        .ciclo-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px; }
        .ciclo-stat {
          border-radius: 12px;
          padding: 18px 20px;
          border: 1.5px solid var(--border);
          display: flex; flex-direction: column; gap: 4px;
        }
        .ciclo-stat-label { font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.6px; color: var(--text); }
        .ciclo-stat-value { font-size: 32px; font-weight: 800; letter-spacing: -1px; color: var(--text-h); }
        .ciclo-stat.blue { background: #eff6ff; border-color: #bfdbfe; }
        .ciclo-stat.blue .ciclo-stat-value { color: #1d4ed8; }
        .ciclo-stat.green { background: #f0fdf4; border-color: #bbf7d0; }
        .ciclo-stat.green .ciclo-stat-value { color: #15803d; }
        .ciclo-filter-row {
          display: flex; align-items: center; gap: 10px; margin-bottom: 20px;
        }
        .ciclo-filter-label {
          font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.6px; color: var(--text); white-space: nowrap;
        }
        .ciclo-select {
          appearance: none;
          background: var(--bg);
          border: 1.5px solid var(--border);
          border-radius: 8px;
          padding: 8px 36px 8px 12px;
          font-size: 13px; font-weight: 500;
          color: var(--text-h);
          cursor: pointer;
          outline: none;
          transition: border-color .2s;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236b7280' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 12px center;
        }
        .ciclo-select:focus { border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-bg); }
        .grp-empty-row td { padding: 40px; color: var(--text); font-style: italic; }

        /* Visualizar sub-section */
        .vis-section { margin-top: 28px; }
        .vis-title {
          font-size: 15px; font-weight: 700; color: var(--text-h);
          margin: 0 0 14px; display: flex; align-items: center; gap: 8px;
        }
        .vis-group-pill {
          font-size: 12px; font-weight: 600;
          background: var(--accent-bg); border: 1px solid var(--accent-border);
          color: var(--accent);
          padding: 2px 10px; border-radius: 20px;
        }
        .vis-add-btn {
          margin-top: 14px;
          display: inline-flex; align-items: center; gap: 6px;
          padding: 9px 18px;
          border-radius: 9px;
          background: #f0fdf4;
          border: 1.5px solid #bbf7d0;
          color: #15803d;
          font-size: 13px; font-weight: 600;
          cursor: pointer; transition: all .2s;
        }
        .vis-add-btn:hover { background: #15803d; color: #fff; border-color: #15803d; }
        .vis-no-alumnos td { padding: 28px; color: #ef4444; font-weight: 600; }

        /* FORM MODAL */
        .grp-overlay {
          position: fixed; inset: 0;
          background: rgba(0,0,0,.55);
          backdrop-filter: blur(4px);
          display: flex; align-items: center; justify-content: center;
          z-index: 100;
          animation: gFadeIn .2s ease;
        }
        @keyframes gFadeIn { from { opacity:0 } to { opacity:1 } }
        .grp-modal {
          background: var(--bg);
          border: 1.5px solid var(--border);
          border-radius: 18px;
          padding: 32px;
          width: 420px;
          max-width: calc(100vw - 32px);
          box-shadow: 0 24px 60px rgba(0,0,0,.2);
          animation: gSlideUp .25s ease;
        }
        @keyframes gSlideUp { from { transform: translateY(16px); opacity:0 } to { transform:none; opacity:1 } }
        .grp-modal-header { margin-bottom: 24px; }
        .grp-modal-title { font-size: 18px; font-weight: 700; color: var(--text-h); margin: 0 0 4px; }
        .grp-modal-sub { font-size: 13px; color: var(--text); margin: 0; }
        .grp-field { margin-bottom: 14px; }
        .grp-field label {
          display: block; font-size: 11px; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.7px;
          color: var(--text); margin-bottom: 5px;
        }
        .grp-field input, .grp-field select {
          width: 100%; padding: 10px 12px;
          border: 1.5px solid var(--border);
          border-radius: 9px;
          background: var(--bg);
          color: var(--text-h);
          font-size: 14px; outline: none;
          transition: border-color .2s, box-shadow .2s;
          box-sizing: border-box;
          font-family: var(--sans);
          appearance: none;
        }
        .grp-field input:focus, .grp-field select:focus {
          border-color: var(--accent);
          box-shadow: 0 0 0 3px var(--accent-bg);
        }
        .grp-field input::placeholder { color: var(--text); opacity: .6; }
        .grp-modal-divider { border: none; border-top: 1px solid var(--border); margin: 20px 0; }
        .grp-modal-footer { display: flex; gap: 10px; }
        .grp-btn-cancel {
          flex: 1; padding: 11px;
          background: transparent;
          color: var(--text);
          border: 1.5px solid var(--border);
          border-radius: 10px; font-size: 14px; font-weight: 600;
          cursor: pointer; transition: border-color .2s, color .2s;
        }
        .grp-btn-cancel:hover { border-color: #ef4444; color: #ef4444; }
        .grp-btn-save {
          flex: 1; padding: 11px;
          background: var(--accent); color: #fff;
          border: none; border-radius: 10px;
          font-size: 14px; font-weight: 600;
          cursor: pointer; transition: opacity .2s;
        }
        .grp-btn-save:hover { opacity: .85; }
      `}</style>

      <h1 className="text-2xl font-bold mb-6">Grupos</h1>
      <button
        onClick={() => setShowForm(true)}
        className="bg-blue-500 text-white w-12 h-12 rounded-full text-2xl mb-6"
      >
        +
      </button>

      {/* Selector de grupo */}
      <div className="mb-6 bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <label htmlFor="grupo" className="block text-sm font-medium text-gray-700 mb-2">
          Seleccionar Grupo
        </label>
        <select
          id="grupo"
          value={grupoSeleccionado}
          onChange={(e) => { setGrupoSeleccionado(e.target.value); setAsistenciaActual({}); setFechaSeleccionada(""); }}
          className="w-full md:w-1/3 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {listaGrupos.map((g) => (
            <option key={g} value={g}>Grupo {g}</option>
          ))}
        </select>
      </div>

      {/* Pestañas */}
      <div className="mb-6 flex items-center border-b border-gray-200 overflow-x-auto">
        {["dashboard","calificaciones","asistencia","resumen"].map(tab => (
          <button
            key={tab}
            onClick={() => setPestanaActiva(tab)}
            className={`px-4 py-2 font-medium transition-colors whitespace-nowrap capitalize ${
              pestanaActiva === tab
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
        <div className="ml-auto">
          {["ciclos","asignaciones"].map(tab => (
            <button
              key={tab}
              onClick={() => setPestanaActiva(tab)}
              className={`px-4 py-2 font-medium transition-colors whitespace-nowrap capitalize ${
                pestanaActiva === tab
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Dashboard */}
      {pestanaActiva === "dashboard" && (
        <GroupDashboard alumnos={alumnos} grupoSeleccionado={grupoSeleccionado} calcularFinal={calcularFinal} />
      )}

      {/* Calificaciones */}
      {pestanaActiva === "calificaciones" && (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-xl font-bold mb-6">Ingrese Calificaciones - Grupo {grupoSeleccionado}</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-gray-50">
                <tr>
                  {["Alumno","Parcial 1","Parcial 2","Parcial 3","Ordinario","Final"].map(h => (
                    <th key={h} className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border border-gray-200">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {alumnosGrupo.map((alumno) => {
                  const final = calcularFinal(alumno);
                  return (
                    <tr key={alumno.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 text-sm text-gray-900 border border-gray-200">{alumno.nombre}</td>
                      {["p1","p2","p3","ord"].map(campo => (
                        <td key={campo} className="px-4 py-2 text-center border border-gray-200">
                          <input
                            type="number" min="0" max="10" step="0.1"
                            value={alumno[campo]}
                            onChange={(e) => handleChangeCalificacion(alumno.id, campo, e.target.value)}
                            className="w-16 px-2 py-1 border border-gray-300 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </td>
                      ))}
                      <td className="px-4 py-2 text-center text-sm font-semibold text-gray-900 border border-gray-200 bg-gray-50">{final}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="text-sm text-gray-600 mt-4">Las calificaciones se guardan automáticamente.</p>
        </div>
      )}

      {/* Asistencia */}
      {pestanaActiva === "asistencia" && (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-xl font-bold mb-4">Registrar Asistencia - Grupo {grupoSeleccionado}</h2>
          <div className="mb-6">
            <label htmlFor="fecha" className="block text-sm font-medium text-gray-700 mb-2">Seleccionar Fecha</label>
            <input
              type="date" id="fecha" value={fechaSeleccionada}
              onChange={(e) => setFechaSeleccionada(e.target.value)}
              className="w-full md:w-1/3 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-gray-50">
                <tr>
                  {["Alumno","Presente","Ausente","Justificado"].map(h => (
                    <th key={h} className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border border-gray-200">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {alumnosGrupo.map((alumno) => (
                  <tr key={alumno.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 text-sm text-gray-900 border border-gray-200">{alumno.nombre}</td>
                    {["presente","ausente","justificado"].map(val => (
                      <td key={val} className="px-4 py-2 text-center border border-gray-200">
                        <input
                          type="radio" name={`asistencia-${alumno.id}`} value={val}
                          checked={asistenciaActual[alumno.id] === val}
                          onChange={(e) => setAsistenciaActual({ ...asistenciaActual, [alumno.id]: e.target.value })}
                          className="cursor-pointer"
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-6">
            <button onClick={registrarAsistencia} className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
              Registrar Asistencia
            </button>
          </div>
        </div>
      )}

      {/* ── ASIGNACIONES ── redesigned */}
      {pestanaActiva === "asignaciones" && (
        <div className="grp-card">
          <h2 className="grp-section-title">Asignaciones</h2>

          {grupos.length === 0 ? (
            <p style={{ color: "var(--text)", fontSize: 14 }}>No hay grupos registrados</p>
          ) : (
            <div className="grp-table-wrap">
              <table className="grp-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Materia</th>
                    <th>Docente</th>
                    <th>Ciclo</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {grupos.map((g) => {
                    const materia = materias.find((m) => String(m.id) === String(g.materiaId));
                    return (
                      <tr key={g.id}>
                        <td><span className="grp-id-badge">{g.id}</span></td>
                        <td><span className="grp-materia-name">{materia ? materia.nombre : "Sin materia"}</span></td>
                        <td><span className="grp-docente">{g.docente}</span></td>
                        <td><span className="grp-ciclo-badge">{g.ciclo}</span></td>
                        <td>
                          <div className="grp-actions">
                            <button onClick={() => visualizarGrupo(g)} className="grp-btn grp-btn-view" title="Ver alumnos">👁️</button>
                            <button onClick={() => editar(g)} className="grp-btn grp-btn-edit" title="Editar">✏️</button>
                            <button onClick={() => eliminar(g.id)} className="grp-btn grp-btn-del" title="Eliminar">🗑️</button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Vista alumnos del grupo */}
          {grupoVisualizado && (
            <div className="vis-section">
              <hr style={{ border: "none", borderTop: "1px solid var(--border)", margin: "24px 0" }} />
              <p className="vis-title">
                Alumnos en grupo
                <span className="vis-group-pill">{grupoVisualizado.nombre}</span>
              </p>
              <div className="grp-table-wrap">
                <table className="grp-table">
                  <thead>
                    <tr>
                      <th style={{ textAlign: "left", paddingLeft: 20 }}>Nombre</th>
                      <th>Matrícula</th>
                      <th>Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {alumnos.filter(a => a.grupos?.includes(grupoVisualizado.nombre)).length === 0 ? (
                      <tr className="vis-no-alumnos"><td colSpan="3">Grupo vacío</td></tr>
                    ) : (
                      alumnos.filter(a => a.grupos?.includes(grupoVisualizado.nombre)).map((alumno) => (
                        <tr key={alumno.id || alumno.matricula}>
                          <td style={{ textAlign: "left", paddingLeft: 20, fontWeight: 600, color: "var(--text-h)" }}>{alumno.nombre}</td>
                          <td><span className="grp-ciclo-badge">{alumno.matricula}</span></td>
                          <td>
                            <button
                              className="grp-btn grp-btn-del"
                              style={{ width: "auto", padding: "4px 12px", borderRadius: 7, fontSize: 12, fontWeight: 600, gap: 4 }}
                              onClick={() => {
                                if (!window.confirm(`¿Quitar a ${alumno.nombre} del grupo?`)) return;
                                const alumnoId = alumno.id || alumno.matricula;
                                setAlumnos(alumnos.map(a => {
                                  const aId = a.id || a.matricula;
                                  if (aId === alumnoId) return { ...a, grupos: (a.grupos || []).filter(g => g !== grupoVisualizado.nombre) };
                                  return a;
                                }));
                                alert(`${alumno.nombre} removido del grupo`);
                              }}
                            >
                              Quitar
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              <button
                className="vis-add-btn"
                onClick={() => {
                  const matricula = prompt("Ingresa la matrícula del alumno a agregar");
                  if (!matricula) return;
                  setAlumnos(prev => {
                    const existe = prev.find(a => a.matricula === matricula);
                    if (!existe) { alert("No se encontró un alumno con esa matrícula"); return prev; }
                    const nombreGrupo = grupoVisualizado.nombre;
                    if (existe.grupos?.includes(nombreGrupo)) { alert(`${existe.nombre} ya está en el grupo`); return prev; }
                    const updated = prev.map(a =>
                      a.matricula === matricula
                        ? { ...a, grupos: a.grupos ? [...new Set([...a.grupos, nombreGrupo])] : [nombreGrupo] }
                        : a
                    );
                    alert(`${existe.nombre} agregado al grupo ${nombreGrupo}`);
                    return updated;
                  });
                }}
              >
                + Añadir alumno
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── CICLOS ── redesigned */}
      {pestanaActiva === "ciclos" && (
        <div className="grp-card">
          <h2 className="grp-section-title">Grupos por ciclo escolar</h2>

          <div className="ciclo-filter-row">
            <span className="ciclo-filter-label">Filtrar ciclo:</span>
            <select
              value={cicloSeleccionado}
              onChange={(e) => setCicloSeleccionado(e.target.value)}
              className="ciclo-select"
            >
              <option value="">Todos los ciclos</option>
              {ciclosDisponibles.map((ciclo) => (
                <option key={ciclo} value={ciclo}>{ciclo}</option>
              ))}
            </select>
          </div>

          <div className="ciclo-stats">
            <div className="ciclo-stat blue">
              <span className="ciclo-stat-label">Total de grupos</span>
              <span className="ciclo-stat-value">{gruposFiltrados.length}</span>
            </div>
            <div className="ciclo-stat green">
              <span className="ciclo-stat-label">Total de alumnos</span>
              <span className="ciclo-stat-value">{totalAlumnosCiclo}</span>
            </div>
          </div>

          {gruposFiltrados.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 0", color: "#ef4444", fontWeight: 600 }}>
              No hay grupos registrados en este ciclo escolar
            </div>
          ) : (
            <div className="grp-table-wrap">
              <table className="grp-table">
                <thead>
                  <tr>
                    <th>Grupo</th>
                    <th>Materia</th>
                    <th>Docente</th>
                    <th>Ciclo</th>
                    <th>Alumnos</th>
                  </tr>
                </thead>
                <tbody>
                  {gruposFiltrados.map((grupo) => {
                    const materia = materias.find((m) => String(m.id) === String(grupo.materiaId));
                    const totalAlumnos = alumnos.filter(a => a.grupos?.includes(grupo.nombre)).length;
                    return (
                      <tr key={grupo.id}>
                        <td><span className="grp-group-tag">📚 {grupo.nombre}</span></td>
                        <td><span className="grp-materia-name">{materia ? materia.nombre : "Sin materia"}</span></td>
                        <td><span className="grp-docente">{grupo.docente}</span></td>
                        <td><span className="grp-ciclo-badge">{grupo.ciclo}</span></td>
                        <td><span className="grp-count-badge">{totalAlumnos}</span></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Resumen */}
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
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border border-gray-200">Alumno</th>
                    <th className="px-4 py-2 text-center text-sm font-semibold text-gray-700 border border-gray-200">% Asistencia</th>
                    <th className="px-4 py-2 text-center text-sm font-semibold text-gray-700 border border-gray-200">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {alumnosGrupo.map((alumno) => {
                    const porcentaje = calcularAsistencia(alumno.id);
                    const estado = porcentaje >= 80 ? "Bueno" : porcentaje >= 60 ? "Regular" : "Bajo";
                    const colorEstado = porcentaje >= 80 ? "text-green-600" : porcentaje >= 60 ? "text-yellow-600" : "text-red-600";
                    return (
                      <tr key={alumno.id} className="hover:bg-gray-50">
                        <td className="px-4 py-2 text-sm text-gray-900 border border-gray-200">{alumno.nombre}</td>
                        <td className="px-4 py-2 text-center text-sm font-bold border border-gray-200">{porcentaje}%</td>
                        <td className={`px-4 py-2 text-center text-sm font-semibold border border-gray-200 ${colorEstado}`}>{estado}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── MODAL FORMULARIO ── redesigned */}
      {showForm && (
        <div
          className="grp-overlay"
          onClick={(e) => e.target === e.currentTarget && setShowForm(false)}
        >
          <div className="grp-modal">
            <div className="grp-modal-header">
              <p className="grp-modal-title">{editando ? "Editar grupo" : "Nuevo grupo"}</p>
              <p className="grp-modal-sub">{editando ? "Actualiza los datos del grupo." : "Completa los campos para registrar un grupo."}</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grp-field">
                <label>Nombre del grupo</label>
                <input
                  placeholder="Ej. Grupo 208"
                  value={form.nombre}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                />
              </div>

              <div className="grp-field">
                <label>Materia</label>
                <select
                  value={form.materiaId}
                  onChange={(e) => setForm({ ...form, materiaId: e.target.value })}
                >
                  <option value="">— Selecciona materia —</option>
                  {materias.map(m => (
                    <option key={m.id} value={m.id}>{m.nombre}</option>
                  ))}
                </select>
              </div>

              <div className="grp-field">
                <label>Ciclo escolar</label>
                <input
                  placeholder="Ej. 2024-2025"
                  value={form.ciclo}
                  onChange={(e) => setForm({ ...form, ciclo: e.target.value })}
                />
              </div>

              <div className="grp-field">
                <label>Docente responsable</label>
                <input
                  placeholder="Ej. Lic. García Pérez"
                  value={form.docente}
                  onChange={(e) => setForm({ ...form, docente: e.target.value })}
                />
              </div>

              <hr className="grp-modal-divider" />

              <div className="grp-modal-footer">
                <button
                  type="button"
                  className="grp-btn-cancel"
                  onClick={() => { setShowForm(false); setEditando(null); setForm({ nombre: "", materiaId: "", ciclo: "", docente: "" }); }}
                >
                  Cancelar
                </button>
                <button type="submit" className="grp-btn-save">
                  {editando ? "Guardar cambios" : "Registrar grupo"}
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