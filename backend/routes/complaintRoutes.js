const express = require('express');
const router = express.Router();
const { createComplaint, getMyComplaints, getBlockComplaints, updateComplaintStatus } = require('../controllers/complaintController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.post('/create', protect, createComplaint);
router.get('/my-complaints', protect, getMyComplaints);
router.get('/block/:hostelBlock', protect, authorize('warden', 'admin'), getBlockComplaints);
router.put('/:id/status', protect, authorize('warden', 'admin'), updateComplaintStatus);

module.exports = router;