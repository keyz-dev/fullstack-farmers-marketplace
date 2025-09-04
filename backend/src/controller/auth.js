const User = require("../models/user");
const Application = require("../models/application");
const {
  userLoginSchema,
  googleLoginSchema,
  emailVerificationSchema,
  resendVerificationSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  googleSignUpSchema,
} = require("../validation/userValidation");
const {
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
  ForbiddenError,
} = require("../utils/errors");
const {
  sendVerificationEmail,
  sendPasswordResetEmail,
} = require("../utils/sendVerificationEmail");
const {
  formatLoginResponse,
  formatEmailVerificationResponse,
  formatGoogleOAuthResponse,
} = require("../utils/returnFormats/registrationData");
const { formatUserData } = require("../utils/returnFormats/userData");
const axios = require("axios");

// ==================== UNIFIED LOGIN ====================
exports.login = async (req, res, next) => {
  try {
    const { error } = userLoginSchema.validate(req.body);
    if (error) return next(new BadRequestError(error.details[0].message));

    const { email, password } = req.body;

    // Find user and populate their application if they have one
    const user = await User.findOne({ email }).select("+password");

    if (!user) return next(new UnauthorizedError("Invalid email or password"));

    // Check if password matches
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid)
      return next(new UnauthorizedError("Invalid email or password"));

    if (!user.isActive)
      return next(new ForbiddenError("Your account is not active"));

    // Check if user needs email verification
    // Send verification email
    await sendVerificationEmail(user, email, user.name);

    return res.status(200).json({
      status: "success",
      message: "Login successful. Please verify your email.",
      data: {
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      },
    });
  } catch (err) {
    return next(err);
  }
};

// ==================== GOOGLE LOGIN (SIGN IN ONLY) ====================
exports.googleLogin = async (req, res, next) => {
  try {
    const { error } = googleLoginSchema.validate(req.body);
    if (error) return next(new BadRequestError(error.details[0].message));

    const { access_token } = req.body;

    if (!access_token)
      return next(new BadRequestError("Access token not found"));

    // Validate token & get user profile from Google
    const response = await axios.get(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: { Authorization: `Bearer ${access_token}` },
      }
    );
    const { email, name, picture } = response.data;

    if (!email)
      return next(new BadRequestError("Email not available from Google"));

    let user = await User.findOne({ email });

    if (!user) {
      return next(
        new NotFoundError(
          "No account found with this email. Please register first."
        )
      );
    }

    if (!user.isActive)
      return next(new ForbiddenError("Your account is not active"));

    // Generate JWT token
    const token = await user.generateAuthToken();

    // Use format utility for consistent response
    const formattedResponse = formatGoogleOAuthResponse(
      user,
      token,
      "Google login successful"
    );

    res.json(formattedResponse);
  } catch (err) {
    return next(err);
  }
};

// Google OAuth sign up
exports.googleSignUp = async (req, res, next) => {
  try {
    const { error } = googleSignUpSchema.validate(req.body);
    if (error) return next(new BadRequestError(error.details[0].message));

    const { access_token, role } = req.body;

    if (!access_token) return next(new NotFoundError("Access token not found"));

    // 1. Validate token & get user profile from Google
    const response = await axios.get(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: { Authorization: `Bearer ${access_token}` },
      }
    );
    const { email, name, picture } = response.data;

    if (!email)
      return next(new NotFoundError("Email not available from Google"));

    let user = await User.findOne({ email });
    if (!user) {
      // Create new user
      user = await User.create({
        email,
        name,
        avatar: picture,
        authProvider: "google",
        isVerified: true,
        isActive: true,
        emailVerified: true,
        emailVerificationCode: null,
        emailVerificationExpires: null,
        role: role || "client",
      });
    }
    // Generate JWT token
    const token = await user.generateAuthToken();

    // Use format utility for consistent response
    const formattedResponse = formatGoogleOAuthResponse(user, token, "Google sign up successful");
    res.json(formattedResponse);
  } catch (err) {
    return next(err);
  }
};

// ==================== EMAIL VERIFICATION ====================
exports.verifyEmail = async (req, res, next) => {
  try {
    const { error } = emailVerificationSchema.validate(req.body);
    if (error) return next(new BadRequestError(error.details[0].message));

    const { email, code } = req.body;
    const user = await User.findOne({
      email,
      emailVerificationCode: code,
      emailVerificationExpires: { $gt: new Date() },
    });

    if (!user)
      return next(new BadRequestError("Invalid or expired verification code"));

    user.emailVerified = true;
    user.emailVerificationCode = null;
    user.emailVerificationExpires = null;
    await user.save();

    const token = await user.generateAuthToken();

    // Use format utility for consistent response
    const formattedResponse = formatEmailVerificationResponse(user, token);
    res.status(200).json(formattedResponse);
  } catch (err) {
    return next(err);
  }
};

// ==================== RESEND VERIFICATION EMAIL ====================
exports.resendVerificationEmail = async (req, res, next) => {
  try {
    const { error } = resendVerificationSchema.validate(req.body);
    if (error) return next(new BadRequestError(error.details[0].message));

    const { email } = req.body;
    const user = await User.findOne({ email, emailVerified: false });

    if (!user)
      return next(new NotFoundError("User not found or already verified"));

    await sendVerificationEmail(user, email, user.name);

    res.status(200).json({
      status: "success",
      message: "Verification email sent",
    });
  } catch (err) {
    return next(err);
  }
};

// ==================== FORGOT PASSWORD ====================
exports.forgotPassword = async (req, res, next) => {
  try {
    const { error } = forgotPasswordSchema.validate(req.body);
    if (error) return next(new BadRequestError(error.details[0].message));

    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return next(new NotFoundError("User not found"));

    await sendPasswordResetEmail(user, email, user.name);

    res.status(200).json({
      status: "success",
      message: "Password reset email sent",
    });
  } catch (err) {
    return next(err);
  }
};

// ==================== RESET PASSWORD ====================
exports.resetPassword = async (req, res, next) => {
  try {
    const { error } = resetPasswordSchema.validate(req.body);
    if (error) return next(new BadRequestError(error.details[0].message));

    const { newPassword, confirmPassword } = req.body;
    if (newPassword !== confirmPassword) {
      return next(new BadRequestError("Passwords do not match"));
    }

    const user = req.resetUser;
    user.password = newPassword;
    user.passwordResetToken = null;
    user.passwordResetTokenExpiresAt = null;
    await user.save();

    res.status(200).json({
      status: "success",
      message:
        "Password has been reset successfully. Please log in with your new password.",
    });
  } catch (err) {
    return next(err);
  }
};

// ==================== VERIFY TOKEN ====================
exports.verifyToken = async (req, res, next) => {
  const user = req.authUser;

  // Get user's application if they have one
  let application = null;
  if (
    [
      "incomplete_farmer",
      "incomplete_delivery_agent",
      "pending_farmer",
      "pending_delivery_agent",
    ].includes(user.role)
  ) {
    application = await Application.findOne({
      userId: user._id,
      isActive: true,
    }).sort({ applicationVersion: -1 });
  }

  res.status(200).json({
    status: "success",
    message: "Token verified",
    valid: true,
    data: formatUserData(user),
  });
};

// ==================== LOGOUT ====================
exports.logout = async (req, res, next) => {
  try {
    // In a JWT-based system, logout is typically handled client-side
    // by removing the token. However, you can implement server-side
    // token blacklisting if needed.

    res.status(200).json({
      status: "success",
      message: "Logout successful",
    });
  } catch (err) {
    return next(err);
  }
};

// ==================== REFRESH TOKEN ====================
exports.refreshToken = async (req, res, next) => {
  try {
    const user = req.authUser;

    // Generate new token
    const newToken = user.generateAuthToken();

    res.status(200).json({
      status: "success",
      message: "Token refreshed successfully",
      data: {
        token: newToken,
        user: formatUserData(user),
      },
    });
  } catch (err) {
    return next(err);
  }
};
