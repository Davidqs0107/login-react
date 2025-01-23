import { useState } from "react";
import { getEmpresasAdminRequest, getPlanesRequest, getUsuariosEmpresaRequest, updatePlanesRequest } from "../../api/admin";

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
    const getUsuariosEmpresa = async (payload) => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await getUsuariosEmpresaRequest(payload);
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
        } finally {
            setLoading(false);
        }
    }
    return (
        {
            // metodos
            getEmpresasAdmin,
            getUsuariosEmpresa,
            getPlanes,
            updatePlan,
            // variables
            loading,
            error
        }
    )
}
