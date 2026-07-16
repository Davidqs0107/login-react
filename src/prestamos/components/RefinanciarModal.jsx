import { useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";
import { useLoan } from "../hooks/useLoan";
import { LabeledInput } from "../../components/LabeledInput";

/**
 * Formulario de refinanciación: capitaliza el saldo pendiente (+ monto adicional
 * opcional) en un préstamo nuevo. Hereda tasa/frecuencia/tipo del original.
 */
export const RefinanciarModal = ({ prestamo, closeModal }) => {
  const { refinanciarLoan, loading } = useLoan();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    monto_adicional: 0,
    total_cuotas: prestamo.total_cuotas || "",
    fecha_inicio: new Date().toISOString().slice(0, 10),
  });

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.total_cuotas || !form.fecha_inicio) {
      Swal.fire({ title: "Completa cuotas y fecha", icon: "warning" });
      return;
    }
    const res = await refinanciarLoan(prestamo.id, {
      monto_adicional: Number(form.monto_adicional) || 0,
      total_cuotas: Number(form.total_cuotas),
      fecha_inicio: form.fecha_inicio,
    });
    if (res?.ok) {
      closeModal(false);
      await Swal.fire({
        title: "Préstamo refinanciado",
        html: `Saldo capitalizado: <b>${res.saldo_refinanciado}</b><br>Nuevo capital: <b>${res.nuevo_capital}</b><br>Nuevo préstamo #${res.prestamo[0].id}`,
        icon: "success",
      });
      navigate(`/prestamo/${res.prestamo[0].id}`);
    } else {
      Swal.fire({ title: "No se pudo refinanciar", icon: "error" });
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <p className="text-sm text-gray-600">
        Se saldará el préstamo actual y su saldo pendiente pasará a un préstamo nuevo.
      </p>
      <LabeledInput
        label="Monto adicional (opcional)"
        type="number" step="0.01" min="0" value={form.monto_adicional}
        onChange={(e) => set("monto_adicional", e.target.value)}
        help="Dinero nuevo que se entrega al cliente, sumado al saldo." />
      <LabeledInput
        label="N° de cuotas del nuevo préstamo"
        type="number" min="1" value={form.total_cuotas}
        onChange={(e) => set("total_cuotas", e.target.value)} />
      <LabeledInput
        label="Fecha de inicio"
        type="date" value={form.fecha_inicio}
        onChange={(e) => set("fecha_inicio", e.target.value)} />
      <div className="flex gap-2 pt-2">
        <button type="submit" disabled={loading}
          className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400">
          {loading ? "Procesando..." : "Refinanciar"}
        </button>
        <button type="button" onClick={() => closeModal(false)}
          className="px-5 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">
          Cancelar
        </button>
      </div>
    </form>
  );
};
