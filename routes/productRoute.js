const express = require("express");
const { uploads } = require("../multer");
const isAuthenticated = require("../middleware/auth");

const {
  createProduct,
  getAllProducts,
  deleteProduct,
} = require("../controller/product");

const router = express.Router();

router.post("/create-product", uploads.array("images"), createProduct);
router.get("/get-all-products/:id", getAllProducts);
router.get("/delete-shop-product/:id", deleteProduct);

module.exports = router;
