import { useState, useRef, useEffect, useLayoutEffect } from "react";
import { X } from "lucide-react";
import { mcqService } from "../../services/mcqService";

const EMPTY = {
  question: "",
  questionImageUrl: "",
  optionA: "",
  optionB: "",
  optionC: "",
  optionD: "",
  correctOption: "",
  level: "",
  marks: "",
};

function toForm(mcq) {
  if (!mcq) return EMPTY;
  return {
    question: mcq.question ?? "",
    questionImageUrl: mcq.questionImageUrl ?? "",
    optionA: mcq.optionA ?? "",
    optionB: mcq.optionB ?? "",
    optionC: mcq.optionC ?? "",
    optionD: mcq.optionD ?? "",
    correctOption: mcq.correctOption ?? "",
    level: mcq.level ?? "",
    marks: mcq.marks != null ? String(mcq.marks) : "",
  };
}

export default function AddMcqModal({ test, editingMcq, onClose, onAdded }) {
  const [form, setForm] = useState(() => toForm(editingMcq));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const isEditing = Boolean(editingMcq);

  function set(field) {
    return (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const payload = { ...form, testId: test.testId, marks: String(form.marks) };
      if (isEditing) payload.questionId = editingMcq.questionId ?? editingMcq.id;
      await mcqService.addMcq(payload);
      onAdded?.();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full rounded-2xl border border-zinc-600 bg-black px-5 py-3.5 text-white placeholder-zinc-500 outline-none focus:border-zinc-400";

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 py-8"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl rounded-3xl border border-zinc-700 bg-zinc-900 p-10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full border border-white text-white hover:bg-white hover:text-black transition"
        >
          <X size={18} />
        </button>

        {/* Title */}
        <h2 className="mb-8 text-center text-2xl font-bold tracking-wide text-white">
          {isEditing ? "Edit MCQ in" : "Add MCQ to"} the {test.testName}
          <div className="mx-auto mt-2 h-0.5 w-48 bg-white" />
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <CodeTextarea
            placeholder="Write question here… use the buttons above to insert code"
            value={form.question}
            onChange={set("question")}
            required
            rows={3}
          />

          <input
            type="text"
            placeholder="Enter Question Image URL"
            value={form.questionImageUrl}
            onChange={set("questionImageUrl")}
            className={inputClass}
          />

          <CodeTextarea
            placeholder="Enter option A"
            value={form.optionA}
            onChange={set("optionA")}
            required
            rows={2}
          />

          <CodeTextarea
            placeholder="Enter option B"
            value={form.optionB}
            onChange={set("optionB")}
            required
            rows={2}
          />

          <CodeTextarea
            placeholder="Enter option C"
            value={form.optionC}
            onChange={set("optionC")}
            required
            rows={2}
          />

          <CodeTextarea
            placeholder="Enter option D"
            value={form.optionD}
            onChange={set("optionD")}
            required
            rows={2}
          />

          <div className="flex gap-4">
            <select
              value={form.correctOption}
              onChange={set("correctOption")}
              required
              className={`${inputClass} flex-1`}
            >
              <option value="" disabled>Select correct option</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
            </select>

            <select
              value={form.level}
              onChange={set("level")}
              required
              className={`${inputClass} flex-1`}
            >
              <option value="" disabled>Select Level</option>
              <option value="EASY">Easy</option>
              <option value="MEDIUM">Medium</option>
              <option value="HARD">Hard</option>
            </select>
          </div>

          <input
            type="number"
            placeholder="Enter Marks for this question"
            value={form.marks}
            onChange={set("marks")}
            required
            min={1}
            className={inputClass}
          />

          {error && (
            <p className="text-center text-sm text-red-400">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mx-auto mt-2 rounded-2xl border border-white px-16 py-4 text-lg font-semibold text-white transition hover:bg-white hover:text-black disabled:opacity-50"
          >
            {loading
              ? isEditing
                ? "Saving..."
                : "Submitting..."
              : isEditing
              ? "Save Changes"
              : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
}

function CodeTextarea({ placeholder, value, onChange, required, rows = 3 }) {
  const ref = useRef(null);
  const nextCursor = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  }, [value]);

  useLayoutEffect(() => {
    if (nextCursor.current !== null && ref.current) {
      ref.current.selectionStart = ref.current.selectionEnd = nextCursor.current;
      nextCursor.current = null;
    }
  });

  function handleKeyDown(e) {
    if (e.key === "Tab") {
      e.preventDefault();
      const s = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const next = value.slice(0, s) + "  " + value.slice(end);
      nextCursor.current = s + 2;
      onChange({ target: { value: next } });
    }
  }

  function insertWrap(before, after) {
    const el = ref.current;
    if (!el) return;
    const s = el.selectionStart;
    const e = el.selectionEnd;
    const selected = value.slice(s, e);
    const next = value.slice(0, s) + before + selected + after + value.slice(e);
    nextCursor.current = s + before.length + selected.length + after.length;
    onChange({ target: { value: next } });
    el.focus();
  }

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2">
        <span className="text-xs text-zinc-500">Insert:</span>
        <button
          type="button"
          onClick={() => insertWrap("`", "`")}
          title="Wrap selection in inline code"
          className="rounded-lg border border-zinc-700 px-2.5 py-1 text-xs text-zinc-400 hover:bg-zinc-800 hover:text-white transition font-mono"
        >
          `inline`
        </button>
        <button
          type="button"
          onClick={() => insertWrap("```\n", "\n```")}
          title="Wrap selection in a code block"
          className="rounded-lg border border-zinc-700 px-2.5 py-1 text-xs text-zinc-400 hover:bg-zinc-800 hover:text-white transition font-mono"
        >
          ```block```
        </button>
        <span className="text-xs text-zinc-600 ml-auto">Tab = 2 spaces</span>
      </div>
      <textarea
        ref={ref}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        rows={rows}
        onKeyDown={handleKeyDown}
        className="w-full rounded-2xl border border-zinc-600 bg-zinc-800 px-5 py-3.5 text-white placeholder-zinc-500 outline-none focus:border-zinc-400 resize-none font-mono text-sm leading-relaxed"
        style={{ minHeight: `${rows * 1.75}rem` }}
      />
    </div>
  );
}
