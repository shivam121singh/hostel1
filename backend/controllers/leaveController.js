const Leave = require('../models/Leave');

// @desc    Apply for a leave / outpass (Student)
// @route   POST /api/leaves/apply
const applyLeave = async (req, res) => {
  try {
    const { leaveType, startDate, endDate, reason, parentContact } = req.body;

    const leave = await Leave.create({
      studentId: req.user._id,
      studentName: req.user.name,
      roomNumber: req.user.roomNumber,
      hostelBlock: req.user.hostelBlock,
      phone: req.user.phone || 'N/A',
      leaveType,
      startDate,
      endDate,
      reason,
      parentContact
    });

    res.status(201).json({ success: true, message: 'Leave application submitted successfully', leave });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get student's own leaves
// @route   GET /api/leaves/my-leaves
const getMyLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find({ studentId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(leaves);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all block leaves (Warden)
// @route   GET /api/leaves/block/:hostelBlock
const getBlockLeaves = async (req, res) => {
  try {
    const { hostelBlock } = req.params;
    const leaves = await Leave.find({
      hostelBlock: new RegExp(`^${hostelBlock}$`, 'i')
    }).sort({ createdAt: -1 });

    res.status(200).json(leaves);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Approve or Reject leave (Warden)
// @route   PUT /api/leaves/:id/status
const updateLeaveStatus = async (req, res) => {
  try {
    const { status, remarks } = req.body;
    const leave = await Leave.findByIdAndUpdate(
      req.params.id,
      {
        status,
        remarks,
        actionTakenBy: req.user._id
      },
      { new: true }
    );

    if (!leave) return res.status(404).json({ message: 'Leave request not found' });

    res.status(200).json({ success: true, message: `Leave ${status}`, leave });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { applyLeave, getMyLeaves, getBlockLeaves, updateLeaveStatus };