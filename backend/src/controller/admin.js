
const User = require('../models/user');
const AsyncError = require('../error_handler/AsyncError');

// Get all farmers (admin)
exports.getAllFarmers = AsyncError(async (req, res) => {
  const farmers = await User.find({ role: 'farmer' })
    .select('name farmName email phone locationZone status produceTypes createdAt')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    farmers,
    count: farmers.length
  });
});

// Get all delivery agents (admin)
exports.getAllDeliveryAgents = AsyncError(async (req, res) => {
  const agents = await User.find({ role: 'delivery_agent' })
    .select('name email phone locationZone status vehicleType isAvailable createdAt')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    agents,
    count: agents.length
  });
});

// Approve/Reject user
exports.updateUserStatus = AsyncError(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // 'approved', 'rejected', 'pending'

  if (!['approved', 'rejected', 'pending'].includes(status)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid status. Must be approved, rejected, or pending'
    });
  }

  const user = await User.findByIdAndUpdate(
    id,
    { status },
    { new: true, runValidators: true }
  );

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  res.status(200).json({
    success: true,
    message: `User ${status} successfully`,
    user: {
      _id: user._id,
      name: user.name,
      role: user.role,
      status: user.status
    }
  });
});

// Get platform statistics
exports.getStats = AsyncError(async (req, res) => {
  const totalUsers = await User.countDocuments();
  const totalFarmers = await User.countDocuments({ role: 'farmer' });
  const approvedFarmers = await User.countDocuments({ role: 'farmer', status: 'approved' });
  const totalAgents = await User.countDocuments({ role: 'delivery_agent' });
  const approvedAgents = await User.countDocuments({ role: 'delivery_agent', status: 'approved' });
  const totalclients = await User.countDocuments({ role: 'client' });

  res.status(200).json({
    success: true,
    stats: {
      totalUsers,
      totalFarmers,
      approvedFarmers,
      totalAgents,
      approvedAgents,
      totalclients
    }
  });
});
