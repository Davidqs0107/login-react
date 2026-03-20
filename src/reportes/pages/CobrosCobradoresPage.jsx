import { useEffect, useState } from "react";
import { useReportes } from "../hooks/useReportes";
import { CobrosCobradoresTable } from "../components/CobrosCobradoresTable";
import { LoaderLocal } from "../../components/LoaderLocal";

export const CobrosCobradoresPage = () => {
  const [data, setData] = useState([]);
  const [dateRange, setDateRange] = useState({
    fecha_inicio: "",
    fecha_fin: "",
  });
  const { getCobrosPorCobrador, loading } = useReportes();

  const loadData = async () => {
    const params = {};
    if (dateRange.fecha_inicio) params.fecha_inicio = dateRange.fecha_inicio;
    if (dateRange.fecha_fin) params.fecha_fin = dateRange.fecha_fin;

    const result = await getCobrosPorCobrador(params);
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

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Cobros por Cobrador
        </h1>
        <p className="text-gray-600 mt-2">
          Total recaudado por cada cobrador en el período seleccionado
        </p>
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

      {loading ? <LoaderLocal /> : <CobrosCobradoresTable data={data} />}
    </div>
  );
};
