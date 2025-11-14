export default function StatsCard({ title, value, icon: Icon, color = 'primary', trend, description }) {
  const colorClasses = {
    primary: 'bg-primary-50 text-primary-600',
    success: 'bg-green-50 text-green-600',
    warning: 'bg-yellow-50 text-yellow-600',
    danger: 'bg-red-50 text-red-600',
    info: 'bg-blue-50 text-blue-600',
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
          {description && (
            <p className="text-sm text-gray-500 mt-1">{description}</p>
          )}
          {trend && (
            <div className={`text-sm mt-2 ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {trend.isPositive ? '↑' : '↓'} {trend.value}
            </div>
          )}
        </div>
        {Icon && (
          <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
            <Icon className="w-8 h-8" />
          </div>
        )}
      </div>
    </div>
  );
}
