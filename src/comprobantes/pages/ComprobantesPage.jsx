import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useComprobantes } from "../hooks/useComprobantes";
import { LoaderLocal } from "../../components/LoaderLocal";
import { getEnvVariables } from "../../helpers/getEnvVariables";

const { VITE_API_URL } = getEnvVariables();

const estadoBadge = (estado) => ({
  pendiente: "bg-yellow-100 text-yellow-700",
  aprobado: "bg-green-100 text-green-700",
  rechazado: "bg-red-100 text-red-700",
}[estado] || "bg-gray-100 text-gray-700");

export const ComprobantesPage = () => {
  const { getComprobantes, validarComprobante, loading } = useComprobantes();
  const [rows, setRows] = useState([]);
  const [meta, setMeta] = useState(null);
  const [estado, setEstado] = useState("pendiente");
  const [page, setPage] = useState(1);

  const load = async () => {
    const params = { page, pageSize: 30 };
    if (estado) params.estado = estado;
    const res = await getComprobantes(params);
    if (res) { setRows(res.comprobantes || []); setMeta(res.meta || null); }
  };

  useEffect(() => { load(); }, [estado, page]);

  const handleValidar = async (id, nuevoEstado) => {
    const confirm = await Swal.fire({
      title: nuevoEstado === "aprobado" ? "¿Aprobar comprobante?" : "¿Rechazar comprobante?",
      text: nuevoEstado === "aprobado" ? "Se registrará el pago correspondiente." : "",
      icon: "question", showCancelButton: true,
      confirmButtonText: "Sí", cancelButtonText: "Cancelar",
    });
    if (!confirm.isConfirmed) return;
    const res = await validarComprobante(id, nuevoEstado);
    if (res?.ok) {
      Swal.fire({ title: "Listo", icon: "success", timer: 1500, showConfirmButton: false });
      load();
    } else {
      Swal.fire({ title: "Error", text: res?.msg || "", icon: "error" });
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800">Comprobantes del portal</h1>
      <p className="text-gray-600 mt-2 mb-6">Pagos reportados por los clientes desde el portal, pendientes de validación.</p>

      <div className="bg-white rounded-lg shadow p-4 mb-6 flex gap-3 items-end">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
          <select value={estado} onChange={(e) => { setEstado(e.target.value); setPage(1); }}
            className="border border-gray-300 rounded-md p-2">
            <option value="pendiente">Pendientes</option>
            <option value="aprobado">Aprobados</option>
            <option value="rechazado">Rechazados</option>
            <option value="">Todos</option>
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
                <th className="p-3">Cliente</th>
                <th className="p-3">Monto</th>
                <th className="p-3">Referencia</th>
                <th className="p-3">Comprobante</th>
                <th className="p-3">Estado</th>
                <th className="p-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr><td colSpan={7} className="p-6 text-center text-gray-500">Sin comprobantes</td></tr>
              )}
              {rows.map((c) => (
                <tr key={c.id} className="border-t">
                  <td className="p-3 whitespace-nowrap">{new Date(c.created_at).toLocaleString("es-ES")}</td>
                  <td className="p-3">{c.cliente}</td>
                  <td className="p-3 font-semibold">{c.monto}</td>
                  <td className="p-3">{c.referencia || "-"}</td>
                  <td className="p-3">
                    {c.archivo
                      ? <a className="text-blue-600 underline" href={`${VITE_API_URL}/${c.archivo}`} target="_blank" rel="noreferrer">Ver</a>
                      : "-"}
                  </td>
                  <td className="p-3"><span className={`px-2 py-1 rounded text-xs font-medium ${estadoBadge(c.estado)}`}>{c.estado}</span></td>
                  <td className="p-3">
                    {c.estado === "pendiente" ? (
                      <div className="flex gap-2">
                        <button onClick={() => handleValidar(c.id, "aprobado")}
                          className="px-3 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600">Aprobar</button>
                        <button onClick={() => handleValidar(c.id, "rechazado")}
                          className="px-3 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600">Rechazar</button>
                      </div>
                    ) : <span className="text-gray-400 text-xs">—</span>}
                  </td>
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
