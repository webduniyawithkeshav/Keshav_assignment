import api from './api';

/**
 * Get all agents with pagination and filters
 * @param {Object} params - Query parameters
 * @returns {Promise} Response with agents list
 */
export const getAgents = async (params = {}) => {
    const response = await api.get('/agents', { params });
    return response.data;
};

/**
 * Get single agent by ID
 * @param {string} id - Agent ID
 * @returns {Promise} Response with agent data
 */
export const getAgentById = async (id) => {
    const response = await api.get(`/agents/${id}`);
    return response.data;
};

/**
 * Create new agent
 * @param {Object} data - Agent data (name, email, phone)
 * @returns {Promise} Response with created agent
 */
export const createAgent = async (data) => {
    const response = await api.post('/agents', data);
    return response.data;
};

/**
 * Update agent
 * @param {string} id - Agent ID
 * @param {Object} data - Updated agent data
 * @returns {Promise} Response with updated agent
 */
export const updateAgent = async (id, data) => {
    const response = await api.put(`/agents/${id}`, data);
    return response.data;
};

/**
 * Delete agent
 * @param {string} id - Agent ID
 * @returns {Promise} Response
 */
export const deleteAgent = async (id) => {
    const response = await api.delete(`/agents/${id}`);
    return response.data;
};

/**
 * Get active agent count
 * @returns {Promise} Response with count and message
 */
export const getActiveAgentCount = async () => {
    const response = await api.get('/agents/count');
    return response.data;
};
