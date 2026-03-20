import { useState } from 'react';
import {
    getMoraDetalladaRequest,
    getCarteraPorEstadoRequest,
    getCobrosPorCobradorRequest,
    getAgendaCobroRequest,
    getRecaudacionMensualRequest,
    getFichaClienteRequest
} from '../../api/reportes';

export const useReportes = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getMoraDetallada = async (params = {}) => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await getMoraDetalladaRequest(params);
            return data;
        } catch (err) {
            setError(err.response?.data?.msg || "Error al cargar mora detallada");
            return null;
        } finally {
            setLoading(false);
        }
    };

    const getCarteraPorEstado = async () => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await getCarteraPorEstadoRequest();
            return data;
        } catch (err) {
            setError(err.response?.data?.msg || "Error al cargar cartera por estado");
            return null;
        } finally {
            setLoading(false);
        }
    };

    const getCobrosPorCobrador = async (params = {}) => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await getCobrosPorCobradorRequest(params);
            return data;
        } catch (err) {
            setError(err.response?.data?.msg || "Error al cargar cobros por cobrador");
            return null;
        } finally {
            setLoading(false);
        }
    };

    const getAgendaCobro = async (params = {}) => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await getAgendaCobroRequest(params);
            return data;
        } catch (err) {
            setError(err.response?.data?.msg || "Error al cargar agenda de cobro");
            return null;
        } finally {
            setLoading(false);
        }
    };

    const getRecaudacionMensual = async (params = {}) => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await getRecaudacionMensualRequest(params);
            return data;
        } catch (err) {
            setError(err.response?.data?.msg || "Error al cargar recaudación mensual");
            return null;
        } finally {
            setLoading(false);
        }
    };

    const getFichaCliente = async (clienteId) => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await getFichaClienteRequest(clienteId);
            return data;
        } catch (err) {
            setError(err.response?.data?.msg || "Error al cargar ficha del cliente");
            return null;
        } finally {
            setLoading(false);
        }
    };

    return {
        // Métodos
        getMoraDetallada,
        getCarteraPorEstado,
        getCobrosPorCobrador,
        getAgendaCobro,
        getRecaudacionMensual,
        getFichaCliente,
        // Estados
        loading,
        error
    };
};
