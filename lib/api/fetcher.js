import { API_BASE_URL, defaultHeaders, authHeaders } from "./config";

/**
 * Core fetch wrapper.
 * - cache: "no-store"  → no Next.js caching
 * - _t on GET requests → busts browser/CDN cache
 */
export async function apiFetch(endpoint, options = {}, auth = false) {
  const method = options.method || "GET";

  // Only add cache-busting timestamp on GET requests
  let url = `${API_BASE_URL}${endpoint}`;
  if (method === "GET") {
    const separator = endpoint.includes("?") ? "&" : "?";
    url = `${url}${separator}_t=${Date.now()}`;
  }

  const headers = auth ? authHeaders() : defaultHeaders();

  const config = {
    ...options,
    cache: "no-store",
    headers: {
      ...headers,
      ...options.headers,
    },
  };

  try {
    const res = await fetch(url, config);
    const json = await res.json();

    if (!res.ok) {
      throw new Error(json?.message || `Request failed with status ${res.status}`);
    }

    return json;
  } catch (err) {
    throw new Error(err.message || "Network error. Please try again.");
  }
}

// ── Convenience methods ───────────────────────────────────────────────────

export const apiGet = (endpoint, auth = false) =>
  apiFetch(endpoint, { method: "GET" }, auth);

export const apiPost = (endpoint, body, auth = false) =>
  apiFetch(endpoint, { method: "POST", body: JSON.stringify(body) }, auth);

export const apiPut = (endpoint, body, auth = true) =>
  apiFetch(endpoint, { method: "PUT", body: JSON.stringify(body) }, auth);

export const apiPatch = (endpoint, body, auth = true) =>
  apiFetch(endpoint, { method: "PATCH", body: JSON.stringify(body) }, auth);

export const apiDelete = (endpoint, auth = true) =>
  apiFetch(endpoint, { method: "DELETE" }, auth);
