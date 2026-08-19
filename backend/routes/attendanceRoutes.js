const express = require('express');
const router = express.Router();
const {
  submitAttendance,
  getMyAttendanceHistory,
  getHostelAttendanceHistory
} = require('../controllers/attendanceController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.post('/submit', protect, authorize('student'), submitAttendance);
router.get('/my-history', protect, authorize('student'), getMyAttendanceHistory);
router.get('/all-history', protect, authorize('warden', 'admin'), getHostelAttendanceHistory);

module.exports = router;