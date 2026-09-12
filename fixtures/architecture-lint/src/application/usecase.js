import { UserId } from "../domain/model.js";
export const loadUser = (id) => ({ id: UserId(id) });
