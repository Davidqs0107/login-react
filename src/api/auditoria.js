import { LoginApi } from "./settings";

export const getAuditoriaRequest = (params = {}) => LoginApi.get(`/auditoria`, { params });
