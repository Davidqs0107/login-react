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
            const isFormData = typeof FormData !== 'undefined' && payload instanceof FormData;
            const { data } = await subirComprobanteRequest(token, payload, {
                headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
            });
            return data;
        } catch (err) {
            // Si el backend no mandó mensaje útil, completar uno por defecto
            let msg = err.response?.data?.msg;
            if (!msg) {
                if (err.response?.status === 413) {
                    msg = 'La imagen o documento es demasiado grande. Máximo 1 MB.';
                } else if (err.code === 'ERR_NETWORK') {
                    msg = 'No se pudo conectar con el servidor.';
                } else {
                    msg = 'No se pudo enviar el comprobante.';
                }
            }
            setError(msg);
            return null;
        } finally { setLoading(false); }
    };

    return { getResumen, subirComprobante, loading, error };
};
