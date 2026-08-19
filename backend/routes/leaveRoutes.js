const express = require('express');
const router = express.Router();
const { applyLeave, getMyLeaves, getBlockLeaves, updateLeaveStatus } = require('../controllers/leaveController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.post('/apply', protect, applyLeave);
router.get('/my-leaves', protect, getMyLeaves);
router.get('/block/:hostelBlock', protect, authorize('warden', 'admin'), getBlockLeaves);
router.put('/:id/status', protect, authorize('warden', 'admin'), updateLeaveStatus);

module.exports = router;