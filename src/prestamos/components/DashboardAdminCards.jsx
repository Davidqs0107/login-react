import { BadgeDollarSign, FileText, UserCheck, Users } from 'lucide-react'
import React from 'react'
import { Card } from '../../components/CardResumen'

export const DashboardAdminCards = ({ summaryState }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card
                title="Total Clientes"
                value={summaryState.clientes_activos || 0}
                icon={<Users size={24} />}
                color="bg-blue-500"
            />
            <Card
                title="Prestamos Activos"
                value={summaryState.prestamos_pendientes || 0}
                icon={<FileText size={24} />}
                color="bg-green-500"
            />
            {/* <Card
                    title="Prestamos Pagados"
                    value={summaryState.prestamos_completados || 0}
                    icon={<CreditCard size={24} />}
                    color="bg-yellow-500"
                /> */}
            <Card
                title="Total Cobradores"
                value={summaryState.cobradores_activos || 0}
                icon={<UserCheck size={24} />}
                color="bg-purple-500"
            />
            <Card
                title="Total Recaudado"
                value={summaryState.total_recaudado || 0}
                icon={<BadgeDollarSign size={24} />}
                color="bg-red-500"
            />
        </div>
    )
}
