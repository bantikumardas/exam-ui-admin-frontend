import { api } from "./api";

export const testService = {
  getAllTests: (pageNo = 0, pageSize = 10, query = "") => {
    const params = new URLSearchParams({ pageNo, pageSize });
    if (query.trim()) params.set("query", query.trim());
    return api.get(`/tests/all-tests?${params.toString()}`);
  },

  createTest: (testName, totalTimeMinute) =>
    api.post("/tests/create", { testName, totalTimeMinute }),

  getTest: (testId) => api.get(`/tests/${testId}`),

  changeStatus: (testId, targetStatus) =>
    api.post(`/tests/${testId}/change-status?targetStatus=${targetStatus}`),

  sendInvite: (testId, emails) =>
    api.post(`/tests/send/invite/${testId}`, { emails }),
};
