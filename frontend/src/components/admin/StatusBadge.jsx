export default function StatusBadge({ status }) {
  const map = {
    active: 'bg-green-100 text-green-700',
    pending: 'bg-yellow-100 text-yellow-700',
    approved: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
    draft: 'bg-neutral-100 text-neutral-600',
  };
  return <span className={`px-2 py-1 text-xs font-medium rounded-full ${map[status] || 'bg-neutral-100 text-neutral-600'}`}>{status}</span>;
}
