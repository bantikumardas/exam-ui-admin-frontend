export default function PageBtn({ children, active, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`h-9 w-9 rounded-xl border border-zinc-700 text-sm transition
        ${active ? "bg-zinc-800" : ""}
        ${disabled ? "cursor-not-allowed opacity-40" : "hover:bg-zinc-800"}`}
    >
      {children}
    </button>
  );
}
