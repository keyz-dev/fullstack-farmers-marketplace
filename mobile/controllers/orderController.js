const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const asyncHandler = require('express-async-handler');

// @desc    Create a new order
// @route   POST /api/orders
// @access  Private
const createOrder = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    totalAmount,
    deliveryFee,
  } = req.body;

  if (!orderItems || orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
  }

  // We need to group items by farmer (vendor)
  const vendorItemsMap = new Map();

  for (const item of orderItems) {
    const product = await Product.findById(item.product);
    if (!product) {
      res.status(404);
      throw new Error(`Product not found: ${item.product}`);
    }
    const vendorId = product.farmer.toString();

    if (!vendorItemsMap.has(vendorId)) {
      vendorItemsMap.set(vendorId, []);
    }
    vendorItemsMap.get(vendorId).push({
      ...item,
      unitPrice: product.price,
      vendor: vendorId,
    });
  }

  const createdOrders = [];

  for (const [vendorId, items] of vendorItemsMap.entries()) {
    const vendor = await User.findById(vendorId);
    if (!vendor) {
      res.status(404);
      throw new Error(`Vendor not found: ${vendorId}`);
    }

    const orderTotal = items.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0);

    const order = new Order({
      client: req.user._id, // Assuming req.user is the authenticated client
      farmer: vendorId,
      orderItems: items,
      shippingAddress,
      paymentMethod,
      totalAmount: orderTotal,
      deliveryFee,
      // other fields can be set to defaults or passed in body
    });

    const createdOrder = await order.save();
    createdOrders.push(createdOrder);
  }

  res.status(201).json(createdOrders);
});

// @desc    Get logged in user orders
// @route   GET /api/orders
// @access  Private
const getOrders = asyncHandler(async (req, res) => {
  // Check user role to return appropriate orders
  if (req.user.role === 'farmer') {
    const orders = await Order.find({ farmer: req.user._id }).populate('client', 'name email');
    res.json(orders);
  } else {
    const orders = await Order.find({ client: req.user._id }).populate('farmer', 'name email');
    res.json(orders);
  }
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('client', 'name email')
    .populate('farmer', 'name email')
    .populate('orderItems.product', 'name image');

  if (order) {
    // Optional: Check if user is authorized to view this order
    if (order.client._id.toString() !== req.user._id.toString() && order.farmer._id.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('User not authorized to view this order');
    }
    res.json(order);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private (Farmer)
const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    if (order.farmer.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Only the farmer can update the order status');
    }
    order.status = req.body.status || order.status;
    order.deliveryStatus = req.body.deliveryStatus || order.deliveryStatus;

    // If delivered, set deliveredAt
    if (req.body.status === 'delivered') {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
    }
    
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Update payment status
// @route   PUT /api/orders/:id/payment
// @access  Private
const updatePaymentStatus = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
  
    if (order) {
      // Logic to confirm payment (could be from a webhook or admin action)
      order.paymentStatus = req.body.paymentStatus || order.paymentStatus;
      if (req.body.paymentStatus === 'paid') {
        order.paymentTime = Date.now();
      }
      
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404);
      throw new Error('Order not found');
    }
  });

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  updatePaymentStatus,
}; 