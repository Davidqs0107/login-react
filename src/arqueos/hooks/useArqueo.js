import { useState } from 'react';
import { cerrarArqueoRequest, getArqueosRequest, getResumenDiaRequest, resolverArqueoRequest } from '../../api/arqueos';

export const useArqueo = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const wrap = async (fn) => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await fn();
            return data;
        } catch (err) {
            setError(err.response?.data?.msg || 'Error en la operación de arqueo');
            return null;
        } finally {
            setLoading(false);
        }
    };

    const getResumenDia = (fecha) => wrap(() => getResumenDiaRequest({ fecha }));
    const cerrarArqueo = (payload) => wrap(() => cerrarArqueoRequest(payload));
    const getArqueos = (params = {}) => wrap(() => getArqueosRequest(params));
    const resolverArqueo = (id, estado) => wrap(() => resolverArqueoRequest(id, estado));

    return { getResumenDia, cerrarArqueo, getArqueos, resolverArqueo, loading, error };
};
