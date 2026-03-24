import { Link } from "react-router";

const ESTADO_STYLES = {
  pendiente: { badge: "bg-gray-100 text-gray-800", label: "Pendiente" },
  activo: { badge: "bg-green-100 text-green-800", label: "Activo" },
  completado: { badge: "bg-blue-100 text-blue-800", label: "Completado" },
  incumplido: { badge: "bg-red-100 text-red-800", label: "Incumplido" },
};

export const PrestamosPorClienteTable = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
        No se encontraron préstamos con los filtros aplicados
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cliente
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contacto
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Préstamo
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Capital / Interés
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Progreso Cuotas
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pagado / Total
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cobrador
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acción
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item) => {
              const { badge, label } =
                ESTADO_STYLES[item.estado_prestamo] || ESTADO_STYLES.pendiente;

              const cuotasPagadas = parseInt(item.cuotas_pagadas);
              const totalCuotas = parseInt(item.total_cuotas);
              const progresoPct =
                totalCuotas > 0
                  ? Math.round((cuotasPagadas / totalCuotas) * 100)
                  : 0;

              const totalPagado = parseFloat(item.total_pagado);
              const totalAPagar = parseFloat(item.total_a_pagar);
              const recuperadoPct =
                totalAPagar > 0
                  ? Math.round((totalPagado / totalAPagar) * 100)
                  : 0;

              return (
                <tr
                  key={item.prestamo_id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  {/* Cliente */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {item.cliente}
                    </div>
                    <div className="text-xs text-gray-500">CI: {item.ci}</div>
                  </td>

                  {/* Contacto */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{item.telefono}</div>
                    <div className="text-xs text-gray-500 max-w-[140px] truncate">
                      {item.direccion}
                    </div>
                  </td>

                  {/* Préstamo */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      #{item.prestamo_id}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(item.fecha_inicio).toLocaleDateString("es-ES")}
                    </div>
                    <div className="text-xs text-gray-400 capitalize">
                      {item.frecuencia_pago} · {item.tipo_prestamo}
                    </div>
                  </td>

                  {/* Capital / Interés */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">
                      Bs. {parseFloat(item.capital).toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {parseFloat(item.tasa_interes).toFixed(2)}% interés
                    </div>
                    <div className="text-xs text-red-500 font-medium">
                      Saldo: Bs. {parseFloat(item.saldo_pendiente).toFixed(2)}
                    </div>
                  </td>

                  {/* Progreso cuotas */}
                  <td className="px-4 py-3 whitespace-nowrap min-w-[140px]">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>
                        {cuotasPagadas}/{totalCuotas} cuotas
                      </span>
                      <span className="font-semibold">{progresoPct}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${progresoPct}%` }}
                      />
                    </div>
                    <div className="text-xs text-orange-500 mt-1">
                      {item.cuotas_pendientes} pendientes
                    </div>
                  </td>

                  {/* Pagado / Total */}
                  <td className="px-4 py-3 whitespace-nowrap min-w-[140px]">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Bs. {totalPagado.toFixed(2)}</span>
                      <span className="font-semibold">{recuperadoPct}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${recuperadoPct}%` }}
                      />
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      de Bs. {totalAPagar.toFixed(2)}
                    </div>
                  </td>

                  {/* Estado */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs font-semibold rounded-full ${badge}`}
                    >
                      {label}
                    </span>
                  </td>

                  {/* Cobrador */}
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                    {item.cobrador}
                  </td>

                  {/* Acción */}
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <Link
                      to={`/prestamo/${item.prestamo_id}`}
                      className="text-blue-600 hover:text-blue-900 font-medium"
                    >
                      Ver detalle
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
