import api from './api';

/**
 * Login admin
 * @param {string} email
 * @param {string} password
 * @returns {Promise} Response with token and user
 */
export const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
};

/**
 * Verify JWT token
 * @returns {Promise} Response with user data
 */
export const verifyToken = async () => {
    const response = await api.get('/auth/verify');
    return response.data;
};

/**
 * Logout user (clear local storage)
 */
export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};

/**
 * Get current user from localStorage
 * @returns {Object|null} User object or null
 */
export const getCurrentUser = () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
};

/**
 * Save auth data to localStorage
 * @param {string} token - JWT token
 * @param {Object} user - User object
 */
export const saveAuthData = (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
};
