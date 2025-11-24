/**
 * Badge Component
 * Reusable badge with variants and sizes
 */
export default function Badge({
    children,
    variant = 'default',
    size = 'md',
    className = '',
    icon: Icon
}) {
    const variants = {
        default: 'bg-gray-100 text-gray-800',
        primary: 'bg-primary-100 text-primary-800',
        success: 'bg-green-100 text-green-800',
        warning: 'bg-yellow-100 text-yellow-800',
        error: 'bg-red-100 text-red-800',
        info: 'bg-blue-100 text-blue-800'
    };

    const sizes = {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-3 py-1 text-sm',
        lg: 'px-4 py-1.5 text-base'
    };

    return (
        <span
            className={`
        inline-flex items-center gap-1 rounded-full font-medium
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
        >
            {Icon && <Icon className="w-3 h-3" />}
            {children}
        </span>
    );
}
