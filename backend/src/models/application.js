const mongoose = require("mongoose");
const addressSchema = require("./address");

const applicationSchema = new mongoose.Schema(
  {
    // Basic application info
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    applicationType: {
      type: String,
      enum: ["farmer", "delivery_agent"],
      required: true,
      index: true,
    },

    // Application status
    status: {
      type: String,
      enum: [
        "draft",
        "pending",
        "under_review",
        "approved",
        "rejected",
        "suspended",
      ],
      default: "draft",
      index: true,
    },

    // Application version for tracking multiple submissions
    applicationVersion: {
      type: Number,
      default: 1,
    },

    // ==================== FARMER-SPECIFIC FIELDS ====================
    // Basic Farm Information
    farmName: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    farmType: {
      type: String,
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
      maxlength: 1000,
    },

    // Farm Details
    farmSize: {
      acres: {
        type: Number,
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
      min: 0,
      max: 50,
    },

    // Farm Media
    farmPhotos: [String],

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

    // ==================== DELIVERY AGENT-SPECIFIC FIELDS ====================
    // Basic Business Information
    businessName: {
      type: String,
      trim: true,
      maxlength: 100,
    },

    // Vehicle Information
    vehicleType: {
      type: String,
      enum: ["motorcycle", "car", "truck", "bicycle", "van", "other"],
    },

    // Service Areas
    serviceAreas: [
      {
        type: String,
        trim: true,
        minlength: 2,
      },
    ],

    // Operating Hours
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
        },
        openTime: String,
        closeTime: String,
      },
    ],

    // Delivery Preferences
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

    // Media
    vehiclePhotos: [String],

    // ==================== COMMON FIELDS ====================
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
        },
        value: String,
      },
    ],

    // Address & Location (can be farmAddress or businessAddress)
    farmAddress: addressSchema,
    businessAddress: addressSchema,

    // Documents with verification status
    documents: [
      {
        _id: {
          type: String,
          default: () => new mongoose.Types.ObjectId().toString(),
        },
        documentType: {
          type: String,
          enum: [
            // Common documents
            "national_id",
            "profile_photo",
            // Farmer specific
            "farm_license",
            "land_ownership",
            "farming_certificate",
            // Delivery agent specific
            "drivers_license",
            "vehicle_registration",
            "vehicle_insurance",
            "background_check",
          ],
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
        verifiedAt: Date,
        verifiedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        verificationNotes: String,
        uploadedAt: {
          type: Date,
          default: Date.now,
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

    // Admin review details
    adminReview: {
      reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      reviewedAt: Date,
      remarks: String,
      rejectionReason: String,
      suspensionReason: String,
      approvedDocuments: [String],
      rejectedDocuments: [String],
      reviewNotes: String,
    },

    // Timestamps
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    reviewedAt: Date,
    approvedAt: Date,
    rejectedAt: Date,
    suspendedAt: Date,

    // Additional metadata
    isActive: {
      type: Boolean,
      default: true,
    },

    // Terms and consent
    agreedToTerms: {
      type: Boolean,
      required: true,
      default: false,
    },
    marketingConsent: {
      type: Boolean,
      default: false,
    },

    // ==================== PERFORMANCE METRICS ====================
    // Rating and reviews
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

    // Farmer-specific metrics
    totalSales: {
      type: Number,
      default: 0,
    },
    totalOrders: {
      type: Number,
      default: 0,
    },

    // Delivery agent-specific metrics
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

    // Application metadata
    metadata: {
      ipAddress: String,
      userAgent: String,
      submissionMethod: {
        type: String,
        enum: ["mobile_app", "web_admin"],
        default: "mobile_app",
      },
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for performance
applicationSchema.index({ userId: 1, applicationType: 1 });
applicationSchema.index({ status: 1, applicationType: 1 });
applicationSchema.index({ submittedAt: -1 });
applicationSchema.index({ "adminReview.reviewedBy": 1 });

// Type-specific indexes
applicationSchema.index({ "farmAddress.city": 1 });
applicationSchema.index({ "farmAddress.state": 1 });
applicationSchema.index({ farmType: 1 });
applicationSchema.index({ "businessAddress.city": 1 });
applicationSchema.index({ "businessAddress.state": 1 });
applicationSchema.index({ vehicleType: 1 });
applicationSchema.index({ rating: -1 });
applicationSchema.index({ isAvailable: 1 });
applicationSchema.index({
  "currentLocation.lat": 1,
  "currentLocation.lng": 1,
});

// Instance methods
applicationSchema.methods.isDraft = function () {
  return this.status === "draft";
};

applicationSchema.methods.isPending = function () {
  return this.status === "pending";
};

applicationSchema.methods.isUnderReview = function () {
  return this.status === "under_review";
};

applicationSchema.methods.isApproved = function () {
  return this.status === "approved";
};

applicationSchema.methods.isRejected = function () {
  return this.status === "rejected";
};

applicationSchema.methods.canBeReviewed = function () {
  return this.status === "pending" || this.status === "under_review";
};

applicationSchema.methods.canBeApproved = function () {
  return this.status === "under_review";
};

applicationSchema.methods.canBeRejected = function () {
  return this.status === "under_review";
};

// Pre-save middleware
applicationSchema.pre("save", function (next) {
  // Set submittedAt if not provided
  if (!this.submittedAt) {
    this.submittedAt = new Date();
  }

  // Set review timestamps based on status changes
  if (this.isModified("status")) {
    const now = new Date();
    switch (this.status) {
      case "under_review":
        this.reviewedAt = now;
        break;
      case "approved":
        this.approvedAt = now;
        break;
      case "rejected":
        this.rejectedAt = now;
        break;
      case "suspended":
        this.suspendedAt = now;
        break;
    }
  }

  next();
});

// Static methods
applicationSchema.statics.findByUserAndType = function (
  userId,
  applicationType
) {
  return this.findOne({ userId, applicationType, isActive: true });
};

applicationSchema.statics.findPendingApplications = function (
  applicationType = null
) {
  const query = { status: "pending", isActive: true };
  if (applicationType) {
    query.applicationType = applicationType;
  }
  return this.find(query);
};

applicationSchema.statics.findUnderReviewApplications = function (
  applicationType = null
) {
  const query = { status: "under_review", isActive: true };
  if (applicationType) {
    query.applicationType = applicationType;
  }
  return this.find(query);
};

applicationSchema.statics.findDraftApplications = function (
  applicationType = null
) {
  const query = { status: "draft", isActive: true };
  if (applicationType) {
    query.applicationType = applicationType;
  }
  return this.find(query);
};

// Type-specific static methods
applicationSchema.statics.findFarmers = function (query = {}) {
  return this.find({ applicationType: "farmer", ...query });
};

applicationSchema.statics.findDeliveryAgents = function (query = {}) {
  return this.find({ applicationType: "delivery_agent", ...query });
};

module.exports = mongoose.model("Application", applicationSchema);
