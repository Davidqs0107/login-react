import { useEffect, useState } from "react";
import { useAuditoria } from "../hooks/useAuditoria";
import { LoaderLocal } from "../../components/LoaderLocal";

const ACCION_LABEL = {
  eliminar_pago: "Eliminó un pago",
  actualizar_configuracion: "Cambió la configuración",
  refinanciar_prestamo: "Refinanció un préstamo",
  arqueo_aprobado: "Aprobó un arqueo",
  arqueo_rechazado: "Rechazó un arqueo",
  comprobante_aprobado: "Aprobó un comprobante",
  comprobante_rechazado: "Rechazó un comprobante",
};

const badgeColor = (accion) =>
  accion.includes("eliminar") || accion.includes("rechazado")
    ? "bg-red-100 text-red-700"
    : accion.includes("aprobado")
    ? "bg-green-100 text-green-700"
    : "bg-blue-100 text-blue-700";

export const AuditoriaPage = () => {
  const { getAuditoria, loading } = useAuditoria();
  const [rows, setRows] = useState([]);
  const [meta, setMeta] = useState(null);
  const [filters, setFilters] = useState({ page: 1, pageSize: 30, entidad: "" });

  const load = async () => {
    const params = { page: filters.page, pageSize: filters.pageSize };
    if (filters.entidad) params.entidad = filters.entidad;
    const res = await getAuditoria(params);
    if (res) {
      setRows(res.auditoria || []);
      setMeta(res.meta || null);
    }
  };

  useEffect(() => { load(); }, [filters]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800">Bitácora de auditoría</h1>
      <p className="text-gray-600 mt-2 mb-6">Registro de acciones sensibles realizadas en el sistema.</p>

      <div className="bg-white rounded-lg shadow p-4 mb-6 flex gap-4 items-end">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Entidad</label>
          <select
            value={filters.entidad}
            onChange={(e) => setFilters({ ...filters, entidad: e.target.value, page: 1 })}
            className="border border-gray-300 rounded-md p-2"
          >
            <option value="">Todas</option>
            <option value="pago">Pagos</option>
            <option value="prestamo">Préstamos</option>
            <option value="configuracion_empresa">Configuración</option>
            <option value="arqueo">Arqueos</option>
            <option value="comprobante_pago">Comprobantes</option>
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
                <th className="p-3">Fecha</th>
                <th className="p-3">Acción</th>
                <th className="p-3">Entidad</th>
                <th className="p-3">ID</th>
                <th className="p-3">Usuario</th>
                <th className="p-3">IP</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr><td colSpan={6} className="p-6 text-center text-gray-500">Sin registros</td></tr>
              )}
              {rows.map((r) => (
                <tr key={r.id} className="border-t">
                  <td className="p-3 whitespace-nowrap">{new Date(r.created_at).toLocaleString("es-ES")}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${badgeColor(r.accion)}`}>
                      {ACCION_LABEL[r.accion] || r.accion}
                    </span>
                  </td>
                  <td className="p-3">{r.entidad}</td>
                  <td className="p-3">{r.entidad_id}</td>
                  <td className="p-3">{r.usuario_id ?? "-"}</td>
                  <td className="p-3">{r.ip ?? "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {meta && (
        <div className="mt-4 flex justify-between items-center">
          <p className="text-sm text-gray-600">Página {meta.page} de {meta.totalPages} — {meta.totalItems} registros</p>
          <div className="flex gap-2">
            <button onClick={() => setFilters({ ...filters, page: filters.page - 1 })} disabled={meta.page <= 1}
              className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-300">Anterior</button>
            <button onClick={() => setFilters({ ...filters, page: filters.page + 1 })} disabled={meta.page >= meta.totalPages}
              className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-300">Siguiente</button>
          </div>
        </div>
      )}
    </div>
  );
};
