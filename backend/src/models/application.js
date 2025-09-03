const mongoose = require("mongoose");

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
      enum: ["pending", "under_review", "approved", "rejected", "suspended"],
      default: "pending",
      index: true,
    },

    // Application version for tracking multiple submissions
    applicationVersion: {
      type: Number,
      default: 1,
    },

    // Dynamic data based on application type
    applicationData: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },

    // Documents with verification status
    documents: [
      {
        _id: {
          type: String,
          default: () => new mongoose.Types.ObjectId().toString(),
        },
        documentType: {
          type: String,
          required: true,
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

// Instance methods
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

module.exports = mongoose.model("Application", applicationSchema);
