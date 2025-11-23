import { useState, useEffect, useCallback } from 'react';
import apiClient from '@/utils/apiClient';
import { toast } from 'react-toastify';

/**
 * Custom hook for API calls with automatic loading and error handling
 * @param {string} endpoint - API endpoint to call
 * @param {Object} options - Configuration options
 * @param {boolean} options.immediate - Whether to fetch immediately (default: true)
 * @param {boolean} options.showError - Whether to show error toast (default: true)
 * @param {Array} options.dependencies - Dependencies for refetching
 * @returns {Object} - { data, loading, error, refetch }
 */
export const useApi = (endpoint, options = {}) => {
    const {
        immediate = true,
        showError = true,
        dependencies = []
    } = options;

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(immediate);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        if (!endpoint) return;

        setLoading(true);
        setError(null);

        try {
            const response = await apiClient.get(endpoint);
            setData(response.data.data || response.data);
            return response.data;
        } catch (err) {
            setError(err);
            if (showError) {
                toast.error(err.response?.data?.message || 'Failed to load data');
            }
            throw err;
        } finally {
            setLoading(false);
        }
    }, [endpoint, showError]);

    useEffect(() => {
        if (immediate) {
            fetchData();
        }
    }, [immediate, ...dependencies]);

    return {
        data,
        loading,
        error,
        refetch: fetchData
    };
};

/**
 * Custom hook for API mutations (POST, PUT, DELETE)
 * @param {string} endpoint - API endpoint
 * @param {string} method - HTTP method (default: 'POST')
 * @param {Object} options - Configuration options
 * @returns {Object} - { mutate, loading, error, data }
 */
export const useApiMutation = (endpoint, method = 'POST', options = {}) => {
    const { showError = true, showSuccess = false, successMessage = 'Success!' } = options;

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const mutate = useCallback(async (payload) => {
        setLoading(true);
        setError(null);

        try {
            const response = await apiClient[method.toLowerCase()](endpoint, payload);
            setData(response.data);

            if (showSuccess) {
                toast.success(successMessage);
            }

            return response.data;
        } catch (err) {
            setError(err);
            if (showError) {
                toast.error(err.response?.data?.message || 'Operation failed');
            }
            throw err;
        } finally {
            setLoading(false);
        }
    }, [endpoint, method, showError, showSuccess, successMessage]);

    return {
        mutate,
        loading,
        error,
        data
    };
};
