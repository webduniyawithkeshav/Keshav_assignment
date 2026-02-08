import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className="navbar-brand">
                    <Link to="/dashboard">Agent Management</Link>
                </div>

                <div className="navbar-menu">
                    <Link to="/dashboard" className="nav-link">Dashboard</Link>
                    <Link to="/agents" className="nav-link">Add Agent</Link>
                    <Link to="/upload" className="nav-link">Upload CSV</Link>
                    <Link to="/distribution" className="nav-link">Distribution</Link>
                </div>

                <div className="navbar-user">
                    <span className="user-name">{user?.name || 'Admin'}</span>
                    <button onClick={handleLogout} className="btn-logout">Logout</button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
