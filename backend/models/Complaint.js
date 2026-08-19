const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    studentName: { type: String, required: true },
    roomNumber: { type: String, required: true },
    hostelBlock: { type: String, required: true },
    category: {
      type: String,
      enum: ['Electrical', 'Plumbing', 'Cleanliness / Housekeeping', 'Carpentry / Furniture', 'Wi-Fi / Internet', 'Other'],
      required: true
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: ['Open', 'In Progress', 'Resolved'],
      default: 'Open'
    },
    resolvedAt: { type: Date },
    adminNotes: { type: String, default: '' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Complaint', complaintSchema);