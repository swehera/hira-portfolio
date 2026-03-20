import { apiGet, apiPost, apiPut, apiDelete } from "./fetcher";

/** GET /projects?featured=true  — public */
export const getProjects = (featuredOnly = false) =>
  apiGet(`/projects${featuredOnly ? "?featured=true" : ""}`, false);

/** GET /projects/:id  — public */
export const getProjectById = (id) => apiGet(`/projects/${id}`, false);

/** POST /projects  — protected */
export const createProject = (data) => apiPost("/projects", data, true);

/** PUT /projects/:id  — protected */
export const updateProject = (id, data) => apiPut(`/projects/${id}`, data, true);

/** DELETE /projects/:id  — protected */
export const deleteProject = (id) => apiDelete(`/projects/${id}`, true);
