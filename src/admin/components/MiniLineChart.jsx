export const MiniLineChart = ({ data, titulo, color = '#3b82f6', height = 180 }) => {
    if (!data || data.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow p-6">
                {titulo && <h3 className="text-lg font-semibold text-gray-800 mb-4">{titulo}</h3>}
                <p className="text-center text-gray-500 py-8">Sin datos</p>
            </div>
        );
    }
    const width = 600;
    const padding = 30;
    const max = Math.max(...data.map(d => Number(d.value) || 0), 1);
    const stepX = data.length > 1 ? (width - padding * 2) / (data.length - 1) : 0;
    const points = data.map((d, i) => {
        const x = padding + i * stepX;
        const y = padding + (1 - (Number(d.value) || 0) / max) * (height - padding * 2);
        return [x, y];
    });
    const pathD = points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x} ${y}`).join(' ');
    const areaD = `${pathD} L ${points[points.length - 1][0]} ${height - padding} L ${points[0][0]} ${height - padding} Z`;

    return (
        <div className="bg-white rounded-lg shadow p-6">
            {titulo && <h3 className="text-lg font-semibold text-gray-800 mb-4">{titulo}</h3>}
            <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet" className="w-full">
                <path d={areaD} fill={color} fillOpacity="0.15" />
                <path d={pathD} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" />
                {points.map(([x, y], i) => (
                    <circle key={i} cx={x} cy={y} r="3" fill={color} />
                ))}
            </svg>
            <div className="flex justify-between text-xs text-gray-500 mt-2 px-2">
                <span>{data[0]?.label}</span>
                {data.length > 2 && <span>{data[Math.floor(data.length / 2)]?.label}</span>}
                <span>{data[data.length - 1]?.label}</span>
            </div>
        </div>
    );
};
