import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SlidersHorizontal, ChevronLeft, ChevronRight } from "lucide-react";
import { testService } from "../services/testService";

import UserMenu from "../components/AdminDashboard/UserMenu";
import TableWrapper from "../components/AdminDashboard/TableWrapper";
import TH from "../components/AdminDashboard/TH";
import TD from "../components/AdminDashboard/TD";
import PageBtn from "../components/AdminDashboard/PageBtn";
import CreateTestModal from "../components/AdminDashboard/CreateTestModal";
import TestActionMenu from "../components/AdminDashboard/TestActionMenu";
import AddMcqModal from "../components/AdminDashboard/AddMcqModal";
import SendInviteModal from "../components/AdminDashboard/SendInviteModal";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("tests");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [mcqModalTest, setMcqModalTest] = useState(null);
  const [inviteModalTest, setInviteModalTest] = useState(null);
  const [tests, setTests] = useState([]);
  const [testsPagination, setTestsPagination] = useState({
    pageNo: 0,
    totalPages: 1,
    hasNext: false,
    hasPrevious: false,
  });
  const [testsLoading, setTestsLoading] = useState(false);
  const [testsError, setTestsError] = useState(null);
  const [testsRefreshKey, setTestsRefreshKey] = useState(0);
  const [query, setQuery] = useState("");
  const [activeQuery, setActiveQuery] = useState("");

  useEffect(() => {
    if (activeTab !== "tests") return;
    setTestsLoading(true);
    setTestsError(null);
    testService
      .getAllTests(testsPagination.pageNo, 10, activeQuery)
      .then((res) => {
        const { content, pageNo, totalPages, hasNext, hasPrevious } = res.data;
        setTests(content);
        setTestsPagination((prev) => ({ ...prev, pageNo, totalPages, hasNext, hasPrevious }));
      })
      .catch((err) => setTestsError(err.message))
      .finally(() => setTestsLoading(false));
  }, [activeTab, testsPagination.pageNo, testsRefreshKey, activeQuery]);

  const goToPage = (page) =>
    setTestsPagination((prev) => ({ ...prev, pageNo: page }));

  const handleSearch = () => {
    setActiveQuery(query);
    setTestsPagination((prev) => ({ ...prev, pageNo: 0 }));
  };

  const handleTestAction = async (action, test) => {
    if (action === "add_mcq") setMcqModalTest(test);
    if (action === "add_coding")
      navigate(`/admin/${test.testId}/create/coding-question`, {
        state: { testName: test.testName },
      });
    if (action === "view")
      navigate(`/admin/${test.testId}/view`);
    if(action==="edit")
      navigate(`/admin/${test.testId}/edit`);
    if (action === "send_invite") setInviteModalTest(test);

    if (action === "move_active" || action === "move_draft" || action === "move_archived") {
      const targetStatus = action.replace("move_", "").toUpperCase();
      try {
        await testService.changeStatus(test.testId, targetStatus);
        setTestsRefreshKey((k) => k + 1);
      } catch (err) {
        setTestsError(err.message);
      }
    }
  };

  const mcqs = [
    {
      id: 1,
      question: "What does HTTP stand for?",
      option: "A",
      test: "Test 1",
      marks: 1,
    },
    {
      id: 2,
      question: "Which HTTP method is idempotent?",
      option: "C",
      test: "Test 2",
      marks: 2,
    },
  ];

  const coding = [
    {
      id: 1,
      question: "Two Sum",
      difficulty: "Easy",
      test: "Test 1",
      marks: 10,
    },
    {
      id: 2,
      question: "Longest Substring",
      difficulty: "Medium",
      test: "Test 2",
      marks: 15,
    },
    {
      id: 3,
      question: "Merge K Sorted Lists",
      difficulty: "Hard",
      test: "Test 3",
      marks: 25,
    },
  ];

  const tabClass = (tab) =>
    `px-8 py-4 rounded-2xl border text-lg font-semibold transition ${
      activeTab === tab
        ? "bg-zinc-800 border-zinc-500"
        : "border-zinc-700 hover:bg-zinc-800"
    }`;

  const statusClass = {
    ACTIVE: "bg-green-100 text-green-800",
    Active: "bg-green-100 text-green-800",
    DRAFT: "bg-amber-100 text-amber-800",
    Draft: "bg-amber-100 text-amber-800",
    ARCHIVED: "bg-gray-200 text-gray-700",
    Archived: "bg-gray-200 text-gray-700",
  };

  const difficultyClass = {
    Easy: "bg-green-100 text-green-800",
    Medium: "bg-yellow-100 text-yellow-800",
    Hard: "bg-red-100 text-red-800",
  };

  return (
    <>
    <div className="min-h-screen bg-black p-6 text-white">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl border border-zinc-700 bg-zinc-900">

        {/* Header */}
        <div className="flex items-center gap-4 border-b border-zinc-700 p-6">
          <button
            onClick={() => setActiveTab("tests")}
            className={tabClass("tests")}
          >
            All Tests
          </button>

          <button
            onClick={() => setActiveTab("mcq")}
            className={tabClass("mcq")}
          >
            All MCQ Questions
          </button>

          <button
            onClick={() => setActiveTab("coding")}
            className={tabClass("coding")}
          >
            All Coding Questions
          </button>

          <UserMenu />
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-700 p-6">
          <div className="flex gap-4">
            <button className="rounded-2xl border border-zinc-700 p-4">
              <SlidersHorizontal />
            </button>

            <div className="flex">
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="w-[400px] rounded-l-2xl border border-zinc-700 bg-transparent px-5 py-4 outline-none"
              />

              <button
                onClick={handleSearch}
                className="rounded-r-2xl border border-l-0 border-zinc-700 px-8"
              >
                Search
              </button>
            </div>
          </div>

          <button
            onClick={() => activeTab === "tests" && setShowCreateModal(true)}
            className="rounded-2xl border border-zinc-700 px-6 py-4 font-semibold"
          >
            +{" "}
            {activeTab === "tests"
              ? "New Test"
              : activeTab === "mcq"
              ? "New MCQ"
              : "New Question"}
          </button>
        </div>

        {/* Tests */}
        {activeTab === "tests" && (
          <TableWrapper>
            <thead>
              <tr>
                <TH>Sl no.</TH>
                <TH>Test Name</TH>
                <TH>Total Questions</TH>
                <TH>Coding Questions</TH>
                <TH> Total Time</TH>
                <TH>Status</TH>
                <TH>Action</TH>
              </tr>
            </thead>

            <tbody>
              {testsLoading && (
                <tr>
                  <td colSpan={6} className="px-8 py-10 text-center text-zinc-400">
                    Loading...
                  </td>
                </tr>
              )}
              {testsError && (
                <tr>
                  <td colSpan={6} className="px-8 py-10 text-center text-red-400">
                    {testsError}
                  </td>
                </tr>
              )}
              {!testsLoading && !testsError && tests.map((item, index) => (
                <tr key={item.testId} className="border-t border-zinc-700">
                  <TD>{testsPagination.pageNo * 10 + index + 1}</TD>
                  <TD>{item.testName}</TD>
                  <TD>{item.totalQuestions}</TD>
                  <TD>{item.totalCodingQuestions}</TD>
                  <TD>{item.totalTimeMinute}</TD>
                  <TD>
                    <span
                      className={`rounded-full px-4 py-2 text-sm font-semibold ${statusClass[item.status]}`}
                    >
                      {item.status}
                    </span>
                  </TD>

                  <TD>
                    <TestActionMenu test={item} onAction={handleTestAction} />
                  </TD>
                </tr>
              ))}
            </tbody>
          </TableWrapper>
        )}

        {/* MCQ */}
        {activeTab === "mcq" && (
          <TableWrapper>
            <thead>
              <tr>
                <TH>Sl no.</TH>
                <TH>Question</TH>
                <TH>Correct Option</TH>
                <TH>Test</TH>
                <TH>Marks</TH>
              </tr>
            </thead>

            <tbody>
              {mcqs.map((item) => (
                <tr key={item.id} className="border-t border-zinc-700">
                  <TD>{item.id}</TD>
                  <TD>{item.question}</TD>

                  <TD>
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-100 font-bold text-violet-700">
                      {item.option}
                    </span>
                  </TD>

                  <TD>{item.test}</TD>
                  <TD>{item.marks}</TD>
                </tr>
              ))}
            </tbody>
          </TableWrapper>
        )}

        {/* Coding */}
        {activeTab === "coding" && (
          <TableWrapper>
            <thead>
              <tr>
                <TH>Sl no.</TH>
                <TH>Question</TH>
                <TH>Difficulty</TH>
                <TH>Test</TH>
                <TH>Marks</TH>
              </tr>
            </thead>

            <tbody>
              {coding.map((item) => (
                <tr key={item.id} className="border-t border-zinc-700">
                  <TD>{item.id}</TD>
                  <TD>{item.question}</TD>

                  <TD>
                    <span
                      className={`rounded-full px-4 py-2 text-sm font-semibold ${difficultyClass[item.difficulty]}`}
                    >
                      {item.difficulty}
                    </span>
                  </TD>

                  <TD>{item.test}</TD>
                  <TD>{item.marks}</TD>
                </tr>
              ))}
            </tbody>
          </TableWrapper>
        )}

        {/* Pagination */}
        <div className="flex justify-center gap-3 p-6">
          <PageBtn
            onClick={() => goToPage(testsPagination.pageNo - 1)}
            disabled={!testsPagination.hasPrevious}
          >
            <ChevronLeft size={18} />
          </PageBtn>

          {Array.from({ length: testsPagination.totalPages }, (_, i) => (
            <PageBtn
              key={i}
              active={i === testsPagination.pageNo}
              onClick={() => goToPage(i)}
            >
              {i + 1}
            </PageBtn>
          ))}

          <PageBtn
            onClick={() => goToPage(testsPagination.pageNo + 1)}
            disabled={!testsPagination.hasNext}
          >
            <ChevronRight size={18} />
          </PageBtn>
        </div>
      </div>
    </div>

    {showCreateModal && (
      <CreateTestModal
        onClose={() => setShowCreateModal(false)}
        onCreated={() => setTestsRefreshKey((k) => k + 1)}
      />
    )}

    {mcqModalTest && (
      <AddMcqModal
        test={mcqModalTest}
        onClose={() => setMcqModalTest(null)}
      />
    )}

    {inviteModalTest && (
      <SendInviteModal
        test={inviteModalTest}
        onClose={() => setInviteModalTest(null)}
      />
    )}
    </>
  );
}
