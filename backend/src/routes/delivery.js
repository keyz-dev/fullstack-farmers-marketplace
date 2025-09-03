
const express = require('express');
const router = express.Router();
const { authenticateUser, authorizeRoles } = require('../middleware/auth');
const {
  createDeliveryRequest,
  respondToDelivery,
  getAgentDeliveries
} = require('../controller/delivery');

// Create delivery request (admin/farmer can dispatch)
router.post('/dispatch', authenticateUser, authorizeRoles('admin', 'farmer'), createDeliveryRequest);

// Agent responds to delivery request
router.patch('/respond/:requestId', authenticateUser, authorizeRoles('delivery_agent'), respondToDelivery);

// Get delivery requests for agent
router.get('/agent-deliveries', authenticateUser, authorizeRoles('delivery_agent'), getAgentDeliveries);

module.exports = router;
