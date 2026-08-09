import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, Phone, Globe } from "lucide-react";
import { userService } from "../services/userService";
import CompanyKeyCell from "../components/AdminDashboard/CompanyKeyCell";

export default function ProfilePage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    userService
      .getProfile()
      .then((res) => setProfile(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const company = profile?.company;

  return (
    <div className="h-screen overflow-hidden bg-black text-white">
      <div className="flex h-full w-full flex-col overflow-hidden rounded-1xl border border-zinc-700 bg-zinc-900">

        {/* Header */}
        <div className="flex flex-none items-center gap-4 border-b border-zinc-700 px-6 py-4">
          <button
            onClick={() => navigate(-1)}
            className="rounded-2xl border border-zinc-700 p-2.5 hover:bg-zinc-800 transition"
          >
            <ArrowLeft size={18} />
          </button>
          <h1 className="text-lg font-bold">Profile</h1>
        </div>

        {/* Content */}
        <div className="flex-1 min-h-0 overflow-y-auto p-8">
          {loading && <p className="text-center text-zinc-400">Loading...</p>}
          {error && <p className="text-center text-red-400">{error}</p>}

          {!loading && !error && profile && (
            <div className="mx-auto flex max-w-2xl flex-col gap-6">

              {/* Account card */}
              <div className="rounded-3xl border border-zinc-700 bg-zinc-800/40 p-8">
                <div className="flex items-center gap-5">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-violet-100 text-2xl font-bold text-violet-700">
                    {profile.name?.charAt(0)?.toUpperCase() || "?"}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">{profile.name}</h2>
                    <span className="mt-1 inline-block rounded-full border border-zinc-600 bg-zinc-800 px-3 py-1 text-xs font-semibold text-zinc-300">
                      {profile.role}
                    </span>
                  </div>
                </div>

                <div className="mt-6 flex items-center gap-2 text-sm text-zinc-400">
                  <Mail size={15} />
                  {profile.email}
                </div>
              </div>

              {/* Company card */}
              {company && (
                <div className="rounded-3xl border border-zinc-700 bg-zinc-800/40 p-8">
                  <div className="flex items-center gap-4">
                    {company.logoUrl && (
                      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-white/5">
                        <img
                          src={company.logoUrl}
                          alt={`${company.companyName} logo`}
                          className="h-full w-full object-contain"
                          onError={(e) => { e.currentTarget.style.display = "none"; }}
                        />
                      </div>
                    )}
                    <div>
                      <h3 className="text-lg font-bold">{company.companyName}</h3>
                      <div className="mt-1 flex flex-wrap gap-2">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            company.active
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-200 text-gray-700"
                          }`}
                        >
                          {company.active ? "Active" : "Inactive"}
                        </span>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            company.subscriptionActive
                              ? "bg-green-100 text-green-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          Subscription {company.subscriptionActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <div className="flex items-center gap-2 text-sm text-zinc-400">
                      <Globe size={15} />
                      {company.emailDomain}
                    </div>
                    {company.phoneNumber && (
                      <div className="flex items-center gap-2 text-sm text-zinc-400">
                        <Phone size={15} />
                        {company.phoneNumber}
                      </div>
                    )}
                  </div>

                  <div className="mt-6 flex flex-col gap-2">
                    <span className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
                      Company Key
                    </span>
                    <CompanyKeyCell companyKey={company.companyKey} />
                  </div>

                  {company.maxActiveTests != null && (
                    <p className="mt-6 text-sm text-zinc-400">
                      Max active tests:{" "}
                      <span className="font-semibold text-white">{company.maxActiveTests}</span>
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
