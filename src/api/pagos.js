import { LoginApi } from "./settings";
export const getPagoCuotaByIdRequest = (id) => LoginApi.get(`/pagos/cuota/${id}`);
export const registerPagoRequest = (pago) => LoginApi.post(`/pagos`, pago);