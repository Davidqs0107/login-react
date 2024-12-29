import { LoginApi } from "./settings";
export const getSummaryRequest = () => LoginApi.get(`/empresa/summary`);