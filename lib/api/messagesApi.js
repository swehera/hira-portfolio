import { apiGet, apiPost, apiPatch, apiDelete } from "./fetcher";

/** POST /messages  — public (contact form) */
export const sendMessage = (data) => apiPost("/messages", data, false);

/** GET /messages?filter=all|unread|starred  — protected */
export const getMessages = (filter = "all") =>
  apiGet(`/messages?filter=${filter}`, true);

/** GET /messages/stats  — protected */
export const getMessageStats = () => apiGet("/messages/stats", true);

/** GET /messages/:id  — protected */
export const getMessageById = (id) => apiGet(`/messages/${id}`, true);

/** PATCH /messages/:id/read  — protected */
export const markMessageRead = (id, is_read = true) =>
  apiPatch(`/messages/${id}/read`, { is_read }, true);

/** PATCH /messages/:id/star  — protected */
export const markMessageStarred = (id, is_starred) =>
  apiPatch(`/messages/${id}/star`, { is_starred }, true);

/** PATCH /messages/mark-all-read  — protected */
export const markAllMessagesRead = () =>
  apiPatch("/messages/mark-all-read", {}, true);

/** DELETE /messages/:id  — protected */
export const deleteMessage = (id) => apiDelete(`/messages/${id}`, true);
