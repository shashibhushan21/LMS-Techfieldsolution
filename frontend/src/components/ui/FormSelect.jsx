import { forwardRef } from 'react';

/**
 * FormSelect Component
 * Standardized select dropdown with label and error handling
 */
const FormSelect = forwardRef(({
    label,
    name,
    options = [],
    placeholder = 'Select an option',
    error,
    helperText,
    required = false,
    icon: Icon,
    className = '',
    ...props
}, ref) => {
    const baseSelectClasses = 'w-full px-4 py-2 border rounded-lg transition-colors focus:outline-none focus:ring-2 appearance-none';
    const normalClasses = 'border-neutral-300 focus:ring-primary-500 focus:border-transparent';
    const errorClasses = 'border-red-300 focus:ring-red-500 focus:border-transparent';
    const iconPadding = Icon ? 'pl-10' : '';

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
                {Icon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Icon className={`w-5 h-5 ${error ? 'text-red-400' : 'text-gray-400'}`} />
                    </div>
                )}

                <select
                    ref={ref}
                    id={name}
                    name={name}
                    className={`
            ${baseSelectClasses}
            ${error ? errorClasses : normalClasses}
            ${iconPadding}
          `}
                    aria-invalid={error ? 'true' : 'false'}
                    aria-describedby={error ? `${name}-error` : helperText ? `${name}-helper` : undefined}
                    {...props}
                >
                    {placeholder && (
                        <option value="" disabled>
                            {placeholder}
                        </option>
                    )}
                    {options.map((option) => (
                        <option
                            key={option.value}
                            value={option.value}
                            disabled={option.disabled}
                        >
                            {option.label}
                        </option>
                    ))}
                </select>

                {/* Custom dropdown arrow */}
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                        />
                    </svg>
                </div>
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

FormSelect.displayName = 'FormSelect';

export default FormSelect;
