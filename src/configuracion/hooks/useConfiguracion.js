import { useApi } from '../../hooks/useApi';
import { getConfiguracionRequest, updateConfiguracionRequest } from '../../api/configuracion';

export const useConfiguracion = () => {
    const { call, loading, error } = useApi();

    const getConfiguracion = async () => {
        const data = await call(() => getConfiguracionRequest(), 'Error al cargar la configuración');
        return data ? data.configuracion : null;
    };

    const updateConfiguracion = async (payload) => {
        const data = await call(() => updateConfiguracionRequest(payload), 'Error al guardar la configuración');
        return data ? data.configuracion : null;
    };

    return { getConfiguracion, updateConfiguracion, loading, error };
};
