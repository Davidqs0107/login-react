import { useEffect, useState } from "react";
import { useParams } from "react-router";
import Swal from "sweetalert2";
import { usePortal } from "../hooks/usePortal";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ACCEPTED_TYPES = ["application/pdf", "image/jpeg", "image/png"];

const generarRequestId = () =>
  (typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}_${Math.random().toString(36).slice(2)}`);

export const PortalPage = () => {
  const { token } = useParams();
  const { getResumen, subirComprobante, loading } = usePortal();
  const [data, setData] = useState(null);
  const [err, setErr] = useState(null);
  const [form, setForm] = useState({ cuota_id: "", monto: "", referencia: "" });
  const [archivo, setArchivo] = useState(null);
  const [archivoPreview, setArchivoPreview] = useState(null);
  // requestId se genera una sola vez por montaje; un reintento conserva el mismo
  // id para que el backend dedupe y devuelva el comprobante existente.
  const [requestId] = useState(generarRequestId);

  const load = async () => {
    const res = await getResumen(token);
    if (res) setData(res); else setErr("El enlace no es válido o expiró.");
  };

  useEffect(() => { load(); }, [token]);

  // Liberar Object URL cuando cambia o se desmonta
  useEffect(() => {
    return () => {
      if (archivoPreview) URL.revokeObjectURL(archivoPreview);
    };
  }, [archivoPreview]);

  const handleArchivoChange = (e) => {
    const file = e.target.files?.[0] ?? null;
    if (archivoPreview) URL.revokeObjectURL(archivoPreview);
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        Swal.fire({ title: "Archivo demasiado grande", text: "Máximo 5 MB.", icon: "warning" });
        e.target.value = "";
        setArchivo(null);
        setArchivoPreview(null);
        return;
      }
      if (!ACCEPTED_TYPES.includes(file.type)) {
        Swal.fire({ title: "Tipo no permitido", text: "Solo PDF, JPG o PNG.", icon: "warning" });
        e.target.value = "";
        setArchivo(null);
        setArchivoPreview(null);
        return;
      }
      setArchivo(file);
      setArchivoPreview(URL.createObjectURL(file));
    } else {
      setArchivo(null);
      setArchivoPreview(null);
    }
  };

  const quitarArchivo = () => {
    if (archivoPreview) URL.revokeObjectURL(archivoPreview);
    setArchivo(null);
    setArchivoPreview(null);
  };

  const cuotasPendientes = data
    ? data.prestamos.flatMap((p) => p.cuotas.filter((c) => c.estado !== "pagada").map((c) => ({ ...c, prestamo_id: p.id })))
    : [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.cuota_id || !form.monto) {
      Swal.fire({ title: "Completa la cuota y el monto", icon: "warning" });
      return;
    }
    let payload;
    if (archivo) {
      const fd = new FormData();
      fd.append("cuota_id", form.cuota_id);
      fd.append("monto", form.monto);
      fd.append("referencia", form.referencia);
      fd.append("request_id", requestId);
      fd.append("comprobante", archivo);
      payload = fd;
    } else {
      payload = {
        cuota_id: Number(form.cuota_id),
        monto: Number(form.monto),
        referencia: form.referencia,
        request_id: requestId,
      };
    }
    const res = await subirComprobante(token, payload);
    if (res?.ok) {
      Swal.fire({ title: "Comprobante enviado", text: res.msg, icon: "success" });
      setForm({ cuota_id: "", monto: "", referencia: "" });
      quitarArchivo();
      load();
    } else {
      Swal.fire({ title: "Error", text: res?.msg || "", icon: "error" });
    }
  };

  if (err) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
        <div className="bg-white rounded-lg shadow p-8 text-center max-w-md">
          <h1 className="text-xl font-bold text-gray-800">Acceso no disponible</h1>
          <p className="text-gray-600 mt-2">{err}</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-100">Cargando...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Cabecera */}
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-500">{data.empresa?.nombre}</p>
          <h1 className="text-2xl font-bold text-gray-800">
            Hola, {data.cliente.nombre} {data.cliente.apellido}
          </h1>
          <div className="flex gap-6 mt-4">
            <div>
              <p className="text-xs text-gray-500 uppercase">Saldo total</p>
              <p className="text-2xl font-bold text-gray-800">{data.moneda} {data.total_saldo}</p>
            </div>
            {data.total_mora > 0 && (
              <div>
                <p className="text-xs text-gray-500 uppercase">Mora</p>
                <p className="text-2xl font-bold text-red-600">{data.moneda} {data.total_mora}</p>
              </div>
            )}
          </div>
        </div>

        {/* Préstamos y cuotas */}
        {data.prestamos.map((p) => (
          <div key={p.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-semibold text-gray-800">Préstamo #{p.id}</h2>
              <span className="text-sm text-gray-500">Saldo: {data.moneda} {p.saldo}</span>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="text-gray-500 text-left">
                  <tr>
                    <th className="py-1">Cuota</th>
                    <th className="py-1">Vence</th>
                    <th className="py-1">Monto</th>
                    <th className="py-1">Saldo</th>
                    <th className="py-1">Mora</th>
                    <th className="py-1">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {p.cuotas.map((c) => (
                    <tr key={c.id} className="border-t">
                      <td className="py-1">#{c.numero_cuota}</td>
                      <td className="py-1 whitespace-nowrap">{c.fecha_pago?.slice(0, 10)}</td>
                      <td className="py-1">{c.monto}</td>
                      <td className="py-1">{c.saldo}</td>
                      <td className={`py-1 ${c.mora > 0 ? "text-red-600 font-medium" : ""}`}>{c.mora || 0}</td>
                      <td className="py-1">
                        <span className={`px-2 py-0.5 rounded text-xs ${c.estado === "pagada" ? "bg-green-100 text-green-700" : c.estado === "parcial" ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-600"}`}>
                          {c.estado}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}

        {/* Reportar pago */}
        {cuotasPendientes.length > 0 && (
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
            <h2 className="font-semibold text-gray-800 mb-4">Reportar un pago</h2>
            <p className="text-sm text-gray-500 mb-4">
              Sube tu comprobante de transferencia/QR. La empresa lo validará.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <select
                value={form.cuota_id}
                onChange={(e) => setForm({ ...form, cuota_id: e.target.value })}
                className="border border-gray-300 rounded-md p-2"
              >
                <option value="">Selecciona cuota</option>
                {cuotasPendientes.map((c) => (
                  <option key={c.id} value={c.id}>
                    Préstamo #{c.prestamo_id} · Cuota #{c.numero_cuota} (saldo {c.saldo})
                  </option>
                ))}
              </select>
              <input type="number" step="0.01" min="0" placeholder="Monto"
                value={form.monto} onChange={(e) => setForm({ ...form, monto: e.target.value })}
                className="border border-gray-300 rounded-md p-2" />
              <input type="text" placeholder="N° de transacción"
                value={form.referencia} onChange={(e) => setForm({ ...form, referencia: e.target.value })}
                className="border border-gray-300 rounded-md p-2" />
            </div>
            <div className="mt-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Comprobante (opcional)
              </label>
              <input
                type="file"
                accept="application/pdf,image/jpeg,image/png"
                onChange={handleArchivoChange}
                className="block w-full text-sm text-gray-700 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {archivo && (
                <div className="flex items-center gap-3 mt-2">
                  {archivo.type.startsWith("image/") && archivoPreview ? (
                    <img src={archivoPreview} alt="preview" className="h-16 rounded border" />
                  ) : (
                    <span className="text-sm text-gray-600">📄 {archivo.name}</span>
                  )}
                  <button
                    type="button"
                    onClick={quitarArchivo}
                    className="text-xs text-red-600 hover:underline"
                  >
                    Quitar
                  </button>
                </div>
              )}
            </div>
            <button type="submit" disabled={loading}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400">
              {loading ? "Enviando..." : "Enviar comprobante"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
