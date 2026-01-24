import { LoginApi } from "./settings";
export const getSummaryRequest = () => LoginApi.get(`/empresa/summary`);
export const getSummaryCobradorRequest = () => LoginApi.get(`/empresa/summary/cobrador`);
export const getById = () => LoginApi.get(`/empresa`);
export const update = (empresa) => LoginApi.put(`/empresa`, empresa);
