const jwt = require('jsonwebtoken');
const AppError = require('../error_handler/AppError');
const wrapAsync = require('../error_handler/AsyncError');
const User = require('../models/user');

const authenticateUser = wrapAsync(async (req, res, next) => {

  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return next(new AppError('Login first to access this resource.', 401));
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return next(new AppError('Invalid or expired token.', 401));
    }
    const user = await User.findById(decoded.id);
    if (!user) {
      return next(new AppError('User not found.', 401));
    }
    req.rootUser = user;
    next();
  })
});

const authorizeRoles = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.rootUser.role)) {
      return next(
        new AppError(`only ${roles.join(', ')} are allowed to acccess this resource`, 401)
      );
    }

    console.log("user role: ", req.rootUser.role);
    next();
  };
};

module.exports = { authenticateUser, authorizeRoles };
