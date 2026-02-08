import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginForm from '../components/auth/LoginForm';
import './LoginPage.css';

const LoginPage = () => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    // Redirect if already logged in
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard');
        }
    }, [isAuthenticated, navigate]);

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="login-header">
                    <h1>Agent Management System</h1>
                    <p>Admin Portal</p>
                </div>
                <LoginForm />
            </div>
        </div>
    );
};

export default LoginPage;
