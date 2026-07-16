import { useEffect, useMemo, useState } from "react";
import { useReportes } from "../hooks/useReportes";
import { RecaudacionMensualChart } from "../components/RecaudacionMensualChart";
import { LoaderLocal } from "../../components/LoaderLocal";
import { exportToPDF, exportToExcel } from "../../common/exportUtils";
import { formatMoney } from "../../helpers/format";
import { useConfig } from "../../context/ConfigContext";

export const RecaudacionMensualPage = () => {
  const [data, setData] = useState([]);
  const [dateRange, setDateRange] = useState({
    fecha_inicio: "",
    fecha_fin: "",
  });
  const { getRecaudacionMensual, loading } = useReportes();
  const { simboloMoneda } = useConfig();

  const RECAUDACION_COLUMNS = useMemo(() => [
    { key: 'mes', label: 'Mes' },
    { key: 'total_cobrado', label: 'Total', format: (v) => formatMoney(v, simboloMoneda) },
    { key: 'total_efectivo', label: 'Efectivo', format: (v) => formatMoney(v, simboloMoneda) },
    { key: 'total_qr', label: 'QR', format: (v) => formatMoney(v, simboloMoneda) },
    { key: 'num_pagos', label: 'Nro. Pagos' }
  ], [simboloMoneda]);

  const loadData = async () => {
    const params = {};
    if (dateRange.fecha_inicio) params.fecha_inicio = dateRange.fecha_inicio;
    if (dateRange.fecha_fin) params.fecha_fin = dateRange.fecha_fin;

    const result = await getRecaudacionMensual(params);
    if (result) {
      setData(result.data || []);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleFilter = () => {
    loadData();
  };

  const handleClearFilters = () => {
    setDateRange({ fecha_inicio: "", fecha_fin: "" });
    setTimeout(() => loadData(), 100);
  };

  const handleExportPDF = () => {
    exportToPDF(data, RECAUDACION_COLUMNS, 'Recaudación Mensual');
  };

  const handleExportExcel = () => {
    exportToExcel(data, RECAUDACION_COLUMNS, 'recaudacion_mensual');
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Recaudación Mensual
          </h1>
          <p className="text-gray-600 mt-2">Totales cobrados agrupados por mes</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleExportPDF} className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">Exportar PDF</button>
          <button onClick={handleExportExcel} className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">Exportar Excel</button>
        </div>
      </div>

      {/* Filtros de fecha */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha Inicio
            </label>
            <input
              type="date"
              value={dateRange.fecha_inicio}
              onChange={(e) =>
                setDateRange({ ...dateRange, fecha_inicio: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha Fin
            </label>
            <input
              type="date"
              value={dateRange.fecha_fin}
              onChange={(e) =>
                setDateRange({ ...dateRange, fecha_fin: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-end gap-2">
            <button
              onClick={handleFilter}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
            >
              Filtrar
            </button>
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
            >
              Limpiar
            </button>
          </div>
        </div>
      </div>

      {loading ? <LoaderLocal /> : <RecaudacionMensualChart data={data} />}
    </div>
  );
};
