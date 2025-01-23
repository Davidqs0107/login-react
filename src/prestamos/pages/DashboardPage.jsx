import React, { useEffect, useState } from 'react'
import { RegisterTableLayout } from '../../layout/RegisterTableLayout'
import { useEmpresa } from '../hooks/useEmpresa'
import { useAuth } from '../../context/AuthContex'
import { roles } from '../../common/constans'
import { DashboardAdminCards } from '../components/DashboardAdminCards'
import { DashboardCobradorCards } from '../components/DashboardCobradorCards'
import { LoaderLocal } from '../../components/LoaderLocal'

export const DashboardPage = () => {
    const { user, isLoading } = useAuth();

    const { getSummary, getSummaryCobrador, loading, error } = useEmpresa();
    const [summaryState, setSummaryState] = useState({});

    const fetchSummary = async () => {
        const summary = await getSummary();
        if (summary) {
            setSummaryState(summary.empresa);
        }
    };
    const fetchSummaryCobrador = async () => {
        const summary = await getSummaryCobrador();
        if (summary) {
            setSummaryState(summary.empresa);
        }
    };
    useEffect(() => {
        // usar switch case para los roles de usuario admin y cobrador
        if (isLoading) return;
        switch (user.rol) {
            case roles.Admin:
                fetchSummary();
                break;
            case roles.Cobrador:
                fetchSummaryCobrador();
                break;
            default:
                break;
        }
    }, []);
    return (
        <RegisterTableLayout title={"Resumen"}>
            {error && <div className="mt-2 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">{error}</div>}
            {loading && <LoaderLocal />}
            {user.rol === roles.Admin ? (<DashboardAdminCards summaryState={summaryState} />) : (<DashboardCobradorCards summaryState={summaryState} />)}
        </RegisterTableLayout>
    )
}

