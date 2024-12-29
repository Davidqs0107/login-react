import { useState } from "react";
import { getSummaryRequest } from "../../api/empresa";

export const useEmpresa = () => {
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
        } finally {
            setLoading(false);
        }
    };
    return (
        {
            //metodos
            getSummary,
            //variables
            loading, error
        }
    )
}
