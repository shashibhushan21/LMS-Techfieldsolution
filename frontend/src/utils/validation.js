/**
 * Validation utility functions
 * Centralized validation logic to reduce code duplication
 */

/**
 * Validate password and confirmation
 * @param {string} password - The password to validate
 * @param {string} confirmPassword - The confirmation password
 * @param {number} minLength - Minimum password length (default: 6)
 * @returns {Object} - { valid: boolean, error: string | null }
 */
export const validatePassword = (password, confirmPassword, minLength = 6) => {
    if (!password || !confirmPassword) {
        return { valid: false, error: 'Password fields cannot be empty' };
    }

    if (password !== confirmPassword) {
        return { valid: false, error: 'Passwords do not match' };
    }

    if (password.length < minLength) {
        return { valid: false, error: `Password must be at least ${minLength} characters` };
    }

    return { valid: true, error: null };
};

/**
 * Validate email format
 * @param {string} email - The email to validate
 * @returns {Object} - { valid: boolean, error: string | null }
 */
export const validateEmail = (email) => {
    if (!email) {
        return { valid: false, error: 'Email is required' };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return { valid: false, error: 'Invalid email format' };
    }

    return { valid: true, error: null };
};

/**
 * Validate required field
 * @param {any} value - The value to validate
 * @param {string} fieldName - Name of the field for error message
 * @returns {Object} - { valid: boolean, error: string | null }
 */
export const validateRequired = (value, fieldName = 'This field') => {
    if (!value || (typeof value === 'string' && value.trim() === '')) {
        return { valid: false, error: `${fieldName} is required` };
    }

    return { valid: true, error: null };
};

/**
 * Validate phone number (basic validation)
 * @param {string} phone - The phone number to validate
 * @returns {Object} - { valid: boolean, error: string | null }
 */
export const validatePhone = (phone) => {
    if (!phone) {
        return { valid: true, error: null }; // Phone is optional in most cases
    }

    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    if (!phoneRegex.test(phone) || phone.replace(/\D/g, '').length < 10) {
        return { valid: false, error: 'Invalid phone number format' };
    }

    return { valid: true, error: null };
};
