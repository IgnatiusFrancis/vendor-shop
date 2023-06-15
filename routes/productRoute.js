const express = require("express");
const { uploads } = require("../multer");
const isAuthenticated = require("../middleware/auth");

const { createProduct } = require("../controller/product");

const router = express.Router();

router.post("/create-product", uploads.array("images"), createProduct);

module.exports = router;
