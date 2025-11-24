import { useEffect } from 'react';
import { FiX } from 'react-icons/fi';

/**
 * Modal Component
 * Responsive modal with backdrop, animations, and accessibility features
 */
export default function Modal({
    isOpen,
    onClose,
    title,
    children,
    footer,
    size = 'md',
    closeOnBackdrop = true,
    showCloseButton = true
}) {
    // Close on Escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const sizeClasses = {
        sm: 'max-w-md',
        md: 'max-w-2xl',
        lg: 'max-w-4xl',
        xl: 'max-w-6xl',
        full: 'max-w-full mx-4'
    };

    return (
        <div
            className="fixed inset-0 z-50 overflow-y-auto"
            aria-labelledby="modal-title"
            role="dialog"
            aria-modal="true"
        >
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
                onClick={closeOnBackdrop ? onClose : undefined}
                aria-hidden="true"
            />

            {/* Modal Container */}
            <div className="flex min-h-screen items-center justify-center p-4">
                {/* Modal Content */}
                <div
                    className={`
            relative bg-white rounded-xl shadow-xl 
            w-full ${sizeClasses[size]}
            transform transition-all
            animate-scale-in
          `}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    {(title || showCloseButton) && (
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            {title && (
                                <h3
                                    id="modal-title"
                                    className="text-xl font-semibold text-gray-900"
                                >
                                    {title}
                                </h3>
                            )}
                            {showCloseButton && (
                                <button
                                    onClick={onClose}
                                    className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
                                    aria-label="Close modal"
                                >
                                    <FiX className="w-6 h-6" />
                                </button>
                            )}
                        </div>
                    )}

                    {/* Body */}
                    <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
                        {children}
                    </div>

                    {/* Footer */}
                    {footer && (
                        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
                            {footer}
                        </div>
                    )}
                </div>
            </div>

            <style jsx>{`
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
      `}</style>
        </div>
    );
}
