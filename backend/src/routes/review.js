
const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/auth');
const {
  createReview,
  getUserReviews
} = require('../controller/review');

// Create review
router.post('/', authenticateUser, createReview);

// Get reviews for a user
router.get('/:userId', getUserReviews);

module.exports = router;
