const AttendanceSession = require('../models/AttendanceSession');
const Attendance = require('../models/Attendance');
const Room = require('../models/Room');
const User = require('../models/User');

// Start a 10-minute session
const startSession = async (req, res) => {
  try {
    const { hostelBlock } = req.body;

    // Safely extract warden user ID from token
    const wardenId = req.user?._id || req.user?.id;

    if (!wardenId) {
      return res.status(401).json({ message: 'User not authenticated or invalid token' });
    }

    // Deactivate any currently active sessions for this block
    await AttendanceSession.updateMany(
      { hostelBlock, isActive: true },
      { isActive: false }
    );

    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + 10 * 60000); // 10 minutes from now

    // Create session with createdBy populated
    const session = await AttendanceSession.create({
      hostelBlock,
      createdBy: wardenId,
      wardenId,
      startTime,
      endTime,
      isActive: true
    });

    if (req.io) {
      req.io.to(`block_${hostelBlock}`).emit('session_started', {
        session,
        message: `Attendance session started for Block ${hostelBlock}`
      });
    }

    res.status(201).json({ success: true, session });
  } catch (error) {
    console.error('Start Session Error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Stop/Close the active session immediately
const stopSession = async (req, res) => {
  try {
    const { hostelBlock } = req.body;

    const session = await AttendanceSession.findOneAndUpdate(
      { hostelBlock, isActive: true },
      { isActive: false, endTime: new Date() },
      { new: true }
    );

    if (!session) {
      return res.status(404).json({ message: 'No active session found to stop' });
    }

    if (req.io) {
      req.io.to(`block_${hostelBlock}`).emit('session_ended', {
        message: `Attendance session closed by Warden for Block ${hostelBlock}`
      });
    }

    res.status(200).json({ success: true, message: 'Session stopped successfully', session });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Check if a session is currently active
const getActiveSession = async (req, res) => {
  try {
    const block = req.params.block || req.params.hostelBlock;
    const session = await AttendanceSession.findOne({
      hostelBlock: block,
      isActive: true,
      endTime: { $gt: new Date() }
    });

    res.json({ active: !!session, session });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get dynamic datewise room cards matrix directly from registered students with phone numbers
const getRoomMatrix = async (req, res) => {
  try {
    const { hostelBlock } = req.params;
    const { date } = req.query; // Format: "YYYY-MM-DD"

    // 1. Calculate the start and end of the chosen date
    const targetDate = date ? new Date(date) : new Date();
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    // 2. Fetch all registered students for this block (includes 'phone')
    const blockRegex = new RegExp(`^(${hostelBlock}|Block\\s*${hostelBlock})$`, 'i');
    const students = await User.find({
      $or: [{ hostelBlock: blockRegex }, { block: blockRegex }],
      role: 'student'
    })
      .select('name email roomNumber hostelBlock phone')
      .lean();

    if (students.length === 0) {
      return res.status(200).json([]);
    }

    // 3. Fetch attendance records for the selected date window
    const studentIds = students.map((s) => s._id);
    const attendances = await Attendance.find({
      studentId: { $in: studentIds },
      $or: [
        { createdAt: { $gte: startOfDay, $lte: endOfDay } },
        { date: { $gte: startOfDay, $lte: endOfDay } }
      ]
    })
      .sort({ createdAt: -1 })
      .lean();

    // Map the most recent attendance entry to each student
    const attendanceMap = new Map();
    attendances.forEach((att) => {
      const sId = att.studentId.toString();
      if (!attendanceMap.has(sId)) {
        attendanceMap.set(sId, att);
      }
    });

    // 4. Group students by room number
    const roomGroups = {};
    students.forEach((student) => {
      const roomKey = student.roomNumber ? String(student.roomNumber).trim() : 'Unassigned';

      if (!roomGroups[roomKey]) {
        roomGroups[roomKey] = {
          roomNumber: roomKey,
          hostelBlock: student.hostelBlock || hostelBlock,
          students: []
        };
      }

      const attRecord = attendanceMap.get(student._id.toString());

      roomGroups[roomKey].students.push({
        _id: student._id,
        name: student.name,
        email: student.email,
        phone: student.phone || 'N/A',
        isPresent: !!attRecord && attRecord.status === 'Present',
        selfieUrl: attRecord?.selfieUrl || null,
        checkInTime: attRecord?.createdAt || attRecord?.date || null
      });
    });

    // 5. Build and sort room card array numerically
    const matrix = Object.values(roomGroups).map((room) => {
      const presentCount = room.students.filter((s) => s.isPresent).length;
      return {
        ...room,
        totalOccupants: room.students.length,
        presentCount
      };
    });

    matrix.sort((a, b) => {
      const numA = parseInt(a.roomNumber, 10);
      const numB = parseInt(b.roomNumber, 10);
      if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
      return a.roomNumber.localeCompare(b.roomNumber);
    });

    res.status(200).json(matrix);
  } catch (error) {
    console.error('Room Matrix Error:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  startSession,
  stopSession,
  getActiveSession,
  getRoomMatrix
};