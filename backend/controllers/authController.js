const User = require('../models/User');
const Room = require('../models/Room');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Helper function to generate JWT Token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register a new Student or Warden
// @route   POST /api/auth/register
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, hostelBlock, roomNumber, phone, secretKey } = req.body;

    // 1. Security Gate: Warden/Admin verification
    if (role === 'warden' || role === 'admin') {
      const validSecret = process.env.WARDEN_REGISTRATION_SECRET || 'HostelMaster2026!';
      if (!secretKey || secretKey !== validSecret) {
        return res.status(403).json({
          message: 'Invalid authorization passkey! Only verified staff can register as Warden/Admin.'
        });
      }
    }

    // 2. Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // 3. Room validation for student
    let roomQrToken = null;
    if (role === 'student') {
      if (!roomNumber) {
        return res.status(400).json({ message: 'Room number is required for student registration' });
      }
      if (!phone) {
        return res.status(400).json({ message: 'Mobile number is required for student registration' });
      }

      const room = await Room.findOne({ hostelBlock, roomNumber });
      if (!room) {
        return res.status(404).json({ message: 'Assigned room does not exist in system' });
      }
      roomQrToken = room.qrToken;
    }

    // 4. Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 5. Create user record with mobile number
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'student',
      hostelBlock,
      roomNumber: role === 'student' ? roomNumber : undefined,
      roomQrToken: role === 'student' ? roomQrToken : undefined,
      phone: role === 'student' ? phone.trim() : undefined
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

    const user = await User.findOne({ email });
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