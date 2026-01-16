import { forwardRef } from 'react';

/**
 * FormInput Component
 * Standardized input field with label, error handling, and icon support
 */
const FormInput = forwardRef(({
    label,
    name,
    type = 'text',
    placeholder,
    error,
    helperText,
    required = false,
    icon: Icon,
    iconPosition = 'left',
    className = '',
    ...props
}, ref) => {
    const baseInputClasses = 'w-full px-4 py-2 border rounded-lg transition-colors focus:outline-none focus:ring-2';
    const normalClasses = 'border-neutral-300 focus:ring-primary-500 focus:border-transparent';
    const errorClasses = 'border-red-300 focus:ring-red-500 focus:border-transparent';
    const iconPaddingLeft = Icon && iconPosition === 'left' ? 'pl-10' : '';
    const iconPaddingRight = Icon && iconPosition === 'right' ? 'pr-10' : '';

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

            <div className="relative">
                {Icon && iconPosition === 'left' && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Icon className={`w-5 h-5 ${error ? 'text-red-400' : 'text-gray-400'}`} />
                    </div>
                )}

                <input
                    ref={ref}
                    id={name}
                    name={name}
                    type={type}
                    placeholder={placeholder}
                    className={`
            ${baseInputClasses}
            ${error ? errorClasses : normalClasses}
            ${iconPaddingLeft}
            ${iconPaddingRight}
          `}
                    aria-invalid={error ? 'true' : 'false'}
                    aria-describedby={error ? `${name}-error` : helperText ? `${name}-helper` : undefined}
                    {...props}
                />

                {Icon && iconPosition === 'right' && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <Icon className={`w-5 h-5 ${error ? 'text-red-400' : 'text-gray-400'}`} />
                    </div>
                )}
            </div>

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

FormInput.displayName = 'FormInput';

export default FormInput;
