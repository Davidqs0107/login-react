import { useCallback, useState } from 'react';
import {
    getCrecimientoEmpresasRequest, getDistribucionPlanesRequest,
    getEmpresasRecientesRequest, getGlobalMetricsRequest, getSuscripcionesCriticasRequest
} from '../../api/adminMetrics';

export const useAdminMetrics = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const call = useCallback(async (fn) => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await fn();
            return data;
        } catch (e) {
            const msg = e.response?.data?.msg
                || e.response?.data?.message
                || e.message
                || 'Error desconocido';
            setError(msg);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const getGlobalMetrics        = useCallback(() => call(getGlobalMetricsRequest()),        [call]);
    const getCrecimientoEmpresas  = useCallback(() => call(getCrecimientoEmpresasRequest()),  [call]);
    const getDistribucionPlanes   = useCallback(() => call(getDistribucionPlanesRequest()),   [call]);
    const getEmpresasRecientes    = useCallback((limit) => call(getEmpresasRecientesRequest(limit)),       [call]);
    const getSuscripcionesCriticas= useCallback((limit) => call(getSuscripcionesCriticasRequest(limit)), [call]);

    return {
        getGlobalMetrics,
        getCrecimientoEmpresas,
        getDistribucionPlanes,
        getEmpresasRecientes,
        getSuscripcionesCriticas,
        loading, error,
    };
};
