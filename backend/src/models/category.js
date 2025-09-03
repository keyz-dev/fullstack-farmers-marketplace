const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: [true, 'Please Enter Valid Category Name'],
  },
  description: {
    type: String,
    required: [true, 'Please Enter Valid Category Description'],
  },
  image: String
}, { timestamps: true });

const Category = mongoose.model('Category', schema);
module.exports = Category;
