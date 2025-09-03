const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please Enter Name'],
  },
  description: {
    type: String,
    required: [true, 'Please Enter Description'],
  },
  price: {
    type: Number,
    required: [true, 'Please Enter Price'],
  },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  stock: {
    type: Number,
    required: [true, 'Please Enter Stock'],
  },
  rating: {
    type: Number,
    default: 0
  },
  images: [String],
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  },
  unit: {
    type: String,
    required: [true, 'Please specify unit (kg, pieces, etc.)'],
  },
  isDeliverable: {
    type: Boolean,
    default: true,
  },
  deliveryRadiusKm: {
    type: Number,
    default: 10,
  },
  locationZone: {
    type: String,
  }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
