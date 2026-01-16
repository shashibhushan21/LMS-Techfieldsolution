/**
 * ProgressBar Component
 * Animated progress bar with variants
 */
export default function ProgressBar({
    value = 0,
    max = 100,
    variant = 'primary',
    size = 'md',
    showLabel = false,
    className = ''
}) {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100));

    const variants = {
        primary: 'bg-primary-600',
        success: 'bg-green-600',
        warning: 'bg-yellow-600',
        error: 'bg-red-600'
    };

    const sizes = {
        sm: 'h-1',
        md: 'h-2',
        lg: 'h-3'
    };

    return (
        <div className={className}>
            {showLabel && (
                <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700">Progress</span>
                    <span className="text-sm font-medium text-gray-700">{Math.round(percentage)}%</span>
                </div>
            )}

            <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${sizes[size]}`}>
                <div
                    className={`${variants[variant]} ${sizes[size]} rounded-full transition-all duration-300 ease-out`}
                    style={{ width: `${percentage}%` }}
                    role="progressbar"
                    aria-valuenow={value}
                    aria-valuemin={0}
                    aria-valuemax={max}
                />
            </div>
        </div>
    );
}
