const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Enter Product name"],
  },

  description: {
    type: String,
    required: [true, "Enter Product description"],
  },
  category: {
    type: String,
    required: [true, "Enter Product category"],
  },
  tags: {
    type: String,
  },
  originalPrice: {
    type: Number,
  },
  discountPrice: {
    type: Number,
    required: [true, "Enter Product Price"],
  },
  stock: {
    type: Number,
    required: [true, "Enter Product stock"],
  },
  images: [
    {
      type: String,
    },
  ],
  shop: {
    type: Object,
    required: true,
  },
  shopId: {
    type: String,
    required: true,
  },
  sold_out: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
