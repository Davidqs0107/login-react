import { useState } from "react";
import { aprobarDescargoRequest, createDescargoRequest, getDescargosByUserRequest, getDescargosRequest } from "../../api/descargos";

export const useDescargos = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getDescargos = async (payload) => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await getDescargosRequest(payload);
            return data;
        } catch (err) {
            setError(err.response?.data?.message || "Error desconocido");
        } finally {
            setLoading(false);
        }
    }

    const getDescargosByUser = async (payload) => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await getDescargosByUserRequest(payload);
            return data;
        } catch (err) {
            setError(err.response?.data?.message || "Error desconocido");
        } finally {
            setLoading(false);
        }
    }

    const createDescargo = async (descargo) => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await createDescargoRequest(descargo);
            return data;
        } catch (err) {
            setError(err.response?.data?.message || "Error desconocido");
        } finally {
            setLoading(false);
        }
    };

    const aprobarDescargo = async (descargo) => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await aprobarDescargoRequest(descargo);
            return data;
        } catch (err) {
            setError(err.response?.data?.message || "Error desconocido");
        } finally {
            setLoading(false);
        }
    };
    return {
        //metodos
        getDescargos,
        getDescargosByUser,
        createDescargo,
        aprobarDescargo,
        //variables
        loading,
        error,
    }
}
