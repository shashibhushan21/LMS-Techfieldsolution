export default function EmptyState({ title = 'No data', message = 'There is nothing to display yet.' }) {
  return (
    <div className="text-center py-12">
      <h3 className="text-sm font-semibold text-neutral-900">{title}</h3>
      <p className="mt-2 text-sm text-neutral-600">{message}</p>
    </div>
  );
}
