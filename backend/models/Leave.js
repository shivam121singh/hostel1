const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    studentName: { type: String, required: true },
    roomNumber: { type: String, required: true },
    hostelBlock: { type: String, required: true },
    phone: { type: String, required: true },
    leaveType: {
      type: String,
      enum: ['Home Visit', 'Outing / Local Pass', 'Emergency', 'Medical'],
      default: 'Home Visit'
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    reason: { type: String, required: true },
    parentContact: { type: String },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending'
    },
    actionTakenBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    remarks: { type: String, default: '' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Leave', leaveSchema);