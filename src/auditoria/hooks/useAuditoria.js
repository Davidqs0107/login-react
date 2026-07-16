import { useApi } from '../../hooks/useApi';
import { getAuditoriaRequest } from '../../api/auditoria';

export const useAuditoria = () => {
    const { call, loading, error } = useApi();

    const getAuditoria = (params = {}) => call(() => getAuditoriaRequest(params), 'Error al cargar la auditoría');

    return { getAuditoria, loading, error };
};
