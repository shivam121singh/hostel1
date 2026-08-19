import React, { useState, useEffect, useContext } from 'react';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const LeavesAndComplaints = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('leaves'); // 'leaves' or 'complaints'
  
  // Lists
  const [leaves, setLeaves] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);

  // Forms
  const [leaveForm, setLeaveForm] = useState({
    leaveType: 'Home Visit',
    startDate: '',
    endDate: '',
    reason: '',
    parentContact: ''
  });

  const [complaintForm, setComplaintForm] = useState({
    category: 'Electrical',
    title: '',
    description: ''
  });

  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'leaves') {
        const url = user.role === 'warden'
          ? `/leaves/block/${user.hostelBlock}`
          : '/leaves/my-leaves';
        const res = await API.get(url);
        setLeaves(res.data);
      } else {
        const url = user.role === 'warden'
          ? `/complaints/block/${user.hostelBlock}`
          : '/complaints/my-complaints';
        const res = await API.get(url);
        setComplaints(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLeaveSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/leaves/apply', leaveForm);
      setMsg('Leave application submitted!');
      setLeaveForm({ leaveType: 'Home Visit', startDate: '', endDate: '', reason: '', parentContact: '' });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error submitting leave');
    }
  };

  const handleComplaintSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/complaints/create', complaintForm);
      setMsg('Complaint registered!');
      setComplaintForm({ category: 'Electrical', title: '', description: '' });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error submitting complaint');
    }
  };

  const handleUpdateLeave = async (id, status) => {
    try {
      await API.put(`/leaves/${id}/status`, { status });
      fetchData();
    } catch (err) {
      alert('Error updating status');
    }
  };

  const handleUpdateComplaint = async (id, status) => {
    try {
      await API.put(`/complaints/${id}/status`, { status });
      fetchData();
    } catch (err) {
      alert('Error updating complaint');
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: '#f8fafc' }}>
      <Navbar />
      <div style={{ maxWidth: '1100px', margin: '2rem auto', padding: '0 1rem' }}>
        
        {/* TAB SWITCHER */}
        <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid #334155', paddingBottom: '0.75rem' }}>
          <button
            onClick={() => setActiveTab('leaves')}
            style={{
              padding: '0.6rem 1.2rem',
              backgroundColor: activeTab === 'leaves' ? '#3b82f6' : '#1e293b',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            🏠 Home Leaves / Outpass
          </button>
          <button
            onClick={() => setActiveTab('complaints')}
            style={{
              padding: '0.6rem 1.2rem',
              backgroundColor: activeTab === 'complaints' ? '#3b82f6' : '#1e293b',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            🛠 Maintenance & Complaints
          </button>
        </div>

        {msg && <p style={{ color: '#4ade80', marginTop: '1rem' }}>{msg}</p>}

        {/* STUDENT SUBMISSION SECTION */}
        {user.role === 'student' && (
          <div style={{ backgroundColor: '#1e293b', padding: '1.5rem', borderRadius: '12px', marginTop: '1.5rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>
              {activeTab === 'leaves' ? 'Request Leave / Outpass' : 'Submit a Maintenance Complaint'}
            </h3>

            {activeTab === 'leaves' ? (
              <form onSubmit={handleLeaveSubmit} style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
                <div>
                  <label style={{ fontSize: '0.85rem' }}>Leave Type</label>
                  <select
                    value={leaveForm.leaveType}
                    onChange={(e) => setLeaveForm({ ...leaveForm, leaveType: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem', backgroundColor: '#0f172a', color: 'white', border: '1px solid #334155', borderRadius: '6px' }}
                  >
                    <option value="Home Visit">Home Visit</option>
                    <option value="Outing / Local Pass">Outing / Local Pass</option>
                    <option value="Medical">Medical</option>
                    <option value="Emergency">Emergency</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem' }}>From Date</label>
                  <input
                    type="date"
                    required
                    value={leaveForm.startDate}
                    onChange={(e) => setLeaveForm({ ...leaveForm, startDate: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem', backgroundColor: '#0f172a', color: 'white', border: '1px solid #334155', borderRadius: '6px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem' }}>To Date</label>
                  <input
                    type="date"
                    required
                    value={leaveForm.endDate}
                    onChange={(e) => setLeaveForm({ ...leaveForm, endDate: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem', backgroundColor: '#0f172a', color: 'white', border: '1px solid #334155', borderRadius: '6px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem' }}>Parent Contact</label>
                  <input
                    type="tel"
                    placeholder="Parent's Mobile"
                    value={leaveForm.parentContact}
                    onChange={(e) => setLeaveForm({ ...leaveForm, parentContact: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem', backgroundColor: '#0f172a', color: 'white', border: '1px solid #334155', borderRadius: '6px' }}
                  />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ fontSize: '0.85rem' }}>Reason</label>
                  <textarea
                    required
                    rows="2"
                    placeholder="Provide details..."
                    value={leaveForm.reason}
                    onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem', backgroundColor: '#0f172a', color: 'white', border: '1px solid #334155', borderRadius: '6px' }}
                  />
                </div>
                <button type="submit" style={{ gridColumn: '1 / -1', padding: '0.75rem', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                  Submit Leave Request
                </button>
              </form>
            ) : (
              <form onSubmit={handleComplaintSubmit} style={{ display: 'grid', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.85rem' }}>Category</label>
                  <select
                    value={complaintForm.category}
                    onChange={(e) => setComplaintForm({ ...complaintForm, category: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem', backgroundColor: '#0f172a', color: 'white', border: '1px solid #334155', borderRadius: '6px' }}
                  >
                    <option value="Electrical">Electrical (Fan, Light, Switch)</option>
                    <option value="Plumbing">Plumbing (Tap, Flush, Leakage)</option>
                    <option value="Cleanliness / Housekeeping">Cleanliness / Housekeeping</option>
                    <option value="Carpentry / Furniture">Carpentry / Furniture (Bed, Door, Almirah)</option>
                    <option value="Wi-Fi / Internet">Wi-Fi / Internet</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem' }}>Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Room 202 fan not working"
                    value={complaintForm.title}
                    onChange={(e) => setComplaintForm({ ...complaintForm, title: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem', backgroundColor: '#0f172a', color: 'white', border: '1px solid #334155', borderRadius: '6px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem' }}>Description</label>
                  <textarea
                    required
                    rows="3"
                    placeholder="Describe the problem..."
                    value={complaintForm.description}
                    onChange={(e) => setComplaintForm({ ...complaintForm, description: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem', backgroundColor: '#0f172a', color: 'white', border: '1px solid #334155', borderRadius: '6px' }}
                  />
                </div>
                <button type="submit" style={{ padding: '0.75rem', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                  Register Complaint
                </button>
              </form>
            )}
          </div>
        )}

        {/* LIST / STATUS SECTION */}
        <h3 style={{ marginTop: '2rem', marginBottom: '1rem' }}>
          {user.role === 'warden' ? `Block ${user.hostelBlock} ${activeTab === 'leaves' ? 'Leave Requests' : 'Complaints'}` : `My ${activeTab === 'leaves' ? 'Leaves' : 'Complaints'}`}
        </h3>

        {loading ? (
          <p>Loading...</p>
        ) : activeTab === 'leaves' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {leaves.length === 0 ? <p style={{ color: '#64748b' }}>No leave requests found.</p> : leaves.map((lv) => (
              <div key={lv._id} style={{ backgroundColor: '#1e293b', padding: '1rem', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '1rem' }}>{lv.studentName} (Room {lv.roomNumber}) — <span style={{ color: '#38bdf8' }}>{lv.leaveType}</span></div>
                  <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                    📅 {new Date(lv.startDate).toLocaleDateString()} to {new Date(lv.endDate).toLocaleDateString()}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#cbd5e1', marginTop: '0.25rem' }}>💬 Reason: {lv.reason}</div>
                  {lv.parentContact && <div style={{ fontSize: '0.8rem', color: '#f59e0b' }}>📞 Parent: {lv.parentContact}</div>}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{
                    padding: '0.3rem 0.6rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 'bold',
                    backgroundColor: lv.status === 'Approved' ? '#166534' : lv.status === 'Rejected' ? '#7f1d1d' : '#854d0e',
                    color: lv.status === 'Approved' ? '#bbf7d0' : lv.status === 'Rejected' ? '#fecaca' : '#fef08a'
                  }}>
                    {lv.status}
                  </span>

                  {user.role === 'warden' && lv.status === 'Pending' && (
                    <>
                      <button onClick={() => handleUpdateLeave(lv._id, 'Approved')} style={{ backgroundColor: '#22c55e', color: 'white', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '6px', cursor: 'pointer' }}>Approve</button>
                      <button onClick={() => handleUpdateLeave(lv._id, 'Rejected')} style={{ backgroundColor: '#ef4444', color: 'white', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '6px', cursor: 'pointer' }}>Reject</button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {complaints.length === 0 ? <p style={{ color: '#64748b' }}>No complaints found.</p> : complaints.map((cp) => (
              <div key={cp._id} style={{ backgroundColor: '#1e293b', padding: '1rem', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '1rem' }}>[{cp.category}] {cp.title}</div>
                  <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                    Room {cp.roomNumber} ({cp.studentName}) • Filed on {new Date(cp.createdAt).toLocaleDateString()}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#cbd5e1', marginTop: '0.25rem' }}>{cp.description}</div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{
                    padding: '0.3rem 0.6rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 'bold',
                    backgroundColor: cp.status === 'Resolved' ? '#166534' : cp.status === 'In Progress' ? '#854d0e' : '#7f1d1d',
                    color: cp.status === 'Resolved' ? '#bbf7d0' : cp.status === 'In Progress' ? '#fef08a' : '#fecaca'
                  }}>
                    {cp.status}
                  </span>

                  {user.role === 'warden' && cp.status !== 'Resolved' && (
                    <button onClick={() => handleUpdateComplaint(cp._id, 'Resolved')} style={{ backgroundColor: '#22c55e', color: 'white', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '6px', cursor: 'pointer' }}>
                      Mark Resolved
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default LeavesAndComplaints;