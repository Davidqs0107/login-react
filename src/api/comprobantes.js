import { LoginApi } from "./settings";

export const getComprobantesRequest = (params = {}) => LoginApi.get(`/comprobantes`, { params });
export const validarComprobanteRequest = (id, estado) => LoginApi.put(`/comprobantes/${id}/validar`, { estado });
