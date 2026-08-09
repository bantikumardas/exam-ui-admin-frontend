import { useState, useRef, useEffect } from "react";
import { EllipsisVertical, ListChecks, Power, PowerOff } from "lucide-react";

export default function CompanyActionMenu({ company, onAction }) {
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
    onAction(action, company);
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="rounded-2xl border border-zinc-700 p-2 hover:bg-zinc-800 transition"
      >
        <EllipsisVertical size={18} />
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-52 overflow-hidden rounded-2xl border border-zinc-700 bg-zinc-900 shadow-xl">
          <MenuItem icon={<ListChecks size={15} />} onClick={() => handle("manage_test")}>
            Manage Test
          </MenuItem>
          {company.active ? (
            <MenuItem icon={<PowerOff size={15} />} onClick={() => handle("deactivate")} danger>
              Deactivate
            </MenuItem>
          ) : (
            <MenuItem icon={<Power size={15} />} onClick={() => handle("activate")} highlight>
              Activate
            </MenuItem>
          )}
        </div>
      )}
    </div>
  );
}

function MenuItem({ icon, children, onClick, highlight, danger }) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 px-5 py-3.5 text-sm transition hover:bg-zinc-800 ${
        danger ? "text-red-400" : highlight ? "text-violet-400" : "text-white"
      }`}
    >
      {icon}
      {children}
    </button>
  );
}
