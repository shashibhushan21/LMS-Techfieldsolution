export default function ProgressCard({ title, current, total, percentage, color = 'primary' }) {
  const colorClasses = {
    primary: 'bg-primary-600',
    success: 'bg-green-600',
    warning: 'bg-yellow-600',
    danger: 'bg-red-600',
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-gray-900">{title}</h4>
        <span className="text-sm font-medium text-gray-600">
          {current}/{total}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className={`h-2.5 rounded-full ${colorClasses[color]}`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <p className="text-sm text-gray-500 mt-2">{percentage}% complete</p>
    </div>
  );
}
