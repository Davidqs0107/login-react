import React, { useEffect, useState } from 'react'
import { RegisterTableLayout } from '../../layout/RegisterTableLayout'
import { Users, FileText, CreditCard, UserCheck, BadgeDollarSign } from 'lucide-react'
import { Card } from '../../components/CardResumen'
import { useEmpresa } from '../hooks/useEmpresa'
import { useAuth } from '../../context/AuthContex'
import { roles } from '../../common/constans'
import { DashboardAdminCards } from '../components/DashboardAdminCards'
import { DashboardCobradorCards } from '../components/DashboardCobradorCards'
import { LoaderLocal } from '../../components/LoaderLocal'

export const DashboardPage = () => {
    const { user } = useAuth();

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
        if (user.rol === roles.Cobrador) {
            fetchSummaryCobrador();
            return;
        }
        fetchSummary();
    }, []);
    return (
        <RegisterTableLayout title={"Resumen"}>
            {error && <div className="mt-2 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">{error}</div>}
            {loading && <LoaderLocal />}
            {user.rol === roles.Admin ? (<DashboardAdminCards summaryState={summaryState} />) : (<DashboardCobradorCards summaryState={summaryState} />)}
        </RegisterTableLayout>
    )
}

