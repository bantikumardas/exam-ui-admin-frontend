import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, FileQuestion, Plus } from "lucide-react";
import { testService } from "../services/testService";
import AddMcqModal from "../components/AdminDashboard/AddMcqModal";

const levelColors = {
  EASY: "bg-green-900/60 text-green-300 border-green-700",
  MEDIUM: "bg-yellow-900/60 text-yellow-300 border-yellow-700",
  HARD: "bg-red-900/60 text-red-300 border-red-700",
};

export default function TestViewPage() {
  const { testId } = useParams();
  const navigate = useNavigate();
  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [editingMcq, setEditingMcq] = useState(null);
  const [showAddMcq, setShowAddMcq] = useState(false);

  useEffect(() => {
    testService
      .getTest(testId)
      .then((res) => setTest(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [testId]);

  if (loading)
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-zinc-400">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-red-400">
        {error}
      </div>
    );
  if (!test) return null;

  const allQuestions = [
    ...(test.mcqQuestions || []).map((q) => ({ ...q, type: "mcq" })),
    ...(test.codingQuestionResponses || []).map((q) => ({ ...q, type: "coding" })),
  ];

  const total = allQuestions.length;
  const current = allQuestions[currentIndex];

  function handleAddCoding() {
    navigate(`/admin/${testId}/create/coding-question`, {
      state: { testName: test.testName },
    });
  }

  return (
    <div className="h-screen overflow-hidden bg-black text-white">
      <div className="flex h-full w-full flex-col overflow-hidden rounded-1xl border border-zinc-700 bg-zinc-900">

        {/* Header */}
        <div className="flex flex-none items-center justify-between border-b border-zinc-700 px-8 py-5">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/admin/dashboard")}
                className="rounded-2xl border border-zinc-700 p-2.5 hover:bg-zinc-800 transition"
              >
                <ArrowLeft size={18} />
              </button>
              <div>
                <h1 className="text-lg font-bold">{test.testName}</h1>
                <p className="text-xs text-zinc-500 mt-0.5">
                  {test.totalTimeMinute} min &middot; {test.totalQuestions} questions &middot;{" "}
                  <span
                    className={
                      test.status === "ACTIVE"
                        ? "text-green-400"
                        : test.status === "DRAFT"
                        ? "text-amber-400"
                        : "text-zinc-400"
                    }
                  >
                    {test.status}
                  </span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowAddMcq(true)}
                className="flex items-center gap-1.5 rounded-2xl border border-zinc-600 px-4 py-2 text-sm font-semibold transition hover:bg-zinc-800"
              >
                <Plus size={15} />
                Add MCQ Question
              </button>
              <button
                onClick={handleAddCoding}
                className="flex items-center gap-1.5 rounded-2xl border border-zinc-600 px-4 py-2 text-sm font-semibold transition hover:bg-zinc-800"
              >
                <Plus size={15} />
                Add Coding Question
              </button>
              <span className="rounded-2xl border border-zinc-600 px-5 py-2 text-sm font-semibold text-zinc-300">
                Admin View
              </span>
            </div>
          </div>

          {total === 0 ? (
            <EmptyQuestionsState
              onAddMcq={() => setShowAddMcq(true)}
              onAddCoding={handleAddCoding}
            />
          ) : (
          <div className="flex flex-1 min-h-0">
            {/* Sidebar */}
            <div className="border-r border-zinc-700 flex flex-col w-16 shrink-0 overflow-y-auto">
              {allQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`py-4 text-center border-b border-zinc-700 text-sm font-medium transition ${
                    i === currentIndex
                      ? "bg-zinc-700 text-white"
                      : "text-zinc-500 hover:bg-zinc-800 hover:text-white"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            {/* Question area */}
            <div className="flex-1 p-8 min-w-0 overflow-y-auto">
              {/* Counter */}
              <div className="mb-6">
                <span className="rounded-2xl border border-zinc-600 px-5 py-2 text-sm font-semibold text-zinc-300">
                  {currentIndex + 1} out of {total}
                </span>
              </div>

              {current.type === "mcq" ? (
                <MCQView q={current} />
              ) : (
                <CodingView q={current} />
              )}

              {/* Navigation */}
              <div className="mt-10 flex justify-center gap-4 flex-wrap">
                <button
                  onClick={() => setCurrentIndex((i) => i - 1)}
                  disabled={currentIndex === 0}
                  className="rounded-2xl border border-zinc-600 px-8 py-3 font-semibold transition hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  View Prev
                </button>
                <button
                  onClick={() => setCurrentIndex((i) => i + 1)}
                  disabled={currentIndex === total - 1}
                  className="rounded-2xl border border-zinc-600 px-8 py-3 font-semibold transition hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  View Next
                </button>
                <button
                  onClick={() => {
                    if (current.type === "mcq") {
                      setEditingMcq(current);
                    } else {
                      navigate(`/admin/${testId}/edit/coding-question`, {
                        state: { testName: test.testName, editingQuestion: current },
                      });
                    }
                  }}
                  className="rounded-2xl border border-zinc-600 px-8 py-3 font-semibold transition hover:bg-zinc-800"
                >
                  Edit
                </button>
              </div>
            </div>
          </div>
          )}
        </div>

      {(editingMcq || showAddMcq) && (
        <AddMcqModal
          test={{ testId, testName: test.testName }}
          editingMcq={editingMcq}
          onClose={() => {
            setEditingMcq(null);
            setShowAddMcq(false);
          }}
          onAdded={() => {
            setEditingMcq(null);
            setShowAddMcq(false);
            testService.getTest(testId).then((res) => setTest(res.data));
          }}
        />
      )}
    </div>
  );
}

function EmptyQuestionsState({ onAddMcq, onAddCoding }) {
  return (
    <div className="flex flex-1 min-h-0 flex-col items-center justify-center gap-5 p-8 text-center">
      <div className="rounded-full border border-zinc-700 bg-zinc-800/60 p-5">
        <FileQuestion size={30} className="text-zinc-500" />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-white">No questions yet</h3>
        <p className="mt-1 text-sm text-zinc-500">
          Add an MCQ or coding question to get this test started.
        </p>
      </div>
      <div className="mt-1 flex flex-wrap justify-center gap-3">
        <button
          onClick={onAddMcq}
          className="flex items-center gap-1.5 rounded-2xl border border-zinc-600 px-6 py-3 text-sm font-semibold transition hover:bg-zinc-800"
        >
          <Plus size={15} />
          Add MCQ Question
        </button>
        <button
          onClick={onAddCoding}
          className="flex items-center gap-1.5 rounded-2xl border border-white px-6 py-3 text-sm font-semibold transition hover:bg-white hover:text-black"
        >
          <Plus size={15} />
          Add Coding Question
        </button>
      </div>
    </div>
  );
}

function CodeText({ text }) {
  if (!text) return null;
  // Split on fenced code blocks first
  const parts = text.split(/(```[\s\S]*?```)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("```") && part.endsWith("```")) {
          const code = part.slice(3, -3).replace(/^\n/, "").replace(/\n$/, "");
          return (
            <pre
              key={i}
              className="my-3 rounded-xl border border-zinc-700 bg-zinc-800/80 px-4 py-3 text-sm font-mono overflow-x-auto text-zinc-200 whitespace-pre"
            >
              <code>{code}</code>
            </pre>
          );
        }
        // Handle inline code, bold and highlight within regular text
        const inline = part.split(/(`[^`\n]+`|\*\*[^*\n]+\*\*|==[^=\n]+==)/g);
        return (
          <span key={i}>
            {inline.map((p, j) => {
              if (p.startsWith("`") && p.endsWith("`") && p.length > 2) {
                return (
                  <code
                    key={j}
                    className="rounded-md border border-zinc-700 bg-zinc-800 px-1.5 py-0.5 font-mono text-sm text-amber-300"
                  >
                    {p.slice(1, -1)}
                  </code>
                );
              }
              if (p.startsWith("**") && p.endsWith("**") && p.length > 4) {
                return (
                  <strong key={j} className="font-bold text-white">
                    {p.slice(2, -2)}
                  </strong>
                );
              }
              if (p.startsWith("==") && p.endsWith("==") && p.length > 4) {
                return (
                  <mark
                    key={j}
                    className="rounded px-1 bg-amber-400/30 text-amber-200"
                  >
                    {p.slice(2, -2)}
                  </mark>
                );
              }
              return <span key={j}>{p}</span>;
            })}
          </span>
        );
      })}
    </>
  );
}

function MCQView({ q }) {
  const options = [
    { label: "A", text: q.optionA },
    { label: "B", text: q.optionB },
    { label: "C", text: q.optionC },
    { label: "D", text: q.optionD },
  ];

  return (
    <div>
      <div className="text-base leading-relaxed mb-8 text-white">
        <CodeText text={q.question} />
      </div>

      <div className="flex flex-col gap-3">
        {options.map((opt) => (
          <div
            key={opt.label}
            className={`rounded-2xl border px-6 py-4 flex items-start gap-4 transition ${
              opt.label === q.correctOption
                ? "border-green-600 bg-green-950/40"
                : "border-zinc-700 bg-zinc-800/40"
            }`}
          >
            <span className="font-bold text-zinc-400 shrink-0 mt-0.5">{opt.label}.</span>
            <span className="text-sm flex-1"><CodeText text={opt.text} /></span>
            {opt.label === q.correctOption && (
              <span className="text-xs text-green-400 font-semibold shrink-0 mt-0.5">&#10003; Correct</span>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <span
          className={`rounded-2xl border px-5 py-2 text-sm font-semibold ${
            levelColors[q.level] || "bg-zinc-800 border-zinc-600 text-white"
          }`}
        >
          {q.level} Level
        </span>
        <span className="rounded-2xl border border-zinc-600 bg-zinc-800 px-5 py-2 text-sm font-semibold">
          Correct: {q.correctOption}
        </span>
        <span className="rounded-2xl border border-zinc-600 bg-zinc-800 px-5 py-2 text-sm font-semibold">
          {q.marks} {q.marks === 1 ? "mark" : "marks"}
        </span>
      </div>
    </div>
  );
}

function CodingView({ q }) {
  const testCases = q.testCaseResponse || q.testCases || [];

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">{q.title}</h2>

      <div className="rounded-2xl border border-zinc-700 bg-zinc-800/40 p-6 mb-6 max-h-64 overflow-y-auto">
        <div className="flex flex-col gap-4 text-sm text-zinc-300 leading-relaxed">
          <CodeText text={q.description} />
          {(q.paragraphs || []).map((p, i) => (
            <CodeText key={i} text={p} />
          ))}
        </div>
      </div>

      {q.constraints && q.constraints.length > 0 && (
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-3">
            Constraints
          </h3>
          <ul className="space-y-1.5">
            {q.constraints.map((c, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-zinc-300">
                <span className="text-zinc-600 mt-0.5">&bull;</span>
                <code className="text-zinc-200">{c}</code>
              </li>
            ))}
          </ul>
        </div>
      )}

      {testCases.length > 0 && (
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-3">
            Test Cases
          </h3>
          <div className="flex flex-col gap-3">
            {testCases.map((tc, i) => (
              <div
                key={tc.testCaseId ?? i}
                className="rounded-2xl border border-zinc-700 bg-zinc-800/40 p-4"
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm font-semibold text-zinc-300">
                    Test Case {i + 1}
                  </span>
                  {tc.isHidden && (
                    <span className="rounded-full border border-zinc-600 px-2.5 py-0.5 text-xs text-zinc-400">
                      Hidden
                    </span>
                  )}
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <span className="text-xs text-zinc-500">Input</span>
                    <pre className="mt-1 whitespace-pre-wrap rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 font-mono text-xs text-zinc-200">
                      {tc.input}
                    </pre>
                  </div>
                  <div>
                    <span className="text-xs text-zinc-500">Expected Output</span>
                    <pre className="mt-1 whitespace-pre-wrap rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 font-mono text-xs text-zinc-200">
                      {tc.expectedOutput}
                    </pre>
                  </div>
                </div>
                {tc.explanation && (
                  <p className="mt-3 text-xs text-zinc-400">{tc.explanation}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 flex flex-wrap gap-3">
        <span
          className={`rounded-2xl border px-5 py-2 text-sm font-semibold ${
            levelColors[q.difficulty] || "bg-zinc-800 border-zinc-600 text-white"
          }`}
        >
          {q.difficulty}
        </span>
        <span className="rounded-2xl border border-zinc-600 bg-zinc-800 px-5 py-2 text-sm font-semibold">
          {q.marks} {q.marks === 1 ? "mark" : "marks"}
        </span>
      </div>
    </div>
  );
}
