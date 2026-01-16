import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';

/**
 * useApiCall Hook
 * Standardized API call handling with loading, error states, and toast notifications
 * 
 * @param {Function} apiFunction - The API function to call
 * @param {Object} options - Configuration options
 * @returns {Object} - { data, loading, error, execute, reset }
 */
export function useApiCall(apiFunction, options = {}) {
    const {
        onSuccess,
        onError,
        successMessage,
        errorMessage = 'An error occurred',
        showSuccessToast = false,
        showErrorToast = true,
        initialData = null
    } = options;

    const [data, setData] = useState(initialData);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const execute = useCallback(async (...args) => {
        try {
            setLoading(true);
            setError(null);

            const result = await apiFunction(...args);
            setData(result.data);

            if (showSuccessToast && successMessage) {
                toast.success(successMessage);
            }

            if (onSuccess) {
                onSuccess(result.data);
            }

            return result.data;
        } catch (err) {
            const errorMsg = err.response?.data?.message || errorMessage;
            setError(errorMsg);

            if (showErrorToast) {
                toast.error(errorMsg);
            }

            if (onError) {
                onError(err);
            }

            throw err;
        } finally {
            setLoading(false);
        }
    }, [apiFunction, onSuccess, onError, successMessage, errorMessage, showSuccessToast, showErrorToast]);

    const reset = useCallback(() => {
        setData(null);
        setError(null);
        setLoading(false);
    }, []);

    return {
        data,
        loading,
        error,
        execute,
        reset
    };
}

/**
 * useFormValidation Hook
 * Reusable form validation logic
 * 
 * @param {Object} initialValues - Initial form values
 * @param {Function} validationRules - Validation function
 * @returns {Object} - Form state and handlers
 */
export function useFormValidation(initialValues, validationRules) {
    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    const handleChange = useCallback((e) => {
        const { name, value, type, checked } = e.target;
        setValues(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    }, [errors]);

    const handleBlur = useCallback((e) => {
        const { name } = e.target;
        setTouched(prev => ({ ...prev, [name]: true }));

        // Validate on blur
        if (validationRules) {
            const fieldErrors = validationRules(values);
            if (fieldErrors[name]) {
                setErrors(prev => ({ ...prev, [name]: fieldErrors[name] }));
            }
        }
    }, [values, validationRules]);

    const validate = useCallback(() => {
        if (!validationRules) return true;

        const validationErrors = validationRules(values);
        setErrors(validationErrors);

        return Object.keys(validationErrors).length === 0;
    }, [values, validationRules]);

    const reset = useCallback(() => {
        setValues(initialValues);
        setErrors({});
        setTouched({});
    }, [initialValues]);

    return {
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        validate,
        reset,
        setValues,
        setErrors
    };
}

/**
 * usePagination Hook
 * Reusable pagination logic
 * 
 * @param {Array} items - Array of items to paginate
 * @param {number} itemsPerPage - Number of items per page
 * @returns {Object} - Pagination state and handlers
 */
export function usePagination(items = [], itemsPerPage = 10) {
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(items.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = items.slice(startIndex, endIndex);

    const goToPage = useCallback((page) => {
        const pageNumber = Math.max(1, Math.min(page, totalPages));
        setCurrentPage(pageNumber);
    }, [totalPages]);

    const nextPage = useCallback(() => {
        goToPage(currentPage + 1);
    }, [currentPage, goToPage]);

    const prevPage = useCallback(() => {
        goToPage(currentPage - 1);
    }, [currentPage, goToPage]);

    const reset = useCallback(() => {
        setCurrentPage(1);
    }, []);

    return {
        currentPage,
        totalPages,
        currentItems,
        goToPage,
        nextPage,
        prevPage,
        reset,
        hasNext: currentPage < totalPages,
        hasPrev: currentPage > 1
    };
}
