import { useEffect, useState } from "react";
import { useSuscripcion } from "../hooks/useSuscripcion";
import { LoaderLocal } from "../../components/LoaderLocal";

const estadoBadge = (estado) => ({
  vigente: "bg-green-100 text-green-700",
  por_vencer: "bg-amber-100 text-amber-700",
  vencido: "bg-red-100 text-red-700",
  sin_plan: "bg-gray-100 text-gray-600",
}[estado] || "bg-gray-100 text-gray-600");

export const SuscripcionesAdminPage = () => {
  const { getSuscripciones, loading } = useSuscripcion();
  const [rows, setRows] = useState([]);
  const [meta, setMeta] = useState(null);
  const [filtro, setFiltro] = useState("");
  const [page, setPage] = useState(1);

  const load = async () => {
    const params = { page, pageSize: 30 };
    if (filtro) params.estado = filtro;
    const res = await getSuscripciones(params);
    if (res) {
      setRows(res.suscripciones || []);
      setMeta(res.meta || null);
    }
  };

  useEffect(() => { load(); }, [filtro, page]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800">Suscripciones</h1>
      <p className="text-gray-600 mt-2 mb-6">Estado de los planes de todas las empresas.</p>

      <div className="bg-white rounded-lg shadow p-4 mb-6 flex gap-3 items-end">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Filtrar por estado</label>
          <select value={filtro} onChange={(e) => { setFiltro(e.target.value); setPage(1); }}
            className="border border-gray-300 rounded-md p-2">
            <option value="">Todas</option>
            <option value="vigente">Vigentes</option>
            <option value="por_vencer">Por vencer</option>
            <option value="vencido">Vencidas</option>
          </select>
        </div>
      </div>

      {loading ? (
        <LoaderLocal />
      ) : (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 text-left">
              <tr>
                <th className="p-3">Empresa</th>
                <th className="p-3">Plan</th>
                <th className="p-3">Vence</th>
                <th className="p-3">Días restantes</th>
                <th className="p-3">Estado</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr><td colSpan={5} className="p-6 text-center text-gray-500">Sin empresas</td></tr>
              )}
              {rows.map((s) => (
                <tr key={s.empresa_id} className="border-t">
                  <td className="p-3 font-medium">{s.empresa_nombre}</td>
                  <td className="p-3">{s.plan_nombre}</td>
                  <td className="p-3 whitespace-nowrap">{s.fecha_fin?.slice(0, 10)}</td>
                  <td className="p-3">{s.dias_restantes}</td>
                  <td className="p-3"><span className={`px-2 py-1 rounded text-xs font-medium ${estadoBadge(s.estado)}`}>{s.estado}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {meta && (
        <div className="mt-4 flex justify-between items-center">
          <p className="text-sm text-gray-600">Página {meta.page} de {meta.totalPages} — {meta.totalItems} empresas</p>
          <div className="flex gap-2">
            <button onClick={() => setPage(page - 1)} disabled={meta.page <= 1}
              className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-300">Anterior</button>
            <button onClick={() => setPage(page + 1)} disabled={meta.page >= meta.totalPages}
              className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-300">Siguiente</button>
          </div>
        </div>
      )}
    </div>
  );
};
