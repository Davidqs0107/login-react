import React from "react";
import { useNavigate } from "react-router";
import { formatDate, formtaTipoPrestamo } from "../../common/functions";
import { Eye, FileInput, FileSearch2 } from "lucide-react";

export const LoansTable = ({
  loans = [],
  meta,
  openModal,
  onPageChange,
  typeModal,
}) => {
  const { page, totalPages = 1 } = meta;

  const navigate = useNavigate();

  // Calcular totales
  const totalMonto = loans.reduce(
    (sum, loan) => sum + parseFloat(loan.monto || 0),
    0
  );
  const totalCuotas = loans.reduce(
    (sum, loan) => sum + parseInt(loan.total_cuotas || 0),
    0
  );
  const onNavigate = (loanId) => {
    navigate(`/prestamo/${loanId}`);
  };
  const handleOpenModal = (prestamoId) => {
    typeModal(true);
    openModal(prestamoId);
  };
  const handleOpenModalDetail = (loan) => {
    typeModal(false);
    openModal(loan);
  };
  return (
    <div className="overflow-x-auto mt-6">
      <table className="hidden sm:table min-w-full table-auto border-collapse border border-gray-200 text-sm">
        <thead>
          <tr className="bg-gray-100 text-left text-sm font-medium text-gray-700">
            <th className="px-4 py-2 border border-gray-200">Nombre</th>
            <th className="px-4 py-2 border border-gray-200">Apellido</th>
            <th className="px-4 py-2 border border-gray-200">CI</th>
            <th className="px-4 py-2 border border-gray-200">Monto</th>
            <th className="px-4 py-2 border border-gray-200">Interes%</th>
            <th className="px-4 py-2 border border-gray-200">Monto total</th>
            <th className="px-4 py-2 border border-gray-200">Saldo</th>
            <th className="px-4 py-2 border border-gray-200">Frecuencia</th>
            <th className="px-4 py-2 border border-gray-200">Total Cuotas</th>
            <th className="px-4 py-2 border border-gray-200">Tipo prestamo</th>
            <th className="px-4 py-2 border border-gray-200">Fecha inicio</th>
            <th className="px-4 py-2 border border-gray-200">Estado</th>
            <th className="px-4 py-2 border border-gray-200">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {loans.map((loan) => (
            <tr
              key={loan.id}
              className="odd:bg-gray-50 even:bg-white hover:bg-gray-100"
            >
              <td className="px-4 py-2 border border-gray-200">
                {loan.nombre}
              </td>
              <td className="px-4 py-2 border border-gray-200">
                {loan.apellido}
              </td>
              <td className="px-4 py-2 border border-gray-200">{loan.ci}</td>
              <td className="px-4 py-2 border border-gray-200">{loan.monto}</td>
              <td className="px-4 py-2 border border-gray-200">
                {loan.tasa_interes}
              </td>
              <td className="px-4 py-2 border border-gray-200">
                {loan.monto_total_cuotas}
              </td>
              <td className="px-4 py-2 border border-gray-200">{loan.saldo}</td>
              <td className="px-4 py-2 border border-gray-200">
                {loan.frecuencia_pago}
              </td>
              <td className="px-4 py-2 border border-gray-200">
                {loan.total_cuotas}
              </td>
              <td className="px-4 py-2 border border-gray-200">
                {formtaTipoPrestamo(loan.tipo_prestamo)}
              </td>
              <td className="px-4 py-2 border border-gray-200">
                {formatDate(loan.fecha_inicio)}
              </td>
              <td className="px-4 py-2 border border-gray-200">
                {loan.estado_prestamo}
              </td>

              <td className="px-4 py-2 border border-gray-200">
                <button
                  title="Ver detalle"
                  className="text-yellow-500 hover:underline mr-2"
                  onClick={() => onNavigate(loan.id)}
                >
                  <Eye />
                </button>
                <button
                  title="Editar documento"
                  className="text-blue-500 hover:underline mr-2"
                  onClick={() => handleOpenModal(loan)}
                >
                  <FileInput />
                </button>
                <button
                  title="Ver documento"
                  className="text-green-500 hover:underline mr-2"
                  onClick={() => handleOpenModalDetail(loan)}
                >
                  <FileSearch2 />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
        {/* Footer con totales */}
        <tfoot>
          <tr className="bg-gray-200 font-semibold text-gray-800">
            <td className="px-4 py-3 border border-gray-200" colSpan="3">
              <strong>TOTALES:</strong>
            </td>
            <td className="px-4 py-3 border border-gray-200">
              <strong>{totalMonto.toFixed(2)}</strong>
            </td>
            <td className="px-4 py-3 border border-gray-200" colSpan="2"></td>
            <td className="px-4 py-3 border border-gray-200">
              <strong>{totalCuotas.toFixed(2)}</strong>
            </td>
            <td className="px-4 py-3 border border-gray-200" colSpan="4"></td>
          </tr>
        </tfoot>
      </table>
      <div className="flex justify-center mt-4">
        <button
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
        >
          Anterior
        </button>
        <span className="px-4 py-2">{`${page} de ${totalPages || 1}`}</span>
        <button
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>

      <div className="block sm:hidden">
        {loans.map((loan) => (
          <div
            key={loan.id}
            className="border border-gray-200 p-4 mb-4 rounded-lg"
          >
            <div className="flex justify-between">
              <span className="font-bold">Nombre:</span>
              <span>{loan.nombre}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-bold">CI:</span>
              <span>{loan.ci}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-bold">Telefono:</span>
              <span>{loan.telefono}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-bold">Direccion:</span>
              <span>{loan.direccion}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-bold">Monto:</span>
              <span>{loan.monto}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-bold">Estado:</span>
              <span>{loan.estado_prestamo}</span>
            </div>
            <div className="flex justify-between mt-2">
              <button
                className="text-yellow-500 hover:underline mr-2"
                onClick={() => onNavigate(loan.id)}
              >
                <Eye />
              </button>
              <button
                title="Editar documento"
                className="text-blue-500 hover:underline mr-2"
                onClick={() => handleOpenModal(loan)}
              >
                <FileInput />
              </button>
              <button
                className="text-green-500 hover:underline mr-2"
                onClick={() => handleOpenModalDetail(loan)}
              >
                <FileSearch2 />
              </button>
            </div>
          </div>
        ))}

        {/* Totales para vista móvil */}
        <div className="border border-gray-200 p-4 mb-4 rounded-lg bg-gray-200">
          <div className="text-center font-bold text-lg mb-2">TOTALES</div>
          <div className="flex justify-between">
            <span className="font-bold">Total Monto:</span>
            <span className="font-bold">{totalMonto.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-bold">Total Cuotas:</span>
            <span className="font-bold">{totalCuotas.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
