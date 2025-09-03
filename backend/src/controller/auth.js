const User = require("../models/user.js");
const { BadRequestError, NotFoundError } = require("../utils/errors.js");
const wrapAsync = require("../error_handler/AsyncError.js");
const sendToken = require("../utils/jwtToken.js");
const {
  validateClient,
  validateFarmer,
  validateDelivery,
} = require("../validation/userValidator.js");

const createuser = wrapAsync(async (req, res, next) => {

  if (!req.body.role) {
    return next(new BadRequestError("Please enter role", 400));
  }

  if (req.body.addressCoordinates) {
    req.body.addressCoordinates = JSON.parse(req.body.addressCoordinates);
  }

  if (req.body.role === "farmer") {
    req.body.produceTypes = JSON.parse(req.body.produceTypes);
    req.body.shopCoordinates = JSON.parse(req.body.shopCoordinates);
    req.body.deliveryRadiusKm = Number(req.body.deliveryRadiusKm);
    req.body.payment = JSON.parse(req.body.payment);
    const { value, error } = validateFarmer(req.body);
    if (error) {
      return next(new BadRequestError(error.details[0].message, 400));
    }
  } else if (req.body.role === "delivery_agent") {
    const { value, error } = validateDelivery(req.body);
    if (error) {
      return next(new BadRequestError(error.details[0].message, 400));
    }
  } else {
    req.body.role = "client";
    const { value, error } = validateClient(req.body);
    if (error) {
      return next(new BadRequestError(error.details[0].message, 400));
    }
  }

  // check if user already exist
  const { email } = req.body;
  let user = await User.findOne({ email });

  if (user) {
    return next(
      new BadRequestError(`user already exist with this email id ${email}`, 400)
    );
  }

  let avatar = undefined;
  if (req.file) {
    avatar = req.file.path;
  }
  req.body.avatar = avatar;
  user = new User(req.body);
  user = await user.save();

  sendToken(user, res, `Registered Successfully`, 201);
});

// for login user
const loginin = wrapAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new BadRequestError("Please enter email & password", 401));
  }
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new BadRequestError("Invalid user or password", 400));
  }

  const match = await user.compareloginPasssword(password);
  if (!match) {
    return next(new BadRequestError("Invalid user or password", 404));
  }
  sendToken(user, res, `welcome Back ${user.name}`, 201);
});

module.exports = {
  createuser,
  loginin,
};
