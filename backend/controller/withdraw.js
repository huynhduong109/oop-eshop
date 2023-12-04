const Shop = require("../model/shop");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const express = require("express");
const { isSeller, isAuthenticated, isAdmin } = require("../middleware/auth");
const Withdraw = require("../model/withdraw");
const sendMail = require("../utils/sendMail");
const router = express.Router();

// create withdraw request --- only for seller
router.post(
    "/create-withdraw-request",
    isSeller,
    catchAsyncErrors(async(req, res, next) => {
        try {
            const { amount } = req.body;
            const data = {
                seller: req.seller,
                amount,
            };

            try {
                await sendMail({
                    email: req.seller.email,
                    subject: "Withdraw Request",
                    message: `Xin chào ${req.seller.name}, yêu cầu rút ${amount}VND của bạn đang được xử lý. Việc này cần ít nhất từ 3 đến 7 ngày để xử lý! `,
                });
                res.status(201).json({
                    success: true,
                });
            } catch (error) {
                return next(new ErrorHandler(error.message, 500));
            }

            const withdraw = await Withdraw.create(data);

            res.status(201).json({
                success: true,
                withdraw,
            });
        } catch (error) {
            return next(new ErrorHandler(error.message, 500));
        }
    })
);

// get all withdraws --- admnin

router.get(
    "/get-all-withdraw-request",
    isAuthenticated,
    isAdmin("Admin"),
    catchAsyncErrors(async(req, res, next) => {
        try {
            const withdraws = await Withdraw.find().sort({ createdAt: -1 });

            res.status(201).json({
                success: true,
                withdraws,
            });
        } catch (error) {
            return next(new ErrorHandler(error.message, 500));
        }
    })
);

// update withdraw request ---- admin
router.put(
    "/update-withdraw-request/:id",
    isAuthenticated,
    isAdmin("Admin"),
    catchAsyncErrors(async(req, res, next) => {
        try {
            const { sellerId, amount } = req.body;

            const withdraw = await Withdraw.findByIdAndUpdate(
                req.params.id, {
                    status: "Thành công",
                    updatedAt: Date.now(),
                }, { new: true }
            );

            const seller = await Shop.findById(sellerId);

            const transection = {
                _id: withdraw._id,
                amount: withdraw.amount,
                updatedAt: withdraw.updatedAt,
                status: withdraw.status,
            };

            seller.transections = [...seller.transections, transection];

            seller.availableBalance = seller.availableBalance - amount;

            await seller.save();

            try {
                await sendMail({
                    email: seller.email,
                    subject: "Payment confirmation",
                    message: `Xin chào ${seller.name}, yêu cầu rút ${withdraw.amount}VND của bạn đang được thực hiện. Thời gian giao dịch tùy thuộc vào quy định của ngân hàng, thường mất từ 3 ngày đến 7 ngày.`,
                });
            } catch (error) {
                return next(new ErrorHandler(error.message, 500));
            }
            res.status(201).json({
                success: true,
                withdraw,
            });
        } catch (error) {
            return next(new ErrorHandler(error.message, 500));
        }
    })
);

module.exports = router;