require("@dotenvx/dotenvx").config();
const User = require("./../models/userModel");
const jwt = require("jsonwebtoken");
const catchAsync = require("./../utils/catchAsync");

function signJsonWebToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
}

function sendJwtCookies(user, statusCode, res) {
  const token = signJsonWebToken(user._id);

  const cookiesOptions = {
    expires: new Date(
      Date.now() + parseInt(process.env.COOKIES_EXPIRE_IN * 24 * 60 * 60 * 1000)
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };
  res.cookie("token", token, cookiesOptions);

  res.status(statusCode).json({
    status: "success",
    token,
  });
}

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    image: req.body.image,
    role: req.body.role,
    authProvider: "mongodb",
  });

  // hidden the password fields
  newUser.password = undefined;

  sendJwtCookies(newUser, 201, res);
});
