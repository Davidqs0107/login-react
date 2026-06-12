import { LoginApi } from "./settings";
export const getCuotaByIdRequest = (id) => LoginApi.get(`/cuotas/${id}`);
export const getCuotasByClienteRequest = (clienteId, estado) => LoginApi.get(`/cuotas/cliente/${clienteId}`, estado ? { params: { estado } } : {});
