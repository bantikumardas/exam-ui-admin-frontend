import { apiHost } from "./api";

export const mcqService = {
  addMcq: (payload) => apiHost.post("/question/one/mcq", payload),
};
