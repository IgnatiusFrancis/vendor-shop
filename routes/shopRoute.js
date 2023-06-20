const express = require("express");
const { uploads } = require("../multer");
const isAuthenticated = require("../middleware/auth");
const {
  createShop,
  activateAccount,
  Login,
  getSellerById,
  logOut,
} = require("../controller/shop");

const router = express.Router();

router.post("/create-shop", uploads.single("avatar"), createShop);
router.post("/activation", activateAccount);
router.post("/login", Login);
router.get("/logout", logOut);
router.get("/findme", isAuthenticated, getSellerById);

module.exports = router;
