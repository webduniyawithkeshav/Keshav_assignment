import { useState, useEffect } from 'react';
import { uploadFile } from '../services/recordService';
import { getActiveAgentCount } from '../services/agentService';
import './UploadCSVPage.css';

const UploadCSVPage = () => {
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [distributionResult, setDistributionResult] = useState(null);
    const [agentCount, setAgentCount] = useState(0);
    const [agentMessage, setAgentMessage] = useState('');

    useEffect(() => {
        checkAgentCount();
    }, []);

    const checkAgentCount = async () => {
        try {
            const response = await getActiveAgentCount();
            setAgentCount(response.count);
            setAgentMessage(response.message);
        } catch (err) {
            console.error('Error fetching agent count:', err);
        }
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setError('');
        setSuccess(false);
        setDistributionResult(null);

        if (!selectedFile) {
            setFile(null);
            setFileName('');
            return;
        }

        // Validate file type
        const allowedTypes = ['.csv', '.xlsx', '.xls'];
        const fileExtension = selectedFile.name.substring(selectedFile.name.lastIndexOf('.')).toLowerCase();

        if (!allowedTypes.includes(fileExtension)) {
            setError('Invalid file type. Only CSV, XLSX, and XLS files are allowed.');
            setFile(null);
            setFileName('');
            return;
        }

        // Validate file size (10MB max)
        if (selectedFile.size > 10 * 1024 * 1024) {
            setError('File size exceeds 10MB limit.');
            setFile(null);
            setFileName('');
            return;
        }

        setFile(selectedFile);
        setFileName(selectedFile.name);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess(false);

        if (!file) {
            setError('Please select a file to upload');
            return;
        }

        if (agentCount < 5) {
            setError(`Cannot upload. ${agentMessage}. You need ${5 - agentCount} more active agent(s).`);
            return;
        }

        setLoading(true);

        try {
            const response = await uploadFile(file);

            if (response.success) {
                setSuccess(true);
                setDistributionResult(response.data);
                setFile(null);
                setFileName('');
                // Reset file input
                e.target.reset();
            }
        } catch (err) {
            const errorMsg = err.response?.data?.error || 'Upload failed';
            const details = err.response?.data?.details;

            if (details && Array.isArray(details)) {
                setError(`${errorMsg}\n${details.join('\n')}`);
            } else {
                setError(errorMsg);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="upload-csv-page">
            <h1>Upload CSV File</h1>

            <div className="agent-count-info">
                <div className={`count-badge ${agentCount === 5 ? 'success' : 'warning'}`}>
                    Active Agents: {agentCount}/5
                </div>
                <p className="count-message">{agentMessage}</p>
            </div>

            <div className="form-container">
                <form onSubmit={handleSubmit}>
                    {error && <div className="error-alert">{error}</div>}
                    {success && <div className="success-alert">File uploaded and distributed successfully!</div>}

                    <div className="file-upload-section">
                        <label className="file-label">
                            <input
                                type="file"
                                accept=".csv,.xlsx,.xls"
                                onChange={handleFileChange}
                                disabled={loading}
                                className="file-input"
                            />
                            <span className="file-button">Choose File</span>
                            <span className="file-name">{fileName || 'No file chosen'}</span>
                        </label>
                    </div>

                    <div className="file-requirements">
                        <h3>File Requirements:</h3>
                        <ul>
                            <li>Accepted formats: CSV, XLSX, XLS</li>
                            <li>Required columns: <strong>FirstName</strong>, <strong>Phone</strong>, <strong>Notes</strong></li>
                            <li>Phone must be 10-15 digits</li>
                            <li>Maximum file size: 10MB</li>
                            <li>Exactly 5 active agents required</li>
                        </ul>
                    </div>

                    <button type="submit" className="btn btn-primary" disabled={loading || !file || agentCount < 5}>
                        {loading ? 'Uploading...' : 'Upload & Distribute'}
                    </button>
                </form>

                {distributionResult && (
                    <div className="distribution-results">
                        <h2>Distribution Results</h2>
                        <p className="result-summary">
                            Successfully distributed <strong>{distributionResult.totalRecords}</strong> records
                        </p>

                        <div className="distribution-list">
                            {distributionResult.distribution.map((item, index) => (
                                <div key={index} className="distribution-item">
                                    <div>
                                        <h4>{item.agentName}</h4>
                                        <p>{item.agentEmail}</p>
                                    </div>
                                    <div className="assigned-count">
                                        {item.assignedCount} records
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UploadCSVPage;
