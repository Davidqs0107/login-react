import { useState } from 'react';
import { getConfiguracionRequest, updateConfiguracionRequest } from '../../api/configuracion';

export const useConfiguracion = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getConfiguracion = async () => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await getConfiguracionRequest();
            return data.configuracion;
        } catch (err) {
            setError(err.response?.data?.msg || 'Error al cargar la configuración');
            return null;
        } finally {
            setLoading(false);
        }
    };

    const updateConfiguracion = async (payload) => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await updateConfiguracionRequest(payload);
            return data.configuracion;
        } catch (err) {
            setError(err.response?.data?.msg || 'Error al guardar la configuración');
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { getConfiguracion, updateConfiguracion, loading, error };
};
