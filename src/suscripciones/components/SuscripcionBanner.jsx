import { useEffect, useState } from "react";
import { useSuscripcion } from "../hooks/useSuscripcion";

/**
 * Banner de aviso de vencimiento de suscripción. Solo se muestra cuando el plan
 * está por vencer o vencido; en estado vigente no renderiza nada.
 */
export const SuscripcionBanner = () => {
  const { getMiSuscripcion } = useSuscripcion();
  const [sus, setSus] = useState(null);

  useEffect(() => {
    getMiSuscripcion().then(setSus).catch(() => {});
  }, []);

  if (!sus || sus.estado === "vigente" || sus.estado === "sin_plan") return null;

  const vencido = sus.estado === "vencido";
  return (
    <div className={`mb-4 rounded-lg px-4 py-3 text-sm font-medium ${vencido ? "bg-red-100 text-red-800 border border-red-300" : "bg-amber-100 text-amber-800 border border-amber-300"}`}>
      {vencido
        ? `⚠️ Tu suscripción (${sus.plan_nombre}) está vencida. Contacta al administrador para renovarla.`
        : `⏳ Tu suscripción (${sus.plan_nombre}) vence en ${sus.dias_restantes} día(s). Renuévala a tiempo para no perder acceso.`}
    </div>
  );
};
