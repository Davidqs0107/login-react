import { Building2, CreditCard, ListChecks, FileSearch, Plus } from 'lucide-react';
import { NavLink } from 'react-router';

const acciones = [
    { to: '/admin/empresas',              titulo: 'Nueva Empresa',          icono: <Plus size={20} />,       color: 'bg-blue-500' },
    { to: '/admin/empresas',              titulo: 'Ver Empresas',          icono: <Building2 size={20} />,  color: 'bg-indigo-500' },
    { to: '/admin/planes',                titulo: 'Gestionar Planes',      icono: <CreditCard size={20} />, color: 'bg-emerald-500' },
    { to: '/admin/suscripciones',         titulo: 'Suscripciones',         icono: <ListChecks size={20} />, color: 'bg-amber-500' },
    { to: '/auditoria',                   titulo: 'Bitácora de Auditoría', icono: <FileSearch size={20} />, color: 'bg-gray-700' },
];

export const AccionesRapidas = () => (
    <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Acciones rápidas</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {acciones.map((a, i) => (
                <NavLink key={i} to={a.to}
                    className="flex flex-col items-center gap-2 p-4 rounded-lg border border-gray-200 hover:border-blue-400 hover:shadow transition-all text-center">
                    <div className={`${a.color} text-white p-2 rounded-lg`}>{a.icono}</div>
                    <span className="text-xs font-medium text-gray-700">{a.titulo}</span>
                </NavLink>
            ))}
        </div>
    </div>
);
