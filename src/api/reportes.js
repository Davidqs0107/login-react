import { LoginApi } from "./settings";

// 1. Mora Detallada - admin, super_admin
export const getMoraDetalladaRequest = (params = {}) => {
    const { page = 1, pageSize = 50, dias_mora_min, cobrador_id } = params;
    const queryParams = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
    });

    if (dias_mora_min) queryParams.append('dias_mora_min', dias_mora_min.toString());
    if (cobrador_id) queryParams.append('cobrador_id', cobrador_id.toString());

    return LoginApi.get(`/reportes/mora?${queryParams.toString()}`);
};

// 2. Cartera por Estado - admin, super_admin
export const getCarteraPorEstadoRequest = () =>
    LoginApi.get('/reportes/cartera');

// 3. Cobros por Cobrador - admin, super_admin
export const getCobrosPorCobradorRequest = (params = {}) => {
    const { fecha_inicio, fecha_fin } = params;
    const queryParams = new URLSearchParams();

    if (fecha_inicio) queryParams.append('fecha_inicio', fecha_inicio);
    if (fecha_fin) queryParams.append('fecha_fin', fecha_fin);

    const query = queryParams.toString();
    return LoginApi.get(`/reportes/cobros${query ? '?' + query : ''}`);
};

// 4. Agenda de Cobro - admin, super_admin, cobrador
export const getAgendaCobroRequest = (params = {}) => {
    const { dias = 7, cobrador_id, page = 1, pageSize = 50 } = params;
    const queryParams = new URLSearchParams({
        dias: dias.toString(),
        page: page.toString(),
        pageSize: pageSize.toString(),
    });

    if (cobrador_id) queryParams.append('cobrador_id', cobrador_id.toString());

    return LoginApi.get(`/reportes/agenda?${queryParams.toString()}`);
};

// 5. Recaudación Mensual - admin, super_admin
export const getRecaudacionMensualRequest = (params = {}) => {
    const { fecha_inicio, fecha_fin } = params;
    const queryParams = new URLSearchParams();

    if (fecha_inicio) queryParams.append('fecha_inicio', fecha_inicio);
    if (fecha_fin) queryParams.append('fecha_fin', fecha_fin);

    const query = queryParams.toString();
    return LoginApi.get(`/reportes/recaudacion${query ? '?' + query : ''}`);
};

// 6. Ficha del Cliente - admin, super_admin
export const getFichaClienteRequest = (clienteId) =>
    LoginApi.get(`/reportes/cliente/${clienteId}`);

// 7. Préstamos por Cliente - admin, super_admin
export const getPrestamosPorClienteRequest = (params = {}) => {
    const { searchTerm, estado_prestamo, fecha_inicio, fecha_fin, page = 1, pageSize = 20 } = params;
    const queryParams = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
    });

    if (searchTerm) queryParams.append('searchTerm', searchTerm);
    if (estado_prestamo) queryParams.append('estado_prestamo', estado_prestamo);
    if (fecha_inicio) queryParams.append('fecha_inicio', fecha_inicio);
    if (fecha_fin) queryParams.append('fecha_fin', fecha_fin);

    return LoginApi.get(`/reportes/prestamos?${queryParams.toString()}`);
};
