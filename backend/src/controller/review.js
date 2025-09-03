
const Review = require('../models/review');
const User = require('../models/user');
const Order = require('../models/order');
const AsyncError = require('../error_handler/AsyncError');

// Create a review
exports.createReview = AsyncError(async (req, res) => {
  const { targetId, rating, comment } = req.body;
  const reviewerId = req.user._id;

  // Check if target user exists and is farmer or delivery_agent
  const targetUser = await User.findById(targetId);
  if (!targetUser || !['farmer', 'delivery_agent'].includes(targetUser.role)) {
    return res.status(404).json({
      success: false,
      message: 'Target user not found or not reviewable'
    });
  }

  // Check if reviewer has had interaction with target (through orders)
  let hasInteraction = false;
  if (targetUser.role === 'farmer') {
    hasInteraction = await Order.exists({
      clientId: reviewerId,
      farmerId: targetId,
      status: 'delivered'
    });
  } else if (targetUser.role === 'delivery_agent') {
    hasInteraction = await Order.exists({
      clientId: reviewerId,
      deliveryAgentId: targetId,
      status: 'delivered'
    });
  }

  if (!hasInteraction) {
    return res.status(400).json({
      success: false,
      message: 'You can only review farmers/agents you have completed transactions with'
    });
  }

  // Check if already reviewed
  const existingReview = await Review.findOne({
    reviewerId,
    targetId
  });

  if (existingReview) {
    return res.status(400).json({
      success: false,
      message: 'You have already reviewed this user'
    });
  }

  const review = await Review.create({
    reviewerId,
    targetId,
    rating,
    comment
  });

  res.status(201).json({
    success: true,
    review
  });
});

// Get reviews for a user
exports.getUserReviews = AsyncError(async (req, res) => {
  const { userId } = req.params;

  const reviews = await Review.find({ targetId: userId })
    .populate('reviewerId', 'name avatar')
    .sort({ createdAt: -1 });

  // Calculate average rating
  const avgRating = reviews.length > 0
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;

  res.json({
    success: true,
    reviews,
    averageRating: avgRating.toFixed(1),
    totalReviews: reviews.length
  });
});
