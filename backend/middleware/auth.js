const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");
const User = require("../model/user");
const Shop = require("../model/shop");

exports.isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(new ErrorHandler("Vui lòng đăng nhâp để tiếp tục!", 401));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  req.user = await User.findById(decoded.id);

  next();
});
exports.isAuthenticatedResetPassword = catchAsyncErrors(
  async (req, res, next) => {
    const { activationToken } = req.params;
    console.log("activationToken", activationToken);

    if (!activationToken) {
      return next(new ErrorHandler("Vui lòng đăng nhâp để tiếp tục!", 401));
    }

    const decoded = jwt.verify(activationToken, process.env.JWT_SECRET_KEY);

    req.user = await User.findById(decoded.id);

    next();
  }
);

exports.isSeller = catchAsyncErrors(async (req, res, next) => {
  const { seller_token } = req.cookies;
  if (!seller_token) {
    return next(new ErrorHandler("Vui lòng đăng nhâp để tiếp tục!", 401));
  }

  const decoded = jwt.verify(seller_token, process.env.JWT_SECRET_KEY);

  req.seller = await Shop.findById(decoded.id);

  next();
});

exports.isAdmin = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(`${req.user.role} không thể truy cập tài nguyên này!`)
      );
    }
    next();
  };
};
