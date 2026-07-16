import { LoginApi } from "./settings";

export const getGlobalMetricsRequest = () => LoginApi.get('/admin/metrics/global');
export const getCrecimientoEmpresasRequest = () => LoginApi.get('/admin/metrics/crecimiento-empresas');
export const getDistribucionPlanesRequest = () => LoginApi.get('/admin/metrics/distribucion-planes');
export const getEmpresasRecientesRequest = (limit = 10) => LoginApi.get(`/admin/metrics/empresas-recientes?limit=${limit}`);
export const getSuscripcionesCriticasRequest = (limit = 10) => LoginApi.get(`/admin/metrics/suscripciones-criticas?limit=${limit}`);
