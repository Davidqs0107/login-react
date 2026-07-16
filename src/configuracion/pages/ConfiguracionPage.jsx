import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useConfiguracion } from "../hooks/useConfiguracion";
import { LoaderLocal } from "../../components/LoaderLocal";
import { SelectMoneda } from "../../components/SelectMoneda";
import { useConfig } from "../../context/ConfigContext";

const MORA_TIPOS = [
  { value: "porcentaje_cuota", label: "% único sobre la cuota" },
  { value: "porcentaje_diario_saldo", label: "% diario sobre el saldo" },
  { value: "monto_fijo_dia", label: "Monto fijo por día de atraso" },
];

const initial = {
  mora_activa: false,
  mora_tipo: "porcentaje_cuota",
  mora_valor: 0,
  mora_dias_gracia: 0,
  mora_tope: "",
  incumplido_dias: 90,
  moneda: "BOB",
  simbolo_moneda: "Bs.",
};

export const ConfiguracionPage = () => {
  const { getConfiguracion, updateConfiguracion, loading } = useConfiguracion();
  const { setConfig } = useConfig();
  const [form, setForm] = useState(initial);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    (async () => {
      const cfg = await getConfiguracion();
      if (cfg) {
        setForm({
          mora_activa: !!cfg.mora_activa,
          mora_tipo: cfg.mora_tipo ?? "porcentaje_cuota",
          mora_valor: cfg.mora_valor ?? 0,
          mora_dias_gracia: cfg.mora_dias_gracia ?? 0,
          mora_tope: cfg.mora_tope ?? "",
          incumplido_dias: cfg.incumplido_dias ?? 90,
          moneda: cfg.moneda ?? "BOB",
          simbolo_moneda: cfg.simbolo_moneda ?? "Bs.",
        });
      }
      setCargando(false);
    })();
  }, []);

  const set = (campo, valor) => setForm((f) => ({ ...f, [campo]: valor }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      mora_valor: Number(form.mora_valor) || 0,
      mora_dias_gracia: Number(form.mora_dias_gracia) || 0,
      mora_tope: form.mora_tope === "" ? null : Number(form.mora_tope),
      incumplido_dias: Number(form.incumplido_dias) || 90,
    };
    const res = await updateConfiguracion(payload);
    if (res) {
      const next = {
        simboloMoneda: res.simbolo_moneda,
        moneda: res.moneda,
      };
      setConfig(next);
      localStorage.setItem('config', JSON.stringify(next));
      Swal.fire({ title: "Configuración guardada", icon: "success", timer: 1800, showConfirmButton: false });
    } else {
      Swal.fire({ title: "No se pudo guardar", icon: "error" });
    }
  };

  if (cargando) return <LoaderLocal />;

  return (
    <div className="p-6 max-w-3xl">
      <h1 className="text-3xl font-bold text-gray-800">Configuración</h1>
      <p className="text-gray-600 mt-2 mb-6">
        Reglas de mora e incumplimiento aplicadas a los préstamos de tu empresa.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Mora */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Mora</h2>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.mora_activa}
                onChange={(e) => set("mora_activa", e.target.checked)}
                className="w-5 h-5"
              />
              <span className="text-sm font-medium">{form.mora_activa ? "Activa" : "Inactiva"}</span>
            </label>
          </div>

          <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${form.mora_activa ? "" : "opacity-50 pointer-events-none"}`}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de mora</label>
              <select
                value={form.mora_tipo}
                onChange={(e) => set("mora_tipo", e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2"
              >
                {MORA_TIPOS.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Valor {form.mora_tipo === "monto_fijo_dia" ? "(monto)" : "(%)"}
              </label>
              <input
                type="number" step="0.01" min="0"
                value={form.mora_valor}
                onChange={(e) => set("mora_valor", e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Días de gracia</label>
              <input
                type="number" min="0"
                value={form.mora_dias_gracia}
                onChange={(e) => set("mora_dias_gracia", e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tope máximo (opcional)</label>
              <input
                type="number" step="0.01" min="0"
                value={form.mora_tope}
                onChange={(e) => set("mora_tope", e.target.value)}
                placeholder="Sin tope"
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>
          </div>
        </div>

        {/* Incumplimiento y general */}
        <div className="bg-white rounded-lg shadow p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Días para marcar incumplido</label>
            <input
              type="number" min="1"
              value={form.incumplido_dias}
              onChange={(e) => set("incumplido_dias", e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2"
            />
            <p className="text-xs text-gray-500 mt-1">Un préstamo con atraso mayor a estos días se marca "incumplido".</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Moneda</label>
            <input
              type="text" maxLength={4}
              value={form.moneda}
              onChange={(e) => set("moneda", e.target.value.toUpperCase())}
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Símbolo de moneda</label>
            <SelectMoneda
              value={form.simbolo_moneda}
              onChange={(e) => set("simbolo_moneda", e.target.value)}
            />
            <p className="text-xs text-gray-500 mt-1">Se mostrará en tablas, dashboard y PDFs.</p>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? "Guardando..." : "Guardar cambios"}
        </button>
      </form>
    </div>
  );
};
