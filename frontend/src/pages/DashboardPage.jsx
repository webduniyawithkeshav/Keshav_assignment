import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getActiveAgentCount } from '../services/agentService';
import { getDistributionStats } from '../services/recordService';
import './DashboardPage.css';

const DashboardPage = () => {
    const [agentCount, setAgentCount] = useState(0);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [agentResponse, statsResponse] = await Promise.all([
                getActiveAgentCount(),
                getDistributionStats(),
            ]);

            setAgentCount(agentResponse.count || 0);
            setMessage(agentResponse.message || '');
            setStats(statsResponse);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loader"></div>
                <p>Loading dashboard...</p>
            </div>
        );
    }

    return (
        <div className="dashboard-page">
            <h1>Dashboard</h1>

            <div className="stats-grid">
                <div className="stat-card">
                    <h3>Active Agents</h3>
                    <div className="stat-value">{agentCount}</div>
                    <div className={`stat-message ${agentCount === 5 ? 'success' : 'warning'}`}>
                        {message}
                    </div>
                </div>

                <div className="stat-card">
                    <h3>Total Records</h3>
                    <div className="stat-value">{stats?.totalRecords || 0}</div>
                    <div className="stat-message">Distributed across agents</div>
                </div>

                <div className="stat-card">
                    <h3>Agents with Records</h3>
                    <div className="stat-value">{stats?.byAgent?.length || 0}</div>
                    <div className="stat-message">Active distributions</div>
                </div>
            </div>

            <div className="actions-grid">
                <Link to="/agents" className="action-card">
                    <div className="action-icon">👥</div>
                    <h3>Add Agent</h3>
                    <p>Create new agents for task assignment</p>
                </Link>

                <Link to="/upload" className="action-card">
                    <div className="action-icon">📤</div>
                    <h3>Upload CSV</h3>
                    <p>Upload and distribute records to agents</p>
                </Link>

                <Link to="/distribution" className="action-card">
                    <div className="action-icon">📊</div>
                    <h3>View Distribution</h3>
                    <p>See agent-wise record distribution</p>
                </Link>
            </div>

            {stats?.byAgent && stats.byAgent.length > 0 && (
                <div className="recent-stats">
                    <h2>Agent Statistics</h2>
                    <div className="agent-stats-list">
                        {stats.byAgent.map((agent, index) => (
                            <div key={index} className="agent-stat-item">
                                <div className="agent-info">
                                    <h4>{agent.agentName}</h4>
                                    <p>{agent.agentEmail}</p>
                                </div>
                                <div className="agent-numbers">
                                    <div className="stat-item">
                                        <span className="label">Total:</span>
                                        <span className="value">{agent.totalAssigned}</span>
                                    </div>
                                    <div className="stat-item">
                                        <span className="label">Pending:</span>
                                        <span className="value pending">{agent.statusBreakdown?.pending || 0}</span>
                                    </div>
                                    <div className="stat-item">
                                        <span className="label">Completed:</span>
                                        <span className="value completed">{agent.statusBreakdown?.completed || 0}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DashboardPage;
