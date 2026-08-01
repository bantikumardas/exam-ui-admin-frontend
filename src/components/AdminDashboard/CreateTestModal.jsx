import { useState } from "react";
import { X } from "lucide-react";
import { testService } from "../../services/testService";

export default function CreateTestModal({ onClose, onCreated }) {
  const [testName, setTestName] = useState("");
  const [totalTimeMinute, setTotalTimeMinute] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!testName.trim() || !totalTimeMinute) return;
    setLoading(true);
    setError(null);
    try {
      await testService.createTest(testName.trim(), Number(totalTimeMinute));
      onCreated();
      onClose();
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
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-6 top-6 text-white hover:text-zinc-400 transition"
        >
          <X size={22} />
        </button>

        {/* Title */}
        <h2 className="mb-8 text-center text-2xl font-bold tracking-wide text-white">
          Create Test
          <div className="mx-auto mt-2 h-0.5 w-32 bg-white" />
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <input
            type="text"
            placeholder="Enter Test name"
            value={testName}
            onChange={(e) => setTestName(e.target.value)}
            required
            className="w-full rounded-2xl border border-zinc-600 bg-zinc-800 px-6 py-4 text-white placeholder-zinc-500 outline-none focus:border-zinc-400"
          />

          <input
            type="number"
            placeholder="Enter test time in minutes"
            value={totalTimeMinute}
            onChange={(e) => setTotalTimeMinute(e.target.value)}
            required
            min={1}
            className="w-full rounded-2xl border border-zinc-600 bg-zinc-800 px-6 py-4 text-white placeholder-zinc-500 outline-none focus:border-zinc-400"
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
