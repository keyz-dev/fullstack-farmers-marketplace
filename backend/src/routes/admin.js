
const express = require('express');
const router = express.Router();
const { authenticateUser, authorizeRoles } = require('../middleware/auth');
const {
  getAllFarmers,
  getAllDeliveryAgents,
  updateUserStatus,
  getStats
} = require('../controller/admin');

// All routes require admin authentication
router.use(authenticateUser, authorizeRoles('admin'));

// Get all farmers
router.get('/farmers', getAllFarmers);

// Get all delivery agents
router.get('/delivery-agents', getAllDeliveryAgents);

// Approve/reject user
router.patch('/users/:id/status', updateUserStatus);

// Get platform statistics
router.get('/stats', getStats);

module.exports = router;
