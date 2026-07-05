import { LoginApi } from "./settings";

// Rutas públicas del portal del cliente (acceso por token)
export const getPortalResumenRequest = (token) => LoginApi.get(`/portal/${token}`);
export const subirComprobanteRequest = (token, data, config = {}) =>
    LoginApi.post(`/portal/${token}/comprobante`, data, config);
