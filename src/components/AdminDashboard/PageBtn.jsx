export default function PageBtn({ children, active, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`h-12 w-12 rounded-xl border border-zinc-700 transition
        ${active ? "bg-zinc-800" : ""}
        ${disabled ? "cursor-not-allowed opacity-40" : "hover:bg-zinc-800"}`}
    >
      {children}
    </button>
  );
}
