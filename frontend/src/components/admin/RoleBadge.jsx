export default function RoleBadge({ role }) {
  const map = {
    admin: 'bg-purple-100 text-purple-700',
    mentor: 'bg-blue-100 text-blue-700',
    intern: 'bg-green-100 text-green-700',
  };
  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${map[role] || 'bg-neutral-100 text-neutral-600'}`}>{role}</span>
  );
}
