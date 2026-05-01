import { useParams, useNavigate } from 'react-router-dom';

function PerfilAlumno() {
  const { matricula } = useParams();
  const navigate = useNavigate();

  const alumnos = [
    { nombre: 'Juan', apellido: 'Pérez', matricula: '2021001', carrera: 'Ingeniería en Sistemas', semestre: '8', grupo: 'A', estado: 'Activo' },
    { nombre: 'María', apellido: 'García', matricula: '2021002', carrera: 'Ingeniería Civil', semestre: '6', grupo: 'B', estado: 'Activo' },
    { nombre: 'Carlos', apellido: 'López', matricula: '2021003', carrera: 'Medicina', semestre: '10', grupo: 'C', estado: 'Inactivo' },
  ];

  const gruposInscritos = [
    { nombre: 'GPO-101', materia: 'Matemáticas Avanzadas', ciclo: '2026-1', docente: 'Dr. Ramírez' },
    { nombre: 'GPO-205', materia: 'Programación Web', ciclo: '2026-1', docente: 'Ing. Torres' },
  ];

  const calificaciones = [
    { materia: 'Matemáticas Avanzadas', parcial1: 8.5, parcial2: 9.0, parcial3: 8.0, final: 8.5 },
    { materia: 'Programación Web', parcial1: 9.0, parcial2: 8.5, parcial3: 9.5, final: 9.0 },
  ];

  const alumno = alumnos.find((a) => a.matricula === matricula);

  if (!alumno) {
    return (
      <section className="p-6">
        <div className="text-center py-8">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Alumno no encontrado</h2>
          <button
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition"
            onClick={() => navigate('/alumnos')}
          >
            Volver a la lista
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="p-6">
      <button
        className="mb-6 flex items-center gap-2 text-blue-600 hover:text-blue-800 transition"
        onClick={() => navigate('/alumnos')}
      >
        ← Volver a la lista de alumnos
      </button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-1">{alumno.nombre} {alumno.apellido}</h1>
        <p className="text-gray-500">Matrícula: {alumno.matricula}</p>
      </div>

      {/* Información del alumno */}
      <div className="mb-8 bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h2 className="text-xl font-semibold mb-4">Información General</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-500">Nombre completo</p>
            <p className="text-lg font-medium">{alumno.nombre} {alumno.apellido}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-500">Matrícula</p>
            <p className="text-lg font-medium">{alumno.matricula}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-500">Carrera</p>
            <p className="text-lg font-medium">{alumno.carrera}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-500">Semestre</p>
            <p className="text-lg font-medium">{alumno.semestre}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-500">Grupo</p>
            <p className="text-lg font-medium">{alumno.grupo}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-500">Estado</p>
            <span className={`px-3 py-1 rounded-full text-sm font-medium inline-block ${
              alumno.estado === 'Activo' ? 'bg-green-100 text-green-800' :
              alumno.estado === 'Baja' ? 'bg-gray-200 text-gray-600' : 'bg-red-100 text-red-800'
            }`}>
              {alumno.estado}
            </span>
          </div>
        </div>
      </div>

      {/* Grupos inscritos */}
      <div className="mb-8 bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h2 className="text-xl font-semibold mb-4">Grupos Inscritos</h2>
        {gruposInscritos.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No hay grupos inscritos.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Grupo</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Materia</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Ciclo Escolar</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Docente</th>
                </tr>
              </thead>
              <tbody>
                {gruposInscritos.map((grupo, index) => (
                  <tr key={index} className="border-t border-gray-200">
                    <td className="px-4 py-2 text-sm text-gray-900">{grupo.nombre}</td>
                    <td className="px-4 py-2 text-sm text-gray-900">{grupo.materia}</td>
                    <td className="px-4 py-2 text-sm text-gray-900">{grupo.ciclo}</td>
                    <td className="px-4 py-2 text-sm text-gray-900">{grupo.docente}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Calificaciones */}
      <div className="mb-8 bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h2 className="text-xl font-semibold mb-4">Calificaciones</h2>
        {calificaciones.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No hay calificaciones registradas.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Materia</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Parcial 1</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Parcial 2</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Parcial 3</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Final</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Estado</th>
                </tr>
              </thead>
              <tbody>
                {calificaciones.map((cal, index) => (
                  <tr key={index} className="border-t border-gray-200">
                    <td className="px-4 py-2 text-sm text-gray-900">{cal.materia}</td>
                    <td className="px-4 py-2 text-sm text-gray-900">{cal.parcial1}</td>
                    <td className="px-4 py-2 text-sm text-gray-900">{cal.parcial2}</td>
                    <td className="px-4 py-2 text-sm text-gray-900">{cal.parcial3}</td>
                    <td className="px-4 py-2 text-sm font-semibold text-gray-900">{cal.final}</td>
                    <td className="px-4 py-2 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        cal.final >= 6 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {cal.final >= 6 ? 'Aprobado' : 'Reprobado'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}

export default PerfilAlumno;
