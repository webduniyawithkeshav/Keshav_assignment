import { useState, useEffect } from 'react';
import { getRecords } from '../services/recordService';
import { getAgents } from '../services/agentService';
import './DistributionListPage.css';

const DistributionListPage = () => {
    const [records, setRecords] = useState([]);
    const [agents, setAgents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filters, setFilters] = useState({
        agent: '',
        status: '',
        page: 1,
    });
    const [pagination, setPagination] = useState(null);

    useEffect(() => {
        fetchAgents();
    }, []);

    useEffect(() => {
        fetchRecords();
    }, [filters]);

    const fetchAgents = async () => {
        try {
            const response = await getAgents({ limit: 100 });
            setAgents(response.data || []);
        } catch (err) {
            console.error('Error fetching agents:', err);
        }
    };

    const fetchRecords = async () => {
        setLoading(true);
        setError('');

        try {
            const params = {
                page: filters.page,
                limit: 20,
            };

            if (filters.agent) {
                params.agent = filters.agent;
            }

            if (filters.status) {
                params.status = filters.status;
            }

            const response = await getRecords(params);
            setRecords(response.data || []);
            setPagination(response.pagination);
        } catch (err) {
            setError('Failed to fetch records');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value, page: 1 }));
    };

    const handlePageChange = (newPage) => {
        setFilters((prev) => ({ ...prev, page: newPage }));
    };

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'completed':
                return 'status-completed';
            case 'in_progress':
                return 'status-in-progress';
            case 'failed':
                return 'status-failed';
            default:
                return 'status-pending';
        }
    };

    return (
        <div className="distribution-list-page">
            <h1>Distribution List</h1>

            <div className="filters-container">
                <div className="filter-group">
                    <label htmlFor="agent">Filter by Agent:</label>
                    <select
                        id="agent"
                        name="agent"
                        value={filters.agent}
                        onChange={handleFilterChange}
                    >
                        <option value="">All Agents</option>
                        {agents.map((agent) => (
                            <option key={agent._id} value={agent._id}>
                                {agent.name} ({agent.email})
                            </option>
                        ))}
                    </select>
                </div>

                <div className="filter-group">
                    <label htmlFor="status">Filter by Status:</label>
                    <select
                        id="status"
                        name="status"
                        value={filters.status}
                        onChange={handleFilterChange}
                    >
                        <option value="">All Statuses</option>
                        <option value="pending">Pending</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="failed">Failed</option>
                    </select>
                </div>
            </div>

            {error && <div className="error-alert">{error}</div>}

            {loading ? (
                <div className="loading-container">
                    <div className="loader"></div>
                    <p>Loading records...</p>
                </div>
            ) : records.length === 0 ? (
                <div className="no-data">
                    <p>No records found. Upload a CSV file to get started.</p>
                </div>
            ) : (
                <>
                    <div className="records-table-container">
                        <table className="records-table">
                            <thead>
                                <tr>
                                    <th>First Name</th>
                                    <th>Phone</th>
                                    <th>Notes</th>
                                    <th>Assigned Agent</th>
                                    <th>Status</th>
                                    <th>Upload Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {records.map((record) => (
                                    <tr key={record._id}>
                                        <td>{record.data?.FirstName || 'N/A'}</td>
                                        <td>{record.data?.Phone || 'N/A'}</td>
                                        <td>{record.data?.Notes || 'N/A'}</td>
                                        <td>
                                            {record.assignedAgentDetails?.name || 'Unknown'}
                                            <br />
                                            <span className="email-text">
                                                {record.assignedAgentDetails?.email || ''}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`status-badge ${getStatusBadgeClass(record.status)}`}>
                                                {record.status || 'pending'}
                                            </span>
                                        </td>
                                        <td>{new Date(record.uploadedAt).toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {pagination && pagination.pages > 1 && (
                        <div className="pagination">
                            <button
                                onClick={() => handlePageChange(filters.page - 1)}
                                disabled={filters.page === 1}
                                className="btn-page"
                            >
                                Previous
                            </button>
                            <span className="page-info">
                                Page {filters.page} of {pagination.pages} ({pagination.total} total records)
                            </span>
                            <button
                                onClick={() => handlePageChange(filters.page + 1)}
                                disabled={filters.page >= pagination.pages}
                                className="btn-page"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default DistributionListPage;
