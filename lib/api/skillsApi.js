import { apiGet, apiPost, apiPut, apiDelete } from "./fetcher";

/** GET /skills  — public */
export const getSkills = () => apiGet("/skills", false);

/** GET /skills/:id  — public */
export const getSkillById = (id) => apiGet(`/skills/${id}`, false);

/** POST /skills  — protected */
export const createSkill = (data) => apiPost("/skills", data, true);

/** PUT /skills/:id  — protected */
export const updateSkill = (id, data) => apiPut(`/skills/${id}`, data, true);

/** DELETE /skills/:id  — protected */
export const deleteSkill = (id) => apiDelete(`/skills/${id}`, true);
