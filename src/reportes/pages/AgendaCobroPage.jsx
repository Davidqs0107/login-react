import { useEffect, useState } from "react";
import { useReportes } from "../hooks/useReportes";
import { AgendaCobroTable } from "../components/AgendaCobroTable";
import { LoaderLocal } from "../../components/LoaderLocal";

export const AgendaCobroPage = () => {
  const [data, setData] = useState([]);
  const [meta, setMeta] = useState(null);
  const [filters, setFilters] = useState({
    dias: 7,
    cobrador_id: "",
    page: 1,
    pageSize: 50,
  });
  const { getAgendaCobro, loading } = useReportes();

  const loadData = async () => {
    const params = { ...filters };
    if (!params.cobrador_id) delete params.cobrador_id;

    const result = await getAgendaCobro(params);
    if (result) {
      setData(result.data || []);
      setMeta(result.meta || null);
    }
  };

  useEffect(() => {
    loadData();
  }, [filters]);

  const handleDiasChange = (dias) => {
    setFilters({ ...filters, dias, page: 1 });
  };

  const handlePageChange = (newPage) => {
    setFilters({ ...filters, page: newPage });
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Agenda de Cobro</h1>
        <p className="text-gray-600 mt-2">
          Cuotas pendientes que vencen próximamente
        </p>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Período
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => handleDiasChange(1)}
                className={`px-4 py-2 rounded-md transition ${
                  filters.dias === 1
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Hoy
              </button>
              <button
                onClick={() => handleDiasChange(3)}
                className={`px-4 py-2 rounded-md transition ${
                  filters.dias === 3
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                3 días
              </button>
              <button
                onClick={() => handleDiasChange(7)}
                className={`px-4 py-2 rounded-md transition ${
                  filters.dias === 7
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                7 días
              </button>
              <button
                onClick={() => handleDiasChange(15)}
                className={`px-4 py-2 rounded-md transition ${
                  filters.dias === 15
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                15 días
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ID Cobrador (opcional)
            </label>
            <input
              type="number"
              value={filters.cobrador_id}
              onChange={(e) =>
                setFilters({ ...filters, cobrador_id: e.target.value, page: 1 })
              }
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Filtrar por cobrador"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <LoaderLocal />
      ) : (
        <>
          <AgendaCobroTable data={data} />
          {meta && (
            <div className="mt-4 flex justify-between items-center">
              <p className="text-sm text-gray-600">
                Página {meta.page} de {meta.totalPages} - Total:{" "}
                {meta.totalItems} registros
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => handlePageChange(meta.page - 1)}
                  disabled={meta.page === 1}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
                >
                  Anterior
                </button>
                <button
                  onClick={() => handlePageChange(meta.page + 1)}
                  disabled={meta.page === meta.totalPages}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
