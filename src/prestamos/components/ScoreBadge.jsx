import { useEffect, useState } from "react";
import { getScoreClienteRequest } from "../../api/clientes";

const CFG = {
  verde: { c: "bg-green-100 text-green-700", t: "Buen pagador" },
  amarillo: { c: "bg-amber-100 text-amber-700", t: "Atraso leve" },
  rojo: { c: "bg-red-100 text-red-700", t: "Moroso" },
  sin_historial: { c: "bg-gray-100 text-gray-500", t: "Sin historial" },
};

/** Muestra el semáforo crediticio de un cliente (se autoconsulta al montar). */
export const ScoreBadge = ({ clienteId }) => {
  const [score, setScore] = useState(null);

  useEffect(() => {
    let alive = true;
    getScoreClienteRequest(clienteId)
      .then(({ data }) => { if (alive) setScore(data.score); })
      .catch(() => {});
    return () => { alive = false; };
  }, [clienteId]);

  if (!score) return <span className="text-xs text-gray-400">…</span>;
  const k = CFG[score.semaforo] || CFG.sin_historial;
  const title = `Mora máx: ${score.metricas.max_dias_atraso}d · Puntualidad: ${score.metricas.puntualidad_pct ?? "-"}%`;
  return (
    <span className={`px-2 py-1 rounded text-xs font-medium ${k.c}`} title={title}>
      {k.t}
    </span>
  );
};
