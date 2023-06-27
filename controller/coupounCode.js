const expressAsyncHandler = require("express-async-handler");
const ErrorHandler = require("../utils/ErrorHandler");
const Product = require("../model/productModel");
const CoupounCode = require("../model/coupounCode");

const createCouponCode = expressAsyncHandler(async (req, res, next) => {
  try {
    const isCoupounCode = await CoupounCode.find({ name: req.body.name });

    if (isCoupounCode.length !== 0) {
      return next(new ErrorHandler("Coupoun code already exist", 400));
    } else {
      const coupounCode = await CoupounCode.create(req.body);

      res.status(201).json({ status: true, coupounCode });
    }
  } catch (error) {
    return next(new ErrorHandler(error, 400));
  }
});

const getCouponCode = expressAsyncHandler(async (req, res, next) => {
  try {
    const couponCodes = await CoupounCode.find({ shopId: req.user._id });

    res.status(201).json({
      success: true,
      couponCodes,
    });
  } catch (error) {
    return next(new ErrorHandler(error, 400));
  }
});

const getCouponCodeByName = expressAsyncHandler(async (req, res, next) => {
  try {
    const couponCode = await CoupounCode.findOne({ name: req.params.name });

    res.status(201).json({
      success: true,
      couponCode,
    });
  } catch (error) {
    return next(new ErrorHandler(error, 400));
  }
});

// delete coupoun code of a shop

const deleteCouponCode = expressAsyncHandler(async (req, res, next) => {
    try {
      const couponCode = await CoupounCode.findByIdAndDelete(req.params.id);

      if (!couponCode) {
        return next(new ErrorHandler("Coupon code dosen't exists!", 400));
      }
      res.status(201).json({
        success: true,
        message: "Coupon code deleted successfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })


module.exports = {
  createCouponCode,
  getCouponCode,
  getCouponCodeByName,
  deleteCouponCode
};
