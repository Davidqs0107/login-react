import { useEffect, useState } from "react";
import { useReportes } from "../hooks/useReportes";
import { PrestamosPorClienteTable } from "../components/PrestamosPorClienteTable";
import { LoaderLocal } from "../../components/LoaderLocal";

const ESTADOS = [
  { value: "", label: "Todos los estados" },
  { value: "pendiente", label: "Pendiente" },
  { value: "activo", label: "Activo" },
  { value: "completado", label: "Completado" },
  { value: "incumplido", label: "Incumplido" },
];

export const PrestamosPorClientePage = () => {
  const [data, setData] = useState([]);
  const [meta, setMeta] = useState(null);
  const [filters, setFilters] = useState({
    searchTerm: "",
    estado_prestamo: "",
    fecha_inicio: "",
    fecha_fin: "",
    page: 1,
    pageSize: 20,
  });
  const [inputSearch, setInputSearch] = useState("");
  const { getPrestamosPorCliente, loading } = useReportes();

  const loadData = async (params) => {
    const cleanParams = { ...params };
    if (!cleanParams.searchTerm) delete cleanParams.searchTerm;
    if (!cleanParams.estado_prestamo) delete cleanParams.estado_prestamo;
    if (!cleanParams.fecha_inicio) delete cleanParams.fecha_inicio;
    if (!cleanParams.fecha_fin) delete cleanParams.fecha_fin;

    const result = await getPrestamosPorCliente(cleanParams);
    if (result) {
      setData(result.data || []);
      setMeta(result.meta || null);
    }
  };

  useEffect(() => {
    loadData(filters);
  }, [filters]);

  const handleSearch = (e) => {
    e.preventDefault();
    setFilters((prev) => ({ ...prev, searchTerm: inputSearch, page: 1 }));
  };

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value, page: 1 }));
  };

  const handleClearFilters = () => {
    setInputSearch("");
    setFilters({
      searchTerm: "",
      estado_prestamo: "",
      fecha_inicio: "",
      fecha_fin: "",
      page: 1,
      pageSize: 20,
    });
  };

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Préstamos por Cliente
        </h1>
        <p className="text-gray-600 mt-2">
          Historial de préstamos con búsqueda por cliente, estado y fechas
        </p>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <form onSubmit={handleSearch}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Búsqueda */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Buscar cliente
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputSearch}
                  onChange={(e) => setInputSearch(e.target.value)}
                  placeholder="Nombre, CI o teléfono..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition text-sm font-medium"
                >
                  Buscar
                </button>
              </div>
            </div>

            {/* Estado */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              <select
                value={filters.estado_prestamo}
                onChange={(e) =>
                  handleFilterChange("estado_prestamo", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                {ESTADOS.map((e) => (
                  <option key={e.value} value={e.value}>
                    {e.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Limpiar */}
            <div className="flex items-end">
              <button
                type="button"
                onClick={handleClearFilters}
                className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition text-sm"
              >
                Limpiar filtros
              </button>
            </div>

            {/* Fecha inicio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha inicio
              </label>
              <input
                type="date"
                value={filters.fecha_inicio}
                onChange={(e) =>
                  handleFilterChange("fecha_inicio", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            {/* Fecha fin */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha fin
              </label>
              <input
                type="date"
                value={filters.fecha_fin}
                onChange={(e) =>
                  handleFilterChange("fecha_fin", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
          </div>
        </form>
      </div>

      {/* Resultado */}
      {loading ? (
        <LoaderLocal />
      ) : (
        <>
          {meta && (
            <p className="text-sm text-gray-500 mb-3">
              {meta.totalItems} préstamo{meta.totalItems !== 1 ? "s" : ""}{" "}
              encontrado{meta.totalItems !== 1 ? "s" : ""}
            </p>
          )}

          <PrestamosPorClienteTable data={data} />

          {/* Paginación */}
          {meta && meta.totalPages > 1 && (
            <div className="mt-4 flex justify-between items-center">
              <p className="text-sm text-gray-600">
                Página {meta.page} de {meta.totalPages}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => handlePageChange(meta.page - 1)}
                  disabled={meta.page === 1}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition text-sm"
                >
                  Anterior
                </button>
                <button
                  onClick={() => handlePageChange(meta.page + 1)}
                  disabled={meta.page === meta.totalPages}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition text-sm"
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
