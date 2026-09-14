import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  const backgroundImageUrl = '/image.jpeg';
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      backgroundColor: '#090d16',
      color: '#f8fafc',
      margin: 0,
      padding: 0,
      overflowX: 'hidden'
    }}>
      <style>{`
        /* ================= Modern Ambient Color Scheme ================= */
        .landing-navbar-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.9rem 2.5rem;
          background: #ffffff;
          border-bottom: 1px solid #e2e8f0;
          box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.05);
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
          gap: 2rem;
        }

        .nav-text-link {
          color: #1e293b;
          text-decoration: none;
          font-weight: 600;
          font-size: 0.95rem;
          transition: color 0.2s ease;
        }

        .nav-text-link:hover {
          color: #06b6d4;
        }

        .nav-register-btn {
          background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%);
          color: #ffffff;
          padding: 0.55rem 1.35rem;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 600;
          font-size: 0.95rem;
          box-shadow: 0 4px 12px rgba(6, 182, 212, 0.25);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .nav-register-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(6, 182, 212, 0.35);
        }

        .mobile-toggle-btn {
          display: none;
          background: transparent;
          border: none;
          color: #0f172a;
          font-size: 1.6rem;
          cursor: pointer;
        }

        .mobile-dropdown-menu {
          display: none;
          flex-direction: column;
          gap: 1.1rem;
          padding: 1.25rem 1.5rem;
          background-color: #ffffff;
          border-bottom: 1px solid #e2e8f0;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          position: fixed;
          top: 65px;
          left: 0;
          width: 100%;
          z-index: 999;
          box-sizing: border-box;
        }

        /* Hero Styling with Gradient Aura */
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
          padding: 8rem 1.5rem 4.5rem 1.5rem;
          box-sizing: border-box;
          overflow: hidden;
        }

        .hero-gradient-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle at top center, rgba(6, 182, 212, 0.18) 0%, rgba(9, 13, 22, 0.88) 55%, #090d16 100%);
          z-index: 1;
        }

        .hero-title-responsive {
          font-size: 3.4rem;
          font-weight: 800;
          line-height: 1.15;
          letter-spacing: -1px;
          margin-bottom: 1.4rem;
        }

        .text-gradient {
          background: linear-gradient(135deg, #38bdf8 0%, #818cf8 50%, #c084fc 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .hero-subtitle-responsive {
          font-size: 1.15rem;
          color: #94a3b8;
          line-height: 1.7;
          max-width: 760px;
          margin: 0 auto 2.5rem auto;
        }

        .hero-actions-container {
          display: flex;
          justify-content: center;
          gap: 1.25rem;
        }

        .btn-primary-aesthetic {
          background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%);
          color: #ffffff;
          padding: 0.9rem 2.2rem;
          border-radius: 10px;
          font-weight: 600;
          text-decoration: none;
          box-shadow: 0 10px 25px -5px rgba(6, 182, 212, 0.35);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .btn-primary-aesthetic:hover {
          transform: translateY(-2px);
          box-shadow: 0 14px 28px -5px rgba(6, 182, 212, 0.45);
        }

        .btn-secondary-aesthetic {
          background: rgba(255, 255, 255, 0.04);
          color: #f8fafc;
          padding: 0.9rem 2.2rem;
          border-radius: 10px;
          font-weight: 600;
          text-decoration: none;
          border: 1px solid rgba(255, 255, 255, 0.12);
          backdrop-filter: blur(10px);
          transition: background 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
        }

        .btn-secondary-aesthetic:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 255, 255, 0.25);
          transform: translateY(-2px);
        }

        /* Glassmorphic Feature Cards */
        .features-grid-responsive {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(290px, 1fr));
          gap: 2rem;
          margin-top: 3.5rem;
        }

        .glass-card {
          background: rgba(17, 24, 39, 0.7);
          backdrop-filter: blur(12px);
          border-radius: 16px;
          padding: 2.2rem;
          border: 1px solid rgba(255, 255, 255, 0.07);
          box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.5);
          transition: transform 0.25s ease, border-color 0.25s ease;
        }

        .glass-card:hover {
          transform: translateY(-6px);
          border-color: rgba(56, 189, 248, 0.4);
        }

        .feature-icon-badge {
          width: 52px;
          height: 52px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.6rem;
          border-radius: 12px;
          margin-bottom: 1.25rem;
          background: rgba(6, 182, 212, 0.12);
          border: 1px solid rgba(6, 182, 212, 0.25);
        }

        /* Responsive Breakpoints */
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
            padding: 7rem 1.25rem 3.5rem 1.25rem;
            min-height: auto;
          }

          .hero-title-responsive {
            font-size: 2.1rem;
            line-height: 1.2;
          }

          .hero-subtitle-responsive {
            font-size: 0.95rem;
            margin-bottom: 2rem;
          }

          .hero-actions-container {
            flex-direction: column;
            width: 100%;
            max-width: 320px;
            margin: 0 auto;
          }

          .btn-primary-aesthetic,
          .btn-secondary-aesthetic {
            width: 100%;
            text-align: center;
            padding: 0.85rem;
          }

          .features-grid-responsive {
            grid-template-columns: 1fr;
            gap: 1.25rem;
            margin-top: 2rem;
          }

          .glass-card {
            padding: 1.6rem;
          }
        }
      `}</style>

      {/* Pure White Top Navigation */}
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

      {/* Mobile Menu Dropdown */}
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
        <div className="hero-gradient-overlay" />

        <div style={{ position: 'relative', zIndex: 2, width: '100%', maxWidth: '920px' }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.45rem 1.2rem',
            background: 'rgba(6, 182, 212, 0.1)',
            border: '1px solid rgba(6, 182, 212, 0.3)',
            borderRadius: '9999px',
            color: '#38bdf8',
            fontSize: '0.85rem',
            fontWeight: '600',
            letterSpacing: '0.3px',
            marginBottom: '1.5rem',
            backdropFilter: 'blur(8px)'
          }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#22c55e' }} />
            Next-Gen Smart Campus Ecosystem
          </span>

          <h1 className="hero-title-responsive">
            Automated Hostel Verification <br />
            <span className="text-gradient">Zero-Proxy Attendance</span>
          </h1>

          <p className="hero-subtitle-responsive">
            Eliminate paper logs with multi-factor check-ins. Combining room-level QR validation, high-precision GPS geofencing, verified selfie snapshots, and real-time warden matrix feeds.
          </p>

          <div className="hero-actions-container">
            <Link to="/register" className="btn-primary-aesthetic">
              Get Started Free
            </Link>
            <Link to="/login" className="btn-secondary-aesthetic">
              Access Portal
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section id="features" style={{ padding: '5.5rem 1.5rem', backgroundColor: '#090d16', borderTop: '1px solid #111827' }}>
        <div style={{ maxWidth: '1140px', margin: '0 auto', width: '100%' }}>
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <span style={{ color: '#06b6d4', fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Engineered For Security
            </span>
            <h2 style={{ fontSize: '2.4rem', fontWeight: '800', marginTop: '0.4rem', marginBottom: '0.6rem', color: '#f8fafc' }}>
              Built for Modern Campus Living
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '1rem', maxWidth: '600px', margin: '0 auto' }}>
              Everything students and wardens need synchronized into one seamless dashboard.
            </p>
          </div>

          <div className="features-grid-responsive">
            <div className="glass-card">
              <div className="feature-icon-badge">📸</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.6rem', color: '#f1f5f9' }}>
                Selfie & QR Verification
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '0.92rem', lineHeight: '1.6' }}>
                Eliminates proxy mark-ins using assigned room QR tokens verified alongside live device camera captures.
              </p>
            </div>

            <div className="glass-card">
              <div className="feature-icon-badge">📍</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.6rem', color: '#f1f5f9' }}>
                150m GPS Geofencing
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '0.92rem', lineHeight: '1.6' }}>
                Submissions outside hostel grounds are rejected instantly using Haversine radial distance calculations.
              </p>
            </div>

            <div className="glass-card">
              <div className="feature-icon-badge">⚡</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.6rem', color: '#f1f5f9' }}>
                Real-Time Room Matrix
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '0.92rem', lineHeight: '1.6' }}>
                Socket.IO streams live check-ins directly to the warden dashboard with color-coded status badges and click-to-call.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;