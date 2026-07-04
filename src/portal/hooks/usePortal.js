import { useState } from 'react';
import { getPortalResumenRequest, subirComprobanteRequest } from '../../api/portal';

export const usePortal = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getResumen = async (token) => {
        setLoading(true); setError(null);
        try {
            const { data } = await getPortalResumenRequest(token);
            return data;
        } catch (err) {
            setError(err.response?.data?.msg || 'Acceso no válido');
            return null;
        } finally { setLoading(false); }
    };

    const subirComprobante = async (token, payload) => {
        setLoading(true); setError(null);
        try {
            const { data } = await subirComprobanteRequest(token, payload);
            return data;
        } catch (err) {
            setError(err.response?.data?.msg || 'No se pudo enviar el comprobante');
            return null;
        } finally { setLoading(false); }
    };

    return { getResumen, subirComprobante, loading, error };
};
