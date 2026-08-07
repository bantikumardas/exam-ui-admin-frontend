export default function TableWrapper({ children }) {
  return (
    <div className="min-h-0 flex-1 overflow-auto">
      <table className="w-full table-fixed">{children}</table>
    </div>
  );
}
