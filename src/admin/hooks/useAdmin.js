import { useState } from "react";
import { getEmpresasAdminRequest, getPlanesRequest, updatePlanesRequest } from "../../api/admin";

export const useAdmin = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getEmpresasAdmin = async (payload) => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await getEmpresasAdminRequest(payload);
            return data;
        } catch (err) {
            setError(err.response?.data?.message || "Error desconocido");
        } finally {
            setLoading(false);
        }
    }
    const getPlanes = async (payload) => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await getPlanesRequest(payload);
            return data;
        } catch (err) {
            setError(err.response?.data?.message || "Error desconocido");
        } finally {
            setLoading(false);
        }
    }

    const updatePlan = async (payload) => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await updatePlanesRequest(payload);
            return data;
        } catch (err) {
            setError(err.response?.data?.message || "Error desconocido");
            checkAuthToken();
        } finally {
            setLoading(false);
        }
    }
    return (
        {
            // metodos
            getEmpresasAdmin,
            getPlanes,
            updatePlan,
            // variables
            loading,
            error
        }
    )
}
