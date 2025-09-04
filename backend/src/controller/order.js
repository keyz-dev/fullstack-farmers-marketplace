const Order = require('../models/order');
const Product  = require('../models/product');
const {BadRequestError} = require('../utils/errors');
const wrapAsync = require('../error_handler/AsyncError');

// to place an order
const newOrder = wrapAsync(async (req, res, next) => {
  const { orderItems, shippingAddress, paymentMethod, totalAmount } = req.body;

  if (
    !shippingAddress ||
    !orderItems ||
    !totalAmount ||
    orderItems.length === 0
  ) {
    return next(new BadRequestError('some of the input fields is missing', 401));
  }

  // check if the product is in stock and recalculate the total amount
  
  let total = 0;
  for (let i = 0; i < orderItems.length; i++) {
    const product = await Product.findById(orderItems[i].product);
    if (!product) {
      return next(new BadRequestError('Product Not Found', 404));
    }
    if (product.stock < orderItems[i].quantity) {
      return next(
        new BadRequestError(
          `Product ${product.name} is out of stock. Only ${product.stock} left`,
          400
        )
      );
    }
    orderItems[i].price = product.price;
    orderItems[i].farmerId = product.vendor._id;
    total += product.price * orderItems[i].quantity;
  }


  const order = new Order({
    clientId: req.authUser._id,
    orderItems,
    shippingAddress,
    paymentMethod,
    totalAmount: total
  });

  const createdOrder = await order.save();

  // reduce the stock of the product
  for (let i = 0; i < orderItems.length; i++) {
    const product = await Product.findById(orderItems[i].product);
    product.stock -= orderItems[i].quantity;
    await product.save();
  }

  res.status(201).json({
    success: true,
    message: 'Order Placed Successfully',
  });
});

const getAdminOrders = wrapAsync(async (req, res, next) => {
  const orders = await Order.find({});

  res.status(200).json({
    success: true,
    orders,
  });
});

const getMyOrders = wrapAsync(async (req, res, next) => {
  const orders = await Order.find({ client: req.authUser._id });

  res.status(200).json({
    success: true,
    orders,
  });
});

const getSingleOrder = wrapAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id)
    .populate('client', 'name email')
    .populate('orderItems.product', 'name price');

  if (!order) return next(new BadRequestError('Order Not Found', 404));
  if (order.client.toString() !== req.authUser._id.toString()) {
    return next(new BadRequestError('You are not authorized to view this order', 403));
  }

  res.status(200).json({
    success: true,
    order,
  });
});

const proccessOrder = wrapAsync(async (req, res, next) => {
  const order = await Order.findById(req.params._id);
  if (!order) return next(new BadRequestError('Order Not Found', 404));

  if (order.orderStatus === 'Preparing') order.orderStatus = 'Shipped';
  else if (order.orderStatus === 'Shipped') {
    order.orderStatus = 'Delivered';
    order.deliveredAt = new Date(Date.now());
  } else return next(new BadRequestError('Order Already Delivered', 400));

  await order.save();

  res.status(200).json({
    success: true,
    message: 'Order Processed Successfully',
  });
});

// ================= Vendor Side ===================

const getVendorOrders = async (req, res) => {
  const orders = await Order.find({ 'orderItems.vendor': req.authUser._id }).sort('-createdAt');

  res.status(200).json({
    success: true,
    orders,
  });
};

const confirmVendorOrder = async (req, res) => {
  const { deliveryMethod } = req.body;

  const order = await Order.findById(req.params.id);

  if (order) {
    // Make sure the vendor is involved in this order
    const vendorInOrder = order.orderItems.find(
      (item) => item.vendor.toString() === req.authUser._id.toString()
    );

    if (!vendorInOrder) {
      return res.status(401).json({ message: 'Not authorized for this order' });
    }

    // You can later store deliveryMethod in a subdocument if you want
    vendorInOrder.deliveryConfirmed = true;
    vendorInOrder.deliveryMethod = deliveryMethod;
    await order.save();

    res.json({ message: 'Order confirmed successfully' });
  } else {
    res.status(404).json({ message: 'Order not found' });
  }
};

const   updateDeliveryStatus = async (req, res) => {
  const { deliveryStatus } = req.body;

  const order = await Order.findById(req.params.id);

  if (order) {
    const vendorInOrder = order.orderItems.find(
      (item) => item.vendor.toString() === req.authUser._id.toString()
    );

    if (!vendorInOrder) {
      return res.status(401).json({ message: 'Not authorized for this order' });
    }
    
    order.deliveryStatus = deliveryStatus;
    if (deliveryStatus === 'delivered') {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
    }
    await order.save();

    res.json({ message: 'Delivery status updated' });
  } else {
    res.status(404).json({ message: 'Order not found' });
  }
};

module.exports = {
  newOrder,
  getAdminOrders,
  getSingleOrder,
  proccessOrder,
  getMyOrders,
  getVendorOrders,
  confirmVendorOrder,
  updateDeliveryStatus
};
