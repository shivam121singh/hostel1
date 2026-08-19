import React, { useState, useEffect, useContext } from 'react';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const AttendanceHistory = () => {
  const { user } = useContext(AuthContext);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  const isStaff = user?.role === 'warden' || user?.role === 'admin';

  useEffect(() => {
    fetchHistory();
  }, [selectedDate, selectedStatus]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      if (isStaff) {
        let endpoint = `/attendance/all-history?hostelBlock=${user.hostelBlock || ''}`;
        if (selectedDate) endpoint += `&date=${selectedDate}`;
        if (selectedStatus) endpoint += `&status=${selectedStatus}`;
        const res = await API.get(endpoint);
        setHistory(res.data);
      } else {
        const res = await API.get('/attendance/my-history');
        setHistory(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="dashboard-container" style={{ maxWidth: '1100px', margin: '2rem auto', padding: '0 1rem' }}>
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <h2 className="card-title" style={{ margin: 0 }}>Attendance Log & History</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                {isStaff ? `Showing all attendance records for Block ${user.hostelBlock}` : 'Your complete attendance records'}
              </p>
            </div>

            {/* Filter controls for Warden/Admin */}
            {isStaff && (
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                />
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                >
                  <option value="">All Statuses</option>
                  <option value="Present">Present</option>
                  <option value="Absent">Absent</option>
                </select>
                <button
                  onClick={() => { setSelectedDate(''); setSelectedStatus(''); }}
                  style={{ padding: '0.5rem 0.75rem', background: '#e2e8f0', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                >
                  Reset
                </button>
              </div>
            )}
          </div>

          {loading ? (
            <p style={{ color: 'var(--text-muted)' }}>Loading records...</p>
          ) : history.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem 0' }}>No attendance records found.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="custom-table">
                <thead>
                  <tr>
                    {isStaff && <th>Student Details</th>}
                    {isStaff && <th>Room</th>}
                    <th>Date</th>
                    <th>Time</th>
                    <th>Status</th>
                    <th>Selfie Proof</th>
                    <th>GPS Verified</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((record) => (
                    <tr key={record._id}>
                      {isStaff && (
                        <td>
                          <strong>{record.studentId?.name || 'N/A'}</strong>
                          <br />
                          <small style={{ color: 'var(--text-muted)' }}>{record.studentId?.email}</small>
                        </td>
                      )}
                      {isStaff && <td>{record.studentId?.roomNumber || 'N/A'}</td>}
                      <td>{new Date(record.createdAt || record.date).toLocaleDateString()}</td>
                      <td>{new Date(record.createdAt || record.date).toLocaleTimeString()}</td>
                      <td>
                        <span className={`badge badge-${record.status === 'Present' ? 'success' : 'danger'}`}>
                          {record.status}
                        </span>
                      </td>
                      <td>
                        {record.selfieUrl ? (
                          <a href={record.selfieUrl} target="_blank" rel="noreferrer" style={{ color: '#2563eb', fontWeight: '600' }}>
                            View Image
                          </a>
                        ) : (
                          'No Image'
                        )}
                      </td>
                      <td>
                        {record.location?.latitude ? (
                          <span style={{ color: '#16a34a', fontSize: '0.85rem' }}>
                            📍 {record.location.latitude.toFixed(4)}, {record.location.longitude.toFixed(4)}
                          </span>
                        ) : (
                          'N/A'
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendanceHistory;