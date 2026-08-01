import { useState, useRef, useEffect } from "react";
import {
  EllipsisVertical,
  ListPlus,
  Code2,
  Eye,
  Pencil,
  ArrowRightCircle,
  Mail,
} from "lucide-react";

export default function TestActionMenu({ test, onAction }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handle(action) {
    setOpen(false);
    onAction(action, test);
  }

  const STATUS_OPTIONS = {
    DRAFT: [
      { label: "Move to Active", value: "move_active" },
      { label: "Move to Archived", value: "move_archived" },
    ],
    ACTIVE: [
      { label: "Move to Draft", value: "move_draft" },
      { label: "Move to Archived", value: "move_archived" },
    ],
    ARCHIVED: [
      { label: "Move to Active", value: "move_active" },
      { label: "Move to Draft", value: "move_draft" },
    ],
  };

  const statusActions = STATUS_OPTIONS[test.status] || [];

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="rounded-2xl border border-zinc-700 p-4 hover:bg-zinc-800 transition"
      >
        <EllipsisVertical size={18} />
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-52 overflow-hidden rounded-2xl border border-zinc-700 bg-zinc-900 shadow-xl">
          <MenuItem icon={<ListPlus size={15} />} onClick={() => handle("add_mcq")}>
            Add MCQ Question
          </MenuItem>
          <MenuItem icon={<Code2 size={15} />} onClick={() => handle("add_coding")}>
            Add Coding Question
          </MenuItem>
          <MenuItem icon={<Eye size={15} />} onClick={() => handle("view")}>
            View
          </MenuItem>
          <MenuItem icon={<Pencil size={15} />} onClick={() => handle("edit")}>
            Edit
          </MenuItem>
          <MenuItem icon={<Mail size={15} />} onClick={() => handle("send_invite")}>
            Send Invitation
          </MenuItem>
          {statusActions.map((opt) => (
            <MenuItem
              key={opt.value}
              icon={<ArrowRightCircle size={15} />}
              onClick={() => handle(opt.value)}
              highlight
            >
              {opt.label}
            </MenuItem>
          ))}
        </div>
      )}
    </div>
  );
}

function MenuItem({ icon, children, onClick, highlight }) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 px-5 py-3.5 text-sm transition hover:bg-zinc-800 ${
        highlight ? "text-violet-400" : "text-white"
      }`}
    >
      {icon}
      {children}
    </button>
  );
}
