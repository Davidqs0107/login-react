import { useState } from 'react';
import { getComprobantesRequest, validarComprobanteRequest } from '../../api/comprobantes';

export const useComprobantes = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getComprobantes = async (params = {}) => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await getComprobantesRequest(params);
            return data;
        } catch (err) {
            setError(err.response?.data?.msg || 'Error al cargar comprobantes');
            return null;
        } finally {
            setLoading(false);
        }
    };

    const validarComprobante = async (id, estado) => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await validarComprobanteRequest(id, estado);
            return data;
        } catch (err) {
            setError(err.response?.data?.msg || 'Error al validar el comprobante');
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { getComprobantes, validarComprobante, loading, error };
};
