export const CobrosCobradoresTable = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
        No hay datos de cobros para mostrar
      </div>
    );
  }

  // Ordenar por total cobrado descendente
  const sortedData = [...data].sort(
    (a, b) => parseFloat(b.total_cobrado) - parseFloat(a.total_cobrado),
  );

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ranking
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cobrador
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contacto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Num. Pagos
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Cobrado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Efectivo / QR
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedData.map((item, index) => {
              const totalCobrado = parseFloat(item.total_cobrado);
              const totalEfectivo = parseFloat(item.total_efectivo);
              const totalQr = parseFloat(item.total_qr);
              const porcentajeEfectivo =
                totalCobrado > 0 ? (totalEfectivo / totalCobrado) * 100 : 0;
              const porcentajeQr =
                totalCobrado > 0 ? (totalQr / totalCobrado) * 100 : 0;

              return (
                <tr
                  key={item.cobrador_id}
                  className={index < 3 ? "bg-yellow-50" : ""}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span
                        className={`px-3 py-1 text-xs font-bold rounded-full ${
                          index === 0
                            ? "bg-yellow-400 text-yellow-900"
                            : index === 1
                              ? "bg-gray-300 text-gray-900"
                              : index === 2
                                ? "bg-orange-400 text-orange-900"
                                : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        #{index + 1}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {item.cobrador}
                    </div>
                    <div className="text-sm text-gray-500">
                      ID: {item.cobrador_id}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.telefono}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.num_pagos}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-lg font-bold text-green-600">
                      Bs. {totalCobrado.toFixed(2)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Efectivo:</span>
                        <span className="font-semibold">
                          Bs. {totalEfectivo.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">QR:</span>
                        <span className="font-semibold">
                          Bs. {totalQr.toFixed(2)}
                        </span>
                      </div>
                      {/* Barra de progreso apilada */}
                      <div className="w-full bg-gray-200 rounded-full h-3 flex overflow-hidden">
                        <div
                          className="bg-green-500 h-3 flex items-center justify-center text-xs text-white"
                          style={{ width: `${porcentajeEfectivo}%` }}
                          title={`Efectivo: ${porcentajeEfectivo.toFixed(1)}%`}
                        ></div>
                        <div
                          className="bg-blue-500 h-3 flex items-center justify-center text-xs text-white"
                          style={{ width: `${porcentajeQr}%` }}
                          title={`QR: ${porcentajeQr.toFixed(1)}%`}
                        ></div>
                      </div>
                    </div>
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
