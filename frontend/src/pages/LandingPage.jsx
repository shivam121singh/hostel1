import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  const backgroundImageUrl = '/image.jpeg';
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      backgroundColor: '#0f172a',
      color: '#f8fafc',
      margin: 0,
      padding: 0,
      overflowX: 'hidden'
    }}>
      {/* Responsive Stylesheet */}
      <style>{`
        .landing-navbar-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.85rem 2.5rem;
          background: rgba(15, 23, 42, 0.95);
          backdrop-filter: blur(8px);
          border-bottom: 1px solid #1e293b;
          z-index: 1000;
          box-sizing: border-box;
        }

        .landing-brand-logo {
          height: 44px;
          width: auto;
          object-fit: contain;
        }

        .landing-links-desktop {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .nav-text-link {
          color: #cbd5e1;
          text-decoration: none;
          font-weight: 500;
          font-size: 0.95rem;
          transition: color 0.2s ease;
        }

        .nav-text-link:hover {
          color: #38bdf8;
        }

        .nav-register-btn {
          background-color: #4f46e5;
          color: #ffffff;
          padding: 0.5rem 1.25rem;
          border-radius: 6px;
          text-decoration: none;
          font-weight: 600;
          font-size: 0.95rem;
          transition: background-color 0.2s ease;
        }

        .nav-register-btn:hover {
          background-color: #4338ca;
        }

        .mobile-toggle-btn {
          display: none;
          background: transparent;
          border: none;
          color: #f8fafc;
          font-size: 1.6rem;
          cursor: pointer;
        }

        .mobile-dropdown-menu {
          display: none;
          flex-direction: column;
          gap: 1rem;
          padding: 1.25rem 1.5rem;
          background-color: #1e293b;
          border-bottom: 1px solid #334155;
          position: fixed;
          top: 60px;
          left: 0;
          width: 100%;
          z-index: 999;
          box-sizing: border-box;
        }

        .hero-section-custom {
          position: relative;
          min-height: 100vh;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          padding: 7rem 1.5rem 4rem 1.5rem;
          box-sizing: border-box;
        }

        .hero-title-responsive {
          font-size: 3rem;
          font-weight: 800;
          line-height: 1.2;
          letter-spacing: -1px;
          margin-bottom: 1.25rem;
        }

        .hero-subtitle-responsive {
          font-size: 1.15rem;
          color: #cbd5e1;
          line-height: 1.6;
          max-width: 780px;
          margin: 0 auto 2.2rem auto;
        }

        .hero-actions-container {
          display: flex;
          justify-content: center;
          gap: 1rem;
        }

        .features-grid-responsive {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
          margin-top: 3rem;
        }

        /* Mobile Screens (<= 768px) */
        @media (max-width: 768px) {
          .landing-navbar-container {
            padding: 0.75rem 1rem;
          }

          .landing-brand-logo {
            height: 36px;
          }

          .landing-links-desktop {
            display: none;
          }

          .mobile-toggle-btn {
            display: block;
          }

          .mobile-dropdown-menu.open {
            display: flex;
          }

          .hero-section-custom {
            padding: 6.5rem 1rem 3rem 1rem;
            min-height: auto;
          }

          .hero-title-responsive {
            font-size: 1.95rem;
            line-height: 1.25;
          }

          .hero-subtitle-responsive {
            font-size: 0.95rem;
            margin-bottom: 1.75rem;
          }

          .hero-actions-container {
            flex-direction: column;
            width: 100%;
            max-width: 320px;
            margin: 0 auto;
          }

          .features-grid-responsive {
            grid-template-columns: 1fr;
            gap: 1.25rem;
            margin-top: 2rem;
          }
        }
      `}</style>

      {/* Navigation Bar */}
      <nav className="landing-navbar-container">
        <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
          <img src="/logo.jpeg" alt="Galgotias Logo" className="landing-brand-logo" />
        </Link>

        <div className="landing-links-desktop">
          <a href="#features" className="nav-text-link">Features</a>
          <Link to="/login" className="nav-text-link">Sign In</Link>
          <Link to="/register" className="nav-register-btn">Register</Link>
        </div>

        <button
          className="mobile-toggle-btn"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle Navigation"
        >
          {isMobileMenuOpen ? '✕' : '☰'}
        </button>
      </nav>

      {/* Mobile Drawer Menu */}
      <div className={`mobile-dropdown-menu ${isMobileMenuOpen ? 'open' : ''}`}>
        <a
          href="#features"
          className="nav-text-link"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          Features
        </a>
        <Link
          to="/login"
          className="nav-text-link"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          Sign In
        </Link>
        <Link
          to="/register"
          className="nav-register-btn"
          style={{ textAlign: 'center' }}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          Register
        </Link>
      </div>

      {/* Hero Section */}
      <section
        className="hero-section-custom"
        style={{ backgroundImage: `url(${backgroundImageUrl})` }}
      >
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.8) 0%, rgba(15, 23, 42, 0.95) 100%)',
          zIndex: 1
        }} />

        <div style={{ position: 'relative', zIndex: 2, width: '100%', maxWidth: '900px' }}>
          <span style={{
            display: 'inline-block',
            padding: '0.4rem 1rem',
            background: 'rgba(99, 102, 241, 0.25)',
            border: '1px solid rgba(99, 102, 241, 0.4)',
            borderRadius: '9999px',
            color: '#a5b4fc',
            fontSize: '0.85rem',
            fontWeight: '600',
            marginBottom: '1.25rem'
          }}>
            Smart Automated Hostel Platform
          </span>

          <h1 className="hero-title-responsive">
            Seamless Hostel Management & Anti-Proxy Check-Ins
          </h1>

          <p className="hero-subtitle-responsive">
            A real-time ecosystem featuring room-level QR sticker verification, live selfie audit streams, digital leave workflows, and warden control panels.
          </p>

          <div className="hero-actions-container">
            <Link
              to="/register"
              style={{
                backgroundColor: '#4f46e5',
                color: '#ffffff',
                padding: '0.85rem 2rem',
                borderRadius: '8px',
                fontWeight: '600',
                textDecoration: 'none',
                textAlign: 'center'
              }}
            >
              Get Started
            </Link>
            <Link
              to="/login"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                color: '#ffffff',
                padding: '0.85rem 2rem',
                borderRadius: '8px',
                fontWeight: '600',
                textDecoration: 'none',
                textAlign: 'center',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}
            >
              Access Portal
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section id="features" style={{ padding: '4.5rem 1.5rem', backgroundColor: '#0f172a' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', width: '100%' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem' }}>
              Designed for Modern Campuses
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
              Everything students and wardens need in one synchronized system.
            </p>
          </div>

          <div className="features-grid-responsive">
            <div style={{
              background: '#1e293b',
              padding: '1.75rem',
              borderRadius: '12px',
              border: '1px solid #334155'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>📸</div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Selfie & QR Verification</h3>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.5' }}>
                Eliminates proxy attendance through assigned room QR codes and automatic camera capture.
              </p>
            </div>

            <div style={{
              background: '#1e293b',
              padding: '1.75rem',
              borderRadius: '12px',
              border: '1px solid #334155'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>⚡</div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Real-Time Live Feed</h3>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.5' }}>
                Wardens monitor incoming student check-ins instantly over high-speed WebSocket connections.
              </p>
            </div>

            <div style={{
              background: '#1e293b',
              padding: '1.75rem',
              borderRadius: '12px',
              border: '1px solid #334155'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>📝</div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Leaves & Complaints</h3>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.5' }}>
                Submit digital leave applications and maintenance tickets directly from the student portal.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;