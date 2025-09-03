const { formatImageUrl } = require("../imageUtils.js");
const { formatProductData } = require("./productData.js");

/**
 * Formats an order item with product details including formatted image URLs.
 * @param {Object} orderItem - The order item document with populated product
 * @returns {Object} - Formatted order item data
 */
const formatOrderItem = async (orderItem) => {
  const formattedItem = {
    _id: orderItem._id,
    quantity: orderItem.quantity,
    unitPrice: orderItem.unitPrice,
    variant: orderItem.variant,
  };

  // If product is populated, format it with proper image URLs
  if (orderItem.product && typeof orderItem.product === "object") {
    formattedItem.product = await formatProductData(orderItem.product);
  } else {
    // If product is just an ID, keep it as is
    formattedItem.product = orderItem.product;
  }

  return formattedItem;
};

/**
 * Formats an order object for API response, including formatted product data.
 * @param {Object} order - The order document (Mongoose or plain object)
 * @returns {Object} - Formatted order data
 */
const formatOrderData = async (order) => {
  // Format order items with product details
  const formattedOrderItems = [];
  if (order.orderItems && Array.isArray(order.orderItems)) {
    for (const item of order.orderItems) {
      const formattedItem = await formatOrderItem(item);
      formattedOrderItems.push(formattedItem);
    }
  }

  return {
    _id: order._id,
    orderNumber: order.orderNumber,
    user: order.user,
    guestInfo: order.guestInfo,
    orderItems: formattedOrderItems,
    shippingAddress: order.shippingAddress,
    paymentMethod: order.paymentMethod,
    paymentReference: order.paymentReference,
    paymentStatus: order.paymentStatus,
    paymentTime: order.paymentTime,
    status: order.status,
    totalAmount: order.totalAmount,
    subtotal: order.subtotal,
    shipping: order.shipping,
    tax: order.tax,
    processingFee: order.processingFee,
    notes: order.notes,
    isDelivered: order.isDelivered,
    deliveredAt: order.deliveredAt,
    booking: order.booking,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
  };
};

/**
 * Formats an order object for vendor view - only includes vendor's items with commission handling.
 * @param {Object} order - The order document (Mongoose or plain object)
 * @param {Array} vendorProductIds - Array of vendor's product IDs
 * @returns {Object} - Formatted order data for vendor view
 */
const formatVendorOrderData = async (order, vendorProductIds) => {
  // Filter order items to only include vendor's products
  const vendorOrderItems = [];
  let vendorSubtotal = 0;
  let vendorCommission = 0;

  if (order.orderItems && Array.isArray(order.orderItems)) {
    for (const item of order.orderItems) {
      // Check if this item belongs to the vendor
      const productId =
        item.product && typeof item.product === "object"
          ? item.product._id.toString()
          : item.product.toString();

      if (vendorProductIds.includes(productId)) {
        const formattedItem = await formatOrderItem(item);
        vendorOrderItems.push(formattedItem);

        // Calculate vendor's portion (before commission)
        const itemTotal = item.unitPrice * item.quantity;
        vendorSubtotal += itemTotal;
      }
    }
  }

  // Calculate commission (10%)
  vendorCommission = vendorSubtotal * 0.1;
  const vendorRevenue = vendorSubtotal - vendorCommission;

  return {
    _id: order._id,
    orderNumber: order.orderNumber,
    user: order.user,
    guestInfo: order.guestInfo,
    orderItems: vendorOrderItems,
    shippingAddress: order.shippingAddress,
    paymentMethod: order.paymentMethod,
    paymentReference: order.paymentReference,
    paymentStatus: order.paymentStatus,
    paymentTime: order.paymentTime,
    status: order.status,
    // Vendor-specific calculations
    vendorSubtotal: vendorSubtotal,
    vendorCommission: vendorCommission,
    vendorRevenue: vendorRevenue,
    // Original order totals for reference
    originalTotalAmount: order.totalAmount,
    originalSubtotal: order.subtotal,
    originalShipping: order.shipping,
    originalTax: order.tax,
    originalProcessingFee: order.processingFee,
    notes: order.notes,
    isDelivered: order.isDelivered,
    deliveredAt: order.deliveredAt,
    booking: order.booking,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
  };
};

module.exports = { formatOrderData, formatOrderItem, formatVendorOrderData };
