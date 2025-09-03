
const DeliveryRequest = require('../models/deliveryRequest');
const Order = require('../models/order');
const User = require('../models/user');
const AsyncError = require('../error_handler/AsyncError');

// Create delivery request and notify agents
exports.createDeliveryRequest = AsyncError(async (req, res) => {
  const { orderId } = req.body;

  const order = await Order.findById(orderId).populate('clientId farmerId');
  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found'
    });
  }

  // Find available delivery agents in the zone
  const availableAgents = await User.find({
    role: 'delivery_agent',
    status: 'approved',
    isAvailable: true,
    'deliveryZone.city': order.deliveryZone
  });

  const deliveryRequest = await DeliveryRequest.create({
    orderId,
    assignedAgents: availableAgents.map(agent => agent._id),
    status: 'pending'
  });

  // TODO: Send FCM notifications to agents
  // sendFCMNotification(availableAgents, order);

  res.status(201).json({
    success: true,
    deliveryRequest,
    message: `Delivery request sent to ${availableAgents.length} agents`
  });
});

// Agent responds to delivery request
exports.respondToDelivery = AsyncError(async (req, res) => {
  const { requestId } = req.params;
  const { response } = req.body; // 'accepted' or 'rejected'
  const agentId = req.user._id;

  const deliveryRequest = await DeliveryRequest.findById(requestId);
  if (!deliveryRequest) {
    return res.status(404).json({
      success: false,
      message: 'Delivery request not found'
    });
  }

  // Check if already responded
  const existingResponse = deliveryRequest.responses.find(
    r => r.agentId.toString() === agentId.toString()
  );

  if (existingResponse) {
    return res.status(400).json({
      success: false,
      message: 'You have already responded to this request'
    });
  }

  // Add response
  deliveryRequest.responses.push({
    agentId,
    response,
    respondedAt: new Date()
  });

  if (response === 'accepted' && deliveryRequest.status === 'pending') {
    // First acceptance - assign the agent
    deliveryRequest.status = 'accepted';

    // Update the order
    await Order.findByIdAndUpdate(deliveryRequest.orderId, {
      deliveryAgentId: agentId,
      status: 'accepted'
    });
  }

  await deliveryRequest.save();

  res.json({
    success: true,
    message: response === 'accepted' ? 'Delivery accepted successfully' : 'Delivery rejected',
    deliveryRequest
  });
});

// Get delivery requests for agent
exports.getAgentDeliveries = AsyncError(async (req, res) => {
  const agentId = req.user._id;

  const deliveryRequests = await DeliveryRequest.find({
    assignedAgents: agentId
  }).populate({
    path: 'orderId',
    populate: {
      path: 'clientId farmerId',
      select: 'name phone locationZone'
    }
  });

  res.json({
    success: true,
    deliveryRequests
  });
});
