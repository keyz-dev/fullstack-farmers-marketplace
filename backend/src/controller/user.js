const User = require("../models/user.js");
const AppError = require("../error_handler/AppError.js");
const wrapAsync = require("../error_handler/AsyncError.js");
const sendEmail = require("../utils/sendEmail.js");
const { cleanUpInstanceImages } = require("../utils/imageCleanup.js");

// get currently logged in user
const getUserProfile = wrapAsync(async (req, res, next) => {
  const user = await User.findById(req.authUser._id);

  res.status(201).json({
    success: true,
    user,
  });
});

// for forgot password

const forgotPassword = wrapAsync(async (req, res, next) => {
  const email = req.body.email;
  if (!email) {
    return next(new AppError("Please enter email id", 400));
  }
  const user = await User.findOne({ email });

  if (!user) {
    return next(
      new AppError(`user not found with this email id ${req.body.email}`, 404)
    );
  }

  const randomNumber = Math.random() * (999999 - 100000) + 100000;
  const otp = Math.floor(randomNumber);
  const otp_expire = 15 * 60 * 1000;

  user.otp = otp;
  user.otp_expire = new Date(Date.now() + otp_expire);
  await user.save();

  const message = `Your OTP for Reseting Password is ${otp}.\n Please ignore if you haven't requested this.`;

  try {
    await sendEmail({
      email: user.email,
      subject: "SHOP:- OTP For Reseting Password Recovery",
      message,
    });
  } catch (error) {
    user.otp = null;
    user.otp_expire = null;
    await user.save();
    return next(error);
  }
  res.status(200).json({
    success: true,
    message: `Email Sent To ${user.email}`,
  });
});

// for reset password of user
const resetPassword = wrapAsync(async (req, res, next) => {
  const { otp, password } = req.body;

  const user = await User.findOne({
    otp,
    otp_expire: {
      $gt: Date.now(),
    },
  });

  if (!user)
    return next(new AppError("Incorrect OTP or has been expired", 400));

  if (!password) return next(new AppError("Please Enter New Password", 400));

  user.password = password;
  user.otp = undefined;
  user.otp_expire = undefined;

  await user.save();

  res.status(200).json({
    success: true,
    message: "Password Changed Successfully, You can login now",
  });
});

// for update user Password
const updatePassword = wrapAsync(async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;
  console.log(oldPassword, newPassword);
  if (!oldPassword || !newPassword)
    return next(new AppError("Please Enter Old Password & New Password", 400));

  const user = await User.findById(req.authUser._id).select("+password");

  // check previous password
  const match = await user.compareloginPasssword(oldPassword);

  if (!match) {
    return next(new AppError("Incorrect password", 404));
  }

  user.password = newPassword;
  await user.save();

  res.status(201).json({
    success: true,
    message: "Password Changed Successully",
  });
});

// for update profile by user
const updateByUser = wrapAsync(async (req, res, next) => {
  const user = await User.findById(req.authUser._id);

  const {
    name,
    email,
    address,
    city,
    country,
    pinCode,
    // role
  } = req.body;

  if (name) user.name = name;
  if (email) user.email = email;
  if (address) user.address = address;
  if (city) user.city = city;
  if (country) user.country = country;
  if (pinCode) user.pinCode = pinCode;
  // if (role) user.role = role;
  await user.save();

  res.status(200).json({
    success: true,
    message: "Profile Updated Successfully",
  });
});

// to update pic
const updatePicByUser = wrapAsync(async (req, res, next) => {
  const user = await User.findById(req.authUser._id);

  if (!req.file) return next(new AppError("Please add image", 400));

  if (user.avatar) {
    await cleanUpInstanceImages(user);
  }

  user.avatar = req.file;

  await user.save();
  res.status(200).json({ success: true, message: "Avatar Updated successful" });
});

///for logout
const logout = wrapAsync(async (req, res) => {
  req.authUser.tokens = [];
  await req.authUser.save();

  res.status(200).json({ success: true, message: "logout successfully" });
});

module.exports = {
  logout,
  forgotPassword,
  resetPassword,
  updateByUser,
  updatePicByUser,
  getUserProfile,
  updatePassword,
};
