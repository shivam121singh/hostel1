import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem 2rem',
      backgroundColor: '#FFFFFF',
      borderBottom: '1px solid #334155'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>

        <Link to="/" >
       <div className="landing-brand">
          <img src="/logo.jpeg" alt="galgotias Logo" className="landing-logo" />
        </div>
        </Link>

        {user && (
          <div style={{ display: 'flex', gap: '1.25rem' }}>
            {user.role === 'warden' ? (
              <>
                <Link to="/warden-dashboard" style={{ color: 'black', textDecoration: 'none', fontSize: '0.95rem' }}>
                  Dashboard
                </Link>
                <Link to="/room-matrix" style={{ color: 'black', textDecoration: 'none', fontSize: '0.95rem' }}>
                  Live Room Matrix
                </Link>
                {/* 👈 Leaves & Complaints Link for Warden */}
                <Link to="/leaves-complaints" style={{ color: '#38bdf8', textDecoration: 'none', fontSize: '0.95rem', fontWeight: '600' }}>
                  📋 Leaves & Complaints
                </Link>
              </>
            ) : (
              <>
                <Link to="/student-dashboard" style={{ color: 'black', textDecoration: 'none', fontSize: '0.95rem' }}>
                  Dashboard
                </Link>
                <Link to="/leaves-complaints" style={{ color: '#38bdf8', textDecoration: 'none', fontSize: '0.95rem', fontWeight: '600' }}>
                  📝 Apply Leave / Complaint
                </Link>
              </>
            )}
          </div>
        )}
      </div>

      {user && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
            {user.name} ({user.role?.toUpperCase()} - Block {user.hostelBlock})
          </span>
          <button
            onClick={handleLogout}
            style={{
              padding: '0.4rem 0.8rem',
              backgroundColor: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;