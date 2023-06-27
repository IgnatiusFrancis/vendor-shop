const express = require("express");
const { uploads } = require("../multer");
const isAuthenticated = require("../middleware/auth");

const {
  createProduct,
  getAllProducts,
  deleteProduct,
} = require("../controller/product");

const router = express.Router();

router.post(
  "/create-product",
  isAuthenticated,
  uploads.array("images"),
  createProduct
);
router.get("/get-all-products/:id", isAuthenticated, getAllProducts);
router.delete("/delete-shop-product/:id", isAuthenticated, deleteProduct);

module.exports = router;
