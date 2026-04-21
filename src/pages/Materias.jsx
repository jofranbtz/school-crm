function Materias() {
  
  const materias = [];


  /*
  const materias = [
    { clave: "MAT101", nombre: "Matemáticas", calificacion: 8, semestre: 1 },
    { clave: "PRO102", nombre: "Programación", calificacion: 10, semestre: 2 },
  ];
  */

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Materias</h1>

      {materias.length === 0 ? (
        <p>No hay materias registradas</p>
      ) : (
        <table className="w-full border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="border p-2">Clave</th>
              <th className="border p-2">Nombre</th>
              <th className="border p-2">Calificación</th>
              <th className="border p-2">Semestre</th>
            </tr>
          </thead>
          <tbody>
            {materias.map((materia, index) => (
              <tr key={index}>
                <td className="border p-2">{materia.clave}</td>
                <td className="border p-2">{materia.nombre}</td>
                <td className="border p-2">{materia.calificacion}</td>
                <td className="border p-2">{materia.semestre}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Materias;