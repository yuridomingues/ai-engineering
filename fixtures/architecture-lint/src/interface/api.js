import { loadUser } from "../application/usecase.js";
export const handle = (id) => loadUser(id);
