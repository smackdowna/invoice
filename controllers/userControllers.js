import { User } from "../models/userModel.js";
import { catchAsyncError } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../utils/errorHandler.js";
import { sendToken } from "../utils/sendToken.js";
import crypto from "crypto";

//registration
export const registerUser = catchAsyncError(async (req, res, next) => {
  const { full_name, email, mobileNumber, password, confirm_password } =
    req.body;

  if (!mobileNumber)
    return next(new ErrorHandler("Mobile number is required", 400));

  let existingUser = await User.findOne({ mobileNumber, verified: true });
  if (existingUser) {
    return next(
      new ErrorHandler("User with this mobile number already exists", 400)
    );
  }

  if (password != confirm_password)
    return next(
      new ErrorHandler("Password and Confirm Password Doesn't Match", 400)
    );

  const user = await User.create({
    full_name,
    email,
    mobileNumber,
    password,
  });
  sendToken(res, user, "Registered Successfully", 200);
});

//login
export const loginUser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  // checking if user has given password and email both

  if (!email || !password) {
    return next(new ErrorHandler("Please Enter Email & Password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  sendToken(res, user, `Welcome Back ${user.full_name} `, 200);
});

export const forgotPassword = catchAsyncError(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(new ErrorHandler("Please enter email", 404));
  }

  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  // Get ResetPassword Token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  // const resetPasswordUrl = `${req.protocol}://${req.get(
  //   "host"
  // )}/api/v1/password/reset/${resetToken}`;

  const frontendurl = `https://pm-gurukul.vercel.app/auth/reset-password/${resetToken}`;

  const message = `Dear ${user.full_name},

  We hope this email finds you well. It appears that you've requested to reset your password for your PMGURUKKUL account. We're here to assist you in securely resetting your password and getting you back to enjoying our platform hassle-free.
  
  To reset your password, please click on the following link:
  
  ${frontendurl}
  
  This link will expire in 15 minutes for security reasons, so please make sure to use it promptly. If you didn't initiate this password reset request, please disregard this email, and your account will remain secure.
  
  If you encounter any issues or have any questions, feel free to reach out to our support team  for further assistance. We're here to help you every step of the way.
  
  Thank you for choosing PMGURUKKUL. We appreciate your continued support.
  
  Best regards,
  PMGURUKKUL Team`;

  try {
    await sendEmail(
      user.email,
      "Password Reset Link for PMGURUKKUL Account",
      message
    );

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorHandler(error.message, 500));
  }
});

// Reset Password
export const resetPassword = catchAsyncError(async (req, res, next) => {
  // creating token hash
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHandler(
        "Reset Password Token is invalid or has been expired",
        400
      )
    );
  }

  if (!req.body.password || !req.body.confirmPassword) {
    return next(new ErrorHandler("Please Enter Password", 400));
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password does not password", 400));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  res.status(200).json({
    success: true,
    message: "Password reset successfully ",
  });
});

//get my profile
export const getmyProfile = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user,
  });
});

//logout
export const logout = catchAsyncError(async (req, res, next) => {
  res.cookie("token", "", {
    expires: new Date(0), // Set the expiration date to a past date to immediately expire the cookie
    httpOnly: true,
    secure: "true", // Set to true in production, false in development
    sameSite: "None", // Ensure SameSite is set to None for cross-site cookies
  });

  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
});
