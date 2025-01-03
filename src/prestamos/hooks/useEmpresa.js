import { useState } from "react";
import { getSummaryCobradorRequest, getSummaryRequest } from "../../api/empresa";
import { useAuth } from "../../context/AuthContex";

export const useEmpresa = () => {
    const { checkAuthToken } = useAuth();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const getSummary = async () => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await getSummaryRequest();
            return data;
        } catch (err) {
            setError(err.response?.data?.message || "Error desconocido");
            checkAuthToken();
        } finally {
            setLoading(false);
        }
    };
    const getSummaryCobrador = async () => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await getSummaryCobradorRequest();
            return data;
        } catch (err) {
            setError(err.response?.data?.message || "Error desconocido");
            checkAuthToken();
        } finally {
            setLoading(false);
        }
    };
    return (
        {
            //metodos
            getSummary,
            getSummaryCobrador,
            //variables
            loading, error
        }
    )
}
