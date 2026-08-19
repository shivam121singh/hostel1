import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    hostelBlock: 'A',
    roomNumber: '',
    phone: '',
    secretKey: ''
  });

  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Ensure phone is provided for student registration
    if (formData.role === 'student' && (!formData.phone || formData.phone.trim().length < 10)) {
      setError('Please provide a valid 10-digit mobile number.');
      return;
    }

    try {
      const response = await API.post('/auth/register', formData);
      login(response.data);

      if (response.data.role === 'warden') {
        navigate('/warden-dashboard');
      } else {
        navigate('/student-dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
<div className="landing-brand">
          <img src="/logo.jpeg" alt="galgotias Logo" className="landing-logo" />
        </div>        <p className="auth-subtitle">Create New Account</p>

        {error && <div className="alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="Shivam Singh"
            />
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="shivam@hostel.com"
            />
          </div>

          {/* Role Selection */}
          <div className="form-group">
            <label>Role</label>
            <select name="role" value={formData.role} onChange={handleChange}>
              <option value="student">Student</option>
              <option value="warden">Warden</option>
            </select>
          </div>

          {/* Mobile Number Input for Student */}
          {formData.role === 'student' && (
            <div className="form-group">
              <label>Mobile Number</label>
              <input
                type="tel"
                name="phone"
                required
                maxLength="10"
                value={formData.phone}
                onChange={handleChange}
                placeholder="9334343740"
              />
            </div>
          )}

          {/* Conditional Secret Key Gate for Warden Role */}
          {formData.role === 'warden' && (
            <div className="form-group">
              <label style={{ color: 'var(--primary)', fontWeight: '600' }}>
                Warden Security Passkey
              </label>
              <input
                type="password"
                name="secretKey"
                required
                value={formData.secretKey}
                onChange={handleChange}
                placeholder="Enter authorized warden passkey"
              />
            </div>
          )}

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
            />
          </div>

          <div className="form-group">
            <label>Hostel Block</label>
            <select name="hostelBlock" value={formData.hostelBlock} onChange={handleChange}>
              <option value="A">Block A</option>
              <option value="B">Block B</option>
            </select>
          </div>

          {formData.role === 'student' && (
            <div className="form-group">
              <label>Room Number</label>
              <input
                type="text"
                name="roomNumber"
                required
                value={formData.roomNumber}
                onChange={handleChange}
                placeholder="101"
              />
            </div>
          )}

          <button type="submit" className="btn-primary" style={{ marginTop: '0.5rem' }}>
            Register
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '600' }}>Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;