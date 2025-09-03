const mongoose = require("mongoose");
const addressSchema = require("./address");

const deliveryAgentSchema = new mongoose.Schema(
  {
    // Reference to user
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Basic Business Information
    businessName: {
      type: String,
      trim: true,
      maxlength: 100,
    },

    // Vehicle Information (ESSENTIAL)
    vehicleType: {
      type: String,
      required: true,
      enum: ["motorcycle", "car", "truck", "bicycle", "van", "other"],
    },

    // Service Areas (ESSENTIAL)
    serviceAreas: [
      {
        type: String,
        trim: true,
        minlength: 2,
      },
    ],

    // Operating Hours (ESSENTIAL)
    operatingHours: [
      {
        day: {
          type: String,
          enum: [
            "monday",
            "tuesday",
            "wednesday",
            "thursday",
            "friday",
            "saturday",
            "sunday",
          ],
          required: true,
        },
        openTime: {
          type: String,
          required: true,
        },
        closeTime: {
          type: String,
          required: true,
        },
      },
    ],

    // Delivery Preferences (ESSENTIAL)
    deliveryPreferences: {
      maxDeliveryRadius: {
        type: Number,
        min: 5,
        max: 100,
        default: 50,
      },
      maxPackageWeight: {
        type: Number,
        min: 1,
        max: 1000,
        default: 100,
      },
      maxPackageDimensions: {
        length: {
          type: Number,
          min: 10,
          max: 500,
          default: 100,
        },
        width: {
          type: Number,
          min: 10,
          max: 500,
          default: 100,
        },
        height: {
          type: Number,
          min: 10,
          max: 500,
          default: 100,
        },
      },
      acceptsFragileItems: {
        type: Boolean,
        default: false,
      },
      acceptsPerishableItems: {
        type: Boolean,
        default: true,
      },
      acceptsLivestock: {
        type: Boolean,
        default: false,
      },
    },

    // Contact Information
    contactInfo: [
      {
        type: {
          type: String,
          enum: [
            "phone",
            "whatsapp",
            "facebook",
            "instagram",
            "website",
            "email",
          ],
          required: true,
        },
        value: {
          type: String,
          required: true,
        },
      },
    ],

    // Business Address & Location
    businessAddress: addressSchema,

    // Media
    vehiclePhotos: [String],

    // Documents
    documents: [
      {
        _id: {
          type: String,
          default: () => new mongoose.Types.ObjectId().toString(),
        },
        originalName: String,
        documentName: String,
        fileType: String,
        size: Number,
        url: String,
        adminRemarks: String,
        isApproved: {
          type: Boolean,
          default: null,
        },
      },
    ],

    // Payment Configuration
    paymentMethods: [
      {
        method: {
          type: String,
          enum: [
            "MoMo",
            "OrangeMoney",
            "OM",
            "MTN",
            "bank_transfer",
            "cash_on_delivery",
          ],
          required: true,
        },
        value: {
          accountNumber: String,
          accountName: String,
          bankName: String,
          accountType: String,
        },
        isActive: {
          type: Boolean,
          default: true,
        },
      },
    ],

    // Application Status
    status: {
      type: String,
      enum: ["pending", "under_review", "approved", "rejected", "suspended"],
      default: "pending",
    },

    // Application version (for tracking multiple applications from same user)
    applicationVersion: {
      type: Number,
      default: 1,
    },

    // Admin Review
    adminReview: {
      reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      reviewedAt: Date,
      remarks: String,
      rejectionReason: String,
      approvedDocuments: [String], // Array of approved document filenames
      rejectedDocuments: [String], // Array of rejected document filenames
    },

    // Terms and Consent
    agreedToTerms: {
      type: Boolean,
      required: true,
      default: false,
    },

    // Timestamps
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    approvedAt: Date,
    rejectedAt: Date,

    // Additional fields
    isActive: {
      type: Boolean,
      default: true,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    totalDeliveries: {
      type: Number,
      default: 0,
    },
    totalEarnings: {
      type: Number,
      default: 0,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    currentLocation: {
      lat: Number,
      lng: Number,
      updatedAt: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better performance
deliveryAgentSchema.index({ status: 1 });
deliveryAgentSchema.index({ "businessAddress.city": 1 });
deliveryAgentSchema.index({ "businessAddress.state": 1 });
deliveryAgentSchema.index({ "vehicleInfo.type": 1 });
deliveryAgentSchema.index({ rating: -1 });
deliveryAgentSchema.index({ isAvailable: 1 });
// Allow multiple applications per user, but ensure only one active at a time
deliveryAgentSchema.index({ userId: 1, status: 1 });
// For tracking application history
deliveryAgentSchema.index({ userId: 1, createdAt: -1 });
// For location-based queries
deliveryAgentSchema.index({
  "currentLocation.lat": 1,
  "currentLocation.lng": 1,
});

module.exports = mongoose.model("DeliveryAgent", deliveryAgentSchema);
