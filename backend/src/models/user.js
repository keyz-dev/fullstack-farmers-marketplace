const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const coordinateSchema = new mongoose.Schema({
  lat: {
    type: Number,
    required: true,
  },
  lng: {
    type: Number,
    required: true,
  },
});

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter the name"],
      minLength: [3, "Your name should be more than 3 char"],
      maxlength: [30, "Your name should not be more than 30 char"],
    },
    email: {
      type: String,
      required: [true, "Please enter the name"],
      unique: true,
      validate: [validator.isEmail, "Not a valid email"],
    },
    phone: String,
    whatsapp: String,
    password: {
      type: String,
      required: [true, "Please enter the password"],
      minLength: [6, "Your password should not be less than 6 char"],
      select: false,
    },
    gender: {
      type: String,
      required: true,
      enum: {
        values: ["male", "female"],
        message: "please select correct gender",
      },
    },
    address: String,
    dob: {
      type: Date,
      required: [true, "please enter date of birth"],
    },
    role: {
      type: String,
      default: "client",
      enum: {
        values: [
          "client",
          "admin",
          "farmer",
          "delivery_agent",
          "incomplete_farmer", // New: waiting for application
          "incomplete_delivery_agent", // New: waiting for application
          "pending_farmer", // New: application submitted, under review
          "pending_delivery_agent", // New: application submitted, under review
        ],
        message: "please select correct role",
      },
    },
    locationZone: String,
    addressCoordinates: coordinateSchema,
    status: {
      type: String,
      default: "pending",
      enum: {
        values: ["pending", "approved", "rejected"],
        message: "please select correct status",
      },
    },
    fcmToken: String,
    avatar: String,
    otp: Number,
    otp_expire: Date,

    // For Farmer
    farmName: String,
    websiteURL: String,
    shopDescription: String,
    shopCoordinates: coordinateSchema,
    shopAddress: String,
    produceTypes: [String],
    deliveryRadiusKm: {
      type: Number,
      default: 10,
    },
    payment: {
      method: String,
      accountNumber: String,
      accountName: String,
    },

    // For Delivery Agent
    vehicleType: String,
    maxDeliveryDistanceKm: {
      type: Number,
      default: 15,
    },
    deliveryZone: [
      { country: { type: String, default: "Cameroon" }, city: String },
    ],
    currentLocation: coordinateSchema,
    isAvailable: {
      type: Boolean,
      default: false,
    },
  },
  { timeStamps: true }
);

// hashing password before saving user
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 12);
});

// for verify login and password
userSchema.methods.compareloginPasssword = async function (password) {
  const match = await bcrypt.compare(password, this.password);
  return match;
};

// Generating JWT token
userSchema.methods.generateAuthToken = async function () {
  let token = jwt.sign(
    {
      id: this._id,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_TIME }
  );

  return token;
};

const User = new mongoose.model("User", userSchema);
module.exports = User;
