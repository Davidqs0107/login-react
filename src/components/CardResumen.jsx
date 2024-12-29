export const Card = ({ title, value, icon, color }) => {
    return (
        <div className={`${color} text-white rounded-lg shadow-lg p-6 transition-transform duration-300 hover:scale-105`}>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">{title}</h2>
                {icon}
            </div>
            <h3 className="text-3xl font-bold text-center">{value}</h3>
        </div>
    )
}