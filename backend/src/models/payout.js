
const mongoose = require('mongoose');

const payoutSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'completed'],
    default: 'pending',
  },
  method: {
    type: String,
    enum: ['mobile_money'],
    default: 'mobile_money',
  },
}, { timestamps: true });

module.exports = mongoose.model('Payout', payoutSchema);
