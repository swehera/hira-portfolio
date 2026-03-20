import { apiPost, apiGet, apiPut } from "./fetcher";

/**
 * POST /auth/login
 * Returns { token, admin }
 */
export const loginAdmin = (username, password) =>
  apiPost("/auth/login", { username, password }, false);

/**
 * GET /auth/me  (protected)
 */
export const getMe = () => apiGet("/auth/me", true);

/**
 * PUT /auth/change-password  (protected)
 */
export const changePassword = (currentPassword, newPassword) =>
  apiPut("/auth/change-password", { currentPassword, newPassword }, true);
