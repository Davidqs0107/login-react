import React from 'react'
import { getCuotaByIdRequest } from '../../api/cuotas';

export const useCuota = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getCuotaById = async (id, mostrarCuotas) => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await getCuotaByIdRequest(id, mostrarCuotas);
            return data;
        } catch (err) {
            setError(err.response?.data?.message || "Error desconocido");
        } finally {
            setLoading(false);
        }
    };
    return (
        {
            // metodos
            // variables
        }
    )
}
