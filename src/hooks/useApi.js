import { useCallback, useState } from 'react';

export const useApi = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Ejecuta una request axios; devuelve response.data, o null si falla.
    const call = useCallback(async (fn, fallbackMsg = 'Error desconocido') => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await fn();
            return data;
        } catch (err) {
            setError(err.response?.data?.msg || err.response?.data?.message || fallbackMsg);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    return { call, loading, error };
};
