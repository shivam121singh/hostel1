const User = require('../models/User');
const Attendance = require('../models/Attendance');

// @desc    Get all students for a warden's hostel block
// @route   GET /api/admin/students
// @access  Private (Warden)
const getStudentsByBlock = async (req, res) => {
  try {
    const students = await User.find({
      role: 'student',
      hostelBlock: req.user.hostelBlock
    }).select('-password').sort({ roomNumber: 1 });

    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update student details (Room reassignment / Block transfer)
// @route   PUT /api/admin/students/:id
// @access  Private (Warden)
const updateStudent = async (req, res) => {
  try {
    const { roomNumber, hostelBlock } = req.body;

    const student = await User.findById(req.params.id);
    if (!student || student.role !== 'student') {
      return res.status(404).json({ message: 'Student not found' });
    }

    student.roomNumber = roomNumber || student.roomNumber;
    student.hostelBlock = hostelBlock || student.hostelBlock;

    await student.save();
    res.json({ success: true, message: 'Student profile updated successfully', student });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get attendance history/report for CSV export
// @route   GET /api/admin/attendance-report
// @access  Private (Warden)
const getAttendanceReport = async (req, res) => {
  try {
    const records = await Attendance.find()
      .populate({
        path: 'studentId',
        select: 'name roomNumber hostelBlock email'
      })
      .sort({ createdAt: -1 });

    // Filter records matching warden's block
    const blockRecords = records.filter(
      r => r.studentId && r.studentId.hostelBlock === req.user.hostelBlock
    );

    res.json(blockRecords);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getStudentsByBlock, updateStudent, getAttendanceReport };