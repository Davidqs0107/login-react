import { useApi } from '../../hooks/useApi';
import { getMiSuscripcionRequest, getSuscripcionesRequest } from '../../api/suscripcion';

export const useSuscripcion = () => {
    const { call, loading, error } = useApi();

    const getMiSuscripcion = async () => {
        const data = await call(() => getMiSuscripcionRequest(), 'Error al cargar la suscripción');
        return data ? data.suscripcion : null;
    };

    const getSuscripciones = (params = {}) => call(() => getSuscripcionesRequest(params), 'Error al cargar las suscripciones'); // { ok, suscripciones, meta }

    return { getMiSuscripcion, getSuscripciones, loading, error };
};
