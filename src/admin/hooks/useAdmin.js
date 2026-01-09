import { useState } from "react";
import { getEmpresasAdminRequest, getEmpresasByNameRequest, getPlanesRequest, getUsuariosEmpresaRequest, limpiarDatosEmpresaRequest, updatePlanesRequest } from "../../api/admin";
import { registerRequest } from "../../api/auth";

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
    const getEmpresasByName = async (payload) => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await getEmpresasByNameRequest(payload);
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

    const createEmpresa = async (payload) => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await registerRequest(payload);
            return data;
        } catch (err) {
            console.log(err)
            setError(err.response?.data?.message || err.response?.data?.msg);
        } finally {
            setLoading(false);
        }
    }

    const limpiarDatosEmpresa = async (empresa_id) => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await limpiarDatosEmpresaRequest(empresa_id);
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
            getEmpresasByName,
            getUsuariosEmpresa,
            getPlanes,
            updatePlan,
            createEmpresa,
            limpiarDatosEmpresa,
            // variables
            loading,
            error
        }
    )
}
