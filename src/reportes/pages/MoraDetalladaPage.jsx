import { useEffect, useMemo, useState } from "react";
import { useReportes } from "../hooks/useReportes";
import { MoraDetalladaTable } from "../components/MoraDetalladaTable";
import { LoaderLocal } from "../../components/LoaderLocal";
import { exportToPDF, exportToExcel } from "../../common/exportUtils";
import { formatMoney } from "../../helpers/format";
import { useConfig } from "../../context/ConfigContext";

export const MoraDetalladaPage = () => {
  const [data, setData] = useState([]);
  const [meta, setMeta] = useState(null);
  const [filters, setFilters] = useState({
    page: 1,
    pageSize: 50,
    dias_mora_min: "",
    cobrador_id: "",
  });
  const { getMoraDetallada, loading } = useReportes();
  const { simboloMoneda } = useConfig();

  const MORA_COLUMNS = useMemo(() => [
    { key: 'cliente', label: 'Cliente' },
    { key: 'ci', label: 'CI' },
    { key: 'telefono', label: 'Teléfono', format: (v, row) => `${row.codigo_pais || ''} ${v || ''}`.trim() },
    { key: 'numero_cuota', label: 'Cuota #' },
    { key: 'monto_cuota', label: 'Monto', format: (v) => formatMoney(v, simboloMoneda) },
    { key: 'fecha_vencimiento', label: 'Fecha Vencimiento' },
    { key: 'dias_mora', label: 'Días Mora' }
  ], [simboloMoneda]);

  const loadData = async () => {
    const params = { ...filters };
    if (!params.dias_mora_min) delete params.dias_mora_min;
    if (!params.cobrador_id) delete params.cobrador_id;

    const result = await getMoraDetallada(params);
    if (result) {
      setData(result.data || []);
      setMeta(result.meta || null);
    }
  };

  useEffect(() => {
    loadData();
  }, [filters]);

  const handlePageChange = (newPage) => {
    setFilters({ ...filters, page: newPage });
  };

  const handleFilterChange = (field, value) => {
    setFilters({ ...filters, [field]: value, page: 1 });
  };

  const handleExportPDF = () => {
    exportToPDF(data, MORA_COLUMNS, 'Reporte Mora Detallada');
  };

  const handleExportExcel = () => {
    exportToExcel(data, MORA_COLUMNS, 'reporte_mora');
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Mora Detallada</h1>
          <p className="text-gray-600 mt-2">
            Listado de cuotas vencidas con días de mora
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExportPDF}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
          >
            Exportar PDF
          </button>
          <button
            onClick={handleExportExcel}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
          >
            Exportar Excel
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Días de mora mínimo
            </label>
            <input
              type="number"
              value={filters.dias_mora_min}
              onChange={(e) =>
                handleFilterChange("dias_mora_min", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ej: 30"
            />
          </div>
          {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ID Cobrador
            </label>
            <input
              type="number"
              value={filters.cobrador_id}
              onChange={(e) =>
                handleFilterChange("cobrador_id", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Filtrar por cobrador"
            />
          </div> */}
          <div className="flex items-end">
            <button
              onClick={() =>
                setFilters({
                  page: 1,
                  pageSize: 50,
                  dias_mora_min: "",
                  cobrador_id: "",
                })
              }
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
            >
              Limpiar Filtros
            </button>
          </div>
        </div>
      </div>

      {/* Tabla */}
      {loading ? (
        <LoaderLocal />
      ) : (
        <>
          <MoraDetalladaTable data={data} />
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
