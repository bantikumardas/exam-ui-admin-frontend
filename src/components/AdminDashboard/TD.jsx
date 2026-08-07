export default function TD({ children, className = "" }) {
  return <td className={`px-4 py-1.5 text-sm leading-tight ${className}`}>{children}</td>;
}
