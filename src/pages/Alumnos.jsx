import React, { useState } from 'react';

function Alumnos() {
  // Datos iniciales de alumnos
  const [alumnos, setAlumnos] = useState([
    { nombre: 'Juan', apellido: 'Pérez', matricula: '2021001', carrera: 'Ingeniería en Sistemas', semestre: '8', estado: 'Activo' },
    { nombre: 'María', apellido: 'García', matricula: '2021002', carrera: 'Ingeniería Civil', semestre: '6', estado: 'Activo' },
    { nombre: 'Carlos', apellido: 'López', matricula: '2021003', carrera: 'Medicina', semestre: '10', estado: 'Inactivo' },
  ]);

  // Estado del formulario
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    matricula: '',
    carrera: '',
    semestre: '',
  });

  const [errores, setErrores] = useState({});

  // Carreras disponibles
  const carreras = [
    'Ingeniería en Sistemas',
    'Ingeniería Civil',
    'Medicina',
    'Derecho',
    'Administración',
    'Contabilidad',
  ];

  // Semestres disponibles
  const semestres = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

  // Validar campos
  const validarFormulario = () => {
    const nuevosErrores = {};
    
    if (!formData.nombre.trim()) nuevosErrores.nombre = 'El nombre es obligatorio';
    if (!formData.apellido.trim()) nuevosErrores.apellido = 'El apellido es obligatorio';
    if (!formData.matricula.trim()) nuevosErrores.matricula = 'La matrícula es obligatoria';
    if (!formData.carrera) nuevosErrores.carrera = 'La carrera es obligatoria';
    if (!formData.semestre) nuevosErrores.semestre = 'El semestre es obligatorio';

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Limpiar el error del campo cuando el usuario empieza a escribir
    if (errores[name]) {
      setErrores(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  // Manejar envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validarFormulario()) {
      return;
    }

    // Agregar nuevo alumno
    const nuevoAlumno = {
      ...formData,
      estado: 'Activo',
    };

    setAlumnos(prev => [...prev, nuevoAlumno]);

    // Limpiar formulario
    setFormData({
      nombre: '',
      apellido: '',
      matricula: '',
      carrera: '',
      semestre: '',
    });
    setErrores({});
  };

  return (
    <section className="p-6">
      <h1 className="text-2xl font-bold mb-6">Alumnos</h1>

      {/* Formulario para registrar nuevo alumno */}
      <div className="mb-8 bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h2 className="text-xl font-semibold mb-4">Registrar Nuevo Alumno</h2>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Campo Nombre */}
          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
              Nombre *
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errores.nombre ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Juan"
            />
            {errores.nombre && (
              <p className="text-red-500 text-xs mt-1">{errores.nombre}</p>
            )}
          </div>

          {/* Campo Apellido */}
          <div>
            <label htmlFor="apellido" className="block text-sm font-medium text-gray-700 mb-1">
              Apellido *
            </label>
            <input
              type="text"
              id="apellido"
              name="apellido"
              value={formData.apellido}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errores.apellido ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Pérez"
            />
            {errores.apellido && (
              <p className="text-red-500 text-xs mt-1">{errores.apellido}</p>
            )}
          </div>

          {/* Campo Matrícula */}
          <div>
            <label htmlFor="matricula" className="block text-sm font-medium text-gray-700 mb-1">
              Matrícula *
            </label>
            <input
              type="text"
              id="matricula"
              name="matricula"
              value={formData.matricula}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errores.matricula ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="2021001"
            />
            {errores.matricula && (
              <p className="text-red-500 text-xs mt-1">{errores.matricula}</p>
            )}
          </div>

          {/* Campo Carrera */}
          <div>
            <label htmlFor="carrera" className="block text-sm font-medium text-gray-700 mb-1">
              Carrera *
            </label>
            <select
              id="carrera"
              name="carrera"
              value={formData.carrera}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errores.carrera ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Selecciona una carrera</option>
              {carreras.map((carrera) => (
                <option key={carrera} value={carrera}>
                  {carrera}
                </option>
              ))}
            </select>
            {errores.carrera && (
              <p className="text-red-500 text-xs mt-1">{errores.carrera}</p>
            )}
          </div>

          {/* Campo Semestre */}
          <div>
            <label htmlFor="semestre" className="block text-sm font-medium text-gray-700 mb-1">
              Semestre *
            </label>
            <select
              id="semestre"
              name="semestre"
              value={formData.semestre}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errores.semestre ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Selecciona un semestre</option>
              {semestres.map((semestre) => (
                <option key={semestre} value={semestre}>
                  Semestre {semestre}
                </option>
              ))}
            </select>
            {errores.semestre && (
              <p className="text-red-500 text-xs mt-1">{errores.semestre}</p>
            )}
          </div>

          {/* Botón Guardar */}
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-700 transition"
            >
              Guardar Alumno
            </button>
          </div>
        </form>
      </div>

      {/* Lista de alumnos */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Lista de Alumnos</h2>

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
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Apellido</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Matrícula</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Carrera</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Semestre</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Estado</th>
                </tr>
              </thead>
              <tbody>
                {alumnos.map((alumno, index) => (
                  <tr key={index} className="border-t border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-2 text-sm text-gray-900">{alumno.nombre}</td>
                    <td className="px-4 py-2 text-sm text-gray-900">{alumno.apellido}</td>
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
      </div>
    </section>
  );
}

export default Alumnos;
