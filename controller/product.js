const expressAsyncHandler = require("express-async-handler");
const Shop = require("../model/shopModel");
const ErrorHandler = require("../utils/ErrorHandler");
const Product = require("../model/product");

const createProduct = expressAsyncHandler(async (req, res, next) => {
  try {
    const shopId = req.body.shopId;
    const shop = await Shop.findById(shopId);

    if (!shop) {
      return next(new ErrorHandler("Shop Id is invalid", 400));
    } else {
      const files = req.files;
      const imageUrls = files.map((file) => `${file.fileName}`);
      const productData = req.body;
      productData.images = imageUrls;
      productData.shop = shop;

      const product = await Product.create(productData);

      res.status(200).json({ status: true, product });
    }
  } catch (error) {
    return next(new ErrorHandler(error, 400));
  }
});

module.exports = {
  createProduct,
};
