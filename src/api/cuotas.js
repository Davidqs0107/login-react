import { LoginApi } from "./settings";
export const getCuotaByIdRequest = (id) => LoginApi.get(`/cuota/${id}`);
