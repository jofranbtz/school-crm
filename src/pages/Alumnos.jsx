import React, { useState, useMemo } from 'react';

function Alumnos() {
  // Datos iniciales de alumnos
  const [alumnos, setAlumnos] = useState([
    { nombre: 'Juan', apellido: 'Pérez', matricula: '2021001', carrera: 'Ingeniería en Sistemas', semestre: '8', grupo: 'A', estado: 'Activo' },
    { nombre: 'María', apellido: 'García', matricula: '2021002', carrera: 'Ingeniería Civil', semestre: '6', grupo: 'B', estado: 'Activo' },
    { nombre: 'Carlos', apellido: 'López', matricula: '2021003', carrera: 'Medicina', semestre: '10', grupo: 'C', estado: 'Inactivo' },
  ]);

  // Estado del formulario
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    matricula: '',
    carrera: '',
    semestre: '',
    grupo: '',
  });

  const [errores, setErrores] = useState({});

  const [busqueda, setBusqueda] = useState('');
  const [filtroCarrera, setFiltroCarrera] = useState('');
  const [filtroSemestre, setFiltroSemestre] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');

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
    if (!formData.grupo.trim()) nuevosErrores.grupo = 'El grupo es obligatorio';

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
      grupo: '',
    });
    setErrores({});
  };

// Estado para edición
  const [editIndex, setEditIndex] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [showPerfilModal, setShowPerfilModal] = useState(false);
  const [alumnoPerfil, setAlumnoPerfil] = useState(null);

  // Estado para modal de confirmación de baja
  const [showConfirmBaja, setShowConfirmBaja] = useState(false);
  const [alumnoParaBaja, setAlumnoParaBaja] = useState(null);

  // Abrir modal y cargar datos del alumno
  const handleEditAlumno = (index) => {
    setEditIndex(index);
    setFormData({ ...alumnos[index] });
    setShowModal(true);
    setErrores({});
  };

  const handleVerPerfil = (index) => {
    setAlumnoPerfil(alumnos[index]);
    setShowPerfilModal(true);
  };

// Guardar cambios de edición
  const handleUpdateAlumno = (e) => {
    e.preventDefault();
    if (!validarFormulario()) return;
    setAlumnos(prev => prev.map((al, idx) => idx === editIndex ? { ...formData, estado: al.estado } : al));
    setShowModal(false);
    setEditIndex(null);
    setFormData({ nombre: '', apellido: '', matricula: '', carrera: '', semestre: '', grupo: '' });
    setErrores({});
  };

  // Abrir modal de confirmación de baja
  const handleConfirmBaja = (index) => {
    setAlumnoParaBaja(index);
    setShowConfirmBaja(true);
  };

  // Confirmar la baja del alumno
  const handleBajaAlumno = () => {
    setAlumnos(prev => prev.map((al, idx) => 
      idx === alumnoParaBaja ? { ...al, estado: 'Baja' } : al
    ));
    setShowConfirmBaja(false);
    setAlumnoParaBaja(null);
  };

  const alumnosFiltrados = useMemo(() => {
    return alumnos.filter((alumno) => {
      const textoBusqueda = busqueda.toLowerCase();
      const coincideBusqueda = !busqueda || (() => {
        const terminos = textoBusqueda.split(/\s+/).filter(t => t.length > 0);
        return terminos.every((termino) =>
          alumno.nombre.toLowerCase().includes(termino) ||
          alumno.apellido.toLowerCase().includes(termino) ||
          alumno.matricula.toLowerCase().includes(termino)
        );
      })();

      const coincideCarrera = !filtroCarrera || alumno.carrera === filtroCarrera;
      const coincideSemestre = !filtroSemestre || alumno.semestre === filtroSemestre;
      const coincideEstado = !filtroEstado || alumno.estado === filtroEstado;

      return coincideBusqueda && coincideCarrera && coincideSemestre && coincideEstado;
    });
  }, [alumnos, busqueda, filtroCarrera, filtroSemestre, filtroEstado]);

  return (
    <section className="p-6">
      <h1 className="text-2xl font-bold mb-6">Alumnos</h1>

      {/* Formulario para registrar nuevo alumno */}
      <div className="mb-8 bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h2 className="text-xl font-semibold mb-4">Registrar Nuevo Alumno</h2>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Campo Grupo */}
                    <div>
                      <label htmlFor="grupo" className="block text-sm font-medium text-gray-700 mb-1">
                        Grupo *
                      </label>
                      <input
                        type="text"
                        id="grupo"
                        name="grupo"
                        value={formData.grupo}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errores.grupo ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="A"
                      />
                      {errores.grupo && (
                        <p className="text-red-500 text-xs mt-1">{errores.grupo}</p>
                      )}
                    </div>
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

{/* Modal de edición */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg relative">
            <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700" onClick={() => setShowModal(false)}>&times;</button>
            <h2 className="text-xl font-semibold mb-4">Editar Alumno</h2>
            <form onSubmit={handleUpdateAlumno} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Campos igual que el formulario de registro */}
              <div>
                <label htmlFor="nombre-edit" className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                <input type="text" id="nombre-edit" name="nombre" value={formData.nombre} onChange={handleChange} className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errores.nombre ? 'border-red-500' : 'border-gray-300'}`} />
                {errores.nombre && (<p className="text-red-500 text-xs mt-1">{errores.nombre}</p>)}
              </div>
              <div>
                <label htmlFor="apellido-edit" className="block text-sm font-medium text-gray-700 mb-1">Apellido *</label>
                <input type="text" id="apellido-edit" name="apellido" value={formData.apellido} onChange={handleChange} className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errores.apellido ? 'border-red-500' : 'border-gray-300'}`} />
                {errores.apellido && (<p className="text-red-500 text-xs mt-1">{errores.apellido}</p>)}
              </div>
              <div>
                <label htmlFor="matricula-edit" className="block text-sm font-medium text-gray-700 mb-1">Matrícula *</label>
                <input type="text" id="matricula-edit" name="matricula" value={formData.matricula} onChange={handleChange} className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errores.matricula ? 'border-red-500' : 'border-gray-300'}`} />
                {errores.matricula && (<p className="text-red-500 text-xs mt-1">{errores.matricula}</p>)}
              </div>
              <div>
                <label htmlFor="carrera-edit" className="block text-sm font-medium text-gray-700 mb-1">Carrera *</label>
                <select id="carrera-edit" name="carrera" value={formData.carrera} onChange={handleChange} className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errores.carrera ? 'border-red-500' : 'border-gray-300'}`}>{carreras.map((carrera) => (<option key={carrera} value={carrera}>{carrera}</option>))}</select>
                {errores.carrera && (<p className="text-red-500 text-xs mt-1">{errores.carrera}</p>)}
              </div>
              <div>
                <label htmlFor="semestre-edit" className="block text-sm font-medium text-gray-700 mb-1">Semestre *</label>
                <select id="semestre-edit" name="semestre" value={formData.semestre} onChange={handleChange} className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errores.semestre ? 'border-red-500' : 'border-gray-300'}`}>{semestres.map((semestre) => (<option key={semestre} value={semestre}>Semestre {semestre}</option>))}</select>
                {errores.semestre && (<p className="text-red-500 text-xs mt-1">{errores.semestre}</p>)}
              </div>
              <div>
                <label htmlFor="grupo-edit" className="block text-sm font-medium text-gray-700 mb-1">Grupo *</label>
                <input type="text" id="grupo-edit" name="grupo" value={formData.grupo} onChange={handleChange} className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errores.grupo ? 'border-red-500' : 'border-gray-300'}`} />
                {errores.grupo && (<p className="text-red-500 text-xs mt-1">{errores.grupo}</p>)}
              </div>
              <div className="flex items-end">
                <button type="submit" className="w-full bg-blue-600 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-700 transition">Guardar Cambios</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de perfil del alumno */}
      {showPerfilModal && alumnoPerfil && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto relative">
            <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl" onClick={() => setShowPerfilModal(false)}>&times;</button>
            <div className="mb-6">
              <h2 className="text-2xl font-bold">{alumnoPerfil.nombre} {alumnoPerfil.apellido}</h2>
              <p className="text-gray-500">Matrícula: {alumnoPerfil.matricula}</p>
            </div>
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Información General</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded-md">
                  <p className="text-sm text-gray-500">Nombre completo</p>
                  <p className="font-medium">{alumnoPerfil.nombre} {alumnoPerfil.apellido}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-md">
                  <p className="text-sm text-gray-500">Matrícula</p>
                  <p className="font-medium">{alumnoPerfil.matricula}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-md">
                  <p className="text-sm text-gray-500">Carrera</p>
                  <p className="font-medium">{alumnoPerfil.carrera}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-md">
                  <p className="text-sm text-gray-500">Semestre</p>
                  <p className="font-medium">{alumnoPerfil.semestre}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-md">
                  <p className="text-sm text-gray-500">Grupo</p>
                  <p className="font-medium">{alumnoPerfil.grupo}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-md">
                  <p className="text-sm text-gray-500">Estado</p>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    alumnoPerfil.estado === 'Activo' ? 'bg-green-100 text-green-800' :
                    alumnoPerfil.estado === 'Baja' ? 'bg-gray-200 text-gray-600' : 'bg-red-100 text-red-800'
                  }`}>
                    {alumnoPerfil.estado}
                  </span>
                </div>
              </div>
            </div>
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Grupos Inscritos</h3>
              <p className="text-gray-500 text-sm">Sin grupos inscritos.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3">Calificaciones</h3>
              <p className="text-gray-500 text-sm">Sin calificaciones registradas.</p>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación de baja */}
      {showConfirmBaja && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Confirmar Baja</h2>
            <p className="text-gray-700 mb-6">
              ¿Estás seguro de que deseas dar de baja al alumno <strong>{alumnos[alumnoParaBaja]?.nombre} {alumnos[alumnoParaBaja]?.apellido}</strong>? 
              Su estado cambió a "Baja".
            </p>
            <div className="flex gap-4 justify-end">
              <button
                className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium py-2 px-4 rounded-md transition"
                onClick={() => {
                  setShowConfirmBaja(false);
                  setAlumnoParaBaja(null);
                }}
              >
                Cancelar
              </button>
              <button
                className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition"
                onClick={handleBajaAlumno}
              >
                Confirmar Baja
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lista de alumnos */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Lista de Alumnos</h2>

        {/* Barra de búsqueda y filtros */}
        <div className="mb-4 p-4 bg-white rounded-lg shadow-md border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label htmlFor="busqueda" className="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
              <input
                type="text"
                id="busqueda"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nombre, apellido o matrícula"
              />
            </div>
            <div>
              <label htmlFor="filtroCarrera" className="block text-sm font-medium text-gray-700 mb-1">Carrera</label>
              <select
                id="filtroCarrera"
                value={filtroCarrera}
                onChange={(e) => setFiltroCarrera(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todas</option>
                {carreras.map((carrera) => (
                  <option key={carrera} value={carrera}>{carrera}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="filtroSemestre" className="block text-sm font-medium text-gray-700 mb-1">Semestre</label>
              <select
                id="filtroSemestre"
                value={filtroSemestre}
                onChange={(e) => setFiltroSemestre(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todos</option>
                {semestres.map((semestre) => (
                  <option key={semestre} value={semestre}>Semestre {semestre}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="filtroEstado" className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
              <select
                id="filtroEstado"
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todos</option>
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
                <option value="Baja">Baja</option>
              </select>
            </div>
          </div>
          {(busqueda || filtroCarrera || filtroSemestre || filtroEstado) && (
            <button
              className="mt-3 text-sm text-blue-600 hover:text-blue-800"
              onClick={() => {
                setBusqueda('');
                setFiltroCarrera('');
                setFiltroSemestre('');
                setFiltroEstado('');
              }}
            >
              Limpiar filtros
            </button>
          )}
        </div>

        {alumnosFiltrados.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No hay alumnos que coincidan con los filtros aplicados.</p>
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
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Grupo</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Estado</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Acciones</th>
                </tr>
              </thead>
              <tbody>
{alumnosFiltrados.map((alumno, index) => (
                  <tr key={index} className={`border-t border-gray-200 hover:bg-gray-50 ${alumno.estado === 'Baja' ? 'bg-gray-100 opacity-60' : ''}`}>
                    <td className="px-4 py-2 text-sm">
                      <button
                        className="text-blue-600 hover:text-blue-800 underline hover:no-underline"
                        onClick={() => handleVerPerfil(index)}
                      >
                        {alumno.nombre}
                      </button>
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-900">{alumno.apellido}</td>
                    <td className="px-4 py-2 text-sm text-gray-900">{alumno.matricula}</td>
                    <td className="px-4 py-2 text-sm text-gray-900">{alumno.carrera}</td>
                    <td className="px-4 py-2 text-sm text-gray-900">{alumno.semestre}</td>
                    <td className="px-4 py-2 text-sm text-gray-900">{alumno.grupo}</td>
<td className="px-4 py-2 text-sm text-gray-900">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        alumno.estado === 'Activo' ? 'bg-green-100 text-green-800' : 
                        alumno.estado === 'Baja' ? 'bg-gray-200 text-gray-600' : 'bg-red-100 text-red-800'
                      }`}>
                        {alumno.estado}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-900">
                      {alumno.estado !== 'Baja' && (
                        <div className="flex gap-2">
                          <button
                            className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded"
                            onClick={() => handleEditAlumno(index)}
                          >
                            Editar
                          </button>
                          {alumno.estado === 'Activo' && (
                            <button
                              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                              onClick={() => handleConfirmBaja(index)}
                            >
                              Baja
                            </button>
                          )}
                        </div>
                      )}
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
