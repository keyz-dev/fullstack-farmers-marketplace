
const express = require('express');
const router = express.Router();
const { authenticateUser, authorizeRoles } = require('../middleware/auth');
const {
  initiatePayment,
  handleWebhook,
  requestPayout,
  getPayoutHistory
} = require('../controller/payment');

// Initiate payment
router.post('/initiate', authenticateUser, initiatePayment);

// Campay webhook (no auth needed)
router.post('/webhook', handleWebhook);

// Request payout
router.post('/payout/request', authenticateUser, authorizeRoles('farmer', 'delivery_agent'), requestPayout);

// Get payout history
router.get('/payout/history', authenticateUser, authorizeRoles('farmer', 'delivery_agent'), getPayoutHistory);

module.exports = router;
