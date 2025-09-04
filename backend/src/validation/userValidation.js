const Joi = require("joi");

// Common contact information schema
const contactInfoSchema = Joi.object({
  type: Joi.string()
    .valid(
      "phone",
      "whatsapp",
      "facebook",
      "instagram",
      "website",
      "business_email"
    )
    .required(),
  value: Joi.string().required(),
});

// Common coordinates schema
const coordinatesSchema = Joi.object({
  lat: Joi.number().min(-90).max(90).required(),
  lng: Joi.number().min(-180).max(180).required(),
});

// Common address schema
const addressSchema = Joi.object({
  streetAddress: Joi.string().required(),
  city: Joi.string().required(),
  state: Joi.string().required(),
  country: Joi.string().default("Cameroon"),
  postalCode: Joi.string().default("00000"),
  fullAddress: Joi.string().required(),
  coordinates: coordinatesSchema.optional(),
});

// Common payment method schema
const paymentMethodSchema = Joi.object({
  method: Joi.string()
    .valid(
      "MoMo",
      "OrangeMoney",
      "OM",
      "MTN",
      "bank_transfer",
      "cash_on_delivery"
    )
    .required(),
  value: Joi.object({
    accountNumber: Joi.string().required(),
    accountName: Joi.string().required(),
    bankName: Joi.string().optional(),
    accountType: Joi.string().optional(),
  }).required(),
});

// ShippingSchema
const shippingSchema = Joi.object({
  sameCityRate: Joi.number().min(0).default(1000),
  sameRegionRate: Joi.number().min(0).default(2000),
  sameCountryRate: Joi.number().min(0).default(5000),
  othersRate: Joi.number().min(0).default(15000),
  freeShippingThreshold: Joi.number().min(0).default(50000),
  sameCityDays: Joi.string().default("1-2"),
  sameRegionDays: Joi.string().default("2-3"),
  sameCountryDays: Joi.string().default("3-5"),
  othersDays: Joi.string().default("5-10"),
  deliverLocally: Joi.boolean().default(true),
  deliverNationally: Joi.boolean().default(true),
  deliverInternationally: Joi.boolean().default(false),
  allowCashOnDelivery: Joi.boolean().default(false),
  codConditions: Joi.string().default("").allow(null, ""),
  processingTime: Joi.string().default("1-2 business days"),
});

// Base user validation schema
const baseUserSchema = Joi.object({
  name: Joi.string().min(2).max(100).required().messages({
    "string.min": "Name must be at least 2 characters long",
    "string.max": "Name cannot exceed 100 characters",
    "any.required": "Name is required",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email address",
    "any.required": "Email is required",
  }),
  phone: Joi.string()
    .pattern(/^\+?[1-9]\d{1,14}$/)
    .optional()
    .messages({
      "string.pattern.base": "Please provide a valid phone number",
    }),
  password: Joi.string().min(6).max(255).messages({
    "string.min": "Password must be at least 6 characters long",
    "string.max": "Password cannot exceed 255 characters",
  }),
  gender: Joi.string().valid("male", "female", "prefer_not_say").optional(),
  dob: Joi.date().max("now").optional().messages({
    "date.max": "Date of birth cannot be in the future",
  }),
  address: addressSchema.optional(),
});

const clientRegistrationSchema = baseUserSchema.keys({
  role: Joi.string().valid("client").required(),
});

// Initiate registration schema (for basic user info only)
const initiateRegistrationSchema = baseUserSchema.keys({
  password: Joi.string().min(6).max(255).required().messages({
    "string.min": "Password must be at least 6 characters long",
    "string.max": "Password cannot exceed 255 characters",
    "any.required": "Password is required",
  }),
});

// Farmer-specific schema
const farmerApplicationSchema = Joi.object({
  farmName: Joi.string().trim().min(2).max(100).required(),
  farmType: Joi.string()
    .valid(
      "vegetables",
      "fruits",
      "grains",
      "livestock",
      "poultry",
      "mixed_farming",
      "organic",
      "other"
    )
    .required()
    .messages({
      "any.only": "Please select a valid farm type",
    }),

  farmDescription: Joi.string().required(),
  farmSize: Joi.object({
    acres: Joi.number().min(0.1).required(),
    unit: Joi.string().valid("acres", "hectares").default("acres"),
  }).required(),
  farmingExperience: Joi.number().min(0).max(50).required().messages({
    "number.min": "Farming experience cannot be negative",
    "number.max": "Farming experience cannot exceed 50 years",
  }),
  contactInfo: Joi.array().items(contactInfoSchema).min(1).required().messages({
    "array.min": "At least one contact method is required",
  }),
  farmAddress: addressSchema.required(),
  documentNames: Joi.array().items(Joi.string()).min(1).required().messages({
    "array.min": "At least one document name is required",
  }),

  paymentMethods: Joi.array()
    .items(paymentMethodSchema)
    .min(1)
    .required()
    .messages({
      "array.min": "At least one payment method is required",
    }),

  shipping: shippingSchema.optional(),

  agreedToTerms: Joi.boolean().valid(true).required().messages({
    "any.only": "You must agree to the terms and conditions",
  }),

  marketingConsent: Joi.boolean().default(false),
});

// Delivery agent-specific schema
const deliveryAgentApplicationSchema = Joi.object({
  // Basic business info
  businessName: Joi.string().trim().min(2).max(100).optional().messages({
    "string.min": "Business name must be at least 2 characters long",
    "string.max": "Business name cannot exceed 100 characters",
  }),

  vehicleType: Joi.string()
    .valid("motorcycle", "car", "truck", "bicycle", "van", "other")
    .required(),

  // Service areas (ESSENTIAL)
  serviceAreas: Joi.array()
    .items(Joi.string().trim().min(2))
    .min(1)
    .max(10)
    .optional()
    .messages({
      "array.min": "At least one service area is required",
      "array.max": "Maximum 10 service areas allowed",
      "any.required": "Service areas are required",
    }),

  // Operating hours (ESSENTIAL)
  operatingHours: Joi.array()
    .items(
      Joi.object({
        day: Joi.string()
          .valid(
            "monday",
            "tuesday",
            "wednesday",
            "thursday",
            "friday",
            "saturday",
            "sunday"
          )
          .required(),
        openTime: Joi.string().required(),
        closeTime: Joi.string().required(),
      })
    )
    .min(1)
    .optional()
    .messages({
      "array.min": "At least one operating hour is required",
    }),

  // Delivery preferences (ESSENTIAL)
  deliveryPreferences: Joi.object({
    maxDeliveryRadius: Joi.number().min(5).max(100).default(50).messages({
      "number.min": "Maximum delivery radius must be at least 5km",
      "number.max": "Maximum delivery radius cannot exceed 100km",
    }),
    maxPackageWeight: Joi.number().min(1).max(1000).default(100).messages({
      "number.min": "Maximum package weight must be at least 1kg",
      "number.max": "Maximum package weight cannot exceed 1000kg",
    }),
    maxPackageDimensions: Joi.object({
      length: Joi.number().min(10).max(500).default(100),
      width: Joi.number().min(10).max(500).default(100),
      height: Joi.number().min(10).max(500).default(100),
    }).default(),
    acceptsFragileItems: Joi.boolean().default(false),
    acceptsPerishableItems: Joi.boolean().default(true),
    acceptsLivestock: Joi.boolean().default(false),
  }).optional(),

  // Contact information (ESSENTIAL)
  contactInfo: Joi.array()
    .items(contactInfoSchema)
    .min(1)
    .max(3)
    .required()
    .messages({
      "array.min": "At least one contact method is required",
      "array.max": "Maximum 3 contact methods allowed",
      "any.required": "Contact information is required",
    }),

  // Business address (ESSENTIAL)
  businessAddress: addressSchema.optional(),

  // Payment methods (ESSENTIAL)
  paymentMethods: Joi.array()
    .items(paymentMethodSchema)
    .min(1)
    .required()
    .messages({
      "any.required": "Payment methods are required",
    }),

  // Required documents (ESSENTIAL)
  documentNames: Joi.array().items(Joi.string()).min(1).required().messages({
    "array.min": "At least one document is required",
    "any.required": "Documents are required",
  }),

  // Terms agreement (ESSENTIAL)
  agreedToTerms: Joi.boolean().valid(true).required().messages({
    "any.only": "You must agree to the terms and conditions",
    "any.required": "Terms agreement is required",
  }),
});

// Schema for admin review
const adminReviewSchema = Joi.object({
  status: Joi.string().valid("approved", "rejected", "under_review").required(),
  remarks: Joi.string().max(1000).optional(),
  rejectionReason: Joi.string().max(1000).optional(),
  documentReviews: Joi.array()
    .items(
      Joi.object({
        documentId: Joi.string().required(),
        isApproved: Joi.boolean().required(),
        remarks: Joi.string().max(500).optional(),
      })
    )
    .optional(),
});

// Schema for application updates
const applicationUpdateSchema = Joi.object({
  // Common fields that can be updated
  contactInfo: Joi.array().items(contactInfoSchema).optional(),
  coordinates: coordinatesSchema.optional(),

  // Farmer-specific updates
  farmDescription: Joi.string().min(10).max(1000).optional(),
  farmSize: Joi.object({
    acres: Joi.number().min(0.1).required(),
    unit: Joi.string().valid("acres", "hectares").default("acres"),
  }).optional(),

  // Delivery agent-specific updates
  businessDescription: Joi.string().min(10).max(1000).optional(),
  serviceAreas: Joi.array().items(Joi.string()).min(1).optional(),
  vehicleInfo: Joi.object({
    type: Joi.string()
      .valid("motorcycle", "car", "truck", "bicycle", "van", "other")
      .required(),
    make: Joi.string().required(),
    model: Joi.string().required(),
    year: Joi.number()
      .min(1990)
      .max(new Date().getFullYear() + 1),
    licensePlate: Joi.string().optional(),
  }).optional(),
});

// Login schema
const userLoginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email address",
    "any.required": "Email is required",
  }),
  password: Joi.string().required().messages({
    "any.required": "Password is required",
  }),
});

// Google login schema
const googleLoginSchema = Joi.object({
  access_token: Joi.string().required().messages({
    "any.required": "Access token is required",
  }),
});

// Google sign up schema
const googleSignUpSchema = Joi.object({
  access_token: Joi.string().required().messages({
    "any.required": "Access token is required",
  }),
  role: Joi.string()
    .valid(
      "doctor",
      "farmer",
      "client",
      "delivery_agent",
      "admin",
      "incomplete_doctor",
      "incomplete_farmer",
      "incomplete_delivery_agent"
    )
    .required()
    .messages({
      "any.required": "Role is required",
      "any.invalid": "Invalid role",
    }),
});

// Email verification schema
const emailVerificationSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email address",
    "any.required": "Email is required",
  }),
  code: Joi.string().length(6).required().messages({
    "string.length": "Verification code must be 6 characters long",
    "any.required": "Verification code is required",
  }),
});

// Resend verification email schema
const resendVerificationSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email address",
    "any.required": "Email is required",
  }),
});

// Forgot password schema
const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email address",
    "any.required": "Email is required",
  }),
});

// Reset password schema
const resetPasswordSchema = Joi.object({
  newPassword: Joi.string().min(6).max(255).required().messages({
    "string.min": "New password must be at least 6 characters long",
    "string.max": "New password cannot exceed 255 characters",
    "any.required": "New password is required",
  }),
  confirmPassword: Joi.string()
    .valid(Joi.ref("newPassword"))
    .required()
    .messages({
      "any.only": "Passwords do not match",
      "any.required": "Password confirmation is required",
    }),
});

// User update schema (for profile updates)
const userUpdateSchema = Joi.object({
  name: Joi.string().min(2).max(100).optional().messages({
    "string.min": "Name must be at least 2 characters long",
    "string.max": "Name cannot exceed 100 characters",
  }),
  email: Joi.string().email().optional().messages({
    "string.email": "Please provide a valid email address",
  }),
  gender: Joi.string().valid("male", "female", "other").optional(),
  dob: Joi.date().max("now").optional().messages({
    "date.max": "Date of birth cannot be in the future",
  }),
  address: addressSchema.optional(),
  bio: Joi.string().max(2000).optional().messages({
    "string.max": "Bio cannot exceed 2000 characters",
  }),
});

// User password update schema
const userPasswordUpdateSchema = Joi.object({
  oldPassword: Joi.string().required().messages({
    "any.required": "Current password is required",
  }),
  newPassword: Joi.string().min(6).max(255).required().messages({
    "string.min": "New password must be at least 6 characters long",
    "string.max": "New password cannot exceed 255 characters",
    "any.required": "New password is required",
  }),
});

module.exports = {
  farmerApplicationSchema,
  deliveryAgentApplicationSchema,
  adminReviewSchema,
  applicationUpdateSchema,
  clientRegistrationSchema,
  userLoginSchema,
  googleLoginSchema,
  googleSignUpSchema,
  emailVerificationSchema,
  resendVerificationSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  userUpdateSchema,
  userPasswordUpdateSchema,
  initiateRegistrationSchema,
};
