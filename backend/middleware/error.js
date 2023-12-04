const ErrorHandler = require("../utils/ErrorHandler");

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Lỗi máy chủ nội bộ";

    // wrong mongodb id error
    if (err.name === "CastError") {
        const message = `Không tìm thấy tài nguyên với id này.. Không hợp lệ ${err.path}`;
        err = new ErrorHandler(message, 400);
    }

    // Duplicate key error
    if (err.code === 11000) {
        const message = `Khóa trùng lặp ${Object.keys(err.keyValue)} đã được nhập`;
        err = new ErrorHandler(message, 400);
    }

    // wrong jwt error
    if (err.name === "JsonWebTokenError") {
        const message = `url của bạn không hợp lệ vui lòng thử lại thư`;
        err = new ErrorHandler(message, 400);
    }

    // jwt expired
    if (err.name === "TokenExpiredError") {
        const message = `Url của bạn đã hết hạn, vui lòng thử lại!`;
        err = new ErrorHandler(message, 400);
    }

    res.status(err.statusCode).json({
        success: false,
        message: err.message,
    });
};