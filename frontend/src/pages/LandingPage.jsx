import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  // You can replace this URL with your local hostel photo (e.g. '/hostel-bg.jpg')
  const backgroundImageUrl = '/image.jpeg';

  return (
    <div style={{ width: '100%' }}>
      {/* Top Navigation Bar */}
      <nav className="landing-nav">
        <div className="landing-brand">
          <img src="/logo.jpeg" alt="galgotias Logo" className="landing-logo" />
        </div>
        <div className="landing-links">
          <a href="#features" className="landing-link" style={{color:"black"}}>Features</a>
          <Link to="/login" className="landing-link" style={{color:"black"}}>Sign In</Link>
          <Link to="/register" className="btn-nav-primary">Register</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        className="hero-section"
        style={{ backgroundImage: `url(${backgroundImageUrl})` }}
      >
        <div className="hero-overlay"></div>
        
        <div className="hero-content">
          <span className="hero-badge">Smart Automated Hostel Platform</span>
          <h1 className="hero-title">
            Seamless Hostel Management & Anti-Proxy Check-Ins
          </h1>
          <p className="hero-subtitle">
            A real-time ecosystem featuring room-level QR sticker verification, live selfie audit streams, digital leave workflows, and warden control panels.
          </p>

          <div className="hero-actions">
            <Link to="/register" className="btn-hero-primary">Get Started</Link>
            <Link to="/login" className="btn-hero-secondary">Access Portal</Link>
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section id="features" className="features-section">
        <div className="features-container">
          <div className="features-heading">
            <h2>Designed for Modern Campuses</h2>
            <p>Everything students and wardens need in one synchronized system.</p>
          </div>

          <div className="features-grid">
            <div className="feature-box">
              <div className="feature-icon">📸</div>
              <h3>Selfie & QR Verification</h3>
              <p>Eliminates proxy attendance through assigned room QR codes and automatic camera capture.</p>
            </div>

            <div className="feature-box">
              <div className="feature-icon">⚡</div>
              <h3>Real-Time Live Feed</h3>
              <p>Wardens monitor incoming student check-ins instantly over high-speed WebSocket connections.</p>
            </div>

            <div className="feature-box">
              <div className="feature-icon">📝</div>
              <h3>Leaves & Complaints</h3>
              <p>Submit digital leave applications and maintenance tickets directly from the student portal.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;