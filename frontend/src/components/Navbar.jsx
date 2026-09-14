import React, { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const closeMenu = () => setIsMenuOpen(false);

  const linkStyle = (path) => ({
    color: location.pathname === path ? '#38bdf8' : '#cbd5e1',
    textDecoration: 'none',
    fontSize: '0.95rem',
    fontWeight: location.pathname === path ? '600' : '500',
    padding: '0.5rem 0'
  });

  return (
    <nav style={{
      backgroundColor: '#0f172a',
      borderBottom: '1px solid #1e293b',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      width: '100%'
    }}>
      <div style={{
        maxWidth: '1300px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0.75rem 1.5rem',
        position: 'relative'
      }}>
        
        {/* Left: Brand Logo */}
        <Link to="/" onClick={closeMenu} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
          <img 
            src="/logo.jpeg" 
            alt="Galgotias Logo" 
            style={{ height: '42px', width: 'auto', borderRadius: '4px', objectFit: 'contain' }} 
          />
        </Link>

        {/* Desktop Navigation Links */}
        {user && (
          <div className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            {user.role === 'warden' ? (
              <>
                <Link to="/warden-dashboard" style={linkStyle('/warden-dashboard')}>
                  Dashboard
                </Link>
                <Link to="/room-matrix" style={linkStyle('/room-matrix')}>
                  Live Room Matrix
                </Link>
                <Link to="/leaves-complaints" style={linkStyle('/leaves-complaints')}>
                  📋 Leaves & Complaints
                </Link>
              </>
            ) : (
              <>
                <Link to="/student-dashboard" style={linkStyle('/student-dashboard')}>
                  Dashboard
                </Link>
                <Link to="/leaves-complaints" style={linkStyle('/leaves-complaints')}>
                  📝 Apply Leave / Complaint
                </Link>
              </>
            )}
          </div>
        )}

        {/* Desktop User Info & Logout */}
        {user && (
          <div className="desktop-user" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
              {user.name} ({user.role?.toUpperCase()} - Block {user.hostelBlock})
            </span>
            <button
              onClick={handleLogout}
              style={{
                padding: '0.4rem 0.85rem',
                backgroundColor: '#ef4444',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '0.85rem'
              }}
            >
              Logout
            </button>
          </div>
        )}

        {/* Mobile Hamburger Button */}
        {user && (
          <button
            className="mobile-hamburger"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle navigation menu"
            style={{
              background: 'transparent',
              border: 'none',
              color: '#ffffff',
              fontSize: '1.6rem',
              cursor: 'pointer',
              display: 'none',
              lineHeight: 1
            }}
          >
            {isMenuOpen ? '✕' : '☰'}
          </button>
        )}
      </div>

      {/* Mobile Dropdown Menu */}
      {user && isMenuOpen && (
        <div style={{
          backgroundColor: '#1e293b',
          borderTop: '1px solid #334155',
          padding: '1rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.85rem'
        }}>
          <div style={{ paddingBottom: '0.5rem', borderBottom: '1px solid #334155', color: '#94a3b8', fontSize: '0.85rem' }}>
            👤 <strong>{user.name}</strong> ({user.role?.toUpperCase()} - Block {user.hostelBlock})
          </div>

          {user.role === 'warden' ? (
            <>
              <Link to="/warden-dashboard" onClick={closeMenu} style={linkStyle('/warden-dashboard')}>
                📊 Dashboard
              </Link>
              <Link to="/room-matrix" onClick={closeMenu} style={linkStyle('/room-matrix')}>
                🏢 Live Room Matrix
              </Link>
              <Link to="/leaves-complaints" onClick={closeMenu} style={linkStyle('/leaves-complaints')}>
                📋 Leaves & Complaints
              </Link>
            </>
          ) : (
            <>
              <Link to="/student-dashboard" onClick={closeMenu} style={linkStyle('/student-dashboard')}>
                📱 Dashboard
              </Link>
              <Link to="/leaves-complaints" onClick={closeMenu} style={linkStyle('/leaves-complaints')}>
                📝 Apply Leave / Complaint
              </Link>
            </>
          )}

          <button
            onClick={() => {
              closeMenu();
              handleLogout();
            }}
            style={{
              marginTop: '0.5rem',
              padding: '0.55rem',
              backgroundColor: '#ef4444',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600',
              textAlign: 'center',
              width: '100%'
            }}
          >
            Logout
          </button>
        </div>
      )}

      {/* Responsive Inline Media Queries for Menu Toggle */}
      <style>{`
        @media (max-width: 768px) {
          .desktop-nav,
          .desktop-user {
            display: none !important;
          }
          .mobile-hamburger {
            display: block !important;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;