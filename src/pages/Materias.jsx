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
    "Primero", "Segundo", "Tercero", "Cuarto", "Quinto",
    "Sexto", "Séptimo", "Octavo", "Noveno", "Décimo",
  ];

  const materiasOrdenadas = [...materias];

  if (filtro === "TODAS") materiasOrdenadas.sort((a, b) => a.id - b.id);
  if (filtro === "PRIMERO_DECIMO") materiasOrdenadas.sort((a, b) => ordenSemestres.indexOf(a.semestre) - ordenSemestres.indexOf(b.semestre));
  if (filtro === "DECIMO_PRIMERO") materiasOrdenadas.sort((a, b) => ordenSemestres.indexOf(b.semestre) - ordenSemestres.indexOf(a.semestre));
  if (filtro === "NOMBRE_AZ") materiasOrdenadas.sort((a, b) => a.nombre.localeCompare(b.nombre));
  if (filtro === "NOMBRE_ZA") materiasOrdenadas.sort((a, b) => b.nombre.localeCompare(a.nombre));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.clave || !form.nombre || !form.semestre) {
      alert("Todos los campos son obligatorios");
      return;
    }
    if (editando !== null && editando !== undefined) {
      const nuevas = materias.map((m) => m.id === editando ? { ...form, id: editando } : m);
      setMaterias(nuevas);
      setEditando(null);
      setShowForm(false);
      setForm({ clave: "", nombre: "", semestre: "" });
    } else {
      setMaterias([...materias, { ...form, id: generarId(materias) }]);
      setForm({ clave: "", nombre: "", semestre: "" });
      setShowForm(false);
    }
  };

  const eliminar = (id) => {
    const tieneGrupoConAlumnos = grupos.some(g => g.materiaId === id && g.alumnos.length > 0);
    if (tieneGrupoConAlumnos) { alert("No puedes eliminar esta materia porque tiene grupos asociados"); return; }
    if (!window.confirm("¿Seguro que deseas eliminar esta materia?")) return;
    setMaterias(materias.filter((m) => m.id !== id));
    setGrupos(grupos.filter(g => g.materiaId !== id));
  };

  const editar = (m) => {
    setForm({ clave: m.clave, nombre: m.nombre, semestre: m.semestre });
    setEditando(m.id);
    setShowForm(true);
  };

  const semestreColor = (sem) => {
    const idx = ordenSemestres.indexOf(sem);
    const colors = [
      "#6366f1","#8b5cf6","#a855f7","#ec4899","#f43f5e",
      "#ef4444","#f97316","#eab308","#22c55e","#14b8a6"
    ];
    return colors[idx] ?? "#6b7280";
  };

  return (
    <div style={{ padding: "32px 24px", maxWidth: 960, margin: "0 auto" }}>
      <style>{`
        .mat-page-title {
          font-size: 28px;
          font-weight: 700;
          letter-spacing: -0.5px;
          color: var(--text-h);
          margin: 0 0 28px;
        }
        .mat-toolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          gap: 12px;
          flex-wrap: wrap;
        }
        .mat-filter-label {
          font-size: 13px;
          font-weight: 600;
          color: var(--text);
          text-transform: uppercase;
          letter-spacing: 0.6px;
          margin-right: 8px;
        }
        .mat-select {
          appearance: none;
          background: var(--bg);
          border: 1.5px solid var(--border);
          border-radius: 8px;
          padding: 8px 36px 8px 12px;
          font-size: 13px;
          font-weight: 500;
          color: var(--text-h);
          cursor: pointer;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236b7280' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 12px center;
          transition: border-color .2s;
          outline: none;
        }
        .mat-select:focus { border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-bg); }
        .mat-add-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          background: var(--accent);
          color: #fff;
          border: none;
          border-radius: 10px;
          padding: 9px 18px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: opacity .2s, transform .15s;
          white-space: nowrap;
        }
        .mat-add-btn:hover { opacity: .88; transform: translateY(-1px); }
        .mat-add-btn svg { width: 16px; height: 16px; }

        /* Table */
        .mat-table-wrap {
          border-radius: 14px;
          overflow: hidden;
          border: 1.5px solid var(--border);
          box-shadow: var(--shadow);
        }
        .mat-table {
          width: 100%;
          border-collapse: collapse;
        }
        .mat-table thead tr {
          background: #0b0d17;
        }
        .mat-table thead th {
          padding: 13px 16px;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #c7d2fe;
          border: none;
          text-align: center;
        }
        .mat-table thead th:first-child { text-align: left; padding-left: 20px; }
        .mat-table tbody tr {
          border-bottom: 1px solid var(--border);
          transition: background .15s;
        }
        .mat-table tbody tr:last-child { border-bottom: none; }
        .mat-table tbody tr:hover { background: var(--accent-bg); }
        .mat-table td {
          padding: 12px 16px;
          font-size: 14px;
          color: var(--text);
          text-align: center;
          border: none;
        }
        .mat-table td:first-child { text-align: left; padding-left: 20px; }
        .mat-id-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 28px; height: 28px;
          border-radius: 6px;
          background: var(--code-bg);
          font-size: 12px;
          font-weight: 700;
          color: var(--text-h);
          font-family: var(--mono);
        }
        .mat-clave {
          font-family: var(--mono);
          font-size: 12px;
          font-weight: 600;
          padding: 2px 8px;
          border-radius: 5px;
          background: var(--accent-bg);
          color: var(--accent);
          border: 1px solid var(--accent-border);
          display: inline-block;
        }
        .mat-nombre {
          font-weight: 600;
          color: var(--text-h);
          font-size: 14px;
        }
        .mat-sem-pill {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 3px 10px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          color: #fff;
        }
        .mat-sem-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: rgba(255,255,255,0.6);
          flex-shrink: 0;
        }
        .mat-actions { display: flex; gap: 6px; justify-content: center; }
        .mat-btn-edit, .mat-btn-delete {
          display: flex; align-items: center; justify-content: center;
          width: 32px; height: 32px;
          border-radius: 8px;
          border: 1.5px solid transparent;
          cursor: pointer;
          font-size: 14px;
          transition: all .2s;
        }
        .mat-btn-edit {
          background: #eff6ff;
          border-color: #bfdbfe;
          color: #2563eb;
        }
        .mat-btn-edit:hover { background: #2563eb; color: #fff; border-color: #2563eb; }
        .mat-btn-delete {
          background: #fef2f2;
          border-color: #fecaca;
          color: #dc2626;
        }
        .mat-btn-delete:hover { background: #dc2626; color: #fff; border-color: #dc2626; }
        .mat-empty {
          padding: 48px 0;
          text-align: center;
          color: var(--text);
          font-size: 14px;
        }
        .mat-empty-icon { font-size: 36px; display: block; margin-bottom: 8px; }

        /* MODAL */
        .mat-overlay {
          position: fixed; inset: 0;
          background: rgba(0,0,0,.55);
          backdrop-filter: blur(4px);
          display: flex; align-items: center; justify-content: center;
          z-index: 100;
          animation: fadeIn .2s ease;
        }
        @keyframes fadeIn { from { opacity:0 } to { opacity:1 } }
        .mat-modal {
          background: var(--bg);
          border: 1.5px solid var(--border);
          border-radius: 18px;
          padding: 32px;
          width: 400px;
          max-width: calc(100vw - 32px);
          box-shadow: 0 24px 60px rgba(0,0,0,.2);
          animation: slideUp .25s ease;
        }
        @keyframes slideUp { from { transform: translateY(16px); opacity:0 } to { transform:none; opacity:1 } }
        .mat-modal-title {
          font-size: 18px;
          font-weight: 700;
          color: var(--text-h);
          margin: 0 0 6px;
        }
        .mat-modal-subtitle {
          font-size: 13px;
          color: var(--text);
          margin: 0 0 24px;
        }
        .mat-field {
          margin-bottom: 14px;
        }
        .mat-field label {
          display: block;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.7px;
          color: var(--text);
          margin-bottom: 5px;
        }
        .mat-field input, .mat-field select {
          width: 100%;
          padding: 10px 12px;
          border: 1.5px solid var(--border);
          border-radius: 9px;
          background: var(--bg);
          color: var(--text-h);
          font-size: 14px;
          outline: none;
          transition: border-color .2s, box-shadow .2s;
          box-sizing: border-box;
          font-family: var(--sans);
        }
        .mat-field input:focus, .mat-field select:focus {
          border-color: var(--accent);
          box-shadow: 0 0 0 3px var(--accent-bg);
        }
        .mat-field input::placeholder { color: var(--text); opacity: .6; }
        .mat-modal-footer {
          display: flex;
          gap: 10px;
          margin-top: 24px;
        }
        .mat-btn-save {
          flex: 1;
          padding: 11px;
          background: var(--accent);
          color: #fff;
          border: none;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: opacity .2s;
        }
        .mat-btn-save:hover { opacity: .85; }
        .mat-btn-cancel {
          flex: 1;
          padding: 11px;
          background: transparent;
          color: var(--text);
          border: 1.5px solid var(--border);
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: border-color .2s, color .2s;
        }
        .mat-btn-cancel:hover { border-color: #ef4444; color: #ef4444; }
        .mat-modal-divider {
          border: none; border-top: 1px solid var(--border);
          margin: 20px 0;
        }
      `}</style>

      <h1 className="mat-page-title">Materias</h1>

      <div className="mat-toolbar">
        <div style={{ display: "flex", alignItems: "center" }}>
          <span className="mat-filter-label">Ordenar:</span>
          <select
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="mat-select"
          >
            <option value="TODAS">Todas las materias</option>
            <option value="PRIMERO_DECIMO">1er semestre → Décimo</option>
            <option value="DECIMO_PRIMERO">Décimo → 1er semestre</option>
            <option value="NOMBRE_AZ">Nombre A → Z</option>
            <option value="NOMBRE_ZA">Nombre Z → A</option>
          </select>
        </div>

        <button onClick={() => setShowForm(true)} className="mat-add-btn">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="8" y1="2" x2="8" y2="14" /><line x1="2" y1="8" x2="14" y2="8" />
          </svg>
          Nueva materia
        </button>
      </div>

      <div className="mat-table-wrap">
        {materias.length === 0 ? (
          <div className="mat-empty">
            <span className="mat-empty-icon">📚</span>
            No hay materias registradas
          </div>
        ) : (
          <table className="mat-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Clave</th>
                <th>Nombre</th>
                <th>Semestre</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {materiasOrdenadas.map((m) => (
                <tr key={m.id}>
                  <td>
                    <span className="mat-id-badge">{m.id}</span>
                  </td>
                  <td>
                    <span className="mat-clave">{m.clave}</span>
                  </td>
                  <td>
                    <span className="mat-nombre">{m.nombre}</span>
                  </td>
                  <td>
                    <span
                      className="mat-sem-pill"
                      style={{ background: semestreColor(m.semestre) }}
                    >
                      <span className="mat-sem-dot" />
                      {m.semestre}
                    </span>
                  </td>
                  <td>
                    <div className="mat-actions">
                      <button onClick={() => editar(m)} className="mat-btn-edit" title="Editar">
                        ✏️
                      </button>
                      <button onClick={() => eliminar(m.id)} className="mat-btn-delete" title="Eliminar">
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showForm && (
        <div className="mat-overlay" onClick={(e) => e.target === e.currentTarget && setShowForm(false)}>
          <div className="mat-modal">
            <p className="mat-modal-title">
              {editando !== null ? "Editar materia" : "Nueva materia"}
            </p>
            <p className="mat-modal-subtitle">
              {editando !== null ? "Modifica los datos de la materia." : "Completa los campos para registrar una materia."}
            </p>

            <form onSubmit={handleSubmit}>
              <div className="mat-field">
                <label>Clave</label>
                <input
                  value={form.clave}
                  onChange={(e) => setForm({ ...form, clave: e.target.value })}
                  placeholder="Ej. MAT-101"
                />
              </div>

              <div className="mat-field">
                <label>Nombre de la materia</label>
                <input
                  value={form.nombre}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                  placeholder="Ej. Matemáticas Avanzadas"
                />
              </div>

              <div className="mat-field">
                <label>Semestre</label>
                <select
                  value={form.semestre}
                  onChange={(e) => setForm({ ...form, semestre: e.target.value })}
                >
                  <option value="">— Selecciona semestre —</option>
                  {ordenSemestres.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>

              <hr className="mat-modal-divider" />

              <div className="mat-modal-footer">
                <button
                  type="button"
                  className="mat-btn-cancel"
                  onClick={() => { setShowForm(false); setEditando(null); setForm({ clave: "", nombre: "", semestre: "" }); }}
                >
                  Cancelar
                </button>
                <button type="submit" className="mat-btn-save">
                  {editando !== null ? "Guardar cambios" : "Registrar materia"}
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
