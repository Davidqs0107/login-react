import { useApi } from '../../hooks/useApi';
import { getCuotaByIdRequest } from '../../api/cuotas';

export const useCuota = () => {
    const { call } = useApi();

    const getCuotaById = (id, mostrarCuotas) => call(() => getCuotaByIdRequest(id, mostrarCuotas));
    return (
        {
            // metodos
            // variables
        }
    )
}
