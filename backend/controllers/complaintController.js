const Complaint = require('../models/Complaint');

// @desc    File a new complaint (Student)
// @route   POST /api/complaints/create
const createComplaint = async (req, res) => {
  try {
    const { category, title, description } = req.body;

    const complaint = await Complaint.create({
      studentId: req.user._id,
      studentName: req.user.name,
      roomNumber: req.user.roomNumber,
      hostelBlock: req.user.hostelBlock,
      category,
      title,
      description
    });

    res.status(201).json({ success: true, message: 'Complaint registered successfully', complaint });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get student's own complaints
// @route   GET /api/complaints/my-complaints
const getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ studentId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all block complaints (Warden)
// @route   GET /api/complaints/block/:hostelBlock
const getBlockComplaints = async (req, res) => {
  try {
    const { hostelBlock } = req.params;
    const complaints = await Complaint.find({
      hostelBlock: new RegExp(`^${hostelBlock}$`, 'i')
    }).sort({ createdAt: -1 });

    res.status(200).json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update complaint status / mark resolved (Warden)
// @route   PUT /api/complaints/:id/status
const updateComplaintStatus = async (req, res) => {
  try {
    const { status, adminNotes } = req.body;
    const updateData = { status, adminNotes };
    if (status === 'Resolved') {
      updateData.resolvedAt = new Date();
    }

    const complaint = await Complaint.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });

    res.status(200).json({ success: true, message: 'Complaint updated', complaint });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createComplaint, getMyComplaints, getBlockComplaints, updateComplaintStatus };