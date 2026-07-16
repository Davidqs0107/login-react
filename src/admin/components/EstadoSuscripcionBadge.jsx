const estilos = {
    vigente:    'bg-green-100 text-green-700',
    por_vencer: 'bg-amber-100 text-amber-700',
    vencido:    'bg-red-100 text-red-700',
    sin_plan:   'bg-gray-100 text-gray-600',
};

const labels = {
    vigente:    'Vigente',
    por_vencer: 'Por vencer',
    vencido:    'Vencido',
    sin_plan:   'Sin plan',
};

export const EstadoSuscripcionBadge = ({ estado, dias }) => {
    const estilo = estilos[estado] || estilos.sin_plan;
    const labelBase = labels[estado] || estado;
    const label = estado === 'por_vencer' && dias != null ? `${labelBase} (${dias}d)` : labelBase;
    return (
        <span className={`px-2 py-1 rounded text-xs font-medium ${estilo}`}>
            {label}
        </span>
    );
};
