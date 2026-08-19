const User = require('../models/User');
const Room = require('../models/Room');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// Helper function to generate JWT Token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '30d' });
};

// @desc    Register a new Student or Warden
// @route   POST /api/auth/register
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, hostelBlock, roomNumber, phone, secretKey } = req.body;

    const normalizedRole = (role || 'student').toLowerCase();

    // 1. Security Gate: Warden/Admin verification
    if (normalizedRole === 'warden' || normalizedRole === 'admin') {
      const validSecret = process.env.WARDEN_REGISTRATION_SECRET || 'HostelMaster2026!';
      if (!secretKey || secretKey !== validSecret) {
        return res.status(403).json({
          message: 'Invalid authorization passkey! Only verified staff can register as Warden/Admin.'
        });
      }
    }

    // 2. Check if user already exists
    const userExists = await User.findOne({ email: email.toLowerCase().trim() });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // 3. Room assignment & auto-creation for student
    let roomQrToken = null;
    if (normalizedRole === 'student') {
      if (!roomNumber) {
        return res.status(400).json({ message: 'Room number is required for student registration' });
      }
      if (!phone) {
        return res.status(400).json({ message: 'Mobile number is required for student registration' });
      }

      // Find room or auto-create if missing
      let room = await Room.findOne({ 
        hostelBlock, 
        roomNumber: roomNumber.toString().trim() 
      });

      if (!room) {
        const token = crypto.randomBytes(16).toString('hex');
        room = await Room.create({
          roomNumber: roomNumber.toString().trim(),
          hostelBlock,
          capacity: 3,
          qrToken: token,
          qrImageUrl: `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${token}`
        });
      }

      roomQrToken = room.qrToken;
    }

    // 4. Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 5. Create user record
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: normalizedRole,
      hostelBlock,
      roomNumber: normalizedRole === 'student' ? roomNumber.toString().trim() : undefined,
      roomQrToken: normalizedRole === 'student' ? roomQrToken : undefined,
      phone: normalizedRole === 'student' ? phone.toString().trim() : undefined
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      hostelBlock: user.hostelBlock,
      roomNumber: user.roomNumber,
      phone: user.phone,
      token: generateToken(user._id, user.role)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Authenticate User & get token
// @route   POST /api/auth/login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      hostelBlock: user.hostelBlock,
      roomNumber: user.roomNumber,
      phone: user.phone,
      token: generateToken(user._id, user.role)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get Current Logged-in User Profile
// @route   GET /api/auth/me
const getMe = async (req, res) => {
  res.json(req.user);
};

module.exports = {
  registerUser,
  loginUser,
  getMe
};