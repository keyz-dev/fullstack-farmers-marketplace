
const express = require('express');
const router = express.Router();
const { authenticateUser, authorizeRoles } = require('../middleware/auth');
const {
  getFarmersByZone,
  getDeliveryAgentsByZone,
  getFarmerProfile,
} = require('../controller/farmer');

// Get farmers by zone
router.get('/farmers', getFarmersByZone);

// Get delivery agents by zone  
router.get('/delivery-agents', getDeliveryAgentsByZone);

// Get farmer profile with products
router.get('/farmers/:farmerId', getFarmerProfile);


module.exports = router;
