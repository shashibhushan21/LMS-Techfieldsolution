import { forwardRef } from 'react';

/**
 * FormTextarea Component
 * Standardized textarea with label and error handling
 */
const FormTextarea = forwardRef(({
    label,
    name,
    placeholder,
    error,
    helperText,
    required = false,
    rows = 4,
    className = '',
    ...props
}, ref) => {
    const baseTextareaClasses = 'w-full px-4 py-2 border rounded-lg transition-colors focus:outline-none focus:ring-2 resize-y';
    const normalClasses = 'border-neutral-300 focus:ring-primary-500 focus:border-transparent';
    const errorClasses = 'border-red-300 focus:ring-red-500 focus:border-transparent';

    return (
        <div className={className}>
            {label && (
                <label
                    htmlFor={name}
                    className="block text-sm font-medium text-gray-700 mb-1"
                >
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}

            <textarea
                ref={ref}
                id={name}
                name={name}
                rows={rows}
                placeholder={placeholder}
                className={`
          ${baseTextareaClasses}
          ${error ? errorClasses : normalClasses}
        `}
                aria-invalid={error ? 'true' : 'false'}
                aria-describedby={error ? `${name}-error` : helperText ? `${name}-helper` : undefined}
                {...props}
            />

            {error && (
                <p id={`${name}-error`} className="mt-1 text-sm text-red-600">
                    {error}
                </p>
            )}

            {!error && helperText && (
                <p id={`${name}-helper`} className="mt-1 text-sm text-gray-500">
                    {helperText}
                </p>
            )}
        </div>
    );
});

FormTextarea.displayName = 'FormTextarea';

export default FormTextarea;
