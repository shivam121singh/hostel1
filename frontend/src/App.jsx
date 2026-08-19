import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import WardenDashboard from './pages/WardenDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import AttendanceHistory from './pages/AttendanceHistory';
import RoomMatrix from './pages/RoomMatrix';
import LeavesAndComplaints from './pages/LeavesAndComplaints';
function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Landing Page */}
          <Route path="/" element={<LandingPage />} />
          
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route
            path="/student-dashboard"
            element={
              <ProtectedRoute allowedRole="student">
                <StudentDashboard />
              </ProtectedRoute>
            }
          />

          <Route path="/leaves-complaints" element={<LeavesAndComplaints />} />
          
          <Route path="/attendance-history" element={<AttendanceHistory />} />
          
         <Route path="/room-matrix" element={<RoomMatrix />} />
          <Route
            path="/warden-dashboard"
            element={
              <ProtectedRoute allowedRole="warden">
                <WardenDashboard />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;