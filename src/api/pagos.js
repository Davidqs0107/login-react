import { LoginApi } from "./settings";
export const getPagoCuotaByIdRequest = (id) => LoginApi.get(`/pagos/cuota/${id}`);
export const registerPagoRequest = (pago) => LoginApi.post(`/pagos`, pago);
export const registerPagoMultiRequest = (pago) => LoginApi.post(`/pagos/multiple`, pago);
export const getPagosRequest = (params) => LoginApi.get(`/pagos`, { params });