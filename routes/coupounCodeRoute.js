const express = require("express");
const isAuthenticated = require("../middleware/auth");

const {
  createCouponCode,
  getCouponCode,
  deleteCouponCode,
} = require("../controller/coupounCode");

const router = express.Router();

router.post("/create-coupon-code", isAuthenticated, createCouponCode);
router.get("/get-coupon-code/:id", isAuthenticated, getCouponCode);
router.delete("/delete-coupon/:id", isAuthenticated, deleteCouponCode);

module.exports = router;
