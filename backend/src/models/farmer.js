const mongoose = require("mongoose");
const addressSchema = require("./address");

const farmerSchema = new mongoose.Schema(
  {
    // Reference to user
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Basic Farm Information
    farmName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    farmType: {
      type: String,
      required: true,
      enum: [
        "vegetables",
        "fruits",
        "grains",
        "livestock",
        "poultry",
        "mixed_farming",
        "organic",
        "other",
      ],
    },
    farmDescription: {
      type: String,
      required: true,
      maxlength: 1000,
    },

    // Farm Details
    farmSize: {
      acres: {
        type: Number,
        required: true,
        min: 0.1,
      },
      unit: {
        type: String,
        enum: ["acres", "hectares"],
        default: "acres",
      },
    },
    farmingExperience: {
      type: Number,
      required: true,
      min: 0,
      max: 50,
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

    // Farm Address & Location
    farmAddress: addressSchema,

    // Farm Media
    farmPhotos: [String],

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

    // shipping details
    shipping: {
      sameCityRate: {
        type: Number,
        default: 1000,
        min: 0,
      },
      sameRegionRate: {
        type: Number,
        default: 2000,
        min: 0,
      },
      sameCountryRate: {
        type: Number,
        default: 5000,
        min: 0,
      },
      othersRate: {
        type: Number,
        default: 15000,
        min: 0,
      },
      freeShippingThreshold: {
        type: Number,
        default: 50000,
        min: 0,
      },
      sameCityDays: {
        type: String,
        default: "1-2",
      },
      sameRegionDays: {
        type: String,
        default: "2-3",
      },
      sameCountryDays: {
        type: String,
        default: "3-5",
      },
      othersDays: {
        type: String,
        default: "5-10",
      },
      deliverLocally: {
        type: Boolean,
        default: true,
      },
      deliverNationally: {
        type: Boolean,
        default: true,
      },
      deliverInternationally: {
        type: Boolean,
        default: false,
      },
      allowCashOnDelivery: {
        type: Boolean,
        default: false,
      },
      codConditions: {
        type: String,
        default: "",
      },
      processingTime: {
        type: String,
        default: "1-2 business days",
      },
    },

    // Terms and Consent
    agreedToTerms: {
      type: Boolean,
      required: true,
      default: false,
    },
    marketingConsent: {
      type: Boolean,
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
    totalSales: {
      type: Number,
      default: 0,
    },
    totalOrders: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better performance
farmerSchema.index({ status: 1 });
farmerSchema.index({ "farmAddress.city": 1 });
farmerSchema.index({ "farmAddress.state": 1 });
farmerSchema.index({ farmType: 1 });
farmerSchema.index({ rating: -1 });
// Allow multiple applications per user, but ensure only one active at a time
farmerSchema.index({ userId: 1, status: 1 });
// For tracking application history
farmerSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model("Farmer", farmerSchema);
