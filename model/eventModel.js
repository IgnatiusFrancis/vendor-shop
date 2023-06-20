const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Enter event Product name"],
  },

  description: {
    type: String,
    required: [true, "Enter event Product description"],
  },
  category: {
    type: String,
    required: [true, "Enter event Product category"],
  },
  start_Date: {
    type: Date,
    required: true,
  },
  finish_Date: {
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
    required: [true, "Enter event Product Price"],
  },
  stock: {
    type: Number,
    required: [true, "Enter event Product stock"],
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

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
