import { useApi } from '../../hooks/useApi';
import { cerrarArqueoRequest, getArqueosRequest, getResumenDiaRequest, resolverArqueoRequest } from '../../api/arqueos';

export const useArqueo = () => {
    const { call, loading, error } = useApi();

    const getResumenDia = (fecha) => call(() => getResumenDiaRequest({ fecha }), 'Error en la operación de arqueo');
    const cerrarArqueo = (payload) => call(() => cerrarArqueoRequest(payload), 'Error en la operación de arqueo');
    const getArqueos = (params = {}) => call(() => getArqueosRequest(params), 'Error en la operación de arqueo');
    const resolverArqueo = (id, estado) => call(() => resolverArqueoRequest(id, estado), 'Error en la operación de arqueo');

    return { getResumenDia, cerrarArqueo, getArqueos, resolverArqueo, loading, error };
};
