import { useState } from 'react';
import { getCuotaByIdRequest, getCuotasByClienteRequest } from '../../api/cuotas';
import { searchClientesRequest } from '../../api/clientes';
import { getPagosRequest } from '../../api/pagos';

export const usePagosPage = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [results, setResults] = useState([]);
    const [resultType, setResultType] = useState(null);
    const [clienteResults, setClienteResults] = useState([]);
    const [meta, setMeta] = useState({ page: 1, pageSize: 10, totalPages: 1 });

    const searchByCliente = async (query) => {
        if (query.length < 2) {
            setClienteResults([]);
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const { data } = await searchClientesRequest(query);
            setClienteResults(data.clientes || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const searchCuotasByCliente = async (clienteId) => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await getCuotasByClienteRequest(clienteId);
            setResults(data.cuotas || []);
            setResultType('cliente');
            return data;
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const searchByCuotaId = async (cuotaId) => {
        if (!cuotaId) return;
        setLoading(true);
        setError(null);
        try {
            const { data } = await getCuotaByIdRequest(cuotaId);
            setResults(data.cuota ? [data.cuota] : []);
            setResultType('cuota');
            return data;
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const searchByFecha = async (fecha_inicio, fecha_fin, page = 1, pageSize = 10) => {
        if (!fecha_inicio || !fecha_fin) return;
        setLoading(true);
        setError(null);
        try {
            const { data } = await getPagosRequest({ fecha_inicio, fecha_fin, page, pageSize });
            setResults(data.pagos || []);
            setResultType('pagos');
            if (data.meta) setMeta(data.meta);
            return data;
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const clearResults = () => {
        setResults([]);
        setResultType(null);
        setClienteResults([]);
    };

    return {
        loading,
        error,
        results,
        resultType,
        clienteResults,
        meta,
        searchByCliente,
        searchCuotasByCliente,
        searchByCuotaId,
        searchByFecha,
        clearResults
    };
};