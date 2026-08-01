import { useState, useRef, useEffect } from "react";
import { User, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function UserMenu() {
  const [open, setOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative ml-auto" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-violet-100 text-violet-700 hover:bg-violet-200 transition"
      >
        <User size={24} />
      </button>

      {open && (
        <div className="absolute right-0 top-16 z-50 w-44 overflow-hidden rounded-2xl border border-zinc-700 bg-zinc-900 shadow-lg">
          <button
            className="flex w-full items-center gap-3 px-5 py-4 text-sm hover:bg-zinc-800 transition"
            onClick={() => setOpen(false)}
          >
            <User size={16} />
            Profile
          </button>
          <button
            className="flex w-full items-center gap-3 px-5 py-4 text-sm text-red-400 hover:bg-zinc-800 transition"
            onClick={() => { logout(); navigate("/login"); }}
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
