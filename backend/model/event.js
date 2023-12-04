const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Vui lòng nhập tên sản phẩm sự kiện!"],
  },
  description: {
    type: String,
    required: [true, "Vui lòng nhập mô tả sản phẩm sự kiện!"],
  },
  category: {
    type: String,
    required: [true, "Vui lòng chọn loại sản phẩm sự kiện!"],
  },
  start_Date: {
    type: Date,
    required: true,
  },
  Finish_Date: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    default: "Running",
  },
  tags: {
    type: String,
  },
  originalPrice: {
    type: Number,
  },
  discountPrice: {
    type: Number,
    required: [true, "Vui lòng nhập giá sản phẩm sự kiện!"],
  },
  stock: {
    type: Number,
    required: [true, "Vui lòng nhập số lượng sản phẩm sự kiện!"],
  },
  images: [
    {
      type: String,
    },
  ],
  shopId: {
    type: String,
    required: true,
  },
  shop: {
    type: Object,
    required: true,
  },
  sold_out: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Event", eventSchema);
