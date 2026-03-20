export const FichaClienteCard = ({ cliente, prestamos }) => {
  const getEstadoColor = (estado) => {
    const colors = {
      pendiente: "bg-gray-500",
      activo: "bg-green-500",
      completado: "bg-blue-500",
      incumplido: "bg-red-500",
    };
    return colors[estado] || "bg-gray-500";
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

  return (
    <div className="space-y-6">
      {/* Datos del Cliente */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Información del Cliente
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Nombre Completo</p>
            <p className="text-lg font-semibold text-gray-900">
              {cliente.nombre} {cliente.apellido}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">CI</p>
            <p className="text-lg font-semibold text-gray-900">{cliente.ci}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Teléfono</p>
            <p className="text-lg font-semibold text-gray-900">
              {cliente.telefono}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Email</p>
            <p className="text-lg font-semibold text-gray-900">
              {cliente.email || "No proporcionado"}
            </p>
          </div>
          <div className="md:col-span-2">
            <p className="text-sm text-gray-600">Dirección</p>
            <p className="text-lg font-semibold text-gray-900">
              {cliente.direccion}
            </p>
          </div>
        </div>
      </div>

      {/* Préstamos */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Historial de Préstamos
        </h2>
        <div className="space-y-4">
          {prestamos.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
              No hay préstamos registrados para este cliente
            </div>
          ) : (
            prestamos.map((prestamo) => {
              const progreso =
                prestamo.total_cuotas > 0
                  ? (parseInt(prestamo.cuotas_pagadas) /
                      parseInt(prestamo.total_cuotas)) *
                    100
                  : 0;

              return (
                <div
                  key={prestamo.prestamo_id}
                  className="bg-white rounded-lg shadow overflow-hidden"
                >
                  {/* Header del préstamo */}
                  <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">
                        Préstamo #{prestamo.prestamo_id}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Inicio:{" "}
                        {new Date(prestamo.fecha_inicio).toLocaleDateString(
                          "es-ES",
                        )}
                      </p>
                    </div>
                    <span
                      className={`px-4 py-2 rounded-full text-white font-semibold ${getEstadoColor(prestamo.estado_prestamo)}`}
                    >
                      {getEstadoLabel(prestamo.estado_prestamo)}
                    </span>
                  </div>

                  {/* Detalles del préstamo */}
                  <div className="px-6 py-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-gray-600">Capital</p>
                        <p className="text-lg font-bold text-gray-900">
                          Bs. {parseFloat(prestamo.capital).toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Tasa Interés</p>
                        <p className="text-lg font-bold text-gray-900">
                          {parseFloat(prestamo.tasa_interes).toFixed(2)}%
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Total a Pagar</p>
                        <p className="text-lg font-bold text-gray-900">
                          Bs. {parseFloat(prestamo.total_a_pagar).toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Saldo Restante</p>
                        <p className="text-lg font-bold text-red-600">
                          Bs. {parseFloat(prestamo.saldo_restante).toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-gray-600">Frecuencia</p>
                        <p className="text-sm font-semibold text-gray-900 capitalize">
                          {prestamo.frecuencia_pago}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Tipo</p>
                        <p className="text-sm font-semibold text-gray-900 capitalize">
                          {prestamo.tipo_prestamo}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Cuotas Pagadas</p>
                        <p className="text-sm font-semibold text-green-600">
                          {prestamo.cuotas_pagadas} / {prestamo.total_cuotas}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">
                          Cuotas Pendientes
                        </p>
                        <p className="text-sm font-semibold text-orange-600">
                          {prestamo.cuotas_pendientes}
                        </p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Progreso de pagos</span>
                        <span className="font-semibold">
                          {progreso.toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-4">
                        <div
                          className="bg-blue-500 h-4 rounded-full transition-all duration-300"
                          style={{ width: `${progreso}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <p className="text-xs text-gray-600">Cobrador Asignado</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {prestamo.cobrador}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
