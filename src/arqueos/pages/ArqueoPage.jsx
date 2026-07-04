import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useArqueo } from "../hooks/useArqueo";
import { useAuth } from "../../context/AuthContex";
import { roles } from "../../common/constans";
import { LoaderLocal } from "../../components/LoaderLocal";

const hoyISO = () => new Date().toISOString().slice(0, 10);

const estadoBadge = (estado) => ({
  cerrado: "bg-yellow-100 text-yellow-700",
  aprobado: "bg-green-100 text-green-700",
  rechazado: "bg-red-100 text-red-700",
}[estado] || "bg-gray-100 text-gray-700");

export const ArqueoPage = () => {
  const { user } = useAuth();
  const esAdmin = user.rol === roles.Admin || user.rol === roles.SuperAdmin;
  const { getResumenDia, cerrarArqueo, getArqueos, resolverArqueo, loading } = useArqueo();

  const [fecha, setFecha] = useState(hoyISO());
  const [resumen, setResumen] = useState(null);
  const [entregado, setEntregado] = useState("");
  const [nota, setNota] = useState("");
  const [arqueos, setArqueos] = useState([]);
  const [meta, setMeta] = useState(null);
  const [page, setPage] = useState(1);

  const cargarResumen = async () => {
    const r = await getResumenDia(fecha);
    if (r) setResumen(r.resumen);
  };
  const cargarArqueos = async () => {
    const r = await getArqueos({ page, pageSize: 15 });
    if (r) {
      setArqueos(r.arqueos || []);
      setMeta(r.meta || null);
    }
  };

  useEffect(() => { cargarResumen(); }, [fecha]);
  useEffect(() => { cargarArqueos(); }, [page]);

  const handleCerrar = async (e) => {
    e.preventDefault();
    const r = await cerrarArqueo({ fecha, total_entregado: Number(entregado) || 0, nota });
    if (r?.ok) {
      Swal.fire({ title: "Caja cerrada", icon: "success", timer: 1600, showConfirmButton: false });
      setEntregado(""); setNota("");
      cargarArqueos();
    } else {
      Swal.fire({ title: "No se pudo cerrar", text: r?.msg || "", icon: "error" });
    }
  };

  const handleResolver = async (id, estado) => {
    const r = await resolverArqueo(id, estado);
    if (r?.ok) cargarArqueos();
  };

  const diferencia = resumen && entregado !== "" ? (Number(entregado) - resumen.total_cobrado_sistema) : null;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800">Arqueo de caja</h1>
      <p className="text-gray-600 mt-2 mb-6">Cierre diario de lo cobrado vs lo entregado.</p>

      {/* Cierre del día */}
      <form onSubmit={handleCerrar} className="bg-white rounded-lg shadow p-6 mb-8 max-w-3xl">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Cerrar caja</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
            <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cobrado (sistema)</label>
            <div className="w-full border border-gray-200 bg-gray-50 rounded-md p-2 font-semibold">
              {resumen ? resumen.total_cobrado_sistema : "—"}
              {resumen && <span className="text-xs text-gray-500 font-normal"> · {resumen.num_pagos} pagos</span>}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Entregado</label>
            <input type="number" step="0.01" min="0" value={entregado} onChange={(e) => setEntregado(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2" placeholder="0.00" />
          </div>
        </div>
        {diferencia !== null && (
          <p className={`mt-3 text-sm font-medium ${diferencia < 0 ? "text-red-600" : diferencia > 0 ? "text-amber-600" : "text-green-600"}`}>
            Diferencia: {diferencia.toFixed(2)} {diferencia < 0 ? "(faltante)" : diferencia > 0 ? "(sobrante)" : "(cuadra)"}
          </p>
        )}
        <input type="text" value={nota} onChange={(e) => setNota(e.target.value)} placeholder="Nota (opcional)"
          className="w-full border border-gray-300 rounded-md p-2 mt-3" />
        <button type="submit" disabled={loading}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400">
          {loading ? "Guardando..." : "Cerrar caja"}
        </button>
      </form>

      {/* Historial */}
      <h2 className="text-xl font-semibold text-gray-800 mb-3">Historial de arqueos</h2>
      {loading && arqueos.length === 0 ? (
        <LoaderLocal />
      ) : (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 text-left">
              <tr>
                <th className="p-3">Fecha</th>
                {esAdmin && <th className="p-3">Cobrador</th>}
                <th className="p-3">Cobrado</th>
                <th className="p-3">Entregado</th>
                <th className="p-3">Diferencia</th>
                <th className="p-3">Estado</th>
                {esAdmin && <th className="p-3">Acciones</th>}
              </tr>
            </thead>
            <tbody>
              {arqueos.length === 0 && (
                <tr><td colSpan={esAdmin ? 7 : 5} className="p-6 text-center text-gray-500">Sin arqueos</td></tr>
              )}
              {arqueos.map((a) => (
                <tr key={a.id} className="border-t">
                  <td className="p-3 whitespace-nowrap">{a.fecha?.slice(0, 10)}</td>
                  {esAdmin && <td className="p-3">{a.cobrador}</td>}
                  <td className="p-3">{a.total_cobrado_sistema}</td>
                  <td className="p-3">{a.total_entregado}</td>
                  <td className={`p-3 font-medium ${Number(a.diferencia) < 0 ? "text-red-600" : Number(a.diferencia) > 0 ? "text-amber-600" : "text-green-600"}`}>
                    {a.diferencia}
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${estadoBadge(a.estado)}`}>{a.estado}</span>
                  </td>
                  {esAdmin && (
                    <td className="p-3">
                      {a.estado === "cerrado" ? (
                        <div className="flex gap-2">
                          <button onClick={() => handleResolver(a.id, "aprobado")}
                            className="px-3 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600">Aprobar</button>
                          <button onClick={() => handleResolver(a.id, "rechazado")}
                            className="px-3 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600">Rechazar</button>
                        </div>
                      ) : <span className="text-gray-400 text-xs">—</span>}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {meta && meta.totalPages > 1 && (
        <div className="mt-4 flex justify-between items-center">
          <p className="text-sm text-gray-600">Página {meta.page} de {meta.totalPages} — {meta.totalItems} arqueos</p>
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
