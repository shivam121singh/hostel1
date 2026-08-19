const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'warden'], required: true },
  hostelBlock: { type: String, required: true }, // e.g., 'A' or 'B'
  roomNumber: { type: String }, // Required if role === 'student'
  roomQrToken: { type: String }, // SHA-256 room secret for QR check
  attendancePercentage: { type: Number, default: 100 },
  phone: {
  type: String,
  required: function() { return this.role === 'student'; }
}
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);