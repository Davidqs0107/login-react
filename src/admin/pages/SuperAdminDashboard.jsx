import { useCallback, useEffect, useState } from 'react';
import { Building2, Users, DollarSign, AlertTriangle, AlertCircle, Activity, Wallet, RefreshCw } from 'lucide-react';
import { useAdminMetrics } from '../hooks/useAdminMetrics';
import { MetricaCard } from '../components/MetricaCard';
import { MiniBarChart } from '../components/MiniBarChart';
import { MiniLineChart } from '../components/MiniLineChart';
import { EstadoSuscripcionBadge } from '../components/EstadoSuscripcionBadge';
import { AccionesRapidas } from '../components/AccionesRapidas';
import { LoaderLocal } from '../../components/LoaderLocal';
import { formatDateWithDateFns } from '../../common/functions';
import { NavLink } from 'react-router';
import { useAuth } from '../../context/AuthContex';

const formatearMesCorto = (yyyyMm) => {
    if (!yyyyMm) return '';
    const parts = yyyyMm.split('-');
    if (parts.length < 2) return yyyyMm;
    const y = parts[0];
    const m = parseInt(parts[1], 10);
    const nombres = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    if (isNaN(m) || m < 1 || m > 12) return yyyyMm;
    return `${nombres[m - 1]} ${y.slice(2)}`;
};

const formatearMRR = (v) => {
    const num = Number(v || 0);
    return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

export const SuperAdminDashboard = () => {
    const { user } = useAuth();
    const { getGlobalMetrics, getCrecimientoEmpresas, getDistribucionPlanes,
            getEmpresasRecientes, getSuscripcionesCriticas } = useAdminMetrics();

    const [metrics, setMetrics] = useState(null);
    const [crecimiento, setCrecimiento] = useState([]);
    const [distribucion, setDistribucion] = useState([]);
    const [recientes, setRecientes] = useState([]);
    const [criticas, setCriticas] = useState([]);
    const [error, setError] = useState(null);
    const [ultimaActualizacion, setUltimaActualizacion] = useState(null);
    const [cargando, setCargando] = useState(true);

    const loadAll = useCallback(async () => {
        setError(null);
        setCargando(true);
        try {
            // Secuencial con pequeño delay para evitar saturar el connection pool del navegador
            // (Chrome limita a 6 conexiones simultáneas por host).
            const m = await getGlobalMetrics();
            await new Promise(r => setTimeout(r, 50));
            const c = await getCrecimientoEmpresas();
            await new Promise(r => setTimeout(r, 50));
            const d = await getDistribucionPlanes();
            await new Promise(r => setTimeout(r, 50));
            const r = await getEmpresasRecientes(10);
            await new Promise(r => setTimeout(r, 50));
            const s = await getSuscripcionesCriticas(10);

            if (m?.metrics) setMetrics(m.metrics);
            if (c?.data) setCrecimiento(c.data);
            if (d?.data) setDistribucion(d.data);
            if (r?.data) setRecientes(r.data);
            if (s?.data) setCriticas(s.data);
            if (!m && !c && !d && !r && !s) {
                setError('No se pudieron cargar las métricas. Verifica que el backend esté corriendo.');
            }
            setUltimaActualizacion(new Date());
        } finally {
            setCargando(false);
        }
    }, [getGlobalMetrics, getCrecimientoEmpresas, getDistribucionPlanes, getEmpresasRecientes, getSuscripcionesCriticas]);

    useEffect(() => { loadAll(); }, [loadAll]);

    const crecimientoData = (crecimiento || []).map(m => ({
        label: formatearMesCorto(m.mes),
        value: Number(m.cantidad) || 0,
    }));
    const distribucionData = (distribucion || []).map(p => ({
        label: p.plan_nombre,
        value: Number(p.cantidad) || 0,
    }));

    if (cargando && !metrics) {
        return (
            <div className="p-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Panel Superadmin</h1>
                <LoaderLocal />
            </div>
        );
    }

    const m = metrics || {};
    const sinPlan = Number(m.empresas_sin_plan || 0);
    const vencidas = Number(m.suscripciones_vencidas || 0);
    const porVencer = Number(m.suscripciones_por_vencer || 0);

    return (
        <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
            <div className="flex flex-wrap justify-between items-center gap-3">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Panel Superadmin</h1>
                    <p className="text-gray-600 mt-1">
                        Bienvenido, <span className="font-semibold">{user?.name || user?.nombre || 'Admin'}</span>.
                        Resumen global de todas las empresas de la plataforma.
                    </p>
                    {ultimaActualizacion && (
                        <p className="text-xs text-gray-400 mt-1">
                            Última actualización: {ultimaActualizacion.toLocaleTimeString('es-ES')}
                        </p>
                    )}
                </div>
                <button onClick={loadAll} disabled={cargando}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50">
                    <RefreshCw size={16} className={cargando ? 'animate-spin' : ''} />
                    Actualizar
                </button>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded flex justify-between items-center">
                    <span>{error}</span>
                    <button onClick={loadAll}
                        className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700">
                        Reintentar
                    </button>
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricaCard titulo="Empresas totales"
                    valor={m.total_empresas ?? '—'}
                    subtitulo={`${m.empresas_activas ?? 0} activas`}
                    icono={<Building2 size={24} />}
                    color="bg-blue-500" />
                <MetricaCard titulo="MRR"
                    valor={`$ ${formatearMRR(m.mrr)}`}
                    subtitulo="Recurrente mensual"
                    icono={<DollarSign size={24} />}
                    color="bg-emerald-500" />
                <MetricaCard titulo="Suscripciones vigentes"
                    valor={m.suscripciones_vigentes ?? '—'}
                    subtitulo={`${porVencer} por vencer · ${vencidas} vencidas`}
                    icono={<Activity size={24} />}
                    color="bg-indigo-500" />
                <MetricaCard titulo="Clientes totales"
                    valor={m.clientes_totales ?? '—'}
                    subtitulo={`${m.prestamos_activos ?? 0} préstamos activos`}
                    icono={<Users size={24} />}
                    color="bg-purple-500" />
            </div>

            {(vencidas > 0 || porVencer > 0 || sinPlan > 0) && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {vencidas > 0 && (
                        <NavLink to="/admin/suscripciones?estado=vencido" className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3 hover:bg-red-100">
                            <AlertCircle className="text-red-600" size={28} />
                            <div>
                                <p className="font-semibold text-red-800">{vencidas} suscripción(es) vencida(s)</p>
                                <p className="text-xs text-red-600">Requieren atención inmediata</p>
                            </div>
                        </NavLink>
                    )}
                    {porVencer > 0 && (
                        <NavLink to="/admin/suscripciones?estado=por_vencer" className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-center gap-3 hover:bg-amber-100">
                            <AlertTriangle className="text-amber-600" size={28} />
                            <div>
                                <p className="font-semibold text-amber-800">{porVencer} suscripción(es) por vencer</p>
                                <p className="text-xs text-amber-600">Próximos 7 días</p>
                            </div>
                        </NavLink>
                    )}
                    {sinPlan > 0 && (
                        <NavLink to="/admin/empresas" className="bg-gray-100 border border-gray-300 rounded-lg p-4 flex items-center gap-3 hover:bg-gray-200">
                            <Wallet className="text-gray-600" size={28} />
                            <div>
                                <p className="font-semibold text-gray-800">{sinPlan} empresa(s) sin plan asignado</p>
                                <p className="text-xs text-gray-500">No generan ingresos</p>
                            </div>
                        </NavLink>
                    )}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <MiniLineChart data={crecimientoData} titulo="Empresas creadas (últimos 12 meses)"
                    color="#10b981" />
                <MiniBarChart data={distribucionData} titulo="Distribución de empresas por plan"
                    color="bg-indigo-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="p-4 border-b flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-gray-800">Suscripciones por vencer / vencidas</h3>
                        <NavLink to="/admin/suscripciones" className="text-sm text-blue-600 hover:underline">Ver todas</NavLink>
                    </div>
                    {criticas.length === 0 ? (
                        <p className="p-6 text-center text-gray-500">Sin suscripciones críticas</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm">
                                <thead className="bg-gray-50 text-gray-600 text-left">
                                    <tr>
                                        <th className="p-3">Empresa</th>
                                        <th className="p-3">Plan</th>
                                        <th className="p-3">Vence</th>
                                        <th className="p-3">Estado</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {criticas.map(s => (
                                        <tr key={s.empresa_id} className="border-t">
                                            <td className="p-3 font-medium">{s.empresa_nombre}</td>
                                            <td className="p-3">{s.plan_nombre}</td>
                                            <td className="p-3 whitespace-nowrap">{s.fecha_fin?.slice(0, 10)}</td>
                                            <td className="p-3"><EstadoSuscripcionBadge estado={s.estado} dias={s.dias_restantes} /></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="p-4 border-b flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-gray-800">Empresas recientes</h3>
                        <NavLink to="/admin/empresas" className="text-sm text-blue-600 hover:underline">Ver todas</NavLink>
                    </div>
                    {recientes.length === 0 ? (
                        <p className="p-6 text-center text-gray-500">Sin empresas registradas</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm">
                                <thead className="bg-gray-50 text-gray-600 text-left">
                                    <tr>
                                        <th className="p-3">Nombre</th>
                                        <th className="p-3">Plan</th>
                                        <th className="p-3">Clientes</th>
                                        <th className="p-3">Préstamos</th>
                                        <th className="p-3">Creada</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recientes.map(e => (
                                        <tr key={e.id} className="border-t">
                                            <td className="p-3 font-medium">{e.nombre}</td>
                                            <td className="p-3">{e.plan_nombre || '—'}</td>
                                            <td className="p-3">{e.clientes_count}</td>
                                            <td className="p-3">{e.prestamos_count}</td>
                                            <td className="p-3 whitespace-nowrap">{formatDateWithDateFns(e.created_at)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            <AccionesRapidas />
        </div>
    );
};
