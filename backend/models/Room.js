const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  hostelBlock: { type: String, required: true },
  roomNumber: { type: String, required: true },
  qrToken: { type: String, required: true, unique: true },
  qrImageUrl: { type: String, required: true }
}, { timestamps: true });

// Compound unique index to prevent duplicate rooms per block
roomSchema.index({ hostelBlock: 1, roomNumber: 1 }, { unique: true });

module.exports = mongoose.model('Room', roomSchema);