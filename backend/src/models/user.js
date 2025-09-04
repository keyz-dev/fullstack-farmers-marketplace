const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const addressSchema = require("./address");

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
    password: {
      type: String,
      required: false,
      minLength: [6, "Your password should not be less than 6 char"],
      select: false,
    },
    gender: {
      type: String,
      required: false,
      enum: {
        values: ["male", "female", "prefer_not_say"],
        message: "please select correct gender",
      },
    },
    address: addressSchema,
    dob: {
      type: Date,
      required: false,
    },
    role: {
      type: String,
      default: "client",
      required: true,
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
    fcmToken: String,
    avatar: String,
    otp: String,
    otp_expire: Date,
    passwordResetToken: {
      type: String,
      default: null,
      select: false,
    },
    passwordResetTokenExpiresAt: {
      type: Date,
      default: null,
      select: false,
    },

    // Email verification fields
    emailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationCode: String,
    emailVerificationExpires: Date,

    // Auth provider
    authProvider: {
      type: String,
      enum: ["local", "google", "facebook"],
      default: "local",
    },

    // Account status
    isActive: {
      type: Boolean,
      default: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// hashing password before saving user
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 12);
});

// for verify login and password
userSchema.methods.comparePassword = async function (password) {
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
