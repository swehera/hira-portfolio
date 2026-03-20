import { apiGet, apiPut } from "./fetcher";

/** GET /about  — public */
export const getAbout = () => apiGet("/about", false);

/** PUT /about  — protected */
export const updateAbout = (data) => apiPut("/about", data, true);
