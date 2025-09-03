const Joi = require('joi');

const commonSchema = {
  name: Joi.string().min(3).max(30).required().messages({
    'string.base': 'Name should be a type of text',
    'string.empty': 'Name cannot be an empty field',
    'string.min': 'Name should have a minimum length of 3',
    'string.max': 'Name should have a maximum length of 30',
    'any.required': 'Name is a required field'
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Email must be a valid email address',
    'any.required': 'Email is a required field'
  }),
  phone: Joi.string().required(),
  whatsapp: Joi.string().required(),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password should have a minimum length of 6',
    'any.required': 'Password is a required field'
  }),
  confirmPassword: Joi.string().min(6).required().valid(Joi.ref('password')).messages({
    'string.min': 'Confirm Password should have a minimum length of 6',
    'any.required': 'Confirm Password is a required field',
    'any.only': 'Confirm Password should match Password'
  }),
  gender: Joi.string().valid('male', 'female').required(),
  dob: Joi.date().required(),
  address: Joi.string().required(),
  addressCoordinates: Joi.object({
    lng: Joi.number().required(),
    lat: Joi.number().required(),
  }).optional(),
  locationZone: Joi.string().optional(),
};

const clientSchema = Joi.object({
  ...commonSchema,
  role: Joi.string().valid('client').required(),
});

const farmerSchema = Joi.object({
  ...commonSchema,
  role: Joi.string().valid('farmer').required(),
  farmName: Joi.string().required(),
  websiteURL: Joi.string().uri().allow('').optional(),
  shopDescription: Joi.string().required(),
  produceTypes: Joi.array().required(),
  shopAddress: Joi.string().required(),
  shopCoordinates: Joi.object({
    lng: Joi.number().required(),
    lat: Joi.number().required(),
  }).optional(),
  deliveryRadiusKm: Joi.number().min(1).required(),
  payment: {
    method: Joi.string().required(),
    accountNumber: Joi.string().required(),
    accountName: Joi.string().required(),
  },
});

const deliveryAgentSchema = Joi.object({
  ...commonSchema,
  role: Joi.string().valid('delivery_agent').required(),
  vehicleType: Joi.string().required(),
  maxDeliveryDistanceKm: Joi.number().min(1).required(),
  deliveryZone: Joi.string().required(),
  currentLocation: Joi.object({
    lng: Joi.number().required(),
    lat: Joi.number().required(),
  }).optional(),
  isAvailable: Joi.boolean().default(false),
  payment: {
    method: Joi.string().required(),
    accountNumber: Joi.string().required(),
    accountName: Joi.string().required(),
  },
});

module.exports = {
  validateClient: (data) => clientSchema.validate(data),
  validateFarmer: (data) => farmerSchema.validate(data),
  validateDelivery: (data) => deliveryAgentSchema.validate(data),
};