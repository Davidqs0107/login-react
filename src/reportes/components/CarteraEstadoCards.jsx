export const CarteraEstadoCards = ({ data }) => {
  const getEstadoColor = (estado) => {
    const colors = {
      pendiente: "bg-gray-100 border-gray-300 text-gray-800",
      activo: "bg-green-100 border-green-300 text-green-800",
      completado: "bg-blue-100 border-blue-300 text-blue-800",
      incumplido: "bg-red-100 border-red-300 text-red-800",
    };
    return colors[estado] || "bg-gray-100 border-gray-300 text-gray-800";
  };

  const getEstadoLabel = (estado) => {
    const labels = {
      pendiente: "Pendiente",
      activo: "Activo",
      completado: "Completado",
      incumplido: "Incumplido",
    };
    return labels[estado] || estado;
  };

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
        No hay datos de cartera para mostrar
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {data.map((item, index) => {
        const progreso =
          item.capital_prestado > 0
            ? (parseFloat(item.total_pagado) /
                parseFloat(item.capital_prestado)) *
              100
            : 0;

        return (
          <div
            key={index}
            className={`rounded-lg shadow-lg p-6 border-2 ${getEstadoColor(item.estado_prestamo)}`}
          >
            <div className="mb-4">
              <h3 className="text-lg font-bold uppercase">
                {getEstadoLabel(item.estado_prestamo)}
              </h3>
              <p className="text-sm opacity-75">
                {item.num_prestamos} préstamos
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-xs opacity-75">Capital Prestado</p>
                <p className="text-xl font-bold">
                  Bs. {parseFloat(item.capital_prestado).toFixed(2)}
                </p>
              </div>

              <div>
                <p className="text-xs opacity-75">Total Pagado</p>
                <p className="text-lg font-semibold">
                  Bs. {parseFloat(item.total_pagado).toFixed(2)}
                </p>
              </div>

              <div>
                <p className="text-xs opacity-75">Saldo Pendiente</p>
                <p className="text-lg font-semibold">
                  Bs. {parseFloat(item.saldo_pendiente).toFixed(2)}
                </p>
              </div>

              {/* Barra de progreso */}
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-current h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progreso}%` }}
                  ></div>
                </div>
                <p className="text-xs text-right mt-1 opacity-75">
                  {progreso.toFixed(1)}% recuperado
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
