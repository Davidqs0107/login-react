import { useState } from 'react';
import { getAuditoriaRequest } from '../../api/auditoria';

export const useAuditoria = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getAuditoria = async (params = {}) => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await getAuditoriaRequest(params);
            return data;
        } catch (err) {
            setError(err.response?.data?.msg || 'Error al cargar la auditoría');
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { getAuditoria, loading, error };
};
