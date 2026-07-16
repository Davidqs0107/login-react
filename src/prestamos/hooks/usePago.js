import { useApi } from "../../hooks/useApi";
import { getPagoCuotaByIdRequest, registerPagoMultiRequest, registerPagoRequest } from "../../api/pagos";

export const usePago = () => {
    const { call, loading, error } = useApi();

    const createPago = (pago) => call(() => registerPagoRequest(pago));
    const createPagoMulti = (pago) => call(() => registerPagoMultiRequest(pago));
    const getPagosCuotaById = (id) => call(() => getPagoCuotaByIdRequest(id));
    return (
        {
            // metodos
            getPagosCuotaById,
            createPago,
            createPagoMulti,
            // variables
            loading,
            error
        }
    )
}
