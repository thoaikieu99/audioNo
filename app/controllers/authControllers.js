const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const { User } = require("../model");
const catchAsync = require("../ultils/catchAsync");
const AppError = require("../ultils/appErrors");
const sendEmail = require("../ultils/email");
const crypto = require("crypto");

const singtoken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPRIES_IN,
  });
};

const createSendTocken = (user, statusCode, res) => {
  token = singtoken(user.id);
  let cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_EXP_COOKIE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  //   if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  res.cookie("kianai", token, cookieOptions);

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

const signUp = catchAsync(async (req, res, next) => {
  let newUser = await User.create(req.body);
  delete newUser.dataValues.password_hash;
  createSendTocken(newUser, 201, res);
});

const login = catchAsync(async (req, res, next) => {
  let { password_hash, username } = req.body;

  let findus = await User.scope("withPassword").findOne({
    where: {
      username,
    },
  });
  if (!findus || !(await findus.validatePassword(password_hash))) {
    next(new AppError("Incorrect username and password", 401));
  } else {
    createSendTocken(findus, 200, res);
  }
});

const protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(
      new AppError("You are not logged in! please log in to get access.", 401)
    );
  }

  let decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  let freshUser = await User.findOne({
    where: {
      id: decode.id,
    },
  });

  if (!freshUser) {
    return next(
      new AppError("The user belonging to this token does no longer exits.")
    );
  }

  if (!freshUser.changePasswordAfter(decode.iat)) {
    return next(
      new AppError("User recently changed password! please log in again.")
    );
  }
  req.user = freshUser;
  next();
});

const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }
    next();
  };
};

const forgotPassword = catchAsync(async (req, res, next) => {
  let user = await User.findOne({
    where: { email: req.body.email },
  });

  if (!user) {
    return next(new AppError("There is not user with email address", 404));
  }
  let resetToken = await user.createResetPassword();
  await user.save({ skip: ["confirmedPassword", "password_hash"] });

  let resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/resetPassword/${resetToken}`;
  let message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\n
    If you didn't forget your password, please ignore this email!`;
  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset token (valid for 10 min)",
      message,
    });
    createSendTocken(user, 201, res);
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ skip: ["confirmedPassword", "password_hash"] });
    return next(
      new AppError(
        "There are an error sending the email. Try again later!",
        404
      )
    );
  }
});

const resetPassword = catchAsync(async (req, res, next) => {
  let hasdtoken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  let user = await User.findOne({ where: { passwordResetToken: hasdtoken } });
  if (!user || user.passwordResetExpires < Date.now()) {
    return next(new AppError("Token is invalid or has exprired", 400));
  }
  user.password_hash = req.body.password_hash;
  user.confirmedPassword = req.body.confirmedPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  createSendTocken(user, 200, res);
});

const updatePassword = catchAsync(async (req, res, next) => {
  let getUser = await User.scope("withPassword").findOne({
    where: { id: req.user.id },
  });
  if (!(await getUser.validatePassword(req.body.password_current))) {
    return next(new AppError("Your current password if wrong.", 401));
  }

  getUser.password_hash = req.body.password_hash;
  getUser.confirmedPassword = req.body.confirmedPassword;
  await getUser.save();
  createSendTocken(getUser, 200, res);
});
module.exports = {
  signUp,
  login,
  protect,
  restrictTo,
  resetPassword,
  forgotPassword,
  updatePassword,
};
