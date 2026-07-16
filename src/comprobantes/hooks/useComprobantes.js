import { useApi } from '../../hooks/useApi';
import { getComprobantesRequest, validarComprobanteRequest } from '../../api/comprobantes';

export const useComprobantes = () => {
    const { call, loading, error } = useApi();

    const getComprobantes = (params = {}) => call(() => getComprobantesRequest(params), 'Error al cargar comprobantes');
    const validarComprobante = (id, estado) => call(() => validarComprobanteRequest(id, estado), 'Error al validar el comprobante');

    return { getComprobantes, validarComprobante, loading, error };
};
