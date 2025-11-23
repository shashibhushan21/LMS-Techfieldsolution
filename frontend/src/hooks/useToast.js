import { toast } from 'react-toastify';
import { useCallback } from 'react';

/**
 * Custom hook for standardized toast notifications
 * Provides consistent error handling and success messages
 * @returns {Object} - Toast utility functions
 */
export const useToast = () => {
    const showSuccess = useCallback((message) => {
        toast.success(message);
    }, []);

    const showError = useCallback((error, defaultMessage = 'An error occurred') => {
        let errorMessage = defaultMessage;

        if (typeof error === 'string') {
            errorMessage = error;
        } else if (error?.response?.data?.message) {
            errorMessage = error.response.data.message;
        } else if (error?.message) {
            errorMessage = error.message;
        }

        toast.error(errorMessage);
    }, []);

    const showInfo = useCallback((message) => {
        toast.info(message);
    }, []);

    const showWarning = useCallback((message) => {
        toast.warning(message);
    }, []);

    return {
        success: showSuccess,
        error: showError,
        info: showInfo,
        warning: showWarning
    };
};
