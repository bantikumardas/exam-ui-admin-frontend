import { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Plus, Trash2, X } from "lucide-react";
import { codingService } from "../services/codingService";

const EMPTY_TEST_CASE = {
  input: "",
  expectedOutput: "",
  explanation: "",
  isHidden: false,
  isExample: true,
};

export default function CreateCodingQuestion() {
  const { testId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const testName = location.state?.testName ?? "";
  const editingQuestion = location.state?.editingQuestion ?? null;
  const isEditing = Boolean(editingQuestion);

  const [title, setTitle] = useState(editingQuestion?.title ?? "");
  const [description, setDescription] = useState(editingQuestion?.description ?? "");
  const [paragraphs, setParagraphs] = useState(
    editingQuestion?.paragraphs?.length ? editingQuestion.paragraphs : [""]
  );
  const [constraints, setConstraints] = useState(
    editingQuestion?.constraints?.length ? editingQuestion.constraints : [""]
  );
  const [difficulty, setDifficulty] = useState(editingQuestion?.difficulty ?? "");
  const [marks, setMarks] = useState(
    editingQuestion?.marks != null ? String(editingQuestion.marks) : ""
  );
  const [testCases, setTestCases] = useState(
    editingQuestion?.testCases?.length
      ? editingQuestion.testCases
      : [{ ...EMPTY_TEST_CASE }]
  );

  const [loading, setLoading] = useState(false);
  const [errorPopup, setErrorPopup] = useState(null);

  function updateList(setter, index, value) {
    setter((prev) => prev.map((item, i) => (i === index ? value : item)));
  }
  function addToList(setter) {
    setter((prev) => [...prev, ""]);
  }
  function removeFromList(setter, index) {
    setter((prev) => prev.filter((_, i) => i !== index));
  }

  function updateTestCase(index, field, value) {
    setTestCases((prev) =>
      prev.map((tc, i) => (i === index ? { ...tc, [field]: value } : tc))
    );
  }
  function addTestCase() {
    setTestCases((prev) => [...prev, { ...EMPTY_TEST_CASE }]);
  }
  function removeTestCase(index) {
    setTestCases((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setErrorPopup(null);
    try {
      const payload = {
        testId,
        title,
        description,
        paragraphs: paragraphs.filter((p) => p.trim()),
        constraints: constraints.filter((c) => c.trim()),
        difficulty,
        marks: Number(marks),
        testCases,
      };
      if (isEditing) {
        payload.codingQuestionId =
          editingQuestion.codingQuestionId ?? editingQuestion.id;
      }
      await codingService.addCodingQuestion(payload);
      navigate(isEditing ? `/admin/${testId}/view` : "/admin/dashboard");
    } catch (err) {
      setErrorPopup(err.message);
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full rounded-2xl border border-zinc-700 bg-zinc-800 px-5 py-3.5 text-white placeholder-zinc-500 outline-none focus:border-zinc-400 transition";

  return (
    <div className="min-h-screen bg-black px-6 py-10 text-white">
      <div className="mx-auto max-w-3xl">

        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              {isEditing ? "Edit Coding Question" : "Add Coding Question"}
            </h1>
            {testName && (
              <p className="mt-1 text-zinc-400">
                Test: <span className="text-violet-400">{testName}</span>
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={() =>
              navigate(isEditing ? `/admin/${testId}/view` : "/admin/dashboard")
            }
            className="rounded-2xl border border-zinc-700 px-5 py-3 text-sm hover:bg-zinc-800 transition"
          >
            Cancel
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-6 rounded-3xl border border-zinc-700 bg-zinc-900 p-8"
        >
          {/* Title */}
          <Section label="Title">
            <input
              type="text"
              placeholder="e.g. Two Sum"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className={inputClass}
            />
          </Section>

          {/* Description */}
          <Section label="Description">
            <textarea
              placeholder="Brief description of the problem"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={3}
              className={`${inputClass} resize-none`}
            />
          </Section>

          {/* Paragraphs */}
          <Section label="Paragraphs">
            <div className="flex flex-col gap-2">
              {paragraphs.map((p, i) => (
                <div key={i} className="flex items-start gap-2">
                  <textarea
                    placeholder={`Paragraph ${i + 1}`}
                    value={p}
                    onChange={(e) => updateList(setParagraphs, i, e.target.value)}
                    rows={2}
                    className={`${inputClass} resize-none`}
                  />
                  {paragraphs.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeFromList(setParagraphs, i)}
                      className="mt-3 text-red-400 hover:text-red-300 transition"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
              <AddRowButton onClick={() => addToList(setParagraphs)} label="Add Paragraph" />
            </div>
          </Section>

          {/* Constraints */}
          <Section label="Constraints">
            <div className="flex flex-col gap-2">
              {constraints.map((c, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder={`Constraint ${i + 1}`}
                    value={c}
                    onChange={(e) => updateList(setConstraints, i, e.target.value)}
                    className={inputClass}
                  />
                  {constraints.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeFromList(setConstraints, i)}
                      className="text-red-400 hover:text-red-300 transition"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
              <AddRowButton onClick={() => addToList(setConstraints)} label="Add Constraint" />
            </div>
          </Section>

          {/* Difficulty + Marks */}
          <div className="flex gap-4">
            <Section label="Difficulty" className="flex-1">
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                required
                className={inputClass}
              >
                <option value="" disabled>Select difficulty</option>
                <option value="EASY">Easy</option>
                <option value="MEDIUM">Medium</option>
                <option value="HARD">Hard</option>
              </select>
            </Section>

            <Section label="Marks" className="flex-1">
              <input
                type="number"
                placeholder="e.g. 10"
                value={marks}
                onChange={(e) => setMarks(e.target.value)}
                required
                min={1}
                className={inputClass}
              />
            </Section>
          </div>

          {/* Test Cases */}
          <Section label="Test Cases">
            <div className="flex flex-col gap-4">
              {testCases.map((tc, i) => (
                <div
                  key={i}
                  className="flex flex-col gap-3 rounded-2xl border border-zinc-700 p-5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-zinc-400">
                      Test Case {i + 1}
                    </span>
                    {testCases.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeTestCase(i)}
                        className="text-red-400 hover:text-red-300 transition"
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>

                  <input
                    type="text"
                    placeholder="Input"
                    value={tc.input}
                    onChange={(e) => updateTestCase(i, "input", e.target.value)}
                    required
                    className={inputClass}
                  />
                  <input
                    type="text"
                    placeholder="Expected Output"
                    value={tc.expectedOutput}
                    onChange={(e) => updateTestCase(i, "expectedOutput", e.target.value)}
                    required
                    className={inputClass}
                  />
                  <input
                    type="text"
                    placeholder="Explanation (optional)"
                    value={tc.explanation}
                    onChange={(e) => updateTestCase(i, "explanation", e.target.value)}
                    className={inputClass}
                  />

                  <div className="flex gap-6">
                    <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-400">
                      <input
                        type="checkbox"
                        checked={tc.isExample}
                        onChange={(e) => updateTestCase(i, "isExample", e.target.checked)}
                        className="accent-violet-500"
                      />
                      Example
                    </label>
                    <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-400">
                      <input
                        type="checkbox"
                        checked={tc.isHidden}
                        onChange={(e) => updateTestCase(i, "isHidden", e.target.checked)}
                        className="accent-violet-500"
                      />
                      Hidden
                    </label>
                  </div>
                </div>
              ))}
              <AddRowButton onClick={addTestCase} label="Add Test Case" />
            </div>
          </Section>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="mx-auto rounded-2xl border border-white px-16 py-4 text-lg font-semibold text-white transition hover:bg-white hover:text-black disabled:opacity-50"
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

      {/* Error Popup */}
      {errorPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="relative w-full max-w-sm rounded-3xl border border-red-500 bg-zinc-900 p-8 text-center">
            <button
              onClick={() => setErrorPopup(null)}
              className="absolute right-5 top-5 text-zinc-400 hover:text-white transition"
            >
              <X size={18} />
            </button>
            <p className="mb-2 text-lg font-semibold text-red-400">
              {isEditing ? "Failed to save question" : "Failed to create question"}
            </p>
            <p className="text-sm text-zinc-300">{errorPopup}</p>
            <button
              onClick={() => setErrorPopup(null)}
              className="mt-6 rounded-2xl border border-zinc-600 px-8 py-3 text-sm hover:bg-zinc-800 transition"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Section({ label, children, className = "" }) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <label className="text-sm font-semibold text-zinc-400">{label}</label>
      {children}
    </div>
  );
}

function AddRowButton({ onClick, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-2 text-sm text-violet-400 hover:text-violet-300 transition"
    >
      <Plus size={15} />
      {label}
    </button>
  );
}
