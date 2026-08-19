import React, { useState, useEffect, useContext } from 'react';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import io from 'socket.io-client';

// Use production environment variable with fallback to live Render backend
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'https://hostel1-h0q4.onrender.com';
const socket = io(SOCKET_URL, {
  transports: ['websocket', 'polling'],
  withCredentials: true
});

// Helper to get local date string (YYYY-MM-DD) avoiding UTC day-lag
const getTodayLocalDate = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const RoomMatrix = () => {
  const { user } = useContext(AuthContext);
  const [rooms, setRooms] = useState([]);
  const [selectedDate, setSelectedDate] = useState(getTodayLocalDate());
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.hostelBlock) {
      fetchMatrix();

      // Normalize block room identifier
      const blockRoom = `block_${user.hostelBlock.replace(/\s+/g, '_').toLowerCase()}`;
      socket.emit('join_block', blockRoom);

      // Real-time listener for live check-ins
      const handleCheckIn = (data) => {
        setRooms((prevRooms) =>
          prevRooms.map((room) => {
            if (String(room.roomNumber) === String(data.roomNumber)) {
              const updatedStudents = room.students.map((st) =>
                String(st._id) === String(data.studentId)
                  ? {
                      ...st,
                      isPresent: true,
                      selfieUrl: data.selfieUrl,
                      checkInTime: data.timestamp
                    }
                  : st
              );
              const presentCount = updatedStudents.filter((s) => s.isPresent).length;
              return { ...room, students: updatedStudents, presentCount };
            }
            return room;
          })
        );
      };

      socket.on('student_checked_in', handleCheckIn);

      return () => {
        socket.off('student_checked_in', handleCheckIn);
      };
    }
  }, [user?.hostelBlock, selectedDate]);

  const fetchMatrix = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/session/room-matrix/${encodeURIComponent(user.hostelBlock)}?date=${selectedDate}`);
      setRooms(res.data);
    } catch (err) {
      console.error('Error loading room matrix:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredRooms = rooms.filter((room) => {
    const matchesSearch = room.roomNumber.toString().toLowerCase().includes(searchQuery.toLowerCase());
    if (filterType === 'pending') return matchesSearch && room.presentCount < room.totalOccupants;
    if (filterType === 'full') return matchesSearch && room.presentCount === room.totalOccupants && room.totalOccupants > 0;
    return matchesSearch;
  });

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: '#f8fafc' }}>
      <Navbar />

      <div style={{ maxWidth: '1300px', margin: '2rem auto', padding: '0 1.5rem' }}>
        {/* HEADER SECTION */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
          <div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: '700' }}>
              Hostel Block {user?.hostelBlock} — Room Cards Matrix
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '0.25rem' }}>
              Showing real-time daily attendance per room
            </p>
          </div>

          {/* CONTROLS & DATE SELECTOR */}
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <label style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Select Date:</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              style={{
                padding: '0.5rem 0.75rem',
                borderRadius: '8px',
                border: '1px solid #334155',
                backgroundColor: '#1e293b',
                color: 'white',
                cursor: 'pointer'
              }}
            />

            <input
              type="text"
              placeholder="Search Room..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                padding: '0.5rem 0.75rem',
                borderRadius: '8px',
                border: '1px solid #334155',
                backgroundColor: '#1e293b',
                color: 'white'
              }}
            />

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              style={{
                padding: '0.5rem 0.75rem',
                borderRadius: '8px',
                border: '1px solid #334155',
                backgroundColor: '#1e293b',
                color: 'white'
              }}
            >
              <option value="all">All Rooms</option>
              <option value="pending">Pending Rooms</option>
              <option value="full">100% Present</option>
            </select>
          </div>
        </div>

        {/* ROOM CARDS GRID */}
        {loading ? (
          <p style={{ color: '#94a3b8' }}>Loading room data...</p>
        ) : filteredRooms.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: '#1e293b', borderRadius: '12px' }}>
            <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>No registered student rooms found for Block {user?.hostelBlock}.</p>
            <small style={{ color: '#64748b' }}>As soon as students register with their room numbers, their room cards will appear here.</small>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '1.25rem'
            }}
          >
            {filteredRooms.map((room) => {
              const isAllPresent = room.totalOccupants > 0 && room.presentCount === room.totalOccupants;
              const isPartiallyPresent = room.presentCount > 0 && room.presentCount < room.totalOccupants;

              return (
                <div
                  key={room.roomNumber}
                  style={{
                    backgroundColor: '#1e293b',
                    borderRadius: '12px',
                    padding: '1.25rem',
                    border: `1.5px solid ${
                      isAllPresent ? '#22c55e' : isPartiallyPresent ? '#eab308' : '#334155'
                    }`,
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.2)'
                  }}
                >
                  {/* CARD HEADER */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '1rem',
                      borderBottom: '1px solid #334155',
                      paddingBottom: '0.6rem'
                    }}
                  >
                    <div>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', margin: 0 }}>
                        Room {room.roomNumber}
                      </h3>
                      <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                        Block {room.hostelBlock}
                      </span>
                    </div>

                    <span
                      style={{
                        padding: '0.25rem 0.6rem',
                        borderRadius: '9999px',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        backgroundColor: isAllPresent
                          ? 'rgba(34, 197, 94, 0.2)'
                          : isPartiallyPresent
                          ? 'rgba(234, 179, 8, 0.2)'
                          : 'rgba(239, 68, 68, 0.2)',
                        color: isAllPresent
                          ? '#4ade80'
                          : isPartiallyPresent
                          ? '#fde047'
                          : '#f87171'
                      }}
                    >
                      {room.presentCount} / {room.totalOccupants} Present
                    </span>
                  </div>

                  {/* ROOMMATES LIST */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    {room.students.map((student) => (
                      <div
                        key={student._id}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          backgroundColor: '#0f172a',
                          padding: '0.6rem 0.8rem',
                          borderRadius: '8px',
                          border: '1px solid #1e293b'
                        }}
                      >
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                          <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>
                            {student.name}
                          </div>

                          {/* Direct Click-to-Call Contact Number */}
                          {student.phone && student.phone !== 'N/A' ? (
                            <a
                              href={`tel:${student.phone}`}
                              style={{
                                color: '#38bdf8',
                                textDecoration: 'none',
                                fontSize: '0.8rem',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.25rem',
                                width: 'fit-content'
                              }}
                            >
                              📞 {student.phone}
                            </a>
                          ) : (
                            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                              No phone registered
                            </span>
                          )}

                          {student.checkInTime ? (
                            <div style={{ fontSize: '0.75rem', color: '#4ade80' }}>
                              🕒 Checked in at{' '}
                              {new Date(student.checkInTime).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </div>
                          ) : (
                            <div style={{ fontSize: '0.75rem', color: '#f87171' }}>
                              Not marked yet
                            </div>
                          )}
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          {student.selfieUrl && (
                            <a
                              href={student.selfieUrl}
                              target="_blank"
                              rel="noreferrer"
                              title="Click to view verification selfie"
                            >
                              <img
                                src={student.selfieUrl}
                                alt="selfie"
                                style={{
                                  width: '32px',
                                  height: '32px',
                                  borderRadius: '50%',
                                  objectFit: 'cover',
                                  border: '2px solid #22c55e'
                                }}
                              />
                            </a>
                          )}
                          <span
                            style={{
                              padding: '0.2rem 0.5rem',
                              borderRadius: '4px',
                              fontSize: '0.75rem',
                              fontWeight: 'bold',
                              backgroundColor: student.isPresent ? '#166534' : '#7f1d1d',
                              color: student.isPresent ? '#bbf7d0' : '#fecaca'
                            }}
                          >
                            {student.isPresent ? '✓ Present' : '✗ Absent'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomMatrix;