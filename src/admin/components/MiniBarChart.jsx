export const MiniBarChart = ({ data, color = 'bg-blue-500', titulo, formatoValor = (v) => v }) => {
    if (!data || data.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow p-6">
                {titulo && <h3 className="text-lg font-semibold text-gray-800 mb-4">{titulo}</h3>}
                <p className="text-center text-gray-500 py-8">Sin datos</p>
            </div>
        );
    }
    const max = Math.max(...data.map(d => Number(d.value) || 0), 1);
    return (
        <div className="bg-white rounded-lg shadow p-6">
            {titulo && <h3 className="text-lg font-semibold text-gray-800 mb-4">{titulo}</h3>}
            <div className="space-y-2">
                {data.map((d, i) => {
                    const pct = max > 0 ? (Number(d.value) / max) * 100 : 0;
                    return (
                        <div key={i} className="flex items-center gap-3">
                            <span className="text-sm text-gray-600 w-32 truncate" title={d.label}>{d.label}</span>
                            <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
                                <div className={`${color} h-6 rounded-full transition-all`} style={{ width: `${pct}%` }} />
                            </div>
                            <span className="text-sm font-semibold text-gray-800 w-20 text-right">{formatoValor(d.value)}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
