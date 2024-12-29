import React, { useEffect, useState } from 'react'
import { RegisterTableLayout } from '../../layout/RegisterTableLayout'
import { Users, FileText, CreditCard, UserCheck } from 'lucide-react'
import { Card } from '../../components/CardResumen'
import { useEmpresa } from '../hooks/useEmpresa'

export const DashboardPage = () => {
    const { getSummary, loading, error } = useEmpresa();
    const [summaryState, setSummaryState] = useState({});
    useEffect(() => {
        const fetchSummary = async () => {
            const summary = await getSummary();
            if (summary) {
                setSummaryState(summary.empresa);
            }
        };
        fetchSummary();
    }, []);
    return (
        <RegisterTableLayout title={"Resumen"}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card
                    title="Total Clientes"
                    value={summaryState.total_clientes || 0}
                    icon={<Users size={24} />}
                    color="bg-blue-500"
                />
                <Card
                    title="Prestamos Activos"
                    value={summaryState.prestamos_pendientes || 0}
                    icon={<FileText size={24} />}
                    color="bg-green-500"
                />
                <Card
                    title="Prestamos Pagados"
                    value={summaryState.prestamos_completados || 0}
                    icon={<CreditCard size={24} />}
                    color="bg-yellow-500"
                />
                <Card
                    title="Total Cobradores"
                    value={summaryState.cobradores_activos || 0}
                    icon={<UserCheck size={24} />}
                    color="bg-purple-500"
                />
            </div>
        </RegisterTableLayout>
    )
}

