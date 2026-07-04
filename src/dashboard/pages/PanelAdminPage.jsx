import { useEffect, useState } from "react";
import { NavLink } from "react-router";
import {
  Users, FileText, BadgeDollarSign, AlertTriangle, ArrowRight, Wallet,
} from "lucide-react";
import { useEmpresa } from "../../prestamos/hooks/useEmpresa";
import { useReportes } from "../../reportes/hooks/useReportes";
import { Card } from "../../components/CardResumen";
import { CarteraEstadoCards } from "../../reportes/components/CarteraEstadoCards";
import { RecaudacionMensualChart } from "../../reportes/components/RecaudacionMensualChart";
import { LoaderLocal } from "../../components/LoaderLocal";

const hoyISO = () => new Date().toISOString().slice(0, 10);
const primerDiaMes = () => { const d = new Date(); d.setDate(1); return d.toISOString().slice(0, 10); };
const inicioTendencia = () => { const d = new Date(); d.setMonth(d.getMonth() - 5); d.setDate(1); return d.toISOString().slice(0, 10); };
const bs = (n) => `Bs. ${parseFloat(n || 0).toFixed(2)}`;

const SectionHeader = ({ title, to, cta = "Ver detalle" }) => (
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
    {to && (
      <NavLink to={to} className="text-blue-600 text-sm font-medium inline-flex items-center gap-1 hover:gap-2 transition-all">
        {cta} <ArrowRight size={15} />
      </NavLink>
    )}
  </div>
);

export const PanelAdminPage = () => {
  const { getSummary } = useEmpresa();
  const { getCarteraPorEstado, getRecaudacionMensual, getCobrosPorCobrador, getMoraDetallada } = useReportes();

  const [summary, setSummary] = useState({});
  const [cartera, setCartera] = useState([]);
  const [recaudacion, setRecaudacion] = useState([]);
  const [cobros, setCobros] = useState([]);
  const [mora, setMora] = useState({ count: 0, saldo: 0, recargo: 0 });
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    (async () => {
      const [sum, cart, rec, cob, mor] = await Promise.all([
        getSummary(),
        getCarteraPorEstado(),
        getRecaudacionMensual({ fecha_inicio: inicioTendencia(), fecha_fin: hoyISO() }),
        getCobrosPorCobrador({ fecha_inicio: primerDiaMes(), fecha_fin: hoyISO() }),
        getMoraDetallada({ page: 1, pageSize: 500 }),
      ]);

      if (sum) setSummary(sum.empresa || {});
      if (cart) setCartera(cart.data || []);
      if (rec) setRecaudacion(rec.data || []);
      if (cob) setCobros((cob.data || []).sort((a, b) => parseFloat(b.total_cobrado) - parseFloat(a.total_cobrado)));
      if (mor) {
        const filas = mor.data || [];
        setMora({
          count: mor.meta?.totalItems ?? filas.length,
          saldo: filas.reduce((a, f) => a + parseFloat(f.saldo_pendiente || 0), 0),
          recargo: filas.reduce((a, f) => a + parseFloat(f.recargo_mora || 0), 0),
        });
      }
      setCargando(false);
    })();
  }, []);

  // Total de cartera (saldo pendiente global) para el KPI
  const saldoCartera = cartera.reduce((a, c) => a + parseFloat(c.saldo_pendiente || 0), 0);
  const maxCobro = Math.max(1, ...cobros.map((c) => parseFloat(c.total_cobrado)));

  if (cargando) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Panel</h1>
        <LoaderLocal />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-10">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Panel</h1>
        <p className="text-gray-600 mt-1">Visión general de tu financiera.</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card title="Clientes activos" value={summary.clientes_activos || 0} icon={<Users size={24} />} color="bg-blue-500" />
        <Card title="Préstamos activos" value={summary.prestamos_pendientes || 0} icon={<FileText size={24} />} color="bg-green-500" />
        <Card title="Saldo en cartera" value={bs(saldoCartera)} icon={<Wallet size={24} />} color="bg-indigo-500" />
        <Card title="Recaudado (este mes)" value={bs(summary.total_recaudado)} icon={<BadgeDollarSign size={24} />} color="bg-emerald-600" />
      </div>

      {/* Alerta de mora */}
      <div className={`rounded-lg p-5 flex items-center justify-between shadow ${mora.count > 0 ? "bg-red-50 border border-red-200" : "bg-green-50 border border-green-200"}`}>
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${mora.count > 0 ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"}`}>
            <AlertTriangle size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-600">Cuotas en mora</p>
            <p className="text-2xl font-bold text-gray-800">
              {mora.count}
              {mora.count > 0 && (
                <span className="text-sm font-normal text-gray-500 ml-2">
                  · saldo {bs(mora.saldo)}{mora.recargo > 0 ? ` · recargo ${bs(mora.recargo)}` : ""}
                </span>
              )}
            </p>
          </div>
        </div>
        {mora.count > 0 && (
          <NavLink to="/reportes/mora" className="text-red-600 text-sm font-medium inline-flex items-center gap-1 hover:gap-2 transition-all whitespace-nowrap">
            Ver mora <ArrowRight size={15} />
          </NavLink>
        )}
      </div>

      {/* Cartera por estado */}
      <section>
        <SectionHeader title="Cartera por estado" to="/reportes/cartera" />
        <CarteraEstadoCards data={cartera} />
      </section>

      {/* Ranking de cobradores (mes actual) */}
      <section>
        <SectionHeader title="Cobros por cobrador (este mes)" to="/reportes/cobros" />
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          {cobros.length === 0 ? (
            <p className="p-6 text-center text-gray-500">Aún no hay cobros este mes.</p>
          ) : (
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-gray-600 text-left">
                <tr>
                  <th className="p-3">Cobrador</th>
                  <th className="p-3">Pagos</th>
                  <th className="p-3 w-1/2">Total cobrado</th>
                </tr>
              </thead>
              <tbody>
                {cobros.map((c) => (
                  <tr key={c.cobrador_id} className="border-t">
                    <td className="p-3 font-medium">{c.cobrador}</td>
                    <td className="p-3">{c.num_pagos}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-gray-100 rounded-full h-3">
                          <div className="bg-emerald-500 h-3 rounded-full"
                            style={{ width: `${(parseFloat(c.total_cobrado) / maxCobro) * 100}%` }} />
                        </div>
                        <span className="font-semibold text-gray-800 whitespace-nowrap">{bs(c.total_cobrado)}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>

      {/* Recaudación mensual (tendencia) */}
      <section>
        <SectionHeader title="Recaudación (últimos meses)" to="/reportes/recaudacion" />
        <RecaudacionMensualChart data={recaudacion} />
      </section>
    </div>
  );
};
