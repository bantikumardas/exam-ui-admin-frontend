import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { companyService } from "../services/companyService";

import UserMenu from "../components/AdminDashboard/UserMenu";
import TableWrapper from "../components/AdminDashboard/TableWrapper";
import TH from "../components/AdminDashboard/TH";
import TD from "../components/AdminDashboard/TD";
import CompanyActionMenu from "../components/AdminDashboard/CompanyActionMenu";
import CreateCompanyModal from "../components/AdminDashboard/CreateCompanyModal";
import CompanyKeyCell from "../components/AdminDashboard/CompanyKeyCell";

export default function CompanyDashboard() {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(null);
    companyService
      .getAllCompanies()
      .then((res) => setCompanies(res.data || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [refreshKey]);

  const handleCompanyAction = async (action, company) => {
    if (action === "manage_test") {
      navigate(`/admin/company/${company.id}/dashboard`, {
        state: { company },
      });
    }

    if (action === "activate" || action === "deactivate") {
      try {
        await companyService.changeStatus(
          company.id,
          action === "activate" ? "ACTIVE" : "INACTIVE"
        );
        setRefreshKey((k) => k + 1);
      } catch (err) {
        setError(err.message);
      }
    }
  };

  return (
    <>
    <div className="h-screen overflow-hidden bg-black text-white">
      <div className="flex h-full w-full flex-col overflow-hidden rounded-1xl border border-zinc-700 bg-zinc-900">

        {/* Header */}
        <div className="flex flex-none items-center justify-between border-b border-zinc-700 px-6 py-4">
          <div>
            <h1 className="text-lg font-bold">Companies</h1>
            <p className="text-xs text-zinc-500 mt-0.5">
              Select a company to manage its tests
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowCreateModal(true)}
              className="rounded-xl border border-zinc-700 px-5 py-2.5 text-sm font-semibold transition hover:bg-zinc-800"
            >
              + New Company
            </button>
            <UserMenu />
          </div>
        </div>

        {/* Table */}
        <TableWrapper>
          <thead>
            <tr>
              <TH className="w-[5%]">Sl no.</TH>
              <TH className="w-[21%]">Company Name</TH>
              <TH className="w-[17%]">Email Domain</TH>
              <TH className="w-[17%]">Company Key</TH>
              <TH className="w-[13%]">Status</TH>
              <TH className="w-[13%]">Subscription</TH>
              <TH className="w-[14%]">Action</TH>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan={7} className="px-8 py-10 text-center text-zinc-400">
                  Loading...
                </td>
              </tr>
            )}
            {error && (
              <tr>
                <td colSpan={7} className="px-8 py-10 text-center text-red-400">
                  {error}
                </td>
              </tr>
            )}
            {!loading && !error && companies.length === 0 && (
              <tr>
                <td colSpan={7} className="px-8 py-10 text-center text-zinc-400">
                  No companies found.
                </td>
              </tr>
            )}
            {!loading && !error && companies.map((company, index) => (
              <tr key={company.id} className="border-t border-zinc-700">
                <TD>{index + 1}</TD>
                <TD>
                  <span className="block truncate" title={company.companyName}>
                    {company.companyName}
                  </span>
                </TD>
                <TD>
                  <span className="block truncate" title={company.emailDomain}>
                    {company.emailDomain}
                  </span>
                </TD>
                <TD>
                  <CompanyKeyCell companyKey={company.companyKey} />
                </TD>
                <TD>
                  <span
                    className={`rounded-full px-3 py-1 text-sm font-semibold ${
                      company.active
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {company.active ? "Active" : "Inactive"}
                  </span>
                </TD>
                <TD>
                  <span
                    className={`rounded-full px-3 py-1 text-sm font-semibold ${
                      company.subscriptionActive
                        ? "bg-green-100 text-green-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {company.subscriptionActive ? "Active" : "Inactive"}
                  </span>
                </TD>
                <TD>
                  <CompanyActionMenu company={company} onAction={handleCompanyAction} />
                </TD>
              </tr>
            ))}
          </tbody>
        </TableWrapper>
      </div>
    </div>

    {showCreateModal && (
      <CreateCompanyModal
        onClose={() => setShowCreateModal(false)}
        onCreated={() => setRefreshKey((k) => k + 1)}
      />
    )}
    </>
  );
}
