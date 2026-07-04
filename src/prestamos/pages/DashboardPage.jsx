import React, { useEffect, useState } from 'react'
import { RegisterTableLayout } from '../../layout/RegisterTableLayout'
import { useEmpresa } from '../hooks/useEmpresa'
import { useAuth } from '../../context/AuthContex'
import { roles } from '../../common/constans'
import { DashboardCobradorCards } from '../components/DashboardCobradorCards'
import { LoaderLocal } from '../../components/LoaderLocal'
import { PanelAdminPage } from '../../dashboard/pages/PanelAdminPage'

export const DashboardPage = () => {
    const { user, isLoading } = useAuth();

    const { getSummaryCobrador, loading, error } = useEmpresa();
    const [summaryState, setSummaryState] = useState({});

    const fetchSummaryCobrador = async () => {
        const summary = await getSummaryCobrador();
        if (summary) {
            setSummaryState(summary.empresa);
        }
    };
    useEffect(() => {
        // Solo el cobrador usa el resumen simple; el admin ve el panel analítico
        if (isLoading) return;
        if (user.rol === roles.Cobrador) {
            fetchSummaryCobrador();
        }
    }, [isLoading]);

    // El home del admin es el panel analítico completo
    if (!isLoading && user?.rol === roles.Admin) {
        return <PanelAdminPage />;
    }

    return (
        <RegisterTableLayout title={"Resumen"}>
            {error && <div className="mt-2 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">{error}</div>}
            {loading && <LoaderLocal />}
            <DashboardCobradorCards summaryState={summaryState} />
        </RegisterTableLayout>
    )
}

