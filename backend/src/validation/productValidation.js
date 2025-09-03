const Joi = require("joi");

// Some product units: kg, g, lbs, piece, dozen, bunch, liter

const createProductSchema = Joi.object({
    name: Joi.string().min(3).max(100).required().messages({
        'string.empty': 'Product name is required.',
        'string.min': 'Product name must be at least 3 characters long.',
        'string.max': 'Product name cannot be longer than 100 characters.',
    }),
    description: Joi.string().min(10).max(1000).required().messages({
        'string.empty': 'A detailed product description is required.',
        'string.min': 'Description should be at least 10 characters long to be helpful for clients.',
    }),
    category: Joi.string().required().messages({
        'any.required': 'Product category is required.',
    }),
    price: Joi.number().positive().precision(2).required().messages({
        'number.base': 'Price must be a number.',
        'number.positive': 'Price must be a positive value.',
        'any.required': 'Price is required.',
    }),
    unit: Joi.string().required().messages({
        'any.required': 'The unit for the price is required.',
    }),
    stock: Joi.number().integer().min(0).required().messages({
        'number.base': 'Stock must be a whole number.',
        'number.min': 'Stock cannot be negative.',
        'any.required': 'Stock quantity is required.',
    }),
    isDeliverable: Joi.boolean().required().messages({
        'any.required': 'Delivery availability is required.',
    }),
    deliveryRadiusKm: Joi.number().min(1).required().messages({
        'number.base': 'Delivery radius must be a number.',
        'number.min': 'Delivery radius must be at least 1 km.',
        'any.required': 'Delivery radius is required.',
    }),
    locationZone: Joi.string().required().messages({
        'any.required': 'Location zone is required.',
    }),
});

const updateProductSchema = Joi.object({
    name: Joi.string().optional(),
    description: Joi.string().optional(),
    category: Joi.string().optional(),
    price: Joi.number().optional(),
    unit: Joi.string().optional(),
    stock: Joi.number().optional(),
});

module.exports = {
    createProductSchema,
    updateProductSchema,
};
