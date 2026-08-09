import { api } from "./api";

export const testService = {
  getAllTests: (pageNo = 0, pageSize = 10, query = "", companyId = "") => {
    const params = new URLSearchParams({ pageNo, pageSize });
    if (query.trim()) params.set("query", query.trim());
    if (companyId) params.set("companyId", companyId);
    return api.get(`/tests/all-tests?${params.toString()}`);
  },

  createTest: (testName, totalTimeMinute, companyId = "") => {
    const payload = { testName, totalTimeMinute };
    if (companyId) payload.companyId = companyId;
    return api.post("/tests/create", payload);
  },

  getTest: (testId) => api.get(`/tests/${testId}`),

  changeStatus: (testId, targetStatus) =>
    api.post(`/tests/${testId}/change-status?targetStatus=${targetStatus}`),

  sendInvite: (testId, emails) =>
    api.post(`/tests/send/invite/${testId}`, { emails }),
};
