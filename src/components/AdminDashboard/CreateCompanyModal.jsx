import { useState } from "react";
import { X } from "lucide-react";
import { companyService } from "../../services/companyService";

const EMPTY = {
  companyName: "",
  emailDomain: "",
  phoneNumber: "",
  email: "",
  logoUrl: "",
};

export default function CreateCompanyModal({ onClose, onCreated }) {
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  function set(field) {
    return (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const payload = {
        companyName: form.companyName.trim(),
        emailDomain: form.emailDomain.trim(),
        phoneNumber: form.phoneNumber.trim(),
        email: form.email.trim(),
        logoUrl: form.logoUrl.trim(),
      };
      await companyService.createCompany(payload);
      onCreated();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full rounded-2xl border border-zinc-600 bg-zinc-800 px-6 py-4 text-white placeholder-zinc-500 outline-none focus:border-zinc-400";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-3xl border border-zinc-700 bg-zinc-900 p-10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-6 top-6 text-white hover:text-zinc-400 transition"
        >
          <X size={22} />
        </button>

        {/* Title */}
        <h2 className="mb-8 text-center text-2xl font-bold tracking-wide text-white">
          Create Company
          <div className="mx-auto mt-2 h-0.5 w-32 bg-white" />
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <input
            type="text"
            placeholder="Enter company name"
            value={form.companyName}
            onChange={set("companyName")}
            required
            className={inputClass}
          />

          <input
            type="text"
            placeholder="Enter email domain (e.g. company.com)"
            value={form.emailDomain}
            onChange={set("emailDomain")}
            required
            className={inputClass}
          />

          <input
            type="email"
            placeholder="Enter contact email"
            value={form.email}
            onChange={set("email")}
            required
            className={inputClass}
          />

          <input
            type="tel"
            placeholder="Enter phone number"
            value={form.phoneNumber}
            onChange={set("phoneNumber")}
            required
            className={inputClass}
          />

          <input
            type="text"
            placeholder="Enter logo URL (optional)"
            value={form.logoUrl}
            onChange={set("logoUrl")}
            className={inputClass}
          />

          {error && (
            <p className="text-center text-sm text-red-400">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mx-auto mt-2 text-white rounded-2xl border border-white px-16 py-4 text-lg font-semibold transition hover:bg-white hover:text-black disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create"}
          </button>
        </form>
      </div>
    </div>
  );
}
