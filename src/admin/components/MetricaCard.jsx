export const MetricaCard = ({ titulo, valor, icono, color = 'bg-blue-500', subtitulo, tendencia }) => (
    <div className="bg-white rounded-lg shadow p-5 flex items-start gap-4 hover:shadow-lg transition-shadow">
        <div className={`${color} text-white p-3 rounded-lg shrink-0`}>
            {icono}
        </div>
        <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-500 uppercase tracking-wide">{titulo}</p>
            <p className="text-2xl font-bold text-gray-800 mt-1 truncate">{valor}</p>
            {subtitulo && <p className="text-xs text-gray-400 mt-1">{subtitulo}</p>}
            {tendencia && (
                <p className={`text-xs mt-1 font-medium ${tendencia.positive ? 'text-green-600' : 'text-red-600'}`}>
                    {tendencia.positive ? '↑' : '↓'} {tendencia.label}
                </p>
            )}
        </div>
    </div>
);
