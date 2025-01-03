import { BadgeDollarSignIcon, Coins, QrCode, Receipt } from 'lucide-react'
import React from 'react'
import { Card } from '../../components/CardResumen'

export const DashboardCobradorCards = ({ summaryState }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

            <Card
                title="Total Recaudado hoy"
                value={summaryState.total_recaudado_hoy || 0}
                icon={<BadgeDollarSignIcon size={24} />}
                color="bg-purple-500"
            />
            <Card
                title="Recaudado hoy Efectivo"
                value={summaryState.total_recaudado_hoy_efectivo || 0}
                icon={<Coins size={24} />}
                color="bg-blue-500"
            />
            <Card
                title="Recaudado hoy QR"
                value={summaryState.total_recaudado_hoy_qr || 0}
                icon={<QrCode size={24} />}
                color="bg-red-500"
            />
            <Card
                title="Total Recaudado"
                value={summaryState.total_recaudado || 0}
                icon={<Receipt size={24} />}
                color="bg-green-500"
            />
        </div>
    )
}
