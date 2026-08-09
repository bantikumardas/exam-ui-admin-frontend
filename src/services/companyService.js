import { api } from "./api";

export const companyService = {
  getAllCompanies: () => api.get("/company/fetch/all"),

  createCompany: (payload) => api.post("/company/create", payload),

  // TODO: backend endpoint for this is not ready yet.
  changeStatus: (companyId, targetStatus) =>
    api.post(`/company/${companyId}/change-status?targetStatus=${targetStatus}`),
};
