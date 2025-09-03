const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  city: {
    type: String,
    required: true,
  },  
  street: {
    type: String,
  },
  postalCode: String,
  state: String,
  country: {
    type: String,
    default: 'Cameroon',
  },
});