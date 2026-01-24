import { useState } from "react";
import { getSummaryCobradorRequest, getSummaryRequest, getById, update } from "../../api/empresa";
import { useAuth } from "../../context/AuthContex";

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
    const getSummaryCobrador = async () => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await getSummaryCobradorRequest();
            return data;
        } catch (err) {
            setError(err.response?.data?.message || "Error desconocido");
        } finally {
            setLoading(false);
        }
    };
    const getEmpresa = async () => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await getById();
            return data;
        } catch (err) {
            setError(err.response?.data?.message || "Error al obtener la empresa");
        } finally {
            setLoading(false);
        }
    };
    const updateEmpresa = async (empresa) => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await update(empresa);
            return data;
        } catch (err) {
            setError(err.response?.data?.message || "Error al actualizar la empresa");
        } finally {
            setLoading(false);
        }
    };
    return (
        {
            //metodos
            getSummary,
            getSummaryCobrador,
            getEmpresa,
            updateEmpresa,
            //variables
            loading, error
        }
    )
}
