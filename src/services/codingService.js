import { apiHost } from "./api";

export const codingService = {
  addCodingQuestion: (payload) => apiHost.post("/question/one/coding", payload),
};
