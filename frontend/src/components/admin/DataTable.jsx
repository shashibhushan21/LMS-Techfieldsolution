import EmptyState from '@/components/admin/EmptyState';

// Generic reusable data table component
// columns: [{ key: 'field', label: 'Header', render?: (row) => JSX }]
export default function DataTable({ columns, data, loading, emptyTitle = 'No data', emptyMessage = 'Nothing to display yet.', className = '' }) {
  return (
    <div className={`overflow-auto rounded-xl border border-neutral-200 bg-white shadow-soft ${className}`}>
      {loading ? (
        <div className="p-6 text-sm">Loading...</div>
      ) : !data || data.length === 0 ? (
        <EmptyState title={emptyTitle} message={emptyMessage} />
      ) : (
        <table className="min-w-full text-sm">
          <thead className="bg-neutral-50 text-neutral-700">
            <tr>
              {columns.map(col => (
                <th key={col.key} className="px-4 py-2 text-left font-medium whitespace-nowrap">{col.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map(row => (
              <tr key={row._id || row.id} className="border-t border-neutral-100 hover:bg-neutral-50 transition">
                {columns.map(col => (
                  <td key={col.key} className="px-4 py-2 align-top text-neutral-700">
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
