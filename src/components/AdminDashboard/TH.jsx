export default function TH({ children, className = "" }) {
  return (
    <th
      className={`sticky top-0 z-10 whitespace-nowrap bg-zinc-950 px-4 py-2 text-left text-sm text-zinc-400 ${className}`}
    >
      {children}
    </th>
  );
}
