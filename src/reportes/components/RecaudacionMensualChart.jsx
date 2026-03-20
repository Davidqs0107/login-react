export const RecaudacionMensualChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
        No hay datos de recaudación para mostrar
      </div>
    );
  }

  // Calcular el valor máximo para escalar las barras
  const maxValue = Math.max(
    ...data.map((item) => parseFloat(item.total_cobrado)),
  );

  return (
    <div className="space-y-6">
      {/* Resumen en tarjetas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {data.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500"
          >
            <div className="mb-2">
              <h3 className="text-lg font-bold text-gray-800">
                {new Date(item.mes + "-01").toLocaleDateString("es-ES", {
                  year: "numeric",
                  month: "long",
                })}
              </h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Cobrado:</span>
                <span className="text-xl font-bold text-green-600">
                  Bs. {parseFloat(item.total_cobrado).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Efectivo:</span>
                <span className="text-sm font-semibold text-gray-700">
                  Bs. {parseFloat(item.total_efectivo).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">QR:</span>
                <span className="text-sm font-semibold text-gray-700">
                  Bs. {parseFloat(item.total_qr).toFixed(2)}
                </span>
              </div>
              <div className="pt-2 border-t">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Préstamos:</span>
                  <span className="font-medium">
                    {item.prestamos_con_pagos}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Pagos:</span>
                  <span className="font-medium">{item.num_pagos}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Gráfico de barras */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">
          Comparativa Mensual
        </h3>
        <div className="space-y-4">
          {data.map((item, index) => {
            const totalCobrado = parseFloat(item.total_cobrado);
            const totalEfectivo = parseFloat(item.total_efectivo);
            const totalQr = parseFloat(item.total_qr);
            const percentage = (totalCobrado / maxValue) * 100;
            const efectivoPercentage = (totalEfectivo / totalCobrado) * 100;
            const qrPercentage = (totalQr / totalCobrado) * 100;

            return (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    {new Date(item.mes + "-01").toLocaleDateString("es-ES", {
                      year: "numeric",
                      month: "short",
                    })}
                  </span>
                  <span className="text-sm font-bold text-gray-900">
                    Bs. {totalCobrado.toFixed(2)}
                  </span>
                </div>
                <div className="relative">
                  {/* Barra total */}
                  <div className="w-full bg-gray-200 rounded-full h-8 overflow-hidden">
                    <div
                      className="h-8 rounded-full flex"
                      style={{ width: `${percentage}%` }}
                    >
                      {/* Efectivo */}
                      <div
                        className="bg-green-500 h-8 flex items-center justify-center"
                        style={{ width: `${efectivoPercentage}%` }}
                      >
                        {efectivoPercentage > 15 && (
                          <span className="text-xs text-white font-semibold">
                            Efectivo: {totalEfectivo.toFixed(0)}
                          </span>
                        )}
                      </div>
                      {/* QR */}
                      <div
                        className="bg-blue-500 h-8 flex items-center justify-center"
                        style={{ width: `${qrPercentage}%` }}
                      >
                        {qrPercentage > 15 && (
                          <span className="text-xs text-white font-semibold">
                            QR: {totalQr.toFixed(0)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{item.num_pagos} pagos</span>
                  <span>{item.prestamos_con_pagos} préstamos</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Leyenda */}
        <div className="flex justify-center gap-6 mt-6 pt-4 border-t">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-sm text-gray-700">Efectivo</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span className="text-sm text-gray-700">QR</span>
          </div>
        </div>
      </div>
    </div>
  );
};
