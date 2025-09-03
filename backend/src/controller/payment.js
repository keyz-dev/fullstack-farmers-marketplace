
const Order = require('../models/order');
const Payout = require('../models/payout');
const User = require('../models/user');
const AsyncError = require('../error_handler/AsyncError');
const campayService = require('../utils/campay');

// Initiate payment
exports.initiatePayment = AsyncError(async (req, res) => {
  const { orderId, phoneNumber } = req.body;

  const order = await Order.findById(orderId);
  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found'
    });
  }

  try {
    const paymentData = {
      amount: order.totalAmount,
      phoneNumber,
      description: `Payment for order ${orderId}`,
      orderId
    };

    const paymentResponse = await campayService.initiatePayment(paymentData);

    // Update order with payment reference
    order.paymentMethod = 'momo';
    order.paymentStatus = 'pending';
    await order.save();

    res.status(200).json({
      success: true,
      message: 'Payment initiated successfully',
      paymentReference: paymentResponse.reference,
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Payment initiation failed',
      error: error.message
    });
  }
});

// Campay webhook
exports.handleWebhook = AsyncError(async (req, res) => {
  const { reference, status, external_reference } = req.body;

  try {
    const order = await Order.findById(external_reference);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (status === 'SUCCESSFUL') {
      order.paymentStatus = 'paid';
      order.paymentTime = new Date();
      order.status = 'accepted';
    } else if (status === 'FAILED') {
      order.paymentStatus = 'failed';
    }

    await order.save();

    res.status(200).json({ success: true, message: 'Webhook processed' });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Webhook processing failed',
      error: error.message
    });
  }
});

// Request payout
exports.requestPayout = AsyncError(async (req, res) => {
  const { amount } = req.body;
  const userId = req.user._id;

  // Check if user is farmer or delivery_agent
  if (!['farmer', 'delivery_agent'].includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: 'Only farmers and delivery agents can request payouts'
    });
  }

  const payout = await Payout.create({
    userId,
    amount,
    status: 'pending'
  });

  res.status(201).json({
    success: true,
    payout,
    message: 'Payout request submitted successfully'
  });
});

// Get payout history
exports.getPayoutHistory = AsyncError(async (req, res) => {
  const userId = req.user._id;

  const payouts = await Payout.find({ userId }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    payouts,
    count: payouts.length
  });
});
