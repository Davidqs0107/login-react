import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useLoan } from "../hooks/useLoan";
import { LabeledSelect } from "../../components/FormField";

/**
 * Cancelación anticipada de un préstamo de interés fijo: muestra el desglose
 * (capital pendiente + interés a cobrar de las próximas N cuotas, resto
 * condonado) y confirma el cobro. Las cuotas restantes quedan condonadas y
 * el préstamo pasa a 'completado'.
 */
export const CancelarAnticipadoModal = ({ prestamo, closeModal, onSuccess }) => {
  const { getFiniquito, cancelarLoan, loading } = useLoan();
  const [finiquito, setFiniquito] = useState(null);
  const [tipoPago, setTipoPago] = useState("efectivo");
  const [loadingPreview, setLoadingPreview] = useState(true);

  useEffect(() => {
    (async () => {
      const res = await getFiniquito(prestamo.id);
      if (res?.ok) setFiniquito(res);
      setLoadingPreview(false);
    })();
  }, [prestamo.id]);

  const confirmar = async () => {
    const res = await cancelarLoan(prestamo.id, { tipo_pago: tipoPago });
    if (res?.ok) {
      closeModal(false);
      await Swal.fire({
        title: "Préstamo cancelado",
        html: `Total cobrado: <b>${res.total_finiquito}</b><br>Interés condonado: <b>${res.interes_condonado}</b>`,
        icon: "success",
      });
      onSuccess?.();
    } else {
      Swal.fire({ title: "No se pudo cancelar el préstamo", icon: "error" });
    }
  };

  if (loadingPreview) {
    return <p className="text-sm text-gray-500">Calculando finiquito...</p>;
  }

  if (!finiquito) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-red-600">No se pudo calcular el finiquito de este préstamo.</p>
        <button type="button" onClick={() => closeModal(false)}
          className="px-5 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">
          Cerrar
        </button>
      </div>
    );
  }

  const total = (finiquito.capital_pendiente || 0) + (finiquito.interes_a_cobrar || 0);

  return (
    <div className="space-y-4">
      <div className="space-y-1 text-sm">
        <p>Capital pendiente: <b>{finiquito.capital_pendiente}</b></p>
        <p>Interés a cobrar ({finiquito.cuotas_interes_a_cobrar} cuota{finiquito.cuotas_interes_a_cobrar === 1 ? "" : "s"}): <b>{finiquito.interes_a_cobrar}</b></p>
        <p className="text-green-600">Interés condonado: <b>{finiquito.interes_condonado}</b></p>
      </div>

      <div className="bg-gray-50 rounded-md p-4 text-center">
        <p className="text-xs text-gray-500 uppercase">Total a cobrar</p>
        <p className="text-3xl font-bold text-gray-800">{total.toFixed(2)}</p>
      </div>

      <LabeledSelect label="Tipo de pago" value={tipoPago} onChange={(e) => setTipoPago(e.target.value)}>
        <option value="efectivo">Efectivo</option>
        <option value="qr">QR</option>
      </LabeledSelect>

      <p className="text-xs text-gray-500">
        Las cuotas restantes quedarán condonadas y el préstamo se marcará como completado.
      </p>

      <div className="flex gap-2 pt-2">
        <button type="button" onClick={confirmar} disabled={loading || total <= 0}
          className="px-5 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:bg-gray-400">
          {loading ? "Procesando..." : "Confirmar"}
        </button>
        <button type="button" onClick={() => closeModal(false)}
          className="px-5 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">
          Cancelar
        </button>
      </div>
    </div>
  );
};
