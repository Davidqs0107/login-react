import { Link } from "react-router";

export const AgendaCobroTable = ({ data }) => {
  const getEstadoColor = (estado) => {
    const colors = {
      pendiente: "bg-gray-100 text-gray-800",
      parcial: "bg-orange-100 text-orange-800",
    };
    return colors[estado] || "bg-gray-100 text-gray-800";
  };

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
        No hay cuotas próximas a vencer
      </div>
    );
  }

  // Agrupar por fecha
  const groupedByDate = data.reduce((acc, item) => {
    const fecha = item.fecha_pago;
    if (!acc[fecha]) {
      acc[fecha] = [];
    }
    acc[fecha].push(item);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {Object.entries(groupedByDate).map(([fecha, cuotas]) => (
        <div key={fecha} className="bg-white rounded-lg shadow overflow-hidden">
          {/* Separador de fecha */}
          <div className="bg-blue-500 text-white px-6 py-3 font-semibold">
            {new Date(fecha).toLocaleDateString("es-ES", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contacto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cuota
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Monto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cobrador
                  </th> */}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {cuotas.map((item) => (
                  <tr key={item.cuota_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {item.cliente}
                        </div>
                        <div className="text-sm text-gray-500">
                          CI: {item.ci}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {item.telefono}
                      </div>
                      <div className="text-sm text-gray-500">
                        {item.direccion}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        Cuota #{item.numero_cuota}
                      </div>
                      <div className="text-sm text-gray-500">
                        Préstamo #{item.prestamo_id}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        Bs. {parseFloat(item.monto_cuota).toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-500">
                        Pendiente: Bs.{" "}
                        {parseFloat(item.monto_pendiente).toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getEstadoColor(item.estado)}`}
                      >
                        {item.estado}
                      </span>
                    </td>
                    {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.cobrador}
                    </td> */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Link
                        to={`/prestamo/${item.prestamo_id}`}
                        className="text-blue-600 hover:text-blue-900 font-medium"
                      >
                        Registrar Pago
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
};
