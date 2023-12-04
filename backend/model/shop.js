const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const shopSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Vui lòng nhập tên cửa hàng!"],
    },
    email: {
        type: String,
        required: [true, "Vui lòng nhập địa chỉ email"],
    },
    password: {
        type: String,
        required: [true, "Vui lòng nhập mật khẩu"],
        minLength: [8, "Mật khẩu phải phải có ít nhất 8 kí tự"],
        select: false,
    },
    description: {
        type: String,
    },
    address: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: Number,
        required: true,
    },
    role: {
        type: String,
        default: "Seller",
    },
    avatar: {
        type: String,
        required: true,
    },
    zipCode: {
        type: Number,
        required: true,
    },
    withdrawMethod: {
        type: Object,
    },
    availableBalance: {
        type: Number,
        default: 0,
    },
    transections: [{
        amount: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            default: "Đang xử lý",
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        updatedAt: {
            type: Date,
        },
    }, ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    resetPasswordToken: String,
    resetPasswordTime: Date,
});

// Hash password
shopSchema.pre("save", async function(next) {
    if (!this.isModified("password")) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
});

// jwt token
shopSchema.methods.getJwtToken = function() {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRES,
    });
};

// comapre password
shopSchema.methods.comparePassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("Shop", shopSchema);