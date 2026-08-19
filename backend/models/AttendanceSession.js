const mongoose = require('mongoose');

const attendanceSessionSchema = new mongoose.Schema({
  hostelBlock: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('AttendanceSession', attendanceSessionSchema);