const { BadRequestError } = require("../utils/errors");

/**
 * Validation middleware using Joi schemas
 * @param {Object} schema - Joi validation schema
 * @returns {Function} Express middleware function
 */
const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errorMessage = error.details
        .map((detail) => detail.message)
        .join(", ");
      return next(new BadRequestError(errorMessage));
    }

    // Replace req.body with validated data
    req.body = value;
    next();
  };
};

module.exports = { validate };
