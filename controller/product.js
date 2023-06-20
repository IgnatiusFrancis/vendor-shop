const expressAsyncHandler = require("express-async-handler");
const Shop = require("../model/shopModel");
const ErrorHandler = require("../utils/ErrorHandler");
const Product = require("../model/productModel");

const createProduct = expressAsyncHandler(async (req, res, next) => {
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

      const product = await Product.create(productData);

      res.status(200).json({ status: true, product });
    }
  } catch (error) {
    return next(new ErrorHandler(error, 400));
  }
});

const getAllProducts = expressAsyncHandler(async (req, res, next) => {
  try {
    const products = await Product.find({ shopId: req.params.id });

    res.status(201).json({
      success: true,
      products,
    });
  } catch (error) {
    return next(new ErrorHandler(error, 400));
  }
});

const deleteProduct = expressAsyncHandler(async (req, res, next) => {
  try {
    const productId = req.params.id;

    const product = await Product.findByIdAndDelete(productId);
    if (!product) {
      return next(new ErrorHandler("Product not found with this Id", 400));
    }
    res.status(201).json({
      success: true,
      message: "Product Deleted",
    });
  } catch (error) {
    return next(new ErrorHandler(error, 400));
  }
});

module.exports = {
  createProduct,
  getAllProducts,
  deleteProduct,
};
