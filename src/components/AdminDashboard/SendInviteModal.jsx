import { useState } from "react";
import { X, Mail } from "lucide-react";
import { testService } from "../../services/testService";

export default function SendInviteModal({ test, onClose }) {
  const [emails, setEmails] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    const cleaned = emails
      .split(",")
      .map((email) => email.trim())
      .filter(Boolean)
      .join(",");
    if (!cleaned) return;

    setLoading(true);
    setError(null);
    try {
      await testService.sendInvite(test.testId, cleaned);
      setSent(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-3xl border border-zinc-700 bg-zinc-900 p-10"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-6 top-6 text-white hover:text-zinc-400 transition"
        >
          <X size={22} />
        </button>

        <h2 className="mb-2 text-center text-2xl font-bold tracking-wide text-white">
          Send Invitation
          <div className="mx-auto mt-2 h-0.5 w-32 bg-white" />
        </h2>
        <p className="mb-8 text-center text-sm text-zinc-400">{test.testName}</p>

        {sent ? (
          <div className="flex flex-col items-center gap-6 py-4">
            <p className="text-center font-semibold text-green-400">
              Invitations sent successfully.
            </p>
            <button
              onClick={onClose}
              className="rounded-2xl border border-white px-16 py-4 text-lg font-semibold text-white transition hover:bg-white hover:text-black"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <textarea
              placeholder="Enter user emails, separated by commas"
              value={emails}
              onChange={(e) => setEmails(e.target.value)}
              required
              rows={3}
              className="w-full resize-none rounded-2xl border border-zinc-600 bg-zinc-800 px-6 py-4 text-white placeholder-zinc-500 outline-none focus:border-zinc-400"
            />

            {error && (
              <p className="text-center text-sm text-red-400">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mx-auto mt-2 flex items-center gap-2 rounded-2xl border border-white px-16 py-4 text-lg font-semibold text-white transition hover:bg-white hover:text-black disabled:opacity-50"
            >
              <Mail size={18} />
              {loading ? "Sending..." : "Send"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
