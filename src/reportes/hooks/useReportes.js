import { useApi } from '../../hooks/useApi';
import {
    getMoraDetalladaRequest,
    getCarteraPorEstadoRequest,
    getCobrosPorCobradorRequest,
    getAgendaCobroRequest,
    getRecaudacionMensualRequest,
    getFichaClienteRequest,
    getPrestamosPorClienteRequest
} from '../../api/reportes';

export const useReportes = () => {
    const { call, loading, error } = useApi();

    const getMoraDetallada = (params = {}) => call(() => getMoraDetalladaRequest(params), "Error al cargar mora detallada");
    const getCarteraPorEstado = () => call(() => getCarteraPorEstadoRequest(), "Error al cargar cartera por estado");
    const getCobrosPorCobrador = (params = {}) => call(() => getCobrosPorCobradorRequest(params), "Error al cargar cobros por cobrador");
    const getAgendaCobro = (params = {}) => call(() => getAgendaCobroRequest(params), "Error al cargar agenda de cobro");
    const getRecaudacionMensual = (params = {}) => call(() => getRecaudacionMensualRequest(params), "Error al cargar recaudación mensual");
    const getFichaCliente = (clienteId) => call(() => getFichaClienteRequest(clienteId), "Error al cargar ficha del cliente");
    const getPrestamosPorCliente = (params = {}) => call(() => getPrestamosPorClienteRequest(params), "Error al cargar préstamos por cliente");

    return {
        // Métodos
        getMoraDetallada,
        getCarteraPorEstado,
        getCobrosPorCobrador,
        getAgendaCobro,
        getRecaudacionMensual,
        getFichaCliente,
        getPrestamosPorCliente,
        // Estados
        loading,
        error
    };
};
