const Attendance = require('../models/Attendance');
const AttendanceSession = require('../models/AttendanceSession');
const User = require('../models/User');
const Room = require('../models/Room');
const cloudinary = require('../config/cloudinary');

// 📍 Set your target hostel coordinates & allowed radius

const HOSTEL_LOCATION = {
  latitude: 28.457611,
  longitude: 77.497000,
  radiusMeters: 150 // Covers ~150 meters radius around the hostel building
};

// Haversine formula to calculate distance in meters
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Returns distance in meters
};

// Submit Attendance
const submitAttendance = async (req, res) => {
  try {
    const studentId = req.user._id;
    const { sessionId, scannedQrToken, selfieImage, latitude, longitude } = req.body;

    const student = await User.findById(studentId);

    // GATE 1: Verify Active Session
    const session = await AttendanceSession.findById(sessionId);
    if (!session || !session.isActive) {
      return res.status(400).json({ message: 'No active attendance session found' });
    }

    // GATE 2: Time Window Verification
    const currentTime = new Date();
    if (currentTime > session.endTime) {
      return res.status(400).json({ message: 'Attendance window has expired!' });
    }

    // GATE 3: Geofencing GPS Verification
    if (!latitude || !longitude) {
      return res.status(400).json({
        message: 'Location access is required to mark attendance. Please enable GPS/Location.'
      });
    }

    const distance = calculateDistance(
      latitude,
      longitude,
      HOSTEL_LOCATION.latitude,
      HOSTEL_LOCATION.longitude
    );

    if (distance > HOSTEL_LOCATION.radiusMeters) {
      return res.status(403).json({
        message: `Attendance Failed! You are outside the hostel premises (${Math.round(distance)}m away). Please come inside the hostel building.`
      });
    }

    // GATE 4: Room QR Match Verification
    const assignedRoom = await Room.findOne({
      roomNumber: student.roomNumber,
      hostelBlock: student.hostelBlock
    });

    const expectedQrToken = assignedRoom ? assignedRoom.qrToken : student.roomQrToken;

    if (!expectedQrToken || expectedQrToken !== scannedQrToken) {
      return res.status(403).json({
        message: 'Invalid QR Code! You must scan the QR sticker for your assigned room.'
      });
    }

    // GATE 5: Duplicate Check
    const alreadyMarked = await Attendance.findOne({ studentId, sessionId });
    if (alreadyMarked) {
      return res.status(400).json({ message: 'You have already submitted attendance for this session' });
    }

    // GATE 6: Upload Selfie to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(selfieImage, {
      folder: `attendance_selfies/Block_${student.hostelBlock}`
    });

    // Save Record
    const attendanceRecord = await Attendance.create({
      studentId,
      sessionId,
      date: new Date(),
      status: 'Present',
      selfieUrl: uploadResult.secure_url,
      location: { latitude, longitude }
    });

    // GATE 7: Real-Time WebSocket Broadcast
    if (req.io) {
      req.io.to(`block_${student.hostelBlock}`).emit('student_checked_in', {
        studentId: student._id,
        name: student.name,
        roomNumber: student.roomNumber,
        selfieUrl: uploadResult.secure_url,
        timestamp: new Date()
      });
    }

    res.status(201).json({
      success: true,
      message: 'Attendance marked successfully within hostel premises!',
      record: attendanceRecord
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get personal attendance history for the logged-in student
const getMyAttendanceHistory = async (req, res) => {
  try {
    const studentId = req.user._id;
    const history = await Attendance.find({ studentId })
      .populate('sessionId', 'startTime endTime hostelBlock')
      .sort({ createdAt: -1 });

    res.status(200).json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get block/hostel-wide attendance records (For Warden & Admin)
const getHostelAttendanceHistory = async (req, res) => {
  try {
    const { hostelBlock, date, status } = req.query;
    let query = {};

    if (hostelBlock) {
      const students = await User.find({ hostelBlock }).select('_id');
      const studentIds = students.map((s) => s._id);
      query.studentId = { $in: studentIds };
    }

    if (status) {
      query.status = status;
    }

    if (date) {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      query.createdAt = { $gte: start, $lte: end };
    }

    const records = await Attendance.find(query)
      .populate('studentId', 'name email roomNumber hostelBlock')
      .populate('sessionId', 'startTime endTime hostelBlock')
      .sort({ createdAt: -1 });

    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  submitAttendance,
  getMyAttendanceHistory,
  getHostelAttendanceHistory
};