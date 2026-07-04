import { useState } from 'react';
import { getMiSuscripcionRequest, getSuscripcionesRequest } from '../../api/suscripcion';

export const useSuscripcion = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getMiSuscripcion = async () => {
        setLoading(true); setError(null);
        try {
            const { data } = await getMiSuscripcionRequest();
            return data.suscripcion;
        } catch (err) {
            setError(err.response?.data?.msg || 'Error al cargar la suscripción');
            return null;
        } finally { setLoading(false); }
    };

    const getSuscripciones = async (params = {}) => {
        setLoading(true); setError(null);
        try {
            const { data } = await getSuscripcionesRequest(params);
            return data; // { ok, suscripciones, meta }
        } catch (err) {
            setError(err.response?.data?.msg || 'Error al cargar las suscripciones');
            return null;
        } finally { setLoading(false); }
    };

    return { getMiSuscripcion, getSuscripciones, loading, error };
};
