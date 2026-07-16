import { useEffect, useMemo, useState } from "react";
import { useReportes } from "../hooks/useReportes";
import { CarteraEstadoCards } from "../components/CarteraEstadoCards";
import { LoaderLocal } from "../../components/LoaderLocal";
import { exportToPDF, exportToExcel } from "../../common/exportUtils";
import { formatMoney } from "../../helpers/format";
import { useConfig } from "../../context/ConfigContext";

export const CarteraEstadoPage = () => {
  const [data, setData] = useState([]);
  const { getCarteraPorEstado, loading } = useReportes();
  const { simboloMoneda } = useConfig();

  const CARTERA_COLUMNS = useMemo(() => [
    { key: 'estado_prestamo', label: 'Estado' },
    { key: 'num_prestamos', label: 'Total Préstamos' },
    { key: 'capital_prestado', label: 'Capital Prestado', format: (v) => formatMoney(v, simboloMoneda) },
    { key: 'total_pagado', label: 'Total Pagado', format: (v) => formatMoney(v, simboloMoneda) },
    { key: 'saldo_pendiente', label: 'Saldo Pendiente', format: (v) => formatMoney(v, simboloMoneda) }
  ], [simboloMoneda]);

  const loadData = async () => {
    const result = await getCarteraPorEstado();
    if (result) {
      setData(result.data || []);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleExportPDF = () => {
    exportToPDF(data, CARTERA_COLUMNS, 'Cartera por Estado');
  };

  const handleExportExcel = () => {
    exportToExcel(data, CARTERA_COLUMNS, 'cartera_estado');
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Cartera por Estado</h1>
          <p className="text-gray-600 mt-2">
            Resumen del portafolio de préstamos agrupado por estado
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleExportPDF} className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">Exportar PDF</button>
          <button onClick={handleExportExcel} className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">Exportar Excel</button>
        </div>
      </div>

      {loading ? <LoaderLocal /> : <CarteraEstadoCards data={data} />}
    </div>
  );
};
