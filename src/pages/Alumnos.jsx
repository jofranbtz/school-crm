import React, { useState } from 'react';

function Alumnos() {
  // Datos mock de alumnos (puedes reemplazar con datos de API más tarde)
  const [alumnos] = useState([
    { nombre: 'Juan Pérez', matricula: '2021001', carrera: 'Ingeniería en Sistemas', semestre: '8', estado: 'Activo' },
    { nombre: 'María García', matricula: '2021002', carrera: 'Ingeniería Civil', semestre: '6', estado: 'Activo' },
    { nombre: 'Carlos López', matricula: '2021003', carrera: 'Medicina', semestre: '10', estado: 'Inactivo' },
    // Agrega más alumnos según necesites
  ]);

  return (
    <section className="p-6">
      <h1 className="text-2xl font-bold mb-4">Alumnos</h1>
      <p className="mb-6">Gestión de alumnos y datos personales.</p>

      {alumnos.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No hay alumnos registrados.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Nombre</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Matrícula</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Carrera</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Semestre</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Estado</th>
              </tr>
            </thead>
            <tbody>
              {alumnos.map((alumno, index) => (
                <tr key={index} className="border-t border-gray-200">
                  <td className="px-4 py-2 text-sm text-gray-900">{alumno.nombre}</td>
                  <td className="px-4 py-2 text-sm text-gray-900">{alumno.matricula}</td>
                  <td className="px-4 py-2 text-sm text-gray-900">{alumno.carrera}</td>
                  <td className="px-4 py-2 text-sm text-gray-900">{alumno.semestre}</td>
                  <td className="px-4 py-2 text-sm text-gray-900">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      alumno.estado === 'Activo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {alumno.estado}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default Alumnos;
