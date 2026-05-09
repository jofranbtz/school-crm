import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

function GroupDashboard({ alumnos, grupoSeleccionado, calcularFinal }) {
  
  const alumnosFiltrados = alumnos.filter(a => a.grupo === grupoSeleccionado);

  const calificacionesFinales = alumnosFiltrados
    .map(a => parseFloat(calcularFinal(a)))
    .filter(cal => !isNaN(cal));

  // Calcular estadísticas
  const calcularEstadisticas = () => {
    if (calificacionesFinales.length === 0) {
      return {
        promedio: 0,
        maxima: 0,
        minima: 0,
        aprobados: 0,
        reprobados: 0,
      };
    }

    const promedio = (calificacionesFinales.reduce((a, b) => a + b, 0) / calificacionesFinales.length).toFixed(1);
    const maxima = Math.max(...calificacionesFinales).toFixed(1);
    const minima = Math.min(...calificacionesFinales).toFixed(1);
    const aprobados = calificacionesFinales.filter(cal => cal >= 6).length;
    const reprobados = calificacionesFinales.filter(cal => cal < 6).length;

    return { promedio, maxima, minima, aprobados, reprobados };
  };

  const estadisticas = calcularEstadisticas();

  const obtenerDistribucion = () => {
    const rangos = {
      '0-2': 0,
      '2-4': 0,
      '4-6': 0,
      '6-8': 0,
      '8-10': 0,
    };

    calificacionesFinales.forEach(cal => {
      if (cal < 2) rangos['0-2']++;
      else if (cal < 4) rangos['2-4']++;
      else if (cal < 6) rangos['4-6']++;
      else if (cal < 8) rangos['6-8']++;
      else rangos['8-10']++;
    });

    return rangos;
  };

  const distribucion = obtenerDistribucion();

  const chartBarData = {
    labels: Object.keys(distribucion),
    datasets: [
      {
        label: 'Cantidad de alumnos',
        data: Object.values(distribucion),
        backgroundColor: [
          'rgba(239, 68, 68, 0.7)',
          'rgba(249, 115, 22, 0.7)',
          'rgba(234, 179, 8, 0.7)',
          'rgba(34, 197, 94, 0.7)',
          'rgba(59, 130, 246, 0.7)',
        ],
        borderColor: [
          'rgba(220, 38, 38, 1)',
          'rgba(234, 88, 12, 1)',
          'rgba(202, 138, 4, 1)',
          'rgba(22, 163, 74, 1)',
          'rgba(37, 99, 235, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const chartPieData = {
    labels: ['Aprobados', 'Reprobados'],
    datasets: [
      {
        data: [estadisticas.aprobados, estadisticas.reprobados],
        backgroundColor: ['rgba(34, 197, 94, 0.7)', 'rgba(239, 68, 68, 0.7)'],
        borderColor: ['rgba(22, 163, 74, 1)', 'rgba(220, 38, 38, 1)'],
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 12,
          },
        },
      },
    },
  };

  return (
    <div className="space-y-6">
      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <p className="text-sm font-medium text-gray-600 mb-2">Promedio General</p>
          <p className="text-3xl font-bold text-blue-600">{estadisticas.promedio}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <p className="text-sm font-medium text-gray-600 mb-2">Calificación Máxima</p>
          <p className="text-3xl font-bold text-green-600">{estadisticas.maxima}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <p className="text-sm font-medium text-gray-600 mb-2">Calificación Mínima</p>
          <p className="text-3xl font-bold text-red-600">{estadisticas.minima}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <p className="text-sm font-medium text-gray-600 mb-2">Total de Alumnos</p>
          <p className="text-3xl font-bold text-gray-700">{alumnosFiltrados.length}</p>
        </div>
      </div>

      {/* Gráficas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Gráfica de barras */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Distribución de Calificaciones</h3>
          {calificacionesFinales.length > 0 ? (
            <Bar data={chartBarData} options={chartOptions} />
          ) : (
            <p className="text-center text-gray-500 py-8">No hay calificaciones registradas</p>
          )}
        </div>

        {/* Gráfica de pastel */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Aprobados vs Reprobados</h3>
          {calificacionesFinales.length > 0 ? (
            <div className="flex justify-center items-center" style={{ height: '300px' }}>
              <Pie
                data={chartPieData}
                options={chartOptions}
              />
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">No hay calificaciones registradas</p>
          )}
        </div>
      </div>

      {/* Tabla detallada */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">Detalle de Calificaciones</h3>
        {alumnosFiltrados.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border border-gray-200">
                    Alumno
                  </th>
                  <th className="px-4 py-2 text-center text-sm font-semibold text-gray-700 border border-gray-200">
                    P1
                  </th>
                  <th className="px-4 py-2 text-center text-sm font-semibold text-gray-700 border border-gray-200">
                    P2
                  </th>
                  <th className="px-4 py-2 text-center text-sm font-semibold text-gray-700 border border-gray-200">
                    P3
                  </th>
                  <th className="px-4 py-2 text-center text-sm font-semibold text-gray-700 border border-gray-200">
                    Ordinario
                  </th>
                  <th className="px-4 py-2 text-center text-sm font-semibold text-gray-700 border border-gray-200">
                    Final
                  </th>
                  <th className="px-4 py-2 text-center text-sm font-semibold text-gray-700 border border-gray-200">
                    Estatus
                  </th>
                </tr>
              </thead>
              <tbody>
                {alumnosFiltrados.map(alumno => {
                  const final = calcularFinal(alumno);
                  const estatus = parseFloat(final) >= 6 ? 'Aprobado' : 'Reprobado';
                  const estatusColor = estatus === 'Aprobado' ? 'text-green-600' : 'text-red-600';

                  return (
                    <tr key={alumno.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 text-sm text-gray-900 border border-gray-200">
                        {alumno.nombre}
                      </td>
                      <td className="px-4 py-2 text-center text-sm text-gray-700 border border-gray-200">
                        {alumno.p1 || '-'}
                      </td>
                      <td className="px-4 py-2 text-center text-sm text-gray-700 border border-gray-200">
                        {alumno.p2 || '-'}
                      </td>
                      <td className="px-4 py-2 text-center text-sm text-gray-700 border border-gray-200">
                        {alumno.p3 || '-'}
                      </td>
                      <td className="px-4 py-2 text-center text-sm text-gray-700 border border-gray-200">
                        {alumno.ord || '-'}
                      </td>
                      <td className="px-4 py-2 text-center text-sm font-semibold text-gray-900 border border-gray-200">
                        {final}
                      </td>
                      <td className={`px-4 py-2 text-center text-sm font-semibold border border-gray-200 ${estatusColor}`}>
                        {estatus}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">No hay alumnos en este grupo</p>
        )}
      </div>
    </div>
  );
}

export default GroupDashboard;