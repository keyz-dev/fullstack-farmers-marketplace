
const User = require('../models/user');
const Product = require('../models/product');
const AsyncError = require('../error_handler/AsyncError');

// Get farmers by zone
exports.getFarmersByZone = AsyncError(async (req, res) => {
  const { zone } = req.query;

  const query = {
    role: 'farmer',
    status: 'approved'
  };

  if (zone) {
    query.locationZone = zone;
  }

  const farmers = await User.find(query)
    .select('name farmName locationZone phone whatsapp produceTypes deliveryRadiusKm avatar')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    farmers,
    count: farmers.length
  });
});

// Get delivery agents by zone
exports.getDeliveryAgentsByZone = AsyncError(async (req, res) => {
  const { zone, available } = req.query;

  const query = {
    role: 'delivery_agent',
    status: 'approved'
  };

  if (zone) {
    query['deliveryZone.city'] = zone;
  }

  if (available === 'true') {
    query.isAvailable = true;
  }

  const agents = await User.find(query)
    .select('name locationZone phone vehicleType maxDeliveryDistanceKm isAvailable avatar')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    agents,
    count: agents.length
  });
});

// Get farmer profile with products
exports.getFarmerProfile = AsyncError(async (req, res) => {
  const { farmerId } = req.params;

  const farmer = await User.findOne({
    _id: farmerId,
    role: 'farmer',
    status: 'approved'
  }).select('name farmName locationZone phone whatsapp produceTypes deliveryRadiusKm avatar shopDescription');

  if (!farmer) {
    return res.status(404).json({
      success: false,
      message: 'Farmer not found'
    });
  }

  const products = await Product.find({
    farmerId,
    stock: { $gt: 0 }
  });

  // Generate WhatsApp link
  const whatsappLink = farmer.whatsapp || farmer.phone
    ? `https://wa.me/${(farmer.whatsapp || farmer.phone).replace(/\D/g, '')}?text=Hi%20I'm%20interested%20in%20your%20products`
    : null;

  res.status(200).json({
    success: true,
    farmer: {
      ...farmer.toObject(),
      whatsappLink
    },
    products,
    productsCount: products.length
  });
});
