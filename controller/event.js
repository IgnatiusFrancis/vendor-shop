const Event = require("../model/eventModel");
const expressAsyncHandler = require("express-async-handler");
const Shop = require("../model/shopModel");
const ErrorHandler = require("../utils/ErrorHandler");

const createEvent = expressAsyncHandler(async (req, res, next) => {
  try {
    const shopId = req.body.shopId;
    const shop = await Shop.findById(shopId);

    if (!shop) {
      return next(new ErrorHandler("Shop Id is invalid", 400));
    } else {
      const files = req.files;
      const imageUrls = files.map((file) => `${file.filename}`);
      const productData = req.body;
      productData.images = imageUrls;
      productData.shop = shop;

      const event = await Event.create(productData);

      res.status(200).json({ status: true, event });
    }
  } catch (error) {
    return next(new ErrorHandler(error, 400));
  }
});

module.exports = {
  createEvent,
};
