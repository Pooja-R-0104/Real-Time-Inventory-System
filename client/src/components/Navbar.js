import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); // Get the current page's location

  // Check if the current page is a login or register page
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">Inventory Management System</div>
      <div className="navbar-links">
        {/* Only show links if user is logged in AND not on an auth page */}
        {user && !isAuthPage && (
          <>
            <Link to="/">Dashboard</Link>
            <Link to="/reports">Reports</Link>
            <Link to="/logs">Logs</Link>
          </>
        )}
        <button onClick={toggleTheme} className="theme-toggle">
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
        {/* Only show logout if user is logged in AND not on an auth page */}
        {user && !isAuthPage && (
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;