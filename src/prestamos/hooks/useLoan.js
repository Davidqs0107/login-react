import { useState } from "react";
import { getLoanByIdRequest, getLoansRequest, registerLoanRequest, updateLoanRequest } from "../../api/prestamos";

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
    const updateLoan = async (id, loan) => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await updateLoanRequest(id, loan);
            return data;
        } catch (err) {
            setError(err.response?.data?.message || "Error desconocido");
        } finally {
            setLoading(false);
        }
    };
    const getLoans = async (payload) => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await getLoansRequest(payload);
            return data;
        } catch (err) {
            setError(err.response?.data?.message || "Error desconocido");
        } finally {
            setLoading(false);
        }
    }
    return {
        // metodos
        createLoan,
        getLoans,
        getLoanById,
        updateLoan,
        // variables
        error,
        loading
    }
}
