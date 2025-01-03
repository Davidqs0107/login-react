import { LoginApi } from "./settings";
export const getSummaryRequest = () => LoginApi.get(`/empresa/summary`);
export const getSummaryCobradorRequest = () => LoginApi.get(`/empresa/summary/cobrador`);
