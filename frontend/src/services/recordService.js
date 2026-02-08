import api from './api';

/**
 * Upload CSV/XLSX file and distribute records
 * @param {File} file - File to upload
 * @returns {Promise} Response with distribution results
 */
export const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/records/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

/**
 * Get records with filters and pagination
 * @param {Object} params - Query parameters
 * @returns {Promise} Response with records list
 */
export const getRecords = async (params = {}) => {
    const response = await api.get('/records', { params });
    return response.data;
};

/**
 * Get distribution statistics
 * @returns {Promise} Response with stats
 */
export const getDistributionStats = async () => {
    const response = await api.get('/records/stats');
    return response.data.data; // Unwrap nested data
};

/**
 * Update record status
 * @param {string} id - Record ID
 * @param {string} status - New status
 * @returns {Promise} Response with updated record
 */
export const updateRecordStatus = async (id, status) => {
    const response = await api.put(`/records/${id}`, { status });
    return response.data;
};
