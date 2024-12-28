import { useState } from "react";
import { getLoanByIdRequest, registerLoanRequest } from "../../api/prestamos";

export const useLoan = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const createLoan = async (loan) => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await registerLoanRequest(loan);
            return data;
        } catch (err) {
            setError(err.response?.data?.message || "Error desconocido");
        } finally {
            setLoading(false);
        }
    };
    const getLoanById = async (id, mostrarCuotas) => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await getLoanByIdRequest(id, mostrarCuotas);
            return data;
        } catch (err) {
            setError(err.response?.data?.message || "Error desconocido");
        } finally {
            setLoading(false);
        }
    };
    return {
        // metodos
        createLoan,
        getLoanById,
        // variables
        error,
        loading
    }
}
