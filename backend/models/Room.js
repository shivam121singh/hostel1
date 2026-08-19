const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
  roomNumber: {
    type: String,
    required: true,
  },
  hostelBlock: {
    type: String,
    required: true,
  },
  capacity: {
    type: Number,
    default: 3,
  },
  qrToken: {
    type: String,
    default: '',
  },
  qrImageUrl: {
    type: String,
    required: false, // <-- Isko false kar dein ya required hata dein
    default: '',
  },
  occupants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Room', RoomSchema);