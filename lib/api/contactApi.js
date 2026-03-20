import { apiGet, apiPut } from "./fetcher";

/** GET /contact  — public */
export const getContact = () => apiGet("/contact", false);

/** PUT /contact  — protected */
export const updateContact = (data) => apiPut("/contact", data, true);
