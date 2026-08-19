const express = require('express');
const router = express.Router();
const { getStudentsByBlock, updateStudent, getAttendanceReport } = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.get('/students', protect, authorize('warden'), getStudentsByBlock);
router.put('/students/:id', protect, authorize('warden'), updateStudent);
router.get('/attendance-report', protect, authorize('warden'), getAttendanceReport);

module.exports = router;