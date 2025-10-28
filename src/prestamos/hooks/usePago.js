import { useState } from "react";
import { getPagoCuotaByIdRequest, registerPagoMultiRequest, registerPagoRequest } from "../../api/pagos";

export const usePago = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const createPago = async (pago) => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await registerPagoRequest(pago);
            return data;
        } catch (err) {
            setError(err.response?.data?.message || "Error desconocido");
        } finally {
            setLoading(false);
        }
    }
    const createPagoMulti = async (pago) => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await registerPagoMultiRequest(pago);
            return data;
        } catch (err) {
            setError(err.response?.data?.message || "Error desconocido");
        } finally {
            setLoading(false);
        }
    }
    const getPagosCuotaById = async (id) => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await getPagoCuotaByIdRequest(id);
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
            getPagosCuotaById,
            createPago,
            createPagoMulti,
            // variables
            loading,
            error
        }
    )
}
