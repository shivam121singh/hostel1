import React, { useState, useEffect, useContext, useRef } from 'react';
import Webcam from 'react-webcam';
import { Html5QrcodeScanner } from 'html5-qrcode';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

const StudentDashboard = () => {
  const { user } = useContext(AuthContext);
  const [activeSession, setActiveSession] = useState(null);
  const [qrInput, setQrInput] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);
  const [isScanningQR, setIsScanningQR] = useState(false);

  const [leaves, setLeaves] = useState([]);
  const [complaints, setComplaints] = useState([]);

  // Leave Form State
  const [leaveReason, setLeaveReason] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  // Complaint Form State
  const [complaintCategory, setComplaintCategory] = useState('Plumbing');
  const [complaintDesc, setComplaintDesc] = useState('');

  const webcamRef = useRef(null);

  useEffect(() => {
    if (user?.hostelBlock) {
      socket.emit('join_block', user.hostelBlock);

      socket.on('session_started', (data) => {
        setActiveSession(data.session);
      });

      socket.on('session_ended', () => {
        setActiveSession(null);
      });
    }

    checkActiveSession();
    fetchMyLeaves();
    fetchMyComplaints();

    return () => {
      socket.off('session_started');
      socket.off('session_ended');
    };
  }, [user?.hostelBlock]);

  // QR Scanner Lifecycle Handler
  useEffect(() => {
    let qrScanner = null;

    if (isScanningQR) {
      qrScanner = new Html5QrcodeScanner(
        'qr-reader',
        { fps: 10, qrbox: { width: 250, height: 250 } },
        false
      );

      qrScanner.render(
        (decodedText) => {
          setQrInput(decodedText);
          setIsScanningQR(false);
          qrScanner.clear();
        },
        (error) => {
          // Continuous scan error - ignored
        }
      );
    }

    return () => {
      if (qrScanner) {
        qrScanner.clear().catch((err) => console.error(err));
      }
    };
  }, [isScanningQR]);

  const checkActiveSession = async () => {
    try {
      const res = await API.get(`/session/active/${user.hostelBlock}`);
      if (res.data.active) {
        setActiveSession(res.data.session);
      } else {
        setActiveSession(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAttendanceSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (!qrInput) {
      setMessage({ type: 'danger', text: 'Please scan or paste your Room QR code first.' });
      return;
    }

    if (!webcamRef.current) {
      setMessage({ type: 'danger', text: 'Selfie camera is not ready.' });
      return;
    }

    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) {
      setMessage({ type: 'danger', text: 'Failed to capture selfie frame. Ensure camera permissions are granted.' });
      return;
    }

    if (!navigator.geolocation) {
      setMessage({ type: 'danger', text: 'Geolocation is not supported by your browser.' });
      return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;

          const res = await API.post('/attendance/submit', {
            sessionId: activeSession._id,
            scannedQrToken: qrInput.trim(),
            selfieImage: imageSrc,
            latitude,
            longitude
          });

          setMessage({ type: 'success', text: res.data.message });
          setQrInput('');
        } catch (err) {
          setMessage({
            type: 'danger',
            text: err.response?.data?.message || 'Attendance submission failed'
          });
        } finally {
          setLoading(false);
        }
      },
      (geoError) => {
        setLoading(false);
        setMessage({
          type: 'danger',
          text: 'Location access denied! You must allow GPS/location access to verify you are inside the hostel premises.'
        });
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleApplyLeave = async (e) => {
    e.preventDefault();
    try {
      await API.post('/leave/apply', { reason: leaveReason, fromDate, toDate });
      setLeaveReason('');
      fetchMyLeaves();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateComplaint = async (e) => {
    e.preventDefault();
    try {
      await API.post('/complaint/create', { category: complaintCategory, description: complaintDesc });
      setComplaintDesc('');
      fetchMyComplaints();
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMyLeaves = async () => {
    const res = await API.get('/leave/myleaves');
    setLeaves(res.data);
  };

  const fetchMyComplaints = async () => {
    const res = await API.get('/complaint/mycomplaints');
    setComplaints(res.data);
  };

  return (
    <div>
      <Navbar />
      <div className="dashboard-container">
        {/* ATTENDANCE CARD */}
        <div className="card">
          <h3 className="card-title">Live Room Check-In Scanner</h3>
          {activeSession ? (
            <div>
              <p style={{ color: 'var(--success)', fontWeight: '600', marginBottom: '1rem' }}>
                🟢 Attendance Session Active (Closes at: {new Date(activeSession.endTime).toLocaleTimeString()})
              </p>

              {message.text && (
                <div
                  className="alert-error"
                  style={{
                    background: message.type === 'success' ? '#dcfce7' : '#fee2e2',
                    color: message.type === 'success' ? '#15803d' : '#b91c1c',
                    padding: '0.75rem',
                    borderRadius: '6px',
                    marginBottom: '1rem'
                  }}
                >
                  {message.text}
                </div>
              )}

              {/* QR Scanner vs Selfie View */}
              {isScanningQR ? (
                <div style={{ marginBottom: '1rem' }}>
                  <div id="qr-reader" style={{ width: '100%', maxWidth: '400px', margin: '0 auto' }}></div>
                  <button
                    type="button"
                    onClick={() => setIsScanningQR(false)}
                    style={{
                      marginTop: '0.5rem',
                      background: '#64748b',
                      color: 'white',
                      border: 'none',
                      padding: '0.5rem 1rem',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel QR Scan
                  </button>
                </div>
              ) : (
                <form onSubmit={handleAttendanceSubmit}>
                  <div className="scanner-box" style={{ marginBottom: '1rem' }}>
                    <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" width="100%" />
                  </div>

                  <div className="form-group">
                    <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>Scanned Room QR Token:</span>
                      <button
                        type="button"
                        onClick={() => setIsScanningQR(true)}
                        style={{
                          background: '#3b82f6',
                          color: 'white',
                          border: 'none',
                          padding: '0.3rem 0.75rem',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '0.85rem'
                        }}
                      >
                        📷 Scan QR Code
                      </button>
                    </label>
                    <input
                      type="text"
                      required
                      value={qrInput}
                      onChange={(e) => setQrInput(e.target.value)}
                      placeholder="Click 'Scan QR Code' or paste token manually"
                    />
                  </div>

                  <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? 'Verifying GPS & Submitting...' : 'Verify Selfie & Submit Attendance'}
                  </button>
                </form>
              )}
            </div>
          ) : (
            <p style={{ color: 'var(--text-muted)' }}>
              🔴 No active attendance window open right now for Block {user.hostelBlock}.
            </p>
          )}
        </div>

        {/* LEAVE & COMPLAINT FORMS */}
        <div className="grid-2">
          {/* LEAVE SECTION */}
          <div className="card">
            <h3 className="card-title">Apply for Leave</h3>
            <form onSubmit={handleApplyLeave}>
              <div className="form-group">
                <label>Reason</label>
                <input
                  type="text"
                  required
                  value={leaveReason}
                  onChange={(e) => setLeaveReason(e.target.value)}
                  placeholder="Home Visit"
                />
              </div>
              <div className="form-group">
                <label>From Date</label>
                <input
                  type="date"
                  required
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>To Date</label>
                <input
                  type="date"
                  required
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                />
              </div>
              <button type="submit" className="btn-primary">
                Submit Leave Request
              </button>
            </form>

            <h4 style={{ marginTop: '1.5rem' }}>My Leave Requests</h4>
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Reason</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {leaves.map((l) => (
                  <tr key={l._id}>
                    <td>{l.reason}</td>
                    <td>
                      <span
                        className={`badge badge-${
                          l.status === 'Approved' ? 'success' : l.status === 'Rejected' ? 'danger' : 'warning'
                        }`}
                      >
                        {l.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* COMPLAINT SECTION */}
          <div className="card">
            <h3 className="card-title">Register Complaint</h3>
            <form onSubmit={handleCreateComplaint}>
              <div className="form-group">
                <label>Category</label>
                <select
                  value={complaintCategory}
                  onChange={(e) => setComplaintCategory(e.target.value)}
                >
                  <option value="Plumbing">Plumbing</option>
                  <option value="Electrical">Electrical</option>
                  <option value="Cleanliness">Cleanliness</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Description</label>
                <input
                  type="text"
                  required
                  value={complaintDesc}
                  onChange={(e) => setComplaintDesc(e.target.value)}
                  placeholder="Tap leaking in bathroom"
                />
              </div>
              <button type="submit" className="btn-primary">
                Submit Complaint
              </button>
            </form>

            <h4 style={{ marginTop: '1.5rem' }}>My Complaints</h4>
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {complaints.map((c) => (
                  <tr key={c._id}>
                    <td>{c.category}</td>
                    <td>
                      <span
                        className={`badge badge-${c.status === 'Resolved' ? 'success' : 'warning'}`}
                      >
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;