import React, { useState, useEffect, useContext } from 'react';
import io from 'socket.io-client';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const socket = io('http://localhost:5000');

const WardenDashboard = () => {
  const { user } = useContext(AuthContext);
  const [liveCheckIns, setLiveCheckIns] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [sessionActive, setSessionActive] = useState(false);

  useEffect(() => {
    socket.emit('join_block', user.hostelBlock);

    socket.on('student_checked_in', (data) => {
      setLiveCheckIns((prev) => [data, ...prev]);
    });

    socket.on('session_started', () => {
      setSessionActive(true);
    });

    socket.on('session_ended', () => {
      setSessionActive(false);
    });

    fetchActiveSession();
    fetchBlockLeaves();
    fetchBlockComplaints();

    return () => {
      socket.off('student_checked_in');
      socket.off('session_started');
      socket.off('session_ended');
    };
  }, []);

  const fetchActiveSession = async () => {
    try {
      const res = await API.get(`/session/active/${user.hostelBlock}`);
      setSessionActive(res.data.active);
    } catch (err) {
      console.error(err);
    }
  };

  const startSession = async () => {
    try {
      await API.post('/session/start', { hostelBlock: user.hostelBlock, durationMinutes: 10 });
      setSessionActive(true);
      setLiveCheckIns([]);
    } catch (err) {
      alert(err.response?.data?.message || 'Error starting session');
    }
  };

  const handleStopSession = async () => {
    try {
      const res = await API.post('/session/stop', { hostelBlock: user.hostelBlock });
      setSessionActive(false);
      alert(res.data.message || 'Session stopped successfully');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to stop session');
    }
  };

  const fetchBlockLeaves = async () => {
    try {
      const res = await API.get('/leave/all');
      setLeaves(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchBlockComplaints = async () => {
    try {
      const res = await API.get('/complaint/all');
      setComplaints(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLeaveStatus = async (id, status) => {
    try {
      await API.patch(`/leave/${id}/status`, { status });
      fetchBlockLeaves();
    } catch (err) {
      console.error(err);
    }
  };

  const handleComplaintStatus = async (id, status) => {
    try {
      await API.patch(`/complaint/${id}/status`, { status });
      fetchBlockComplaints();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="dashboard-container">
        {/* SESSION CONTROL CARD */}
        <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h3 className="card-title" style={{ margin: 0 }}>Hostel Block {user.hostelBlock} - Control Center</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.3rem' }}>
              Status: {sessionActive ? '🟢 10-Min Session Running' : '🔴 Idle'}
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <button 
              onClick={startSession} 
              disabled={sessionActive} 
              className="btn-primary" 
              style={{ 
                width: 'auto', 
                padding: '0.6rem 1.2rem', 
                backgroundColor: sessionActive ? 'var(--text-muted)' : 'var(--primary)',
                cursor: sessionActive ? 'not-allowed' : 'pointer'
              }}
            >
              {sessionActive ? 'Session Active...' : 'Start 10-Min Session'}
            </button>

            <button 
              onClick={handleStopSession} 
              disabled={!sessionActive} 
              style={{ 
                width: 'auto', 
                padding: '0.6rem 1.2rem', 
                backgroundColor: !sessionActive ? '#94a3b8' : '#ef4444',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                fontWeight: '600',
                cursor: !sessionActive ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.2s ease'
              }}
            >
              Stop Session
            </button>
          </div>
        </div>

        {/* LIVE CHECK-IN FEED */}
        <div className="card">
          <h3 className="card-title">Real-Time Student Check-In Feed (Socket.IO)</h3>
          {liveCheckIns.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>Waiting for students to scan QR and submit selfie...</p>
          ) : (
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Room</th>
                  <th>Selfie Proof</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {liveCheckIns.map((item, index) => (
                  <tr key={index}>
                    <td><strong>{item.name}</strong></td>
                    <td>{item.roomNumber}</td>
                    <td>
                      <a href={item.selfieUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', fontWeight: '600' }}>
                        View Selfie
                      </a>
                    </td>
                    <td>{new Date(item.timestamp).toLocaleTimeString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* LEAVES & COMPLAINTS MANAGEMENT */}
        <div className="grid-2">
          {/* LEAVE MANAGEMENT */}
          <div className="card">
            <h3 className="card-title">Leave Requests</h3>
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Reason</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {leaves.map((l) => (
                  <tr key={l._id}>
                    <td>{l.studentId?.name} (R-{l.studentId?.roomNumber})</td>
                    <td>{l.reason}</td>
                    <td>
                      {l.status === 'Pending' ? (
                        <div style={{ display: 'flex', gap: '0.3rem' }}>
                          <button onClick={() => handleLeaveStatus(l._id, 'Approved')} style={{ background: 'var(--success)', color: 'white', border: 'none', padding: '0.2rem 0.5rem', borderRadius: '4px', cursor: 'pointer' }}>Approve</button>
                          <button onClick={() => handleLeaveStatus(l._id, 'Rejected')} style={{ background: 'var(--danger)', color: 'white', border: 'none', padding: '0.2rem 0.5rem', borderRadius: '4px', cursor: 'pointer' }}>Reject</button>
                        </div>
                      ) : (
                        <span className={`badge badge-${l.status === 'Approved' ? 'success' : 'danger'}`}>{l.status}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* COMPLAINT MANAGEMENT */}
          <div className="card">
            <h3 className="card-title">Complaints Management</h3>
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Issue</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {complaints.map((c) => (
                  <tr key={c._id}>
                    <td><strong>{c.category}</strong> (R-{c.studentId?.roomNumber})</td>
                    <td>{c.description}</td>
                    <td>
                      {c.status !== 'Resolved' ? (
                        <button onClick={() => handleComplaintStatus(c._id, 'Resolved')} style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: '0.2rem 0.5rem', borderRadius: '4px', cursor: 'pointer' }}>
                          Mark Resolved
                        </button>
                      ) : (
                        <span className="badge badge-success">Resolved</span>
                      )}
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

export default WardenDashboard;