import { useCallback } from 'react';
import { useApi } from '../../hooks/useApi';
import {
    getCrecimientoEmpresasRequest, getDistribucionPlanesRequest,
    getEmpresasRecientesRequest, getGlobalMetricsRequest, getSuscripcionesCriticasRequest
} from '../../api/adminMetrics';

export const useAdminMetrics = () => {
    const { call, loading, error } = useApi();

    const getGlobalMetrics        = useCallback(() => call(getGlobalMetricsRequest),        [call]);
    const getCrecimientoEmpresas  = useCallback(() => call(getCrecimientoEmpresasRequest),  [call]);
    const getDistribucionPlanes   = useCallback(() => call(getDistribucionPlanesRequest),   [call]);
    const getEmpresasRecientes    = useCallback((limit) => call(() => getEmpresasRecientesRequest(limit)),       [call]);
    const getSuscripcionesCriticas= useCallback((limit) => call(() => getSuscripcionesCriticasRequest(limit)), [call]);

    return {
        getGlobalMetrics,
        getCrecimientoEmpresas,
        getDistribucionPlanes,
        getEmpresasRecientes,
        getSuscripcionesCriticas,
        loading, error,
    };
};
