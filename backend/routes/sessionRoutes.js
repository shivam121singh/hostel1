const express = require('express');
const router = express.Router();

const {
  startSession,
  stopSession,
  getActiveSession,
  getRoomMatrix
} = require('../controllers/sessionController');

const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// Session Control Routes (Warden/Admin)
router.post('/start', protect, authorize('warden', 'admin'), startSession);
router.post('/stop', protect, authorize('warden', 'admin'), stopSession);

// Active Session Check (Accessible by both Students and Staff)
router.get('/active/:hostelBlock', protect, getActiveSession);

// Live Room Matrix / Cards Grid (Warden/Admin)
router.get('/room-matrix/:hostelBlock', protect, authorize('warden', 'admin'), getRoomMatrix);

module.exports = router;