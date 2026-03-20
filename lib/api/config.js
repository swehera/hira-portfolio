/**
 * Central API configuration.
 * All fetch calls go through this base URL.
 */
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://hira-portfolio-api.onrender.com/api";

/**
 * Default headers for every request.
 */
export const defaultHeaders = () => ({
  "Content-Type": "application/json",
});

/**
 * Auth headers — attaches JWT token from sessionStorage.
 * Safe to call on server (returns empty if no window).
 */
export const authHeaders = () => {
  if (typeof window === "undefined") return defaultHeaders();
  const token = sessionStorage.getItem("admin_token");
  return {
    ...defaultHeaders(),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};
