import { FiX, FiAlertCircle, FiCheckCircle, FiInfo, FiAlertTriangle } from 'react-icons/fi';

/**
 * Alert Component
 * Dismissible alert messages with variants
 */
export default function Alert({
    children,
    variant = 'info',
    title,
    onClose,
    className = ''
}) {
    const variants = {
        success: {
            container: 'bg-green-50 border-green-200 text-green-800',
            icon: FiCheckCircle,
            iconColor: 'text-green-600'
        },
        error: {
            container: 'bg-red-50 border-red-200 text-red-800',
            icon: FiAlertCircle,
            iconColor: 'text-red-600'
        },
        warning: {
            container: 'bg-yellow-50 border-yellow-200 text-yellow-800',
            icon: FiAlertTriangle,
            iconColor: 'text-yellow-600'
        },
        info: {
            container: 'bg-blue-50 border-blue-200 text-blue-800',
            icon: FiInfo,
            iconColor: 'text-blue-600'
        }
    };

    const config = variants[variant];
    const Icon = config.icon;

    return (
        <div
            className={`
        relative rounded-lg border p-4
        ${config.container}
        ${className}
      `}
            role="alert"
        >
            <div className="flex items-start gap-3">
                <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${config.iconColor}`} />

                <div className="flex-1">
                    {title && (
                        <h4 className="font-semibold mb-1">{title}</h4>
                    )}
                    <div className="text-sm">{children}</div>
                </div>

                {onClose && (
                    <button
                        onClick={onClose}
                        className="flex-shrink-0 p-1 rounded-lg hover:bg-black/5 transition-colors"
                        aria-label="Close alert"
                    >
                        <FiX className="w-4 h-4" />
                    </button>
                )}
            </div>
        </div>
    );
}
