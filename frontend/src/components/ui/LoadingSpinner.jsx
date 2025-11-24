import { FiLoader } from 'react-icons/fi';

/**
 * LoadingSpinner Component
 * Reusable loading indicator with size variants
 */
export default function LoadingSpinner({
    size = 'md',
    color = 'primary',
    fullScreen = false,
    text = null
}) {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-8 h-8',
        lg: 'w-12 h-12',
        xl: 'w-16 h-16'
    };

    const colorClasses = {
        primary: 'text-primary-600',
        white: 'text-white',
        gray: 'text-gray-600'
    };

    const spinner = (
        <div className="flex flex-col items-center justify-center gap-3">
            <FiLoader
                className={`${sizeClasses[size]} ${colorClasses[color]} animate-spin`}
            />
            {text && (
                <p className="text-sm text-gray-600">{text}</p>
            )}
        </div>
    );

    if (fullScreen) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                {spinner}
            </div>
        );
    }

    return spinner;
}
